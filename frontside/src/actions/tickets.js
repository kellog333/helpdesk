import axios from 'axios';
import { setAlert } from './alert';
import {
    GET_ALL_TICKETS,
    TICKET_ERROR,
    GET_ONE_TICKET,
    GET_MY_TICKETS,
    GET_TICKET_BY_STATUS,
    GET_UNASSIGNED_TICKETS,
    GET_CUSTOMER_TICKETS,
    GET_STATUSES,
    GET_PRIORITIES,
    GET_CATEGORIES,
    GET_ASSIGNEES,
    CREATE_TICKET,
    UPDATE_TICKET,
    CLOSE_TICKET,
} from './types';

export const getTicketByStatus = (status) => async dispatch => {
    try {
        const res = await axios.get(`/api/tickets/status/${status}`);
        dispatch({
            type: GET_TICKET_BY_STATUS,
            payload: res.data
        })
    } catch (err) {
        dispatch({
            type: TICKET_ERROR,
            payload: { msg: err.response.statusText, status: err.response.status }
        })
    }
}

export const getUnassigned = () => async dispatch => {
    try {
        const res = await axios.get('/api/tickets/unassigned');
        dispatch({
            type: GET_UNASSIGNED_TICKETS,
            payload: res.data
        })
    } catch (err) {
        dispatch({
            type: TICKET_ERROR,
            payload: { msg: err.response.statusText, status: err.response.status }
        })
    }
}

export const allTheTickets = () => async dispatch => {
    try {
        const res = await axios.get('/api/tickets');
        dispatch({
            type: GET_ALL_TICKETS,
            payload: res.data
        })
    } catch (err) {
        dispatch({
            type: TICKET_ERROR,
            payload: { msg: err.response.statusText, status: err.response.status }
        });
    }
};

export const getUserById = (id) => async dispatch => {
    const config = {
        headers: {
            'Content-Type': 'application/json'
        }
    }
    try {
        const res = await axios.get(`/api/users/byid/${id}`, config);
        return (res.data)
    } catch (err) {
        console.log(err.message)
    }
};

export const getMyTicketCount = () => async dispatch => {
    try {
        const res = await axios.get('/api/tickets/mytickets/count');
        return res.data;
    } catch (err) {
        console.log(err);
        dispatch({
            type: TICKET_ERROR,
            payload: { msg: err.response.statusText, status: err.response.status }
        });
    }
}

export const getCustomerName = (id) => async dispatch => {
    const config = {
        headers: {
            'Content-Type': 'application/json'
        }
    }
    try {
        const res = await axios.get(`/api/customers/byid/${id}`, config);
        return (res.data);
    } catch (err) {
        console.log(err.message);
    }
};

export const getTicketById = (id) => async dispatch => {
    const config = {
        headers: {
            'Content-Type': 'application/json'
        }
    }
    try {
        const res = await axios.get(`/api/tickets/${id}`, config);
        dispatch({
            type: GET_ONE_TICKET,
            payload: res.data
        })
    } catch (err) {
        console.log(err.response)
        // dispatch({
        //     type: TICKET_ERROR,
        //     payload: { msg: err.response.statusText, status: err.response.status }
        // });
    }
};

export const addNote = (id, text, time, priv = false) => async dispatch => {
    const config = {
        headers: {
            'Content-Type': 'application/json'
        }
    }
    const body = JSON.stringify({ note: text, timeon: time, priv });
    try {
        await axios.put(`/api/tickets/update/${id}`, body, config);
    } catch (err) {
        console.log(err.message);
    }
}

export const allMyTickets = (pagenu = 1) => async dispatch => {
    try {
        const res = await axios.get('/api/tickets/mytickets');
        dispatch({
            type: GET_MY_TICKETS,
            payload: res.data
        })
    } catch (err) {
        dispatch({
            type: TICKET_ERROR,
            payload: { msg: err.response.statusText, status: err.response.status }
        });
    }
};

export const ticketByCompany = (id) => async dispatch => {
    try {
        const res = await axios.get(`/api/tickets/customer/${id}`);
        dispatch({
            type: GET_CUSTOMER_TICKETS,
            payload: res.data
        })
    } catch (err) {
        dispatch({
            type: TICKET_ERROR,
            payload: { msg: err.response.statusText, status: err.response.status }
        })
    }
}

