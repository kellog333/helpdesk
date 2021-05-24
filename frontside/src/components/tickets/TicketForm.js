import React, { useState, useEffect } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { searchCustomers } from '../../actions/customers';
import AsyncSelect from 'react-select/async';
import Select from 'react-select';
import { Modal, Button } from 'react-bootstrap';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { withRouter } from 'react-router-dom'
import { getStatuses } from '../../actions/tickets';
import { getPriorities } from '../../actions/tickets';
import { getAssignees } from '../../actions/tickets';
import { getCategories } from '../../actions/tickets';
import { createTicket } from '../../actions/tickets';
import { searchClient } from '../../actions/client';
import { getCustomer } from '../../actions/customers';

export const TicketForm = ({ searchCustomers, getPriorities, createTicket, categories, priorities, statuses, assignees, getCategories, getAssignees, getStatuses, getCustomer, searchClient, customer, history, closeTerm, showModal }) => {
    const [isSelected, setIsSelected] = useState(false);
    const [clientSearch, setClientSearch] = useState('');
    const [formData, setFormData] = useState({
        customer: '',
        name: '',
        custnumber: '',
        contact: '',
        contactname: '',
        contactphone: '',
        contactemail: '',
        category: '',
        status: '',
        priority: '',
        assignedto: '',
        assignedname: '',
        description: '',
        title: '',
    });

    useEffect(() => {
        getPriorities();
        getCategories();
        getAssignees();
        getStatuses();
    }, [getPriorities, getCategories, getAssignees, getStatuses])

    const handleSearch = async (sear, callback) => {
        await searchCustomers(sear)
            .then(item => {
                callback(item.map((cus) => ({
                    label: cus.company,
                    value: cus._id,
                    cnum: cus.custnumber
                }
                ))
                )
            })
    }

    const customStyles = {
        option: (provided, state) => ({
            ...provided,
            color: "#000000"
        })
    }
    
    const handleChange = async (input) => {
        await searchClient(input.value)
            .then(users => users.map((user)=>({
                    "label": user.name,
                    "value": user.user,
            })
        ))
        getCustomer(input.cnum)
        setFormData({ ...formData, customer: input.value, name: input.label, custnumber: input.cnum })
        setIsSelected(true)
    }

    const handleClientChange = async (clie) => {
        var currentClient = customer.users.filter((user) => {
            return user.user === clie.value;
        })
        console.log(currentClient)
        setClientSearch(currentClient[0]);
        setFormData({ ...formData, contact: clie.value, contactname: clie.label, contactemail: clie.email, contactphone: clie.phone })
        console.log(clie)
    }

    const handleCategoriesChange = (categ) => {
        setFormData({ ...formData, category: categ.label })
    }

    const handleStatusChange = (stat) => {
        setFormData({ ...formData, status: stat.label })
    }

    const handleAssigneeChange = (assig) => {
        setFormData({ ...formData, assignedto: assig.value, assignedname: assig.label })
    }

    const handlePriorityChange = (prior) => {
        setFormData({ ...formData, priority: prior.label })
    }

    const handleClose = () => {
        setIsSelected(false)
        closeTerm()
    }

    const handleSubmit = () => {
        createTicket(formData, history)
    }

    const onChange = e => setFormData({ ...formData, [e.target.name]: e.target.value });

    return (
        <>
            <Modal
                show={showModal}
                onHide={handleClose}
                backdrop="static"
                size="xl"
            >
                <Modal.Header className='bg-dark text-white' closeButton>
                    New Ticket
                </Modal.Header>
                <Modal.Body className='bg-dark text-white'>

                    <div className='d-flex inline'>
                        <div className='w-50 ml-5 mt-4'>
                <h5>Company</h5>
                <AsyncSelect
                    loadOptions={handleSearch}
                    styles={customStyles}
                    onChange={handleChange}
                                placeholder="Search Company"
                />
                            {isSelected && customer && (
                    <>
                    <h5 className='mt-3'>Contact</h5>
                                    <Select
                                        options={customer.users.map((user) => ({
                                            label: user.name,
                                            value: user.user,
                                            email: user.email,
                                            phone: user.phone
                                        }))}
                        styles={customStyles}
                        onChange={handleClientChange}
                    />
                    </>
                )}
                            {isSelected && customer ? (
                    <>
                            <p className='mt-5'>{customer.custnumber}</p>
                            <h2>{customer.company}</h2>
                    <p>{customer.primaryphone}</p>
                                    <p>Contact: {clientSearch.name}</p>
                                    <p>Email: {clientSearch.email}</p>
                    </>
                ):(
                                    ""
                )}
                </div>
                        <div className='w-50 mt-5 p-2'>
                            {isSelected && customer ? (
                                <>
                                    <Select
                                        options={categories.map((cats) => ({
                                            value: cats._id,
                                            label: cats.text
                                        }))}
                                        onChange={handleCategoriesChange}
                                        styles={customStyles}
                                        placeholder='Set Category...'
                                    />
                                    <Select
                                        options={priorities.map((prior) => ({
                                            value: prior._id,
                                            label: prior.text
                                        }))}
                                        onChange={handlePriorityChange}
                                        styles={customStyles}
                                        placeholder="Set Priority.."
                                        className="mt-1"
                                    />
                                    <Select
                                        options={statuses.map((stat) => ({
                                            value: stat._id,
                                            label: stat.text
                                        }))}
                                        onChange={handleStatusChange}
                                        styles={customStyles}
                                        placeholder="Set Status..."
                                        className='mt-1'
                                    />
                                    <Select
                                        options={assignees.map((assign) => ({
                                            value: assign._id,
                                            label: assign.name
                                        }))}
                                        onChange={handleAssigneeChange}
                                        styles={customStyles}
                                        placeholder="Assign to..."
                                        className='mt-1'
                                    />
                                    <div className="d-flex flex-column justify-content-center" style={{ height: "10rem" }}>
                                        {/* <strong className='ml-5'>Description</strong> */}
                                        <input type="text" placeholder="Title" name='title' className='rounded w-75 mt-5 mb-2' onChange={(e) => onChange(e)} />
                                        <div>Description</div>

                                        <ReactQuill style={{ width: "95%", height: "80%" }} theme="snow" value={formData.description} onChange={(e) => setFormData({ ...formData, description: e })} />
                                    </div>
                                </>
                            ) : ("")}
                </div>
            </div>

                </Modal.Body>
                <Modal.Footer className='bg-dark text-white'>
                    <Button variant='outline-danger' onClick={handleClose}>Cancel</Button>
                    <Button variant='outline-info' onClick={handleSubmit}>Submit Ticket</Button>
                </Modal.Footer>
            </Modal>
        </>
    )
}

TicketForm.propTypes = {
    searchCustomers: PropTypes.func.isRequired,
    searchClient: PropTypes.func.isRequired,
    getCustomer: PropTypes.func.isRequired,
    customer: PropTypes.object,
    getCategories: PropTypes.func.isRequired,
    getAssignees: PropTypes.func.isRequired,
    getPriorities: PropTypes.func.isRequired,
    getStatuses: PropTypes.func.isRequired,
    assignees: PropTypes.array.isRequired,
    categories: PropTypes.array.isRequired,
    priorities: PropTypes.array.isRequired,
    statuses: PropTypes.array.isRequired,
    createTicket: PropTypes.func.isRequired,
}

const mapStateToProps = (state) => ({
    customer: state.customers.customer,
    statuses: state.tickets.statuses,
    priorities: state.tickets.priorities,
    categories: state.tickets.categories,
    assignees: state.tickets.assignees
})


export default connect(mapStateToProps, { searchCustomers, createTicket, getStatuses, getPriorities, getCategories, getAssignees, getCustomer, searchClient })(withRouter(TicketForm));
