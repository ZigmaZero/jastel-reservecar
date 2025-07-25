import Database from 'better-sqlite3';
import db from '../db.js';
import { Count, Employee } from '../interfaces/internalTypes.js';
import { EmployeeExternal } from '../interfaces/externalTypes.js';

export function getEmployees(
  pageSize: number, 
  offset: number, 
  sortField: "id" | "teamId" | "teamName" | "verified" | "name" | undefined,
  sortOrder: "asc" | "desc" | undefined,
  filterField: "id" | "teamId" | "teamName" | "verified" | "name" | undefined,
  filterOp: "=" | "is" | "contains" | undefined,
  filterValue: string | undefined
): EmployeeExternal[] {
  // Determine the ORDER BY field
  let orderBy = "Employee.userId";
  if (sortField === "teamName") orderBy = "Team.name";
  else if (sortField === "teamId") orderBy = "Employee.teamId";
  else if (sortField === "verified") orderBy = "Employee.verified";
  else if (sortField === "name") orderBy = "Employee.name";
  const order = sortOrder === "desc" ? "DESC" : "ASC";

  // Filtering
  let filterClause = "Employee.deletedAt IS NULL";
  let params: any[] = [];

  if (filterField) {
    if ((filterField === "id" || filterField === "teamId") && filterOp === "=" && filterValue !== undefined && filterValue !== "") {
      if (filterField === "id") {
        filterClause += " AND Employee.userId = ?";
      } else {
        filterClause += " AND Employee.teamId = ?";
      }
      params.push(Number(filterValue));
    } else if ((filterField === "name" || filterField === "teamName") && filterOp === "contains" && filterValue !== undefined && filterValue !== "") {
      if (filterField === "name") {
        filterClause += " AND Employee.name LIKE ?";
      } else {
        filterClause += " AND Team.name LIKE ?";
      }
      params.push(`%${filterValue}%`);
    } else if (filterField === "verified" && filterOp === "is") {
      if (filterValue === "true") {
        filterClause += " AND Employee.verified = 1";
      } else if (filterValue === "false") {
        filterClause += " AND Employee.verified = 0";
      } // if "any" or undefined, do not add a filter
    }
  }

  const stmt = db.prepare<[...any[], number, number], EmployeeExternal>(`
    SELECT 
      Employee.userId AS id,
      Employee.lineId,
      Employee.name,
      Employee.verified,
      Employee.teamId,
      Team.name AS teamName
    FROM Employee
    LEFT JOIN Team ON Employee.teamId = Team.teamId
    WHERE ${filterClause}
    ORDER BY ${orderBy} ${order}
    LIMIT ? OFFSET ?
  `);
  return stmt.all(...params, pageSize, offset);
}

export function getEmployeesCount(
  filterField?: "id" | "teamId" | "teamName" | "verified" | "name",
  filterOp?: "=" | "is" | "contains",
  filterValue?: string
): number {
  let filterClause = "Employee.deletedAt IS NULL";
  let params: any[] = [];

  if (filterField) {
    if ((filterField === "id" || filterField === "teamId") && filterOp === "=" && filterValue !== undefined && filterValue !== "") {
      if (filterField === "id") {
        filterClause += " AND Employee.userId = ?";
      } else {
        filterClause += " AND Employee.teamId = ?";
      }
      params.push(Number(filterValue));
    } else if ((filterField === "name" || filterField === "teamName") && filterOp === "contains" && filterValue !== undefined && filterValue !== "") {
      if (filterField === "name") {
        filterClause += " AND Employee.name LIKE ?";
      } else {
        filterClause += " AND Team.name LIKE ?";
      }
      params.push(`%${filterValue}%`);
    } else if (filterField === "verified" && filterOp === "is") {
      if (filterValue === "true") {
        filterClause += " AND Employee.verified = 1";
      } else if (filterValue === "false") {
        filterClause += " AND Employee.verified = 0";
      }
    }
  }

  const stmt = db.prepare<any[], Count>(
    `SELECT COUNT(*) as count FROM Employee LEFT JOIN Team ON Employee.teamId = Team.teamId WHERE ${filterClause}`
  );
  const count = stmt.get(...params);
  return count ? (count as any).count : 0;
}

export function getEmployeesInTeam(teamId: number): EmployeeExternal[] {
  const stmt = db.prepare<[number], EmployeeExternal>(`
    SELECT 
      Employee.userId AS id,
      Employee.lineId,
      Employee.name,
      Employee.verified,
      Employee.teamId,
      Team.name AS teamName
    FROM Employee
    LEFT JOIN Team ON Employee.teamId = Team.teamId
    WHERE Employee.teamId = ? AND Employee.deletedAt IS NULL
  `);
  return stmt.all(Number(teamId));
}

// Get employee by id with teamName
export function getEmployeeById(userId: number): EmployeeExternal | undefined {
  const stmt = db.prepare<[number], EmployeeExternal>(`
    SELECT 
      Employee.userId AS id,
      Employee.lineId,
      Employee.name,
      Employee.verified,
      Employee.teamId,
      Team.name AS teamName
    FROM Employee
    LEFT JOIN Team ON Employee.teamId = Team.teamId
    WHERE Employee.userId = ? AND Employee.deletedAt IS NULL
  `);
  return stmt.get(userId);
}

// Get employee by name with teamName
export function getEmployeeByLineId(lineId: string): EmployeeExternal | undefined {
  const stmt = db.prepare<[string], EmployeeExternal>(`
    SELECT 
      Employee.userId AS id,
      Employee.lineId,
      Employee.name,
      Employee.verified,
      Employee.teamId,
      Team.name AS teamName
    FROM Employee
    LEFT JOIN Team ON Employee.teamId = Team.teamId
    WHERE Employee.lineId = ? AND Employee.deletedAt IS NULL
  `);
  return stmt.get(lineId);
}

export function createEmployee(fullName: string, lineId: string): Database.RunResult {
  const stmt = db.prepare<[string, string, number, string, string], Employee>('INSERT INTO Employee (name, lineId, verified, createdAt, updatedAt) VALUES (?, ?, ?, ?, ?)');
  return stmt.run(fullName, lineId, 0, new Date().toISOString(), new Date().toISOString());
}

export function verifyEmployee(userId: number): Database.RunResult {
  const stmt = db.prepare('UPDATE Employee SET verified = 1 WHERE userId = ? AND deletedAt IS NULL');
  return stmt.run(userId);
}

export function updateEmployee(userId: number, name: string, teamId?: number): Database.RunResult {
  const stmt = db.prepare<[string, number | undefined, string, number], Employee>(
    'UPDATE Employee SET name = ?, teamId = ?, updatedAt = ? WHERE userId = ? AND deletedAt IS NULL'
  );
  return stmt.run(name, teamId, new Date().toISOString(), userId);
}

export function removeEmployee(userId: number): Database.RunResult {
  const stmt = db.prepare<[string, number], Employee>('UPDATE Employee SET deletedAt = ? WHERE userId = ?');
  return stmt.run(new Date().toISOString(), userId);
}