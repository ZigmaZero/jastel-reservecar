import { ReservationExternal } from "../interfaces/externalTypes.js";

export function jobCheckoutMessageEN(reservation: ReservationExternal): string {
    return `[Checkout]\nEmployee: ${reservation.user}\nCar: ${reservation.car}\nDescription: ${reservation.description}`;
}

export function jobCheckoutMessageTH(reservation: ReservationExternal): string {
    return `[เช็คเอาท์]\nพนักงาน: ${reservation.user}\nรถ: ${reservation.car}\nรายละเอียด: ${reservation.description}`;
}

export default jobCheckoutMessageTH;