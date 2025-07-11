import Database from 'better-sqlite3';
import db from '../db.js';
import { Count, Team } from '../interfaces/internalTypes.js';
import { TeamExternal } from '../interfaces/externalTypes.js';

export function getTeams(): TeamExternal[] {
  const stmt = db.prepare<[], Team>('SELECT * FROM Team WHERE deletedAt IS NULL ORDER BY name ASC');
  return stmt.all().map(team => ({
    id: team.teamId,
    name: team.name
  }));
}

export function getTeamsPaginated(
  pageSize: number, 
  offset: number, 
  sortField: "id" | "name" | undefined, 
  sortOrder: "asc" | "desc" | undefined,
  filterField: "id" | "name" | undefined,
  filterOp: "=" | "contains" | undefined,
  filterValue: string | undefined
): TeamExternal[] {
  // Map sortField to actual SQL column
  let orderBy = "Team.teamId";
  if (sortField === "name") orderBy = "Team.name";
  const order = sortOrder === "desc" ? "DESC" : "ASC";

  // Filtering
  let filterClause = "deletedAt IS NULL";
  let params: any[] = [];

  if (filterField && filterValue !== undefined && filterValue !== "") {
    if (filterField === "id" && filterOp === "=") {
      filterClause += " AND teamId = ?";
      params.push(Number(filterValue));
    } else if (filterField === "name" && filterOp === "contains") {
      filterClause += " AND name LIKE ?";
      params.push(`%${filterValue}%`);
    }
  }

  const stmt = db.prepare<[...any[], number, number], Team>(`
    SELECT * FROM Team
    WHERE ${filterClause}
    ORDER BY ${orderBy} ${order}
    LIMIT ? OFFSET ?
  `);
  return stmt.all(...params, pageSize, offset).map(team => ({
    id: team.teamId,
    name: team.name
  }));
}

export function getTeamsCount(
  filterField?: "id" | "name",
  filterOp?: "=" | "contains",
  filterValue?: string
): number {
  let filterClause = "deletedAt IS NULL";
  let params: any[] = [];

  if (filterField && filterValue !== undefined && filterValue !== "") {
    if (filterField === "id" && filterOp === "=") {
      filterClause += " AND teamId = ?";
      params.push(Number(filterValue));
    } else if (filterField === "name" && filterOp === "contains") {
      filterClause += " AND name LIKE ?";
      params.push(`%${filterValue}%`);
    }
  }

  const stmt = db.prepare<any[], Count>(
    `SELECT COUNT(*) as count FROM Team WHERE ${filterClause}`
  );
  const count = stmt.get(...params);
  return count ? (count as any).count : 0;
}

export function getTeamById(teamId: number): TeamExternal | undefined {
  const stmt = db.prepare<number, Team>('SELECT * FROM Team WHERE teamId = ? AND deletedAt IS NULL');
  const team = stmt.get(teamId)
  return team ? { id: team.teamId, name: team.name } : undefined;
}

export function createTeam(name: string): Database.RunResult {
  const stmt = db.prepare('INSERT INTO Team (name, createdAt, updatedAt) VALUES (?, ?, ?)');
  return stmt.run(name, new Date().toISOString(), new Date().toISOString());
}

export function updateTeam(teamId: number, name: string): Database.RunResult {
  const stmt = db.prepare('UPDATE Team SET name = ?, updatedAt = ? WHERE teamId = ? AND deletedAt IS NULL');
  return stmt.run(name, new Date().toISOString(), teamId);
}

export function deleteTeamAndUnassignMembers(teamId: number): Database.RunResult {
  const transaction = db.transaction((teamId: number) => {
    db.prepare('UPDATE Employee SET teamId = NULL WHERE teamId = ?').run(teamId);
    db.prepare('UPDATE Car SET teamId = NULL WHERE teamId = ?').run(teamId);
    const stmt = db.prepare<[string, number], Team>('UPDATE Team SET deletedAt = ? WHERE teamId = ?');
    return stmt.run(new Date().toISOString(), teamId);
  });
  return transaction(teamId);
}