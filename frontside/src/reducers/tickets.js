import {
    GET_ALL_TICKETS,
    GET_ONE_TICKET,
    TICKET_ERROR,
    GET_MY_TICKETS,
    GET_UNASSIGNED_TICKETS,
    GET_CUSTOMER_TICKETS,
    GET_STATUSES,
    GET_PRIORITIES,
    GET_ASSIGNEES,
    GET_CATEGORIES,
    CREATE_TICKET,
    CLOSE_TICKET,
    UPDATE_TICKET,
} from '../actions/types';

const initialState = {
    tickets: [],
    ticket: null,
    unassigned: [],
    errors: {},
    statuses: [],
    categories: [],
    assignees: [],
    priorities: [],
    loading: true
}

export default function tickets(state = initialState, action) {
    const {type, payload} = action;

    switch(type) {
        case GET_MY_TICKETS:
        case GET_ALL_TICKETS:
        case GET_CUSTOMER_TICKETS:
            return {
                ...state,
                tickets: payload,
                loading: false
            }
        case TICKET_ERROR:
            return {
                ...state,
                errors: payload,
                loading: false
            }
        case CREATE_TICKET:
        case UPDATE_TICKET:
        case GET_ONE_TICKET:
            return {
                ...state,
                ticket: payload,
                loading: false
            }
        case GET_UNASSIGNED_TICKETS:
            return {
                ...state,
                unassigned: payload,
                loading: false
            }
        case GET_STATUSES:
            return {
                ...state,
                statuses: payload,
                loading: false
            }
        case GET_PRIORITIES:
            return {
                ...state,
                priorities: payload,
                loading: false
            }
        case GET_ASSIGNEES:
            return {
                ...state,
                assignees: payload,
                loading: false
            }
        case GET_CATEGORIES:
            return {
                ...state,
                categories: payload,
                loading: false
            }
        case CLOSE_TICKET:
            return {
                ...state,
                ticket: null,
                loading: false
            }
        default:
            return state;
    }
}