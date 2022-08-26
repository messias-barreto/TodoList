import { useEffect, useState } from "react"
import { getRefreshToken, getToken, setRefreshToken, setToken } from "../../hooks/localstorage"
import { useApi } from "../../hooks/useApi"
import { User } from "../../Types/User"
import { AuthContext } from "./AuthContext"

export const AuthProvider = ({ children }: { children: JSX.Element }) => {
    const [user, setUser] = useState<User | null>(null)
    const api = useApi();

    const signin = async (login: string, password: string) => {
        const data = await api.singin(login, password);
        if (data.token) {
            setUser({
                id: data.user.data.id,
                name: data.user.data.name,
                email: data.user.data.email,
                login: data.user.data.login
            });

            setToken(data.token);
            setRefreshToken(data.refresh_token);
            return true;
        }
        return false;
    }

    const signout = async () => {
        await api.logout();
        setUser(null);
    }

    const refreshToken = async () => {
        const refresh = getRefreshToken();
        if (refresh) {
            const token = await api.validateToken(refresh);
            setToken(token.token);
            setUser({
                id: token.user.userToken,
                name: 'test',
                email: 'test',
                login: 'test'
            })
        }
    }

    useEffect(() => {
        refreshToken()
    }, [])

    return (
        <AuthContext.Provider value={{ user, signin, signout }}>
            {children}
        </AuthContext.Provider>
    )
}