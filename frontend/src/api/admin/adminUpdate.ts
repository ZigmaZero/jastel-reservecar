import axios from 'axios';
import type { AdminExternal } from '../../types/externalTypes';

export default function adminUpdate(id: number, name: string, password: string, token: string): Promise<{
    admin: AdminExternal;
    token: string;
}> {

    return axios.put(`/admin/${id}`, {
        name,
        password
    }, {
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
        }
    })
    .then((response) => {
        if (response.status !== 200) {
            throw new Error(`Unexpected response status: ${response.status}`);
        } else {
            return {
                admin: response.data.admin,
                token: response.data.token
            }
        }
    })
    .catch((error) => {
        if (error.response && error.response.status !== 400 && error.response.status !== 401) {
            throw new Error(`Unexpected error status:, error.response.status, error.response.data`);
        }
        else
            throw error;
    });
}