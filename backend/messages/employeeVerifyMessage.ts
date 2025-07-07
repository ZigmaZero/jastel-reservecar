import { EmployeeExternal } from "../interfaces/externalTypes.js";

export function employeeVerifyMessageEN(user: EmployeeExternal): string {
    return `[Employee verification]
Hello ${user.name}:
An administrator has verified your identity.
You may use the ReserveCar system by interacting with the rich menu.
Thank you for using Jastel ReserveCar.`;
}

export function employeeVerifyMessageTH(user: EmployeeExternal): string {
    return `[แจ้งเตือนการยืนยันตัวตน]
สวัสดีคุณ ${user.name}:
ผู้ดูแลระบบได้ยืนยันตัวตนของคุณแล้ว
คุณสามารถใช้งานระบบ ReserveCar ได้โดยกดที่ Rich Menu
ขอบคุณที่ใช้บริการ Jastel ReserveCar.`;
}

export default employeeVerifyMessageEN;