import React, { useState } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { addClient } from '../../actions/client';
import { withRouter } from 'react-router-dom';
import NumberFormat from 'react-number-format';
import { Modal, Button } from 'react-bootstrap';

const AddUserModal = ({ customer, showModal, closeTerm, addClient, history }) => {
    const [formData, setFormData] = useState({
        company: customer._id,
        phone: '',
        email: '',
        name: ''
    })

    const handleSubmit = (e) => {
        e.preventDefault();
        addClient(formData, customer.custnumber, history)
        closeTerm();
    }

    // const { company, primaryphone } = formData;
    const handleClose = () => {
        closeTerm()
    }

    return (
        <>
            <div className='container w-75'>
                <Modal
                show={showModal}
                onHide={handleClose}
                backdrop="static"
                size="lg"
                >
                <Modal.Header className='bg-dark text-white' closeButton>
                    <h2>New User</h2>
                </Modal.Header>
                <Modal.Body className='bg-dark text-white'>
                <form className='d-flex flex-column' onSubmit={handleSubmit}>
                    <input placeholder='Name' type="text" name="name" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} className='mt-2' />
                    <NumberFormat format="(###) ###-####" placeholder='Phone Number' name='phone' value={formData.phone} onValueChange={(e) => setFormData({ ...formData, phone: e.formattedValue })} className='mt-2' />
                    <input placeholder='Email' type="email" name="company" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} className='mt-2' />
                </form>
                </Modal.Body>
                <Modal.Footer className='bg-dark text-white'>
                    <Button variant='outline-danger' onClick={(e) => handleClose()} className='mt-2 w-25'>Cancel</Button>
                    <Button variant='outline-info' onClick={(e)=> handleSubmit(e)} className='mt-2 w-25'>Create User</Button>
                </Modal.Footer>
                </Modal>
            </div>
        </>
    )
}

AddUserModal.propTypes = {
    addClient: PropTypes.func.isRequired,
    customer: PropTypes.object.isRequired,
}

const mapStateToProps = (state) => ({
    customer: state.customers.customer
})


export default connect(mapStateToProps, { addClient })(withRouter(AddUserModal));
