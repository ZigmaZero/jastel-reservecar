import axios from "axios";
import type { CarExternal } from "../../types/externalTypes";

export default function getCarsOfTeam(teamId: number, token: string): Promise<CarExternal[]> {
    return axios.get(`/user/cars`, {
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
        },
        params: {
            teamId: teamId
        }
    }).then((response) => {
        if (response.status !== 200) {
            throw new Error(`Unexpected response status: ${response.status}`);
        }
        return response.data.cars as CarExternal[];
    }).catch((error) => {
        throw error;
    });
}