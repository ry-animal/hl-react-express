import path from 'path';

import type { Config } from 'drizzle-kit';

export default {
  schema: './src/db/schema.ts',
  out: './drizzle',
  driver: 'sqlite',
  dbCredentials: {
    url: path.join(__dirname, 'db.sqlite'),
  },
} satisfies Config;
