// JWT and SQL types for application

export type JwtPayload = {
    id?: number,
    name: string
}

export type Employee = {
    userId: number,
    lineId: string,
    name: string,
    verified: boolean,
    teamId?: number,
    createdAt: string,
    updatedAt: string,
    deletedAt?: string
}

export type Team = {
    teamId: number,
    name: string
}

export type Car = {
    carId: number,
    plateNumber: string,
    teamId?: number
}

export type Admin = {
    adminId: number,
    name: string,
    password: string,
    createdAt: string,
    updatedAt: string,
    deletedAt?: string
}

export type Reservation = {
    reservationId: number,
    userId: number,
    carId: number,
    description: string,
    checkinTime: string,
    checkoutTime?: string
}

export interface Count {
    count: number
}