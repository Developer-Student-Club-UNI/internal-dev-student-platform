'use client';

import * as React from 'react';
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
  Input,
  PageHeader,
} from '@repo/ui';

export function PanelSiteView() {
  const [email, setEmail] = React.useState('dsc@gmail.com');
  const [phone, setPhone] = React.useState('989098789');
  const [location, setLocation] = React.useState('Ubicación FIIE - UNI');
  const [schedule, setSchedule] = React.useState(
    'Lunes - Sábado (9:00-22:00)'
  );
  const [contactSaved, setContactSaved] = React.useState(false);

  const [linkedin, setLinkedin] = React.useState('https://linkedin.com');
  const [whatsapp, setWhatsapp] = React.useState(
    'https://wa.me/51989098789'
  );
  const [tiktok, setTiktok] = React.useState('https://tiktok.com');
  const [facebook, setFacebook] = React.useState('https://facebook.com');
  const [instagram, setInstagram] = React.useState('https://instagram.com');
  const [socialSaved, setSocialSaved] = React.useState(false);
  const [formError, setFormError] = React.useState<string | null>(null);

  const handleSaveContact = (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);
    setContactSaved(false);

    for (const val of [email, phone, location, schedule]) {
      const check = validateSafeInput(val);
      if (!check.safe) {
        setFormError(`[${check.threatType}] ${check.reason}`);
        return;
      }
    }
    setContactSaved(true);
  };

  const handleSaveSocial = (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);
    setSocialSaved(false);

    for (const val of [linkedin, whatsapp, tiktok, facebook, instagram]) {
      const check = validateSafeInput(val);
      if (!check.safe) {
        setFormError(`[${check.threatType}] ${check.reason}`);
        return;
      }
    }
    setSocialSaved(true);
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Sitio"
        description="Los datos de contacto y las redes sociales que aparecen en el pie de página y en Contacto (PUT /api/v1/admin/site/:key · Capacidad: site:write)."
        badge="SiteSetting"
        icon="Globe"
      />

      {formError && (
        <Alert
          variant="danger"
          title="Bloqueado por @repo/security"
          description={formError}
        />
      )}

      {/* Formulario 1: Contacto (PanelSite.tsx) */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Contacto</CardTitle>
              <CardDescription>
                Lo que se ve en el pie de página y en la página pública de Contacto.
              </CardDescription>
            </div>
            {contactSaved && <Badge variant="success">Guardado</Badge>}
          </div>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSaveContact} className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <Input
                label="Correo"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              <Input
                label="Teléfono"
                helperText="Se escribe como quieras que se lea."
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                required
              />
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <Input
                label="Ubicación"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                required
              />
              <Input
                label="Horario"
                value={schedule}
                onChange={(e) => setSchedule(e.target.value)}
                required
              />
            </div>

            <div className="flex justify-end">
              <Button type="submit" variant="primary">
                Guardar contacto
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      {/* Formulario 2: Redes Sociales (PanelSite.tsx) */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Redes</CardTitle>
              <CardDescription>
                Los cinco enlaces oficiales del pie de página. Se guardan juntos.
              </CardDescription>
            </div>
            {socialSaved && <Badge variant="success">Guardado</Badge>}
          </div>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSaveSocial} className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <Input
                label="LinkedIn"
                type="url"
                value={linkedin}
                onChange={(e) => setLinkedin(e.target.value)}
                required
              />
              <Input
                label="WhatsApp"
                type="url"
                value={whatsapp}
                onChange={(e) => setWhatsapp(e.target.value)}
                required
              />
              <Input
                label="TikTok"
                type="url"
                value={tiktok}
                onChange={(e) => setTiktok(e.target.value)}
                required
              />
              <Input
                label="Facebook"
                type="url"
                value={facebook}
                onChange={(e) => setFacebook(e.target.value)}
                required
              />
              <Input
                label="Instagram"
                type="url"
                value={instagram}
                onChange={(e) => setInstagram(e.target.value)}
                required
              />
            </div>

            <div className="flex justify-end">
              <Button type="submit" variant="primary">
                Guardar redes
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
