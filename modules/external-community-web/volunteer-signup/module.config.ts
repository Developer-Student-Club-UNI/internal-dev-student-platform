import { defineModule } from '@repo/module-sdk';
import { VolunteerSignupView } from './views/volunteer-signup-view';

export default defineModule({
  id: 'volunteer-signup',
  targetApp: 'external-community-web',
  title: 'Contacto',
  description:
    'Información de contacto, ubicación FIIS-UNI, preguntas frecuentes y buzón de mensajes.',
  version: '1.0.0',
  mount: {
    type: 'route',
    path: '/contacto',
    slot: 'header-nav',
    order: 20,
    icon: 'Mail',
  },
  component: VolunteerSignupView,
});
