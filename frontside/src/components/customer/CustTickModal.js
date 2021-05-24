import React, { useState, useRef, useEffect } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Modal, Button } from 'react-bootstrap';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import Select from 'react-select';
import { withRouter } from 'react-router-dom'
import { getStatuses } from '../../actions/tickets';
import { getPriorities } from '../../actions/tickets';
import { getAssignees } from '../../actions/tickets';
import { getCategories } from '../../actions/tickets';
import { createTicket } from '../../actions/tickets';
import { setAlert } from '../../actions/alert';
import Alert from '../layout/Alert';

const CustTickModal = ({ customer, createTicket, history, categories, setAlert, assignees, priorities, closeTerm, showModal, statuses, getCategories, getAssignees, getPriorities, getStatuses }) => {
    const [clientSearch, setClientSearch] = useState('');
    const [clientOptions, setClientOptions] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [formData, setFormData] = useState({
        customer: customer._id,
        name: customer.company,
        custnumber: customer.custnumber,
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

    const customStyles = {
        option: (provided, state) => ({
            ...provided,
            color: "#000000",
        })
    }


    useEffect(() => {
        getStatuses();
        getPriorities();
        getCategories();
        getAssignees();
        const users = customer.users.map((user) => ({
            value: user.user,
            label: user.name,
            email: user.email,
            phone: user.phone
        }))
        setClientOptions(users)
        setIsLoading(false)
    }, [getStatuses, getPriorities, getCategories, getAssignees, customer.users, setClientOptions, setIsLoading])

    const custo = useRef({});

    const handleClientChange = (clie) => {
        custo.current = clie
        setClientSearch(clie)
        setFormData({ ...formData, contact: clie.value, contactname: clie.label, contactphone: clie.phone, contactemail: clie.email })
    }

    const handleCategoriesChange = (categ) => {
        setFormData({...formData, category: categ.label})
    }

    const handleStatusChange = (stat) => {
        setFormData({...formData, status: stat.label})
    }

    const handleAssigneeChange = (assig) => {
    setFormData({...formData, assignedto: assig.value, assignedname: assig.label})
    }

    const handlePriorityChange = (prior) => {
    setFormData({...formData, priority: prior.label})
    }

    const handleClose = () => {
        closeTerm()
    }

    const handleSubmit = () => {
        if(formData.contactname.length === 0 || formData.contact.length === 0 ||  formData.contact.length === 0 || formData.status.length === 0 || formData.priority.length === 0) {
            setAlert('All fields are required', 'danger');
        }
        createTicket(formData, history);
    }


    const onChange = e => setFormData({ ...formData, [e.target.name]: e.target.value });

    return (
        <>
            { isLoading ? (
                <h1>LOADING</h1>
            ) : (
            <Modal
                        show={showModal}
                onHide={handleClose}
                backdrop="static"
                size="lg"
            >
                <Modal.Header className='bg-dark text-white' closeButton>
                            New Ticket for {customer.company}
                </Modal.Header>
                <Modal.Body className='bg-dark text-white'>
                <Alert />
                    <form>
                        <div className='d-flex justify-content-around'>
                                    <div className='w-50'>
                                        {clientOptions.length > 0 ? (
                                            <>
                                                <Select
                                                    options={clientOptions}
                                                    onChange={handleClientChange}
                                                    styles={customStyles}
                                                    placeholder='Select Contact'
                                                />
                                            </>
                                        ) : (
                                                "No users available"
                                            )}
                                        {clientSearch ? (
                                            <>
                                                <p className='mt-2'>{clientSearch.label}</p>
                                                <p>{clientSearch.email}</p>
                                                <p>{clientSearch.phone}</p>
                                            </>
                                        ) : ("")}
                            </div>
                            <div className='d-flex flex-column w-50 ml-3'>
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
                                    </div>
                                </div>
                                <div className="d-flex justify-content-center mt-3">
                                    <input type="text" placeholder="Title" name='title' className='rounded w-75' onChange={(e) => onChange(e)} />
                                </div>
                                <div className='mt-4'>Description</div>
                                <div className="d-flex justify-content-center" style={{ height: "10rem"}}>
                                {/* <strong className='ml-5'>Description</strong> */}
                                    <ReactQuill style={{ width: "95%", height: "70%" }} className='m-3' theme="snow" value={formData.description} onChange={(e) => setFormData({ ...formData, description: e })} />
                        </div>
                    </form>
                </Modal.Body>
                <Modal.Footer className='bg-dark text-white'>
                    <Button variant='outline-danger' onClick={handleClose}>Cancel</Button>
                    <Button variant='outline-info' onClick={handleSubmit}>Submit Ticket</Button>
                </Modal.Footer>
            </Modal>
                )}
        </>
    )
}

CustTickModal.propTypes = {
    statuses: PropTypes.array.isRequired,
    getStatuses: PropTypes.func.isRequired,
    priorities: PropTypes.array.isRequired,
    getPriorities: PropTypes.func.isRequired,
    getAssignees: PropTypes.func.isRequired,
    getCategories: PropTypes.func.isRequired,
    assignees: PropTypes.array.isRequired,
    categories: PropTypes.array.isRequired,
    createTicket: PropTypes.func.isRequired,
    setAlert: PropTypes.func.isRequired,
}

const mapStateToProps = (state) => ({
    statuses: state.tickets.statuses,
    priorities: state.tickets.priorities,
    categories: state.tickets.categories,
    assignees: state.tickets.assignees
})

export default connect(mapStateToProps, { getStatuses, setAlert, getPriorities, getAssignees, getCategories, createTicket })(withRouter(CustTickModal))
