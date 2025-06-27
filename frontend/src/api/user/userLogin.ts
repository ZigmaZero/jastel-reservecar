import axios from "axios";
import type { EmployeeExternal } from "../../types/externalTypes";

export default function userLogin(lineId: string): Promise<{
    user: EmployeeExternal;
    token: string;
}> {
    return axios.post(`/user/login`, { lineId }, {
        headers: {
            "Content-Type": "application/json",
        }
    }).then((response) => {
        if (response.status !== 200) {
            throw new Error(`Unexpected response status: ${response.status}`);
        } else {
            if (response.data && response.data.user && response.data.token) {
                return {
                    user: response.data.user,
                    token: response.data.token
                };
            } else {
                throw new Error("Login failed. Please try again later.");
            }
        }
    }).catch((error) => {
        if (error.response && error.response.status !== 400 && error.response.status !== 401) {
            console.error("Unexpected error status:", error.response.status, error.response.data);
            throw new Error("An unexpected error occurred. Please try again later.");
        } else {
            throw error;
        }
    });
}