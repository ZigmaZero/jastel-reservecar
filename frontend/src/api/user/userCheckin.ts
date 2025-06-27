import axios from 'axios';

export default function userCheckin(
    carId: number,
    description: string,
    token: string
) : Promise<void> {
    return axios.post(`/user/checkin`, { carId, description }, {
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
        }
    }).then((response) => {
        if (response.status !== 201) {
            throw new Error(`Unexpected response status: ${response.status}`);
        }
        return;
    }).catch((error) => {
        if (error.response && error.response.status !== 400 && error.response.status !== 401) {
            console.error("Unexpected error status:", error.response.status, error.response.data);
            throw new Error("An unexpected error occurred. Please try again later.");
        } else {
            throw error;
        }
    }
    );
}