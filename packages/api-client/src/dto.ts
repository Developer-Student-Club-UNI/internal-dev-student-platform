/**
 * @repo/api-client — Contrato Estándar de DTOs del Backend (Basado en dsc-web-backend)
 *
 * Diseñado como estándar agnóstico y Open Source para comunidades estudiantiles
 * (con preset de referencia DSC UNI).
 */

/** Envoltura de éxito: todo endpoint devuelve `{ data }`. */
export interface ApiSuccess<T> {
  data: T;
}

/** Problema concreto de un campo del formulario (`VALIDATION_ERROR`). */
export interface ApiFieldError {
  field: string;
  message: string;
  code?: string;
}

/**
 * Array de campos en `VALIDATION_ERROR`, u objeto en conflictos de dominio
 * (ej. `TEAM_UNIT_HAS_MEMBERSHIPS`, `LINK_EMAIL_TAKEN`).
 */
export type ApiErrorDetails = ApiFieldError[] | Record<string, unknown>;

/** Envoltura de error estándar: `{ error: { code, message, details? } }`. */
export interface ApiErrorBody {
  error: {
    code: string;
    message: string;
    details?: ApiErrorDetails;
  };
}

/** Meta de paginación estándar. */
export interface ApiPageMeta {
  page: number;
  perPage: number;
  total: number;
  totalPages: number;
}

export interface ApiPaged<T> {
  data: T[];
  meta: ApiPageMeta;
}

export interface ApiPerson {
  slug: string;
  firstName: string;
  lastName: string;
}

export interface ApiAuthUser {
  id: string;
  email: string;
  roles: string[];
  emailVerified: boolean;
  avatarUrl: string | null;
  person: ApiPerson | null;
}

export interface SessionTokens {
  accessToken: string;
  refreshToken?: string;
  csrfToken: string;
}

export type RefreshResponse = SessionTokens;

export interface LoginResponse extends SessionTokens {
  user: ApiAuthUser;
}

export interface RegisterResponse extends LoginResponse {
  hasPendingProfile: boolean;
  verificationEmailSent: boolean;
}

export interface VerifyEmailResponse {
  alreadyVerified: boolean;
  profileAdopted: boolean;
}

export interface MeResponse {
  user: ApiAuthUser;
}

export interface ApiEventCategory {
  slug: string;
  name: string;
}

export interface ApiOrganizer {
  slug: string;
  name: string;
  /** Indica si el organizador es la propia comunidad anfitriona (agnóstico al nombre del club). */
  isOwn: boolean;
}

export interface ApiEventImage {
  url: string;
  displayOrder: number;
}

/**
 * Evento publicado (`GET /api/v1/events`).
 * Modalidad modelada con dos booleanos (`isVirtual`, `isInPerson`); ambos true = Híbrido.
 */
export interface ApiEvent {
  slug: string;
  title: string;
  category: ApiEventCategory;
  organizer: ApiOrganizer;
  speaker: string;
  isVirtual: boolean;
  isInPerson: boolean;
  startsAt: string;
  endsAt: string;
  place: string;
  description: string | null;
  coverImageUrl: string | null;
  registerUrl: string | null;
}

export interface ApiEventDetail extends ApiEvent {
  images: ApiEventImage[];
}

export type ApiEventStatus = 'DRAFT' | 'PUBLISHED' | 'CANCELLED';

export interface ApiAdminEvent extends ApiEvent {
  status: ApiEventStatus;
  createdAt: string;
  updatedAt: string;
}

export interface ApiAdminImage {
  id: string;
  url: string;
  displayOrder: number;
}

export interface ApiAdminEventDetail extends ApiAdminEvent {
  images: ApiAdminImage[];
}

export interface ApiSite {
  contact: {
    email: string;
    phone: string;
    location: string;
    schedule: string;
  };
  social: {
    linkedin: string;
    whatsapp: string;
    tiktok: string;
    facebook: string;
    instagram: string;
  };
}

