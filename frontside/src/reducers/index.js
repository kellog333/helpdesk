import { combineReducers } from 'redux';
import auth from './auth';
import alert from './alert';
import tickets from './tickets';
import customers from './customer';
import client from './client';


export default combineReducers({
	alert,
	auth,
	tickets,
	customers,
	client
});