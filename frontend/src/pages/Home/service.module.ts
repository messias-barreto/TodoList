import axios from "axios";
import { getToken } from "../../hooks/localstorage";
const URL = 'http://127.0.0.1:3200';

interface IWork {
    id?: string;
    title: string;
    description?: string;
    user_id: string | undefined;
}

export const getAllWorks = async (user: string = 'null', page: number = 1) => {
    const token = await getToken();
    const headers = {
        headers: { 'Authorization': `Bearer ${token}` }
    }

    const data = await axios.get(`${URL}/works/${user}`, headers)
        .then(res => { return res.data })
        .catch((error) => { return (error) })

    return data
}


export const getOneWork = async (work: string | undefined) => {
    if (work === undefined) { return { "message": "Work is not found" } }

    const token = await getToken();
    const headers = {
        headers: { 'Authorization': `Bearer ${token}` }
    }
    const data = await axios.get(`${URL}/one-work/${work}`, headers)
        .then(res => { return res.data })
        .catch((error) => { return (error) })

    return data
}

export const addWork = async (work: IWork) => {
    const token = await getToken();
    const headers = {
        headers: { 'Authorization': `Bearer ${token}` }
    }

    const data = await axios.post(`${URL}/works`, work, headers)
        .then(res => { return res })
        .catch((error) => { return error })

    return data
}


export const removeWork = async (id: string) => {
    const token = await getToken();
    const headers = {
        headers: { 'Authorization': `Bearer ${token}` }
    }

    const data = await axios.delete(`${URL}/works/${id}`, headers)
        .then(res => { return res })
        .catch((error) => { return error })

    return data
}