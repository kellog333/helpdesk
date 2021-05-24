import React, { useState } from 'react';
import { Redirect } from 'react-router-dom';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { login } from '../../actions/auth';

const Login = ({ login, isAuthenticated }) => {
	const [ formData, setFormData ] = useState({
		email: '',
		password: ''
	});

	const { email, password } = formData;

	const handleSubmit = e => {
		e.preventDefault();
		login(email, password)
	};

	// Form Controls
	const onChange = e => setFormData({ ...formData, [e.target.name]: [e.target.value ]});

	// Redirect if logged in
	if(isAuthenticated){
		return <Redirect to='/' />
	}

	return (
			<>
				<div className="auth-section">
					<h1 className='large text-primary'>Sign In</h1>
					<form className='auth-form' onSubmit={handleSubmit}>
						<div className='login-input'>
							<input type='email' style={{ width: "100%" }} placeholder='Email Address' name='email' value={email} onChange={e => onChange(e)} />
						</div>
						<div className='login-input mt-2'>
							<input type='password' style={{ width: "100%" }} placeholder='Password' name='password' minLength='8' value={password} onChange={e => onChange(e)} />
						</div>
						<input type='submit' className='btn btn-primary mt-2' />
					</form>
				</div>
			</>
		)
}

Login.propTypes = {
	login: PropTypes.func.isRequired,
	isAuthenticated: PropTypes.bool
};

const mapStateToProps = state => ({
	isAuthenticated: state.auth.isAuthenticated
});

export default connect(mapStateToProps, { login })(Login);