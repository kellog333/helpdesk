import {
    GET_CUSTOMERS,
    CUSTOMER_ERROR,
    GET_CUSTOMER,
    ADD_CUSTOMER
} from '../actions/types';

const initialState = {
    customers: [],
    customer: null,
    loading: true,
    errors: {},
};

export default function customers(state = initialState, action) {
    const { type, payload } = action;

    switch (type) {
        case GET_CUSTOMERS:
            return {
                ...state,
                customers: payload,
                loading: false
            }
        case CUSTOMER_ERROR:
            return {
                ...state,
                errors: payload,
                loading: false
            }
        case ADD_CUSTOMER:
        case GET_CUSTOMER:
            return {
                ...state,
                customer: payload,
                loading: false
            }
        default:
            return state
    }

}