export interface ApiProjectImage {
  url: string;
  displayOrder: number;
}

export interface ApiProject {
  slug: string;
  title: string;
  description: string;
  technologies: string[];
  coverImageUrl: string | null;
  images: ApiProjectImage[];
  linkUrl: string | null;
}

export interface ApiAdminProject {
  slug: string;
  title: string;
  description: string;
  technologies: string[];
  coverImageUrl: string | null;
  linkUrl: string | null;
  displayOrder: number;
  isPublished: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface ApiTeamMember {
  slug: string;
  firstName: string;
  lastName: string;
  photoUrl: string | null;
  about: string;
  career: string | null;
  linkedinUrl: string | null;
  githubUrl: string | null;
  label: string | null;
  unit: { slug: string; name: string } | null;
  skills: string[];
}

/** Cinco zonas jerárquicas estándar del directorio de equipo (`GET /api/v1/team`). */
export interface ApiTeam {
  board: ApiTeamMember[];
  directors: ApiTeamMember[];
  leaders: ApiTeamMember[];
  squadLeads: ApiTeamMember[];
  volunteers: ApiTeamMember[];
}

export type ApiMembershipKind = 'LEADER' | 'VOLUNTEER';
export type ApiMembershipLevel =
  | 'BOARD'
  | 'DIRECTOR'
  | 'SQUAD_LEAD'
  | 'LEADER'
  | 'VOLUNTEER';

export type ApiTeamUnitKind = 'DIRECTORATE' | 'SQUAD';

export interface ApiMembershipUnit {
  slug: string;
  name: string;
  kind: ApiTeamUnitKind;
}

export interface ApiMembership {
  kind: ApiMembershipKind;
  level: ApiMembershipLevel;
  roleTitle: string | null;
  label: string | null;
  unit: ApiMembershipUnit | null;
  term: string;
  startedOn: string;
  endedOn: string | null;
  displayOrder: number;
}

export interface ApiAdminPerson {
  slug: string;
  firstName: string;
  lastName: string;
  linkEmail: string | null;
  photoUrl: string | null;
  about: string | null;
  linkedinUrl: string | null;
  githubUrl: string | null;
  career: string | null;
  hasAccount: boolean;
  currentMembership: ApiMembership | null;
  createdAt: string;
  updatedAt: string;
}

export interface ApiAdminTeamUnit {
  slug: string;
  name: string;
  kind: ApiTeamUnitKind;
  isActive: boolean;
  displayOrder: number;
  memberships: number;
}

export interface ApiAdminTerm {
  id: string;
  name: string;
  startsOn: string;
  endsOn: string;
  isCurrent: boolean;
  memberships: number;
}

export type ApiUserStatus = 'ACTIVE' | 'SUSPENDED';

export interface ApiAdminUser {
  id: string;
  email: string;
  status: ApiUserStatus;
  emailVerified: boolean;
  lastLoginAt: string | null;
  createdAt: string;
  person: { slug: string; firstName: string; lastName: string } | null;
  roles: string[];
}

export interface ApiContactMessage {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  organization: string | null;
  message: string;
  createdAt: string;
}

export interface ApiContactMessageList {
  data: ApiContactMessage[];
  meta: {
    total: number;
    limit: number;
    truncated: boolean;
  };
}

export interface ApiAuditField {
  field: string;
  before: unknown;
  after: unknown;
}

export interface ApiAuditLog {
  id: string;
  action: 'CREATE' | 'UPDATE' | 'DELETE';
  entityType: string;
  entityId: string;
  actor: {
    name: string;
    email: string;
  };
  fields: ApiAuditField[];
  omittedFields: number;
  createdAt: string;
}

export interface ApiAuditLogList {
  data: ApiAuditLog[];
  meta: {
    total: number;
    limit: number;
    truncated: boolean;
  };
}
