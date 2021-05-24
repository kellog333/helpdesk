import axios from 'axios';
import { setAlert } from '../actions/alert';
import setAuthToken from '../utils/setAuthToken';
import {
	USER_LOADED,
	LOGIN_SUCCESS,
	LOGIN_FAIL,
	LOGOUT,
	AUTH_ERROR
} from './types';


export const loadUser = () => async dispatch => {
	if(localStorage.token) {
		setAuthToken(localStorage.token);
	}
	try {
		const res = await axios.get('/api/auth');
		dispatch({
			type: USER_LOADED,
			payload: res.data
		})
	} catch(err) {
		dispatch({
			type: AUTH_ERROR
		});
	}
};

export const login = (email, password) => async dispatch => {
	const config = {
		headers: {
			'Content-Type': 'application/json'
		}
	}
	const body = JSON.stringify({ email, password});
	try {
		const res = await axios.post('/api/auth', body, config);
		dispatch({
			type: LOGIN_SUCCESS,
			payload: res.data
		});
		dispatch(loadUser());
	} catch(err) {
		const errors = err.response.data.errors;
		console.log(errors)
		if(errors){
			errors.map(error => dispatch(setAlert(error.msg, 'danger')));
		}
		dispatch({
			type: LOGIN_FAIL
		});
	}
};

export const logout = () => dispatch => {
	dispatch({
		type: LOGOUT
	})
};