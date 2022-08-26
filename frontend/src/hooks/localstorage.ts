export const setToken = (token: string) => {
    localStorage.setItem('auth-user', token);
}

export const setRefreshToken = (refresh_token: string) => {
    localStorage.setItem('auth-refresh', refresh_token);
}

export const getToken = async () => {
    return localStorage.getItem('auth-user');
}

export const getRefreshToken = () => {
    return localStorage.getItem('auth-refresh');
}