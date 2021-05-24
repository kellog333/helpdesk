import React, { useEffect, useState } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { getAllCustomers } from '../../actions/customers';
import CustomerItem from './CustomerItem';
import NewCustomer from './NewCustomer';
import { Button } from 'react-bootstrap';

const Customers = ({ customers: { customers }, getAllCustomers }) => {
    const [showModal, setShowModal] = useState(false);

    useEffect(() => {
        getAllCustomers();
    }, [getAllCustomers])

    return (
        <>
            <div className='ticket-list'>
                    <NewCustomer showModal={showModal} closeTerm={() => setShowModal(false)} />
                <div className='d-flex justify-content-between align-items-center mb-4 mx-5'>
                    <h2>Customers</h2>
                    <Button onClick={() => setShowModal(true)} className='btn btn-primary'>Add Customer</Button>
                </div>
                <div>
                    <ul className='list-unstyled d-flex inline justify-content-between'>
                        <li className='col-md-2'>Number</li>
                        <li className='col-md-3'>Customer</li>
                        <li className='col-md-1 d-none d-lg-block d-xl-block'>Users</li>
                        <li className="col-md-1 d-none d-lg-block d-xl-block">Active</li>
                    </ul>
                </div>
                {customers.map(customer => (
                    <CustomerItem key={customer._id} customer={customer} />
                ))}
            </div>
        </>
    );
};

Customers.propTypes = {
    customers: PropTypes.object.isRequired,
    getAllCustomers: PropTypes.func.isRequired,
}

const mapStateToProps = (state) => ({
    customers: state.customers
});


export default connect(mapStateToProps, { getAllCustomers })(Customers);
