import React, { useState } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { addCustomer } from '../../actions/customers';
import { withRouter } from 'react-router-dom';
import NumberFormat from 'react-number-format';
import { Modal, Button } from 'react-bootstrap';

const NewCustomer = ({ showModal, closeTerm, addCustomer, history }) => {
    const [formData, setFormData] = useState({
        company: '',
        primaryphone: '',
        primaryemail: '',
        streetaddress: '',
        usstate: '',
        zipcode: '',
        city: ''
    })

    const handleSubmit = (e) => {
        e.preventDefault();
        addCustomer(formData, history)
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
                    <h2>New Customer</h2>
                </Modal.Header>
                <Modal.Body className='bg-dark text-white'>
                <form className='d-flex flex-column' onSubmit={handleSubmit}>
                    <input placeholder='Company Name' type="text" name="company" value={formData.company} onChange={(e) => setFormData({ ...formData, company: e.target.value })} />
                    <NumberFormat format="(###) ###-####" placeholder='Primary Phone Number' name='primaryphone' value={formData.primaryphone} onValueChange={(e) => setFormData({ ...formData, primaryphone: e.formattedValue })} className='mt-2' />
                    <input placeholder='Primary Email' type="email" name="company" value={formData.primaryemail} onChange={(e) => setFormData({ ...formData, primaryemail: e.target.value })} className='mt-2' />
                    <input placeholder='Street Address' type="text" name="streetaddress" value={formData.streetaddress} onChange={(e) => setFormData({ ...formData, streetaddress: e.target.value })} className='mt-2' />
                    <input placeholder='City' type="text" name="city" value={formData.city} onChange={(e) => setFormData({ ...formData, city: e.target.value })} className='mt-2' />
                    <input placeholder='state' type="text" name="usstate" value={formData.usstate} onChange={(e) => setFormData({ ...formData, usstate: e.target.value })} className='mt-2' />
                    <input placeholder='Zip Code' type="text" name="zipcode" value={formData.zipcode} onChange={(e) => setFormData({ ...formData, zipcode: e.target.value })} className='mt-2' />
                </form>
                </Modal.Body>
                <Modal.Footer className='bg-dark text-white'>
                    <Button variant='outline-danger' className='mt-2 w-25'>Cancel</Button>
                    <Button variant='outline-info' onClick={(e)=> handleSubmit(e)} className='mt-2 w-25'>Create Customer</Button>
                </Modal.Footer>
                </Modal>
            </div>
        </>
    )
}

NewCustomer.propTypes = {
    addCustomer: PropTypes.func.isRequired,
}

const mapStateToProps = (state) => ({

})


export default connect(mapStateToProps, { addCustomer })(withRouter(NewCustomer));
