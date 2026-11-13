# Estándar de Backend y Contrato de API del IDP (`specs/BACKEND_CONTRACT.md`)

> **Arquitectura de Referencia:** Basado en `dsc-web-backend` + `dsc-web-frontend` (`@repo/api-client`), parametrizado como estándar **White-Label Open Source** para comunidades estudiantiles y técnicas.

---

## 1. Filosofía del Contrato Cliente-Servidor (`@repo/api-client`)

Todas las aplicaciones (`apps/*`) y módulos (`modules/*/*`) del IDP se comunican con el backend exclusivamente a través de `@repo/api-client`, el cual garantiza cuatro invariantes de seguridad y consistencia:

1. **Envolturas Deterministas de Respuesta:**
   - **Éxito simple:** `{ data: T }` (`apiRequest<T>`)
   - **Éxito paginado:** `{ data: T[], meta: { page, perPage, total, totalPages } }` (`apiRequestPaged<T>`)
   - **Éxito con límite/tope (Auditoría / Mensajes):** `{ data: T[], meta: { total, limit, truncated } }` (`apiRequestWithMeta<T>`)
   - **Error estructurado (`ApiError`):** `{ error: { code: string, message: string, details?: ApiFieldError[] | Record<string, unknown> } }`. Las interfaces reaccionan a `error.code` y `error.fieldErrors`, nunca al texto libre.

2. **Gestión de Sesión Zero-Trust (Memoria + Cookie Refresh Rotativa + CSRF):**
   - El `accessToken` (JWT de corta duración, 15 min) vive **únicamente en memoria** dentro de `@repo/api-client` (inmune a exfiltración vía `localStorage`).
   - La renovación se realiza contra `POST /api/v1/auth/refresh` usando una promesa compartida **Single-Flight (`refreshInFlight`)**: si 10 peticiones reciben `401 TOKEN_EXPIRED` simultáneamente, se ejecuta **una sola** rotación de refresh token, evitando falsos positivos de robo de sesión.
   - `POST /api/v1/auth/refresh` exige doble envío anti-CSRF (`X-CSRF-Token` comparado en tiempo constante con la cookie `csrf_token`).

3. **Autorización Basada en Capacidades (`can(roles, permission)`):**
   - En lugar de acoplar las vistas a nombres de roles fijos, los módulos y endpoints exigen **capacidades**:
     - `event:write` — Gestión de eventos y convocatorias
     - `project:write` — Gestión de proyectos y stack tecnológico
     - `person:write` — Gestión del directorio de miembros y vinculación (`linkEmail`)
     - `team-unit:write` — Gestión de direcciones (`DIRECTORATE`) y squads (`SQUAD`)
     - `term:write` — Gestión de ciclos académicos (ej. `2026-I`, `2026-II`)
     - `site:write` — Configuración institucional y redes sociales (`SiteSetting`)
     - `message:read` — Lectura inmutable de mensajes de contacto
     - `user:write` — Administración de cuentas y estados (`ACTIVE` / `SUSPENDED`)
     - `audit:read` — Lectura inmutable del registro de auditoría (`AuditLog`)

---

## 2. Modelo de Dominio Agnóstico (White-Label Open Source)

El esquema de datos (PostgreSQL + Prisma 7 con UUIDv7 y `timestamptz`) está diseñado para servir a **DSC UNI** como implementación de referencia y a cualquier otra comunidad estudiantil como proyecto Open Source:

| Entidad | Propósito en el Ecosistema | Diseño White-Label |
| :--- | :--- | :--- |
| **`AppUser` & `Person`** | Separación entre cuenta autenticada (`AppUser`) y ficha del directorio (`Person`). Soporta adopción segura de perfil previo mediante `linkEmail` tras verificar el correo (`profileAdopted`). | Agnóstico a la universidad o club. |
| **`Membership`, `TeamUnit`, `Term`** | Estructura organizativa en 5 niveles (`BOARD`, `DIRECTOR`, `SQUAD_LEAD`, `LEADER`, `VOLUNTEER`) agrupados en unidades (`DIRECTORATE` o `SQUAD`) por ciclo (`Term`). | Cualquier comunidad define sus propias direcciones/comités y ciclos. |
| **`Event` & `Organizer`** | Eventos con modalidad dual booleana (`isVirtual`, `isInPerson`; ambos `true` = Híbrido) y estado (`DRAFT`, `PUBLISHED`, `CANCELLED`). | Usa `organizer.isOwn: boolean` en lugar de comparar strings hardcodeados como `'DSC UNI'`. |
| **`Project` & `Technology`** | Portafolio de proyectos open-source con galería en R2/S3 y etiquetas tecnológicas. | Reutilizable por cualquier capítulo técnico. |
| **`AuditLog`** | Trazabilidad inmutable (`CREATE`, `UPDATE`, `DELETE`) con diff `{ before, after }` por campo. | Cumplimiento OWASP A09 de serie. |

---

## 3. Cómo Configurar Otra Comunidad (Modo Open Source)

Para adaptar cualquier aplicación del monorepo a otra comunidad estudiantil sin tocar los paquetes base, basta con definir el bloque `community` en `app.config.ts`:

```ts
export default defineApp({
  id: 'external-community-web',
  // ...
  community: {
    shortName: 'TECH UNI', // Por defecto: 'DSC UNI'
    organizationName: 'Club de Ingeniería y Tecnología', // Por defecto: 'Developer Student Club'
    institutionName: 'Universidad Nacional de Ingeniería',
    themePreset: 'tech-indigo', // 'dsc-uni' | 'tech-indigo' | 'ai-guild'
    apiBaseUrl: '/api/v1',
  },
});
```
