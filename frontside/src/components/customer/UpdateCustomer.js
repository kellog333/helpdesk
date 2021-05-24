import React, { useState, useEffect } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { Button, Modal } from 'react-bootstrap'
import NumberFormat from 'react-number-format'
import { updateCustomer } from '../../actions/customers'

const UpdateCustomer = ({ customers: { customer, loading }, showModal, updateCustomer, closeTerm }) => {

    const [formData, setFormData] = useState({
        custnumber: '',
        company: '',
        primaryphone: '',
        primaryemail: '',
        streetaddress: '',
        city: '',
        usstate: '',
        zipcode: ''
    });

    useEffect(() => {
        setFormData({
            custnumber: loading || !customer.custnumber ? '' : customer.custnumber,
            company: loading || !customer.company ? '' : customer.company,
            primaryphone: loading || !customer.primaryphone ? '' : customer.primaryphone,
            primaryemail: loading || !customer.primaryemail ? '' : customer.primaryemail,
            streetaddress: loading || !customer.streetaddress ? '' : customer.streetaddress,
            city: loading || !customer.city ? '' : customer.city,
            usstate: loading || !customer.usstate ? '' : customer.usstate,
            zipcode: loading || !customer.zipcode ? '' : customer.zipcode
        })
    }, [setFormData, customer.city, customer.company, customer.custnumber, customer.primaryphone, customer.primaryemail, customer.streetaddress, customer.usstate, customer.zipcode, loading])


    const handleClose = () => {
        closeTerm();
    }

    const handleSubmit = () => {
        updateCustomer(customer.custnumber, formData)
        closeTerm();
    }

    return (
        <>
            <Modal
                show={showModal}
                onHide={handleClose}
                size="lg"
            >
                <Modal.Header className='bg-dark text-white'>
                    <h2>Update Customer</h2>
                </Modal.Header>
                <Modal.Body className="bg-dark text-white">
                <form className='d-flex flex-column' onSubmit={()=>handleSubmit()}>
                    <input placeholder='Company Name' type="text" name="company" value={formData.company} onChange={(e) => setFormData({ ...formData, company: e.target.value })} />
                    <NumberFormat format="(###) ###-####" placeholder='Primary Phone Number' name='primaryphone' value={formData.primaryphone} onValueChange={(e) => setFormData({ ...formData, primaryphone: e.formattedValue })} className='mt-2' />
                    <input placeholder='Primary Email' type="email" name="company" value={formData.primaryemail} onChange={(e) => setFormData({ ...formData, primaryemail: e.target.value })} className='mt-2' />
                    <input placeholder='Street Address' type="text" name="streetaddress" value={formData.streetaddress} onChange={(e) => setFormData({ ...formData, streetaddress: e.target.value })} className='mt-2' />
                    <input placeholder='City' type="text" name="city" value={formData.city} onChange={(e) => setFormData({ ...formData, city: e.target.value })} className='mt-2' />
                    <input placeholder='state' type="text" name="usstate" value={formData.usstate} onChange={(e) => setFormData({ ...formData, usstate: e.target.value })} className='mt-2' />
                    <input placeholder='Zip Code' type="text" name="zipcode" value={formData.zipcode} onChange={(e) => setFormData({ ...formData, zipcode: e.target.value })} className='mt-2' />
                </form>
                </Modal.Body>
                <Modal.Footer className="bg-dark text-white">
                    <Button variant='outline-danger' onClick={closeTerm}>Cancel</Button>
                    <Button variant='outline-info' onClick={() => handleSubmit()}>Save</Button>
                </Modal.Footer>
            </Modal>
        </>
    )
}

UpdateCustomer.propTypes = {
    customers: PropTypes.object.isRequired,
    updateCustomer: PropTypes.func.isRequired,
}

const mapStateToProps = (state) => ({
    customers: state.customers
})


export default connect(mapStateToProps, { updateCustomer })(UpdateCustomer)