export const getStatuses = () => async dispatch => {
    try {
        const res = await axios.get('/api/settings/statuses');
        dispatch({
            type: GET_STATUSES,
            payload: res.data
        })
    } catch (err) {
        dispatch({
            type: TICKET_ERROR,
            payload: { msg: err.response.statusText, status: err.response.status }
        })
    }
}

export const getPriorities = () => async dispatch => {
    try {
        const res = await axios.get('/api/settings/priorities');
        dispatch({
            type: GET_PRIORITIES,
            payload: res.data
        })
    } catch (err) {
        dispatch({
            type: TICKET_ERROR,
            payload: { msg: err.response.statusText, status: err.response.status }
        })
    }
}

export const getCategories = () => async dispatch => {
    try {
        const res = await axios.get('/api/settings/categories');
        dispatch({
            type: GET_CATEGORIES,
            payload: res.data
        })
    } catch (err) {
        dispatch({
            type: TICKET_ERROR,
            payload: { msg: err.response.statusText, status: err.response.status }
        })
    }
}

export const getAssignees = () => async dispatch => {
    try {
        const res = await axios.get('/api/users/employees');
        dispatch({
            type: GET_ASSIGNEES,
            payload: res.data
        })
    } catch (err) {
        dispatch({
            type: TICKET_ERROR,
            payload: { msg: err.response.statusText, status: err.response.status }
        })
    }
}

export const createTicket = (formData, history) => async dispatch => {
    console.log(formData)
    try {
        const config = {
            header: {
                'Content-Type': 'application/json'
            }
        }
        const res = await axios.post('/api/tickets', formData, config);
        // console.log(res)
        setAlert("Ticket Created", 'success')
        dispatch({
            type: CREATE_TICKET,
            payload: res.data
        })
        history.push(`/ticket/${res.data.ticketnumber}`)
    } catch (err) {
        console.log("HITTING ERROR")
        setAlert(err.response.statusText, 'danger')
        dispatch({
            type: TICKET_ERROR,
            payload: { msg: err.response.statusText, status: err.response.status }
        })
    }
}

export const updateTicket = (id, formData) => async dispatch => {
    const config = {
        headers: {
            'Content-Type': 'application/json'
        }
    }
    try {
        const res = await axios.put(`/api/tickets/update/${id}`, formData, config);
        dispatch({
            type: UPDATE_TICKET,
            payload: res.data
        })
    } catch (err) {
        console.log(err);
        setAlert(err.response.statusText, 'danger')
        dispatch({
            type: TICKET_ERROR,
            payload: { msg: err.response.statusText, status: err.response.status }
        })
    }
}

export const closeTicket = (id, history) => async dispatch => {
    const config = {
        headers: {
            'Content-Type': 'application/json'
        }
    }
    const body = {
        'status': 'Closed'
    }
    try {
        await axios.put(`/api/tickets/update/${id}`, body, config);
        dispatch({
            type: CLOSE_TICKET
        })
        setAlert("Ticket Closed", 'success');
        history.push('/mytickets');
    } catch (err) {
        console.log(err.message);
        setAlert(err.response.statusText, 'danger')
        dispatch({
            type: TICKET_ERROR,
            payload: { msg: err.response.statusText, status: err.response.status }
        })
    }
}

export const takeTicket = (id, user, username) => async dispatch => {
    const config = {
        headers: {
            'Content-Type': 'application/json'
        }
    }
    const body = {
        "assignedto": user,
        "assignedname": username
    }
    try {
        const res = await axios.put(`/api/tickets/update/${id}`, body, config);
        console.log(body)
        dispatch({
            type: UPDATE_TICKET,
            payload: res.data
        })
        setAlert("Ticket Accepted", "success")
    } catch (err) {
        console.log(err.message);
        setAlert(err.response.statusText, 'danger')
        dispatch({
            type: TICKET_ERROR,
            payload: { msg: err.response.statusText, status: err.response.status }
        })
    }
}