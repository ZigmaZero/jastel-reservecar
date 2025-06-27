// Internal types used for frontend data manipulation
// to call the API providing the necessary data

export type Employee = {
    id?: number,
    lineId: string,
    name: string,
    verified: boolean,
    teamId?: number
}

export type Team = {
    id?: number,
    name: string
}

export type Car = {
    id?: number,
    plateNumber: string,
    teamId?: number
}

export type Admin = {
    id?: number,
    name: string
}

export type Reservation = {
    id?: number,
    userId: number,
    carId: number,
    description: string,
    checkinTime: string, // stored as ISO string
    checkoutTime?: string
}

export type LineAuthCodeResponse = {
    access_token: string,
    expires_in: number,
    refresh_token: string, 
    scope: string,
    token_type: string
}

export type LineProfile = {
    userId: string,
    displayName: string,
    pictureUrl: string,
    statusMessage?: string
}