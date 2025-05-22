import Database from 'better-sqlite3';
import { join } from 'path';
import { schema } from '../src/lib/db/schema.js';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import { mkdir } from 'fs/promises';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

async function migrate() {
  try {
    // Create data directory if it doesn't exist
    await mkdir(join(__dirname, '../data'), { recursive: true });
    
    const db = new Database(join(__dirname, '../data/kidney-match.db'));
    
    // Enable foreign keys
    db.pragma('foreign_keys = ON');
    
    // Execute schema
    db.exec(schema);
    
    console.log('Migration completed successfully');
    
    db.close();
  } catch (error) {
    console.error('Migration failed:', error);
    process.exit(1);
  }
}

migrate();