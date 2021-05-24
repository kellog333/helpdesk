import axios from 'axios';
import { setAlert } from './alert';
import {
    GET_CLIENT,
    CLIENT_ERROR,
    REMOVE_CLIENT
} from './types';

export const searchClient = (company) => async dispatch => {
    try {
        const clients = await axios.get(`/api/client/${company}`);
        return clients.data;
    } catch (err) {
        console.log(err);
    }
}

export const addClient = ( formData, customernumber, history) => async dispatch => {
    try {
        const config = {
            headers: {
                'Content-Type': 'application/json'
            }
        }
        await axios.post('/api/client/adduser', formData, config)
        dispatch(setAlert('User Created', 'success'))
        history.go()
    } catch (err) {
        dispatch(setAlert(err.response.data, 'danger'))
        console.log(err.response)
    }
}

export const getClient = (clid) => async dispatch => {
    try {
        const client = await axios.get(`/api/client/byid/${clid}`);
        dispatch({
            type: GET_CLIENT,
            payload: client.data
        })
    } catch(err) {
        dispatch({
            type: CLIENT_ERROR,
            payload: { msg: err.response.statusText, status: err.response.status }
        })
    }
}

export const removeClient = (clid, company, history) => async dispatch => {
    try {
        await axios.delete(`/api/client/${clid}`);
        dispatch({
            type: REMOVE_CLIENT
        })
        history.push(`/customers`);
        dispatch(setAlert("User removed", 'success'))
    } catch (err) {
        dispatch({
            type: CLIENT_ERROR,
            payload: { msg: err.response.statusText, status: err.response.status }
        })
    }
}