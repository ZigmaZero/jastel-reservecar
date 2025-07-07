import { ReservationExternal } from "../interfaces/externalTypes.js";

export function jobCheckinMessageEN(reservation: ReservationExternal): string {
    return `[Checkin]\nEmployee: ${reservation.user}\nCar: ${reservation.car}\nDescription: ${reservation.description}`;
}

export function jobCheckinMessageTH(reservation: ReservationExternal): string {
    return `[เช็คอิน]\nพนักงาน: ${reservation.user}\nรถ: ${reservation.car}\nรายละเอียด: ${reservation.description}`;
}

export default jobCheckinMessageTH;