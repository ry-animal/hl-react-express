import type { Config } from 'drizzle-kit';
import path from 'path';

export default {
  schema: './src/db/schema.ts',
  out: './drizzle',
  driver: 'sqlite',
  dbCredentials: {
    url: path.join(__dirname, 'db.sqlite'),
  },
} satisfies Config; 