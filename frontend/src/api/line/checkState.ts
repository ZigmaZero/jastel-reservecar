import axios from 'axios';

export default function checkState(state: string): Promise<boolean> {
    return axios.delete(`/line/${state}`, {}).then((response) => {
        if(response.status !== 200) {
            throw new Error(`Unexpected response status: ${response.status}`);
        }
        return response.data.success as boolean;
    }).catch((error) => {
        if(error.response && error.response.status !== 400 && error.response.status !== 404)
        {
            console.error("Unexpected error status:", error.response.status, error.response.data);
            throw new Error("An unexpected error occurred. Please try again later.");
        }
        else {
            return false;
        }
    })
}