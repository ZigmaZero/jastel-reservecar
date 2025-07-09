import axios from 'axios';
import type { AdminExternal } from '../../types/externalTypes';

export default function adminLogin(name: string, password: string): Promise<{
    admin: AdminExternal;
    token: string;
}> {

    return axios.post(`/admin/login`, {
        name,
        password
    })
    .then((response) => {
        if (response.status !== 200) {
            throw new Error(`Unexpected response status: ${response.status}`);
        } else {
            console.log(`Welcome ${name}`);
            return {
                admin: response.data.admin,
                token: response.data.token
            }
        }
    })
    .catch((error) => {
        throw error;
    });
}