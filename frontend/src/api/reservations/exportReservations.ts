import axios from 'axios';
import type { ReservationExternal } from '../../types/externalTypes';

export default function exportReservations(startTime: string, endTime: string, token: string): Promise<ReservationExternal[]> {
    return axios.get(`/reservations/export`, {
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
        },
        params: {
            startTime,
            endTime
        }
    }).then((response) => {
        if (response.status !== 200) {
            throw new Error(`Unexpected response status: ${response.status}`);
        }
        return response.data;
    }).catch((error) => {
        if(error.response && error.response.status !== 400 && error.response.status !== 401) {
            console.error("Unexpected error status:", error.response.status, error.response.data);
            throw new Error("An unexpected error occurred. Please try again later.");
        }
        else {
            throw error;
        }
    })
}