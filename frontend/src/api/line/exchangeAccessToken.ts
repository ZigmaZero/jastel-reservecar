import axios from "axios";
import type { LineProfile } from "../../types/internalTypes";

export default async function authToProfile(code: string, redirect_uri: string): Promise<LineProfile | undefined> {
    return axios.post(`/line/auth`, {code, redirect_uri}).then((response) => {
        return response.data.profile as LineProfile;
    }).catch((error) => {
        console.error("Internal server error:", error.response.status, error.response.data);
        throw new Error("An unexpected error occurred. Please try again later.");
    })
}