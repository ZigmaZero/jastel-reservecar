import axios from 'axios';
import type { ReservationExternal } from '../../types/externalTypes';

export default function getJobsOfUser(token: string): Promise<ReservationExternal[]> {
    return axios.get(`/user/reservations`, {
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
        }
    }).then((response) => {
        if (response.status !== 200) {
            throw new Error(`Unexpected response status: ${response.status}`);
        }
        return response.data.reservations as ReservationExternal[];
    }
    ).catch((error) => {
        throw error;
    }
    );
}