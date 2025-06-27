import axios from "axios";
import type { TeamExternal } from "../../types/externalTypes";

export default function deleteTeam(item: TeamExternal, token: string): Promise<null> {
    return axios.delete(`/teams/${item.id}`, {
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
        }
    }).then((response) => {
        if (response.status !== 200) {
            throw new Error(`Unexpected response status: ${response.status}`);
        }
        return null;
    }).catch((error) => {
        if (error.response && error.response.status !== 400 && error.response.status !== 401) {
            console.error("Unexpected error status:", error.response.status, error.response.data);
            throw new Error("An unexpected error occurred. Please try again later.");
        } else {
            alert(error.response.data.error);
            return null;
        }
    });
}