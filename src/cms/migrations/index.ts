import * as migration_20261021_080911_cms_baseline from './20261021_080911_cms_baseline';
import * as migration_20261021_080925_enquiry_submissions from './20261021_080925_enquiry_submissions';
import * as migration_20261029_100000_enquiry_details from './20261029_100000_enquiry_details';
import * as migration_20261029_150000_fastener_applications from './20261029_150000_fastener_applications';
import * as migration_20261029_160000_blog_categories from './20261029_160000_blog_categories';
import * as migration_20261030_011934_careers from './20261030_011934_careers';

export const migrations = [
  {
    up: migration_20261021_080911_cms_baseline.up,
    down: migration_20261021_080911_cms_baseline.down,
    name: '20261021_080911_cms_baseline',
  },
  {
    up: migration_20261021_080925_enquiry_submissions.up,
    down: migration_20261021_080925_enquiry_submissions.down,
    name: '20261021_080925_enquiry_submissions',
  },
  {
    up: migration_20261029_100000_enquiry_details.up,
    down: migration_20261029_100000_enquiry_details.down,
    name: '20261029_100000_enquiry_details',
  },
  {
    up: migration_20261029_150000_fastener_applications.up,
    down: migration_20261029_150000_fastener_applications.down,
    name: '20261029_150000_fastener_applications',
  },
  {
    up: migration_20261029_160000_blog_categories.up,
    down: migration_20261029_160000_blog_categories.down,
    name: '20261029_160000_blog_categories',
  },
  {
    up: migration_20261030_011934_careers.up,
    down: migration_20261030_011934_careers.down,
    name: '20261030_011934_careers'
  },
];
