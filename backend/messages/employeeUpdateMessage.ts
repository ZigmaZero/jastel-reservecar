import { EmployeeExternal } from "../interfaces/externalTypes.js";

export function employeeUpdateMessageEN(oldUser: EmployeeExternal, newUser: EmployeeExternal): string {
  return `[Employee information changed]
Hello ${oldUser.name}:
An administrator has changed your employee information in the ReserveCar system.
The changes are as follows:
${oldUser.name !== newUser?.name ?
      `- Old name: ${oldUser.name}
+ New name: ${newUser?.name}` : ""}${oldUser.teamId !== newUser?.teamId ?
      `- Old team: ${oldUser.teamName || "None"}
+ New team: ${newUser?.teamName || "None"}` : ""}`
}

export function employeeUpdateMessageTH(oldUser: EmployeeExternal, newUser: EmployeeExternal): string {
  return `[แจ้งเตือนการเปลี่ยนแปลงข้อมูลพนักงาน]
สวัสดีคุณ ${oldUser.name}:
ผู้ดูแลระบบได้เปลี่ยนแปลงข้อมูลของคุณในระบบ ReserveCar
รายละเอียดการเปลี่ยนแปลงมีดังนี้:
${oldUser.name !== newUser?.name ?
      `- ชื่อเดิม: ${oldUser.name}
+ ชื่อใหม่: ${newUser?.name}` : ""}${oldUser.teamId !== newUser?.teamId ?
      `- ทีมเดิม: ${oldUser.teamName || "ไม่มี"}
+ ทีมใหม่: ${newUser?.teamName || "ไม่มี"}` : ""}`
}

export default employeeUpdateMessageTH;
