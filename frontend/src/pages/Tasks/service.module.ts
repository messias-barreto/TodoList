import axios from "axios";
import { getToken } from "../../hooks/localstorage";
const URL = 'http://127.0.0.1:3200';

interface ITasks {
    id?: string;
    title?: string;
    status?: boolean;
}

export const getAllTasks = async (work_id: string = '') => {
    const token = await getToken();
    const headers = {
        headers: { 'Authorization': `Bearer ${token}` }
    }

    const data = await axios.get(`${URL}/tasks/${work_id}`, headers)
        .then(res => {
            return res.data
        }).catch(error => {
            return error
        })

    return data;
}

export const addTask = async (task :ITasks) => {
    const token = await getToken();
        const headers = {
            headers: { 'Authorization': `Bearer ${token}` }
        }

    const data = await axios.post(`${URL}/tasks`, task, headers)
    .then(res => { return res })
    .catch((error) => { return error })

    return data
}

export const completeTask = async (task_id: string, status: boolean) => {
    if (status === false) {
        const token = await getToken();
        const headers = {
            headers: { 'Authorization': `Bearer ${token}` }
        }

        const data = await axios.patch(`${URL}/tasks/${task_id}`, {}, headers)
            .then(res => {
                return res.data
            }).catch(() => {
                return ("Não foi possível Concluir a Tarefa");
            })

        return data
    }

    return false
}

export const removeTasks = async (task_id: string) => {
    const token = await getToken();
    const headers = {
        headers: { 'Authorization': `Bearer ${token}` }
    }

    const data = await axios.delete(`${URL}/tasks/${task_id}`, headers)
        .then(res => { return res.data})
        .catch((error) => {
            return error
        })

        return data
}