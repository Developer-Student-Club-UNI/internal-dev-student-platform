import { defineModule } from '@repo/module-sdk';
import { NosotrosView } from './views/nosotros-view';

export default defineModule({
  id: 'nosotros',
  targetApp: 'external-community-web',
  title: 'Acerca de Nosotros',
  description:
    'Historia, misión y enfoque de aprendizaje colaborativo del Developer Student Club UNI.',
  version: '1.0.0',
  mount: {
    type: 'route',
    path: '/nosotros',
    slot: 'header-nav',
    order: 5,
    icon: 'Info',
  },
  component: NosotrosView,
});
