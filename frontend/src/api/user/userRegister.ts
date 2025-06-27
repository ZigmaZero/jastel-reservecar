import axios from "axios";

export default function userRegister(fullName: string, lineId: string): Promise<null> {
    return axios.post(`/user/register`, {fullName, lineId}, {
        headers: {
            "Content-Type": "application/json",
        }
    }).then((response) => {
        if (response.status !== 201) {
            throw new Error(`Unexpected response status: ${response.status}`);
        } else {
            if(response.data && response.data.success) {
                return null;
            }
            else throw new Error("Registration failed. Please try again later.");
        }
    }).catch((error) => {
        if (error.response && error.response.status !== 400 && error.response.status !== 401 && error.response.status !== 409) {
            console.error("Unexpected error status:", error.response.status, error.response.data);
            throw new Error("An unexpected error occurred. Please try again later.");
        } else {
            throw error;
        }
    })
}