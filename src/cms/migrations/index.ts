import * as migration_20261021_080911_cms_baseline from './20261021_080911_cms_baseline';
import * as migration_20261021_080925_enquiry_submissions from './20261021_080925_enquiry_submissions';

export const migrations = [
  {
    up: migration_20261021_080911_cms_baseline.up,
    down: migration_20261021_080911_cms_baseline.down,
    name: '20261021_080911_cms_baseline',
  },
  {
    up: migration_20261021_080925_enquiry_submissions.up,
    down: migration_20261021_080925_enquiry_submissions.down,
    name: '20261021_080925_enquiry_submissions'
  },
];
