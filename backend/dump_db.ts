import Database from 'better-sqlite3';
import fs from 'fs';

const db = new Database('database/database.db');

const tables = [
  'Employee',
  'Team',
  'Car',
  'Admin',
  'Reservation',
  'LineLoginState'
];

let output = '';

for (const table of tables) {
  output += `--- ${table} ---\n`;
  try {
    const rows = db.prepare(`SELECT * FROM ${table}`).all();
    if (rows.length === 0) {
      output += '(empty)\n';
    } else {
      for (const row of rows) {
        output += JSON.stringify(row) + '\n';
      }
    }
  } catch (err) {
    output += `Error reading table ${table}: ${err}\n`;
  }
  output += '\n';
}

fs.writeFileSync('database_dump.txt', output, 'utf8');
console.log('Database dumped to database_dump.txt');

