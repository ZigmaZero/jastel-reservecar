import axios from 'axios';

export default function getState(): Promise<string> {
    return axios.get('/line').then((response) => {
        if (response.status !== 200) {
            throw new Error(`Unexpected response status: ${response.status}`);
        }
        return response.data.state as string;
    }).catch((error) => {
        console.error("Unexpected error status:", error.response.status, error.response.data);
        throw new Error("An unexpected error occurred. Please try again later.");
    });
}