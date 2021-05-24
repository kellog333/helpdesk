import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { logout } from '../../actions/auth';
import { Navbar, Nav, NavDropdown, Form, FormControl, Button } from 'react-bootstrap';

const Navibar = ({ auth: { isAuthenticated, loading, user }, logout }) => {

	const authedLinks = (
		<>
			<Form inline>
				<FormControl type='text' placeholder='search' className='mr-sm-2' />
				<Button variant='outline-info' className='mt-xs-2'>Search</Button>
			</Form>
			<Nav.Link href='/account' className='text-white ml-md-4'>Account</Nav.Link> 
			<Nav.Link onClick={ logout } className='text-white'>Sign Out</Nav.Link>
		</>
	);

	const unAuthedLinks = (
		<>
		<div className='d-flex justify-content-around'>
			<Nav.Link href='/login' className='text-white'>Log In</Nav.Link>
			<Nav.Link href='/signup' className='text-white'>Sign Up</Nav.Link>
		</div>
		</>
	)

	return (
		<>
			<Navbar variant="dark" bg='dark' expand='lg'>
				<Navbar.Brand href='/' className='text-white'>Helpdesk</Navbar.Brand>
				<Navbar.Toggle aria-controls="basic-navbar-nav" />
				<Navbar.Collapse id="basic-navbar-nav">
					<Nav className='mr-auto'>
						<Nav.Link href='/'>Home</Nav.Link>
						{! loading && (<>{ isAuthenticated && (<>
							<Nav.Link href='/alltickets'>All Tickets</Nav.Link>
							<Nav.Link href='/mytickets'>My Tickets</Nav.Link>
							<Nav.Link href='/customers'>Customers</Nav.Link>
							{!loading && (<>{user && user.role.indexOf('Admin') > -1 && (<Nav.Link href='/admin'>Admin</Nav.Link>)}</>)}
							<NavDropdown title='More'>
								<NavDropdown.Item href='/customers'>Customers</NavDropdown.Item>
								<NavDropdown.Item href='/archive'>Archive</NavDropdown.Item>
							</NavDropdown>
						</>)}</>)}
					</Nav>
					<Nav className="justifyContent = 'end'">
						{ !loading && (<>{ isAuthenticated ? authedLinks : unAuthedLinks }</>)}
					</Nav>
				</Navbar.Collapse>
			</Navbar>
		</>
		)
}

Navibar.propTypes = {
	logout: PropTypes.func.isRequired,
	auth: PropTypes.object.isRequired
}

const mapStateToProps = state => ({
	auth: state.auth
})

export default connect(mapStateToProps, { logout })(Navibar);