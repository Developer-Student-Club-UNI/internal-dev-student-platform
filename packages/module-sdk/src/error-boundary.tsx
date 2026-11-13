'use client';

import * as React from 'react';
import { redactSensitiveData } from '@repo/security';
import { Badge, Button, Card, CardContent, Icon } from '@repo/ui';

export interface ModuleErrorBoundaryProps {
  moduleId: string;
  moduleTitle: string;
  children: React.ReactNode;
}

interface ModuleErrorBoundaryState {
  hasError: boolean;
  errorMessage: string | null;
}

export class ModuleErrorBoundary extends React.Component<
  ModuleErrorBoundaryProps,
  ModuleErrorBoundaryState
> {
  constructor(props: ModuleErrorBoundaryProps) {
    super(props);
    this.state = {
      hasError: false,
      errorMessage: null,
    };
  }

  static getDerivedStateFromError(error: Error): ModuleErrorBoundaryState {
    const rawMsg = error.message || 'Excepción inesperada en el módulo.';
    return {
      hasError: true,
      // OWASP A09 & OWASP AI LLM06: Redactar cualquier token/API key/credencial antes de renderizar
      errorMessage: redactSensitiveData(rawMsg),
    };
  }

  handleRetry = () => {
    this.setState({ hasError: false, errorMessage: null });
  };

  render() {
    if (this.state.hasError) {
      return (
        <Card className="border-status-danger/40 my-4">
          <CardContent className="p-6 space-y-4">
            <div className="flex items-start justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-md bg-status-danger-bg text-status-danger">
                  <Icon name="AlertTriangle" className="h-5 w-5" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-base font-bold text-foreground">
                      Fallo Aislado en Módulo: {this.props.moduleTitle}
                    </h3>
                    <Badge variant="danger">Error Boundary + PII Redaction</Badge>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    ID de Módulo: <code>{this.props.moduleId}</code> — El App Shell principal sigue operando con normalidad.
                  </p>
                </div>
              </div>
              <Button size="sm" variant="outline" onClick={this.handleRetry}>
                <Icon name="RefreshCw" className="h-3.5 w-3.5" />
                Reintentar Módulo
              </Button>
            </div>
            {this.state.errorMessage && (
              <pre className="rounded-md bg-surface-elevated p-3 text-xs text-status-danger overflow-x-auto">
                {this.state.errorMessage}
              </pre>
            )}
          </CardContent>
        </Card>
      );
    }

    return this.props.children;
  }
}
