import {
    GET_CLIENT,
    GET_CLIENTS,
    CLIENT_ERROR,
    REMOVE_CLIENT
} from '../actions/types';

const initialState = {
    clients: [],
    client: null,
    errors: {},
    loading: true
};

export default function clients(state = initialState, action) {
    const { type, payload } = action;
    switch (type) {
        case GET_CLIENTS:
            return {
                ...state,
                clients: payload,
                loading: false
            }
        case GET_CLIENT:
            return {
                ...state,
                client: payload,
                loading: false
            }
        case CLIENT_ERROR:
            return {
                ...state,
                errors: payload,
                loading: false
            }
        case REMOVE_CLIENT:
            return {
                ...state,
                client: null,
                loading: false
            }
        default:
            return state
    }
}