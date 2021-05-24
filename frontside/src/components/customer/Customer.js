import React, { useState, useEffect } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { getCustomer } from '../../actions/customers';
import { ticketByCompany } from '../../actions/tickets';
import { Userlist } from './Userlist';
import { Button, Modal } from 'react-bootstrap';
import TicketItem from '../tickets/TicketItem';
import CustTickModal from './CustTickModal';
import AddUserModal from './AddUserModal';
import { setAlert } from '../../actions/alert';
import UpdateCustomer from './UpdateCustomer';
import { withRouter } from 'react-router-dom';
import { archiveCustomer, activateCustomer } from '../../actions/customers';

const Customer = ({ getCustomer, setAlert, ticketByCompany, history, archiveCustomer, activateCustomer, tickets: { tickets }, match, auth, customer }) => {
    const [showModal, setShowModal] = useState(false);
    const [addUserModal,setAddUserModal] = useState(false);
    const [updateModal, setUpdateModal] = useState(false);
    const [confirmArchive, setConfirmArchive] = useState(false);

    useEffect(() => {
        getCustomer(match.params.id);
        ticketByCompany(match.params.id);
    }, [getCustomer, updateModal, match.params.id, ticketByCompany])

    const openModal = () => {
        setShowModal(true);
    }

    const closeModal = async () => {
        setAddUserModal(false);
        setUpdateModal(false);
        await getCustomer(match.params.id)
    }

    const archiveAction = async () => {
        archiveCustomer(customer.custnumber, history);
    }

    const ticketsOpen = () => {
        const tickarr = [];
        tickets.map((tic)=>{
            if(tic.status !== 'Closed'){
                tickarr.push(tic)
            }
            return 0;
        })
        return tickarr.length
    }

    const ticketsClosed = () => {
        const tickarr = [];
        tickets.map((tic)=>{
            if(tic.status === 'Closed'){
                tickarr.push(tic)
            }
            return 0;
        })
        return tickarr.length
    }

    return (
        <>
            <div>
                {customer && (
                    <>
                        <div className='container'>
                            {showModal && <CustTickModal customer={customer} showModal={showModal} closeTerm={() => setShowModal(false)} />}
                            <AddUserModal customer={customer} showModal={addUserModal} closeTerm={() => closeModal()} />
                            <UpdateCustomer showModal={updateModal} closeTerm={() => closeModal()} />
                            <Modal  
                                show={confirmArchive}
                                onHide={()=>setConfirmArchive(false)}
                                size="md"
                            >
                                <Modal.Header className="bg-dark text-white" closeButton>
                                    Archive Customer
                                </Modal.Header>
                                <Modal.Body className="bg-dark text-white">
                                    Archive customer?
                                </Modal.Body>
                                <Modal.Footer className='bg-dark text-white'>
                                    <Button variant='outline-info' onClick={()=>setConfirmArchive(false)}>Cancel</Button>
                                    <Button variant='outline-danger' onClick={()=>archiveAction()}>Archive</Button>
                                </Modal.Footer>
                                </Modal>
                                <div className="d-flex inline justify-content-between">
                                <div className="d-flex flex-column align-items-baseline">
                                    <div className="d-flex inline">

                                        <div>
                                            <h2>{customer.company}{' '}</h2>
                                            <small>{customer.custnumber}</small>
                                        </div>
                                        <div className='ml-3'>{customer.active ? <strong className='text-success'>Active</strong> : <strong className='text-danger'>Inactive</strong>}</div>
                                    </div>
                                    <div className="mt-3">
                                        <strong>Phone number</strong><p>{customer.primaryphone}</p>
                                        <strong>Primary Email</strong><p>{customer.primaryemail}</p>
                                        <strong>Address:</strong><p>{customer.streetaddress}</p><p style={{ marginTop: "-1rem" }}>{customer.city}, {customer.usstate} {customer.zipcode}</p>
                                    </div>
                                </div>
                                <div className="d-flex inline">
                                    <div>

                                        <h5>Authorized Users</h5>
                                        {customer.users.map((user) => (
                                            <Userlist key={user.user} user={user} />
                                        ))}
                                    </div>
                                    <div className='d-flex flex-column ml-3'>
                                        <Button variant='outline-info' onClick={() => openModal()}>Create Ticket</Button>
                                        <Button variant='outline-info' onClick={() => setAddUserModal(true)} className='mt-2'>Add User</Button>
                                        <Button variant='outline-info' className='mt-2'>Send Invitation</Button>
                                        <Button variant='outline-info' onClick={() => setUpdateModal(true)} className='mt-2'>Edit Customer</Button>
                                        {customer.active ? (
                                            <Button variant='outline-danger' onClick={() => setConfirmArchive(true)} className='mt-2'>Archive Customer</Button>
                                            ):(
                                                <Button variant='outline-success' className='mt-2' onClick={()=>activateCustomer(customer.custnumber, history)}>Activate Customer</Button>
                                            )}
                                    </div>
                                </div>
                            </div>
                            <div className='mt-5'>
                                { tickets.length > 0 && ticketsOpen() > 0 && <h4>Customers Open Tickets</h4>}
                                {tickets.map(ticke => {
                                    if (ticke.status !== "Closed") {
                                        return <>
                                            <TicketItem key={ticke.ticketnumber} ticket={ticke} />
                                        </>
                                    }
                                    return "";
                                })}
                            </div>
                            <div className="mt-5">
                                {tickets.length > 0 && ticketsClosed() > 0 && <h4>Customers Closed Tickets</h4>}
                                {tickets.map(ticke => {
                                    if (ticke.status === "Closed") {
                                        return <>
                                            <TicketItem key={ticke.ticketnumber} ticket={ticke} />
                                        </>
                                    }
                                    return "";
                                })}
                            </div>
                        </div>
                    </>
                )}
            </div>
        </>
    )
}

Customer.propTypes = {
    customer: PropTypes.object,
    getCustomer: PropTypes.func.isRequired,
    ticketByCompany: PropTypes.func.isRequired,
    tickets: PropTypes.object.isRequired,
    setAlert: PropTypes.func.isRequired,
    archiveCustomer: PropTypes.func.isRequired,
    activateCustomer: PropTypes.func.isRequired,
}

const mapStateToProps = (state) => ({
    auth: state.auth,
    customer: state.customers.customer,
    tickets: state.tickets
})


export default connect(mapStateToProps, { getCustomer, ticketByCompany, setAlert, archiveCustomer, activateCustomer })(withRouter(Customer))
