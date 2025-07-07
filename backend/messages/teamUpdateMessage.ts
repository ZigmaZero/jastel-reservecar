import { EmployeeExternal, TeamExternal } from "../interfaces/externalTypes.js";

export function teamUpdateMessageEN(oldTeam: TeamExternal, newTeam: TeamExternal): string {
    return `[Team information changed]
An administrator updated information for the team you're assigned to:
- Old Name: ${oldTeam.name}
+ New Name: ${newTeam.name}`;
}

export function teamUpdateMessageTH(oldTeam: TeamExternal, newTeam: TeamExternal): string {
    return `[แจ้งเตือนการเปลี่ยนแปลงข้อมูลทีม]
ผู้ดูแลระบบได้อัปเดตข้อมูลทีมที่คุณสังกัด:
- ชื่อเดิม: ${oldTeam.name}
+ ชื่อใหม่: ${newTeam.name}`;
}

export default teamUpdateMessageTH;