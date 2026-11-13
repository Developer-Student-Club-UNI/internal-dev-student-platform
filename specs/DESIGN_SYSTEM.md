# Sistema de Diseño Cerrado (`specs/DESIGN_SYSTEM.md`)

## 1. Filosofía: Cero Estilo Libre

Para evitar que aplicaciones o módulos creados por distintos voluntarios o agentes de IA rompan la coherencia visual, **el estilo está centralizado al 100% en `@repo/ui` y `@repo/layouts`**.

- **Única fuente de verdad de color y tema:** `packages/ui/src/styles/tokens.css`.
- **Único preset de Tailwind:** `packages/ui/tailwind.preset.ts`.

---

## 2. Tokens Semánticos Autorizados

Está **terminantemente prohibido** usar colores de la paleta por defecto de Tailwind (`blue-500`, `slate-900`, `emerald-600`, etc.) o valores hexadecimales/arbitrarios (`bg-[#fff]`, `w-[320px]`).

### Superficies y Fondos
- `bg-background`: Fondo principal de la página.
- `bg-surface`: Superficie de tarjetas, paneles y contenedores.
- `bg-surface-elevated`: Superficie destacada, popovers, cabeceras de tabla o elementos interactivos en hover.
- `bg-surface-Glass`: Superficie translúcida para barras de navegación superiores.

### Tipografía y Contenido
- `text-foreground`: Texto principal de alta legibilidad.
- `text-muted-foreground`: Texto secundario, subtítulos y metadatos.
- `text-primary`: Texto con color de acento institucional.

### Acciones e Identidad
- `bg-primary` / `text-primary-foreground`: Acción principal e identidad de marca.
- `bg-secondary` / `text-secondary-foreground`: Acciones secundarias.
- `bg-accent` / `text-accent-foreground`: Resaltado suave para badges y navegación activa.

### Bordes y Estados Semánticos
- `border-subtle`: Bordes estándar de tarjetas, divisores y tablas.
- `border-strong`: Bordes enfatizados o activos.
- `bg-status-success` / `text-status-success`: Operaciones completadas, estados activos o verificados.
- `bg-status-warning` / `text-status-warning`: Alertas preventivas o pendientes de revisión.
- `bg-status-danger` / `text-status-danger`: Errores críticos, revocaciones o acciones destructivas.
- `bg-status-info` / `text-status-info`: Información contextual o anuncios.

---

## 3. Catálogo de Componentes de `@repo/ui`

Ninguna aplicación ni módulo puede declarar etiquetas `<button>`, `<input>`, `<select>`, `<textarea>` o `<table>` directamente. Debe importar los componentes de `@repo/ui`:

| Categoría | Componentes en `@repo/ui` | Uso Principal |
| :--- | :--- | :--- |
| **Primitivas Interactivas** | `Button`, `Input`, `Select`, `Textarea`, `Badge` | Formularios, filtros y acciones. |
| **Contenedores y Layout** | `Card`, `CardHeader`, `CardContent`, `CardFooter`, `SectionContainer` | Agrupación visual consistente con bordes y padding normalizados. |
| **Estructura de Página** | `PageHeader`, `StatCard`, `EmptyState`, `Alert`, `Skeleton` | Cabeceras de módulo, métricas KPI, estados vacíos y alertas. |
| **Datos Tabulares** | `DataTable` | Tablas tipadas con cabeceras y estados vacíos estandarizados. |
| **Iconografía** | `Icon` (`IconName` tipado) | Conjunto curado de iconos vectoriales consistentes. |
