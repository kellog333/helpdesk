import axios from 'axios';
import { setAlert } from '../actions/alert'
import {
    GET_CUSTOMERS,
    CUSTOMER_ERROR,
    GET_CUSTOMER,
    ADD_CUSTOMER
} from './types';

export const getAllCustomers = () => async dispatch => {
    try {
        const customers = await axios.get('/api/customers');
        dispatch({
            type: GET_CUSTOMERS,
            payload: customers.data
        });
    } catch (err) {
        console.log(err.message);
        dispatch({
            type: CUSTOMER_ERROR,
            payload: { msg: err.response.statusText, status: err.response.status }
        })
    }
};

export const getCustomer = (id) => async dispatch => {
    try {
        const customer = await axios.get(`/api/customers/${id}`)
        dispatch({
            type: GET_CUSTOMER,
            payload: customer.data
        });
    } catch (err) {
        console.log(err.message)
        // dispatch({
        //     type: CUSTOMER_ERROR,
        //     payload: { msg: err.response.statusText, status: err.response.status }
        // })
    }
}

export const searchCustomers = (query) => async dispatch => {
    try {
        const customers = await axios.get(`/api/customers/search/${query}`);
        return customers.data;
    } catch (err) {
        console.log(err);
    }
}

export const addCustomer = (formData, history) => async dispatch => {
    try {
        const config = {
            headers: {
                "Content-Type": "application/json"
            }
        }
        const res = await axios.post('/api/customers', formData, config);
        dispatch({
            type: ADD_CUSTOMER,
            payload: res.data
        });
        dispatch(setAlert('Customer Added', 'success'));
        history.push(`/customer/${res.data.custnumber}`)
    } catch (err) {
        const errors = err.response.data.errors;
        if (errors) {
            console.log(errors)
            errors.map(error => dispatch(setAlert(error.msg, 'danger')))
        }
        dispatch({
            type: CUSTOMER_ERROR,
            payload: { msg: err.response.statusText, status: err.response.status }
        })
    }
}

export const updateCustomer = (id, formdata) => async dispatch => {
    try {
        const config = {
            headers: {
                "Content-Type": "application/json"
            }
        }
        await axios.put(`/api/customers/update/${id}`, formdata, config)
        dispatch (setAlert("Customer updated", 'success'))
    } catch (err) {
        console.log(err.message)
    }
}

export const archiveCustomer = (id, history) => async dispatch => {
    try {
        const config = {
            headers: {
                "Content-Type": 'application/json'
            }
        }
        const body = {
            "active": false
        }
        await axios.put(`/api/customers/update/${id}`, body, config);
        dispatch(setAlert("Customer Archived", 'success'));
        history.push("/customers");
    } catch (err) {
        console.log(err.message);
        dispatch({
            type: CUSTOMER_ERROR,
            payload: { msg: err.response.statusText, status: err.response.status }
        })
    }
}

export const activateCustomer = (id, history) => async dispatch => {
    try {
        const config = {
            headers: {
                "Content-Type": 'application/json'
            }
        }
        const body = {
            "active": true
        }
        await axios.put(`/api/customers/update/${id}`, body, config);
        dispatch(setAlert("Customer Activated", 'success'));
        history.push("/customers");
    } catch (err) {
        console.log(err.message);
        dispatch({
            type: CUSTOMER_ERROR,
            payload: { msg: err.response.statusText, status: err.response.status }
        })
    }
}