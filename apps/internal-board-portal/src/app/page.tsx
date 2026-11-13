'use client';

import * as React from 'react';
import { useAuth } from '@repo/auth';
import { sanitizeText, validateSafeInput } from '@repo/security';
import {
  Alert,
  Badge,
  Button,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Icon,
  Input,
  PageHeader,
  Textarea,
} from '@repo/ui';

function normalizeSkillsList(raw: string): string[] {
  const seen = new Set<string>();
  const result: string[] = [];
  for (const item of raw.split(',')) {
    const trimmed = item.trim();
    if (!trimmed) continue;
    const key = trimmed.toLowerCase();
    if (!seen.has(key)) {
      seen.add(key);
      result.push(trimmed);
    }
  }
  return result;
}

export default function InternalPortalDashboardPage() {
  const { user, csrfToken, verifyMutationCsrf } = useAuth();

  const nameParts = user.name.replace(/\s*\([^)]*\)\s*/g, '').split(' ');
  const [firstName, setFirstName] = React.useState(nameParts[0] ?? 'Mateo');
  const [lastName, setLastName] = React.useState(
    nameParts.slice(1).join(' ') || 'Vargas'
  );
  const [career, setCareer] = React.useState('Ingeniería de Sistemas');
  const [linkedinUrl, setLinkedinUrl] = React.useState(
    'https://linkedin.com/in/dsc-uni'
  );
  const [githubUrl, setGithubUrl] = React.useState(
    'https://github.com/dsc-uni'
  );
  const [about, setAbout] = React.useState(
    'Integrante activo del Developer Student Club UNI. Apasionado por el desarrollo de software, ciencia de datos y comunidades open-source.'
  );
  const [skillsInput, setSkillsInput] = React.useState(
    'React, TypeScript, Next.js, Python, Cloud'
  );
  const [savedNotice, setSavedNotice] = React.useState<string | null>(null);
  const [formError, setFormError] = React.useState<string | null>(null);

  React.useEffect(() => {
    const clean = user.name.replace(/\s*\([^)]*\)\s*/g, '').split(' ');
    setFirstName(clean[0] ?? 'Usuario');
    setLastName(clean.slice(1).join(' ') || 'DSC');
  }, [user.name]);

  const parsedSkills = React.useMemo(
    () => normalizeSkillsList(skillsInput),
    [skillsInput]
  );

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);
    setSavedNotice(null);

    if (!verifyMutationCsrf(csrfToken)) {
      setFormError('Token anti-CSRF inválido o expirado (OWASP A07).');
      return;
    }

    const fieldsToValidate = [
      { name: 'Nombre', value: firstName },
      { name: 'Apellidos', value: lastName },
      { name: 'Carrera', value: career },
      { name: 'LinkedIn', value: linkedinUrl },
      { name: 'GitHub', value: githubUrl },
      { name: 'Sobre mí', value: about },
      { name: 'Skills', value: skillsInput },
    ];

    for (const field of fieldsToValidate) {
      const check = validateSafeInput(field.value);
      if (!check.safe) {
        setFormError(
          `[${check.threatType}] Campo "${field.name}": ${check.reason}`
        );
        return;
      }
    }

    const normalizedSkills = normalizeSkillsList(skillsInput);
    setFirstName(sanitizeText(firstName, 80));
    setLastName(sanitizeText(lastName, 80));
    setCareer(sanitizeText(career, 120));
    setAbout(sanitizeText(about, 600));
    setSkillsInput(normalizedSkills.join(', '));
    setSavedNotice('Cambios guardados.');
  };

  const slug = `${firstName}-${lastName}`
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-');

  return (
    <div className="space-y-8">
      <PageHeader
        title="Mi cuenta"
        description="Gestiona los datos de tu cuenta y tu ficha pública dentro del directorio del equipo (PATCH /api/v1/auth/me/profile)."
        badge={`Rol: ${user.role}`}
        icon="UserCheck"
      />

      {/* Bloque de Credencial de Cuenta (Solo lectura como en PanelHome.tsx) */}
      <Card>
        <CardContent className="p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Correo de la cuenta
            </span>
            <div className="flex items-center gap-2.5">
              <span className="text-base font-bold text-foreground">
                {user.email}
              </span>
              <Badge variant="success">Verificado</Badge>
            </div>
            <p className="text-xs text-muted-foreground">
              Departamento / Unidad: {user.department} · Roles Backend:{' '}
              <code>{user.backendRoles.join(', ')}</code>
            </p>
          </div>

          {user.role !== 'member' && (
            <div className="rounded-sm border border-subtle bg-background px-4 py-2.5 text-xs">
              <span className="block text-muted-foreground">
                Enlace público en /team:
              </span>
              <code className="font-semibold text-primary">
                /team?member={slug}
              </code>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Formulario Editable: Mi perfil del equipo (PanelHome.tsx) */}
      <Card>
        <CardHeader>
          <CardTitle>Mi perfil del equipo</CardTitle>
          <CardDescription>
            Edita tu nombre, carrera, enlaces profesionales, biografía y etiquetas de skills.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSaveProfile} className="space-y-5">
            <div className="grid gap-4 sm:grid-cols-2">
              <Input
                label="Nombre"
                placeholder="Julio Alfonso"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                required
              />
              <Input
                label="Apellidos"
                placeholder="Suárez Durand"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                required
              />
            </div>

            <Input
              label="Carrera"
              placeholder="Ingeniería de Sistemas"
              value={career}
              onChange={(e) => setCareer(e.target.value)}
            />

            <div className="grid gap-4 sm:grid-cols-2">
              <Input
                label="LinkedIn"
                placeholder="https://linkedin.com/in/..."
                value={linkedinUrl}
                onChange={(e) => setLinkedinUrl(e.target.value)}
              />
              <Input
                label="GitHub"
                placeholder="https://github.com/..."
                value={githubUrl}
                onChange={(e) => setGithubUrl(e.target.value)}
              />
            </div>

            <Textarea
              label="Sobre mí"
              placeholder="Cuéntanos sobre ti..."
              helperText="Opcional. Se muestra en tu ficha pública de la página de Equipo."
              value={about}
              onChange={(e) => setAbout(e.target.value)}
            />

            <div className="space-y-2">
              <Input
                label="Skills"
                placeholder="React, Figma, Scrum"
                helperText="Separadas por comas. Se reutilizan las que ya existan sin duplicar mayúsculas/minúsculas."
                value={skillsInput}
                onChange={(e) => setSkillsInput(e.target.value)}
              />
              {parsedSkills.length > 0 && (
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {parsedSkills.map((skill) => (
                    <Badge key={skill} variant="primary">
                      {skill}
                    </Badge>
                  ))}
                </div>
              )}
            </div>

            {formError && (
              <Alert
                variant="danger"
                title="Error de validación (@repo/security)"
                description={formError}
              />
            )}

            {savedNotice && (
              <Alert
                variant="success"
                title={savedNotice}
                description="Tu ficha del equipo ha sido actualizada y normalizada."
              />
            )}

            <div className="flex items-center justify-between pt-2">
              <span className="text-xs font-mono text-muted-foreground">
                CSRF Token: {csrfToken}
              </span>
              <Button type="submit" variant="primary">
                <Icon name="CheckCircle2" className="h-4 w-4" />
                <span>Guardar cambios</span>
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
