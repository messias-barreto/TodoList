import axios from "axios";

const api = axios.create({
    baseURL: 'http://localhost:3200'
});

export const useApi = () => ({
    validateToken: async (refresh_token: string | null) => {
        if(refresh_token !== null || refresh_token !== undefined) {
            const response = await api.post('/refresh', {refresh_token});
            return response.data;
        }

        return null;
    },

    singin: async (login: string, password: string) => {
        const response = await api.post('/auth', { login, password});
        return response.data;
    },

    logout: async () => {
        await api.post('/logout');
    }
})