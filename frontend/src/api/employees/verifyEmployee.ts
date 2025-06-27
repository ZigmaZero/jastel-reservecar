import axios from "axios";
import type { EmployeeExternal } from "../../types/externalTypes";

export default function verifyEmployee(item: EmployeeExternal , token: string): Promise<null> {
    return axios.put(`/employees/${item.id}/verify`, {}, {
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
            throw error;
        }
    });
}