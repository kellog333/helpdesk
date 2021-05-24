import React from 'react';
import { Redirect } from 'react-router-dom';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

export const Landing = ({ isAuthenticated }) => {

		if(isAuthenticated){
		return <Redirect to='/dashboard' />
	}

	return (
			<>
				<section className="landing">
					<div className="dark-overlay">
						<div className="landing-inner">
							<h1 className="x-large">Helpdesk</h1>
							<p className="lead">Ticket management and problem resolution</p>
							<div className="buttons">
								<a href="/register" className="btn btn-primary">Sign up</a>
								<a href="/login" className="btn btn-light ml-5">Login</a>
							</div>
						</div>
					</div>
				</section>
			</>
		)
}

Landing.propTypes = ({
	isAuthenticated: PropTypes.bool
})

const mapStateToProps = state => ({
	isAuthenticated: state.auth.isAuthenticated
})

export default connect(mapStateToProps)(Landing);