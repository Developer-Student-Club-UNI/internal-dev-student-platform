import { defineModule } from '@repo/module-sdk';
import { EventsShowcaseView } from './views/events-showcase-view';

export default defineModule({
  id: 'events-showcase',
  targetApp: 'external-community-web',
  title: 'Eventos',
  description:
    'Agenda de talleres, charlas y hackathons del Developer Student Club UNI.',
  version: '1.0.0',
  mount: {
    type: 'route',
    path: '/eventos',
    slot: 'header-nav',
    order: 10,
    icon: 'Calendar',
  },
  component: EventsShowcaseView,
});
