import { EmployeeExternal } from "../interfaces/externalTypes.js";

export function employeeDeleteMessageEN(user: EmployeeExternal): string {
  return `[Employee removal notice]
Dear ${user.name}:
An administrator has removed you from the ReserveCar system.
If you believe this is in error, please contact the administrator and register to the system again.
Thank you for using Jastel ReserveCar.`
}

export function employeeDeleteMessageTH(user: EmployeeExternal): string {
  return `[แจ้งเตือนการนำออกพนักงาน]
เรียนคุณ ${user.name}:
ผู้ดูแลระบบได้นำออกข้อมูลของคุณจากระบบ ReserveCar
หากคุณคิดว่าเกิดข้อผิดพลาด กรุณาติดต่อผู้ดูแลระบบและลงทะเบียนใหม่อีกครั้ง
ขอบคุณที่ใช้บริการ Jastel ReserveCar`
}

export default employeeDeleteMessageTH;