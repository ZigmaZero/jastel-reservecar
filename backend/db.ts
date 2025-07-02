import Database from 'better-sqlite3';
import logger from './logger.js';

const db = new Database(
  (process.env.NODE_ENV === 'test') 
  ? 'database/test.db' 
  : `database/${process.env.DATABASE_NAME || 'main'}.db`
);
db.pragma('journal_mode = WAL');

export default db;