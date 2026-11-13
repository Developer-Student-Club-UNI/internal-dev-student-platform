'use client';

import * as React from 'react';
import { useAuth } from '@repo/auth';
import { validateSafeInput } from '@repo/security';
import {
  Alert,
  Badge,
  Button,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  DataTable,
  Icon,
  Input,
  PageHeader,
  Select,
  type DataTableColumn,
} from '@repo/ui';

interface CertificateItem {
  code: string;
  recipient: string;
  program: string;
  issuedBy: string;
  issuedAt: string;
}

const INITIAL_CERTIFICATES: CertificateItem[] = [
  {
    code: 'CERT-2026-8901',
    recipient: 'Valeria Rojas',
    program: 'Voluntariado Destacado — Semestre 2026-II',
    issuedBy: 'Mateo Vargas (board)',
    issuedAt: '10 Nov 2026',
  },
  {
    code: 'CERT-2026-8902',
    recipient: 'Diego Herrera',
    program: 'Speaker: Taller de Agentes IA y Monorepos',
    issuedBy: 'Sofía Mendoza (admin)',
    issuedAt: '11 Nov 2026',
  },
];

export function CertificatesView() {
  const { user, csrfToken, verifyMutationCsrf } = useAuth();
  const [certs, setCerts] = React.useState<CertificateItem[]>(INITIAL_CERTIFICATES);
  const [recipient, setRecipient] = React.useState('');
  const [program, setProgram] = React.useState(
    'Voluntariado Destacado — Semestre 2026-II'
  );
  const [securityAlert, setSecurityAlert] = React.useState<string | null>(null);
  const [simulateCrash, setSimulateCrash] = React.useState(false);

  if (simulateCrash) {
    throw new Error(
      'Fallo simulado en el motor de firma PDF con credencial Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIn0.dozjgNryP4J3jVmNHl0w5N_XgL0n3I9PlFUP0THsR8U — Observa cómo ModuleErrorBoundary redacta el token automáticamente.'
    );
  }

  const handleIssue = (e: React.FormEvent) => {
    e.preventDefault();
    setSecurityAlert(null);

    if (!verifyMutationCsrf(csrfToken)) {
      setSecurityAlert('Error CSRF: Token de sesión inválido.');
      return;
    }

    const recipientCheck = validateSafeInput(recipient, 120);
    if (!recipientCheck.safe) {
      setSecurityAlert(
        `[${recipientCheck.threatType}] ${recipientCheck.reason}`
      );
      return;
    }

    if (!recipientCheck.sanitized) return;
    const nextCode = `CERT-2026-${8903 + certs.length}`;
    setCerts((prev) => [
      {
        code: nextCode,
        recipient: recipientCheck.sanitized,
        program,
        issuedBy: `${user.name} (${user.role})`,
        issuedAt: '12 Nov 2026',
      },
      ...prev,
    ]);
    setRecipient('');
  };

  const columns: DataTableColumn<CertificateItem>[] = [
    {
      key: 'code',
      header: 'Código Verificable',
      render: (row) => (
        <Badge variant="primary" className="font-mono">
          {row.code}
        </Badge>
      ),
    },
    {
      key: 'recipient',
      header: 'Beneficiario',
      render: (row) => <span className="font-semibold">{row.recipient}</span>,
    },
    {
      key: 'program',
      header: 'Programa / Evento',
      render: (row) => <span>{row.program}</span>,
    },
    {
      key: 'issuedBy',
      header: 'Autorizado Por',
      render: (row) => (
        <span className="text-xs text-muted-foreground">{row.issuedBy}</span>
      ),
    },
    {
      key: 'issuedAt',
      header: 'Fecha',
      render: (row) => <span>{row.issuedAt}</span>,
    },
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        title="Emisión y Firma de Certificados"
        description="Módulo exclusivo para Junta Directiva (board) y Administradores (admin)."
        badge="RBAC + OWASP Guard"
        badgeVariant="warning"
        icon="Award"
        actions={
          <Button
            size="sm"
            variant="outline"
            onClick={() => setSimulateCrash(true)}
          >
            <Icon name="AlertTriangle" className="h-3.5 w-3.5 text-status-warning" />
            <span>Simular Fuga de Token en Excepción (Test Redaction)</span>
          </Button>
        }
      />

      {securityAlert && (
        <Alert
          variant="danger"
          title="Emisión bloqueada por @repo/security"
          description={securityAlert}
        />
      )}

      <Alert
        variant="info"
        title="Protección por Rol (RBAC) + Redacción de Secretos (OWASP AI LLM06)"
        description="Si cambias tu rol a 'volunteer' o 'member', este módulo se bloquea. Si pulsas 'Simular Fuga de Token', comprobarás que ModuleErrorBoundary enmascara automáticamente cualquier JWT o Bearer token en el error."
      />

      <Card>
        <CardHeader>
          <CardTitle>Emitir Nuevo Certificado Oficial</CardTitle>
          <CardDescription>
            Firmando actualmente con la identidad: <strong>{user.name}</strong> ({user.email}) · Token CSRF: <code>{csrfToken}</code>
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleIssue} className="grid gap-4 sm:grid-cols-3 items-end">
            <Input
              label="Nombre del Estudiante o Voluntario"
              placeholder="Ej. Andrés Salazar"
              value={recipient}
              onChange={(e) => setRecipient(e.target.value)}
              required
            />
            <Select
              label="Categoría de Certificación"
              value={program}
              onChange={(e) => setProgram(e.target.value)}
              options={[
                {
                  value: 'Voluntariado Destacado — Semestre 2026-II',
                  label: 'Voluntariado Destacado — Semestre 2026-II',
                },
                {
                  value: 'Speaker Oficial en Evento Tecnológico',
                  label: 'Speaker Oficial en Evento Tecnológico',
                },
                {
                  value: 'Contribuidor Core — Frontend IDP Monorepo',
                  label: 'Contribuidor Core — Frontend IDP Monorepo',
                },
              ]}
            />
            <Button type="submit" variant="primary">
              <Icon name="FileCheck" className="h-4 w-4" />
              <span>Emitir Certificado</span>
            </Button>
          </form>
        </CardContent>
      </Card>

      <DataTable
        columns={columns}
        data={certs}
        rowKey={(row) => row.code}
      />
    </div>
  );
}
