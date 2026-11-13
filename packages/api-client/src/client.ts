import { detectPathTraversal } from '@repo/security';
import type {
  ApiErrorBody,
  ApiErrorDetails,
  ApiPaged,
  ApiSuccess,
  RefreshResponse,
} from './dto';

/**
 * Cliente HTTP Único del IDP (`@repo/api-client`)
 *
 * Basado en la arquitectura probada de `dsc-web-frontend` + `dsc-web-backend`:
 * 1. Access Token exclusivamente en memoria de módulo (inmune a robo por localStorage).
 * 2. Renovación automática Single-Flight (`refreshInFlight`) ante respuestas 401
 *    para evitar que peticiones concurrentes disparen la detección de reúso de refresh token.
 * 3. Protección CSRF por doble envío (`X-CSRF-Token`) en `/auth/refresh`.
 * 4. Desenvoltura tipada de `{ data }`, `{ data, meta }` y errores estructurados `ApiError`.
 */

const DEFAULT_BASE_URL =
  typeof process !== 'undefined' && process.env?.NEXT_PUBLIC_API_URL
    ? process.env.NEXT_PUBLIC_API_URL
    : '/api/v1';

export class ApiError extends Error {
  readonly status: number;
  readonly code: string;
  readonly details?: ApiErrorDetails;

  constructor(
    status: number,
    code: string,
    message: string,
    details?: ApiErrorDetails
  ) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.code = code;
    this.details = details;
  }

  get fieldErrors(): Record<string, string> {
    const result: Record<string, string> = {};
    if (!Array.isArray(this.details)) return result;
    for (const detail of this.details) {
      result[detail.field] ??= detail.message;
    }
    return result;
  }

  get conflictDetails(): Record<string, unknown> | null {
    if (!this.details || Array.isArray(this.details)) return null;
    return this.details;
  }
}

let accessToken: string | null = null;
let csrfToken: string | null = null;

export function getAccessToken(): string | null {
  return accessToken;
}

export function setAccessToken(token: string | null): void {
  accessToken = token;
}

export function getCsrfToken(): string | null {
  return csrfToken;
}

export function setCsrfToken(token: string | null): void {
  csrfToken = token;
}

export interface AdminImageFiles {
  cover?: File | null;
  gallery?: File[];
  photo?: File | null;
}

export function hasFiles(files?: AdminImageFiles): boolean {
  return (
    Boolean(files?.cover) ||
    Boolean(files?.photo) ||
    (files?.gallery?.length ?? 0) > 0
  );
}

export function buildFormPayload(
  payload: unknown,
  files: AdminImageFiles
): FormData {
  const form = new FormData();
  form.append('data', JSON.stringify(payload));
  if (files.cover) form.append('cover', files.cover);
  if (files.photo) form.append('photo', files.photo);
  for (const file of files.gallery ?? []) form.append('gallery', file);
  return form;
}

export interface RequestOptions {
  method?: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';
  body?: unknown;
  auth?: boolean;
  signal?: AbortSignal;
  csrf?: boolean;
  retried?: boolean;
  baseUrl?: string;
}

async function toApiError(response: Response): Promise<ApiError> {
  let body: Partial<ApiErrorBody> | null;
  try {
    body = (await response.json()) as ApiErrorBody;
  } catch {
    body = null;
  }

  const error = body?.error;
  if (error?.code) {
    return new ApiError(
      response.status,
      error.code,
      error.message,
      error.details
    );
  }

  return new ApiError(
    response.status,
    'UNKNOWN',
    'No pudimos completar la operación. Inténtalo de nuevo.'
  );
}

let refreshInFlight: Promise<boolean> | null = null;

export function ensureSession(baseUrl = DEFAULT_BASE_URL): Promise<boolean> {
  refreshInFlight ??= requestRefresh(baseUrl).finally(() => {
    refreshInFlight = null;
  });
  return refreshInFlight;
}

async function requestRefresh(baseUrl: string): Promise<boolean> {
  try {
    const data = await rawRequest<ApiSuccess<RefreshResponse>>(
      '/auth/refresh',
      {
        method: 'POST',
        auth: false,
        csrf: true,
        baseUrl,
      }
    );
    accessToken = data.data.accessToken;
    csrfToken = data.data.csrfToken;
    return true;
  } catch {
    accessToken = null;
    csrfToken = null;
    return false;
  }
}

async function rawRequest<T>(
  endpointPath: string,
  options: RequestOptions = {}
): Promise<T> {
  if (!endpointPath.startsWith('/') || detectPathTraversal(endpointPath)) {
    throw new ApiError(
      400,
      'INVALID_API_PATH',
      'Ruta de API bloqueada por validación anti-Path Traversal.'
    );
  }

  const {
    method = 'GET',
    body,
    auth = true,
    signal,
    csrf = false,
    retried = false,
    baseUrl = DEFAULT_BASE_URL,
  } = options;

  const isForm = typeof FormData !== 'undefined' && body instanceof FormData;
  const headers: Record<string, string> = {};

  if (body !== undefined && !isForm) {
    headers['Content-Type'] = 'application/json';
  }

  const token = auth ? getAccessToken() : null;
  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  if (csrf && csrfToken) {
    headers['X-CSRF-Token'] = csrfToken;
  }

  let response: Response;
  try {
    response = await fetch(`${baseUrl}${endpointPath}`, {
      method,
      headers,
      body:
        body === undefined
          ? undefined
          : isForm
          ? (body as FormData)
          : JSON.stringify(body),
      signal,
      credentials: 'include',
    });
  } catch (error) {
    if (error instanceof DOMException && error.name === 'AbortError') {
      throw error;
    }
    throw new ApiError(
      0,
      'NETWORK_ERROR',
      'No pudimos conectar con el servidor.'
    );
  }

  if (response.status === 401 && auth && !retried) {
    const renewed = await ensureSession(baseUrl);
    if (renewed) {
      return rawRequest<T>(endpointPath, { ...options, retried: true });
    }
  }

  if (!response.ok) {
    throw await toApiError(response);
  }

  if (response.status === 204) {
    return undefined as T;
  }

  return (await response.json()) as T;
}

export async function apiRequest<T>(
  endpointPath: string,
  options: RequestOptions = {}
): Promise<T> {
  const payload = await rawRequest<ApiSuccess<T>>(endpointPath, options);
  return payload === undefined ? (undefined as T) : payload.data;
}

export async function apiRequestPaged<T>(
  endpointPath: string,
  options: RequestOptions = {}
): Promise<ApiPaged<T>> {
  return rawRequest<ApiPaged<T>>(endpointPath, options);
}

export async function apiRequestWithMeta<T>(
  endpointPath: string,
  options: RequestOptions = {}
): Promise<T> {
  return rawRequest<T>(endpointPath, options);
}
