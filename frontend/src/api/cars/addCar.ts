import axios from "axios";
import type { CarExternal } from "../../types/externalTypes";

export default function addCar(item: CarExternal, token: string): Promise<null> {
    return axios.post("/cars", item, {
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
        }}).then((response) => {
            if (response.status !== 201) {
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