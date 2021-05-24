import React, { useEffect, useState } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { getClient } from '../../actions/client'
import { Link, withRouter } from 'react-router-dom'
import { Button, Modal } from 'react-bootstrap'
import { removeClient } from '../../actions/client'

export const Client = ({match, client, removeClient, getClient, history }) => {
    const [showModal, setShowModal] = useState(false);
    useEffect(()=>{
        getClient(match.params.id);
    },[getClient, match.params.id])
    return (
        <>
            {client?(
                <>
                <div className="p-3 m-5 d-flex inline">
                <div className='w-50'>
                <h3>{client.name}</h3>
                <Modal show={showModal} onHide={()=>setShowModal(false)} size="md">
                    <Modal.Header className='bg-dark text-white' closeButton>
                        Delete User
                    </Modal.Header>
                    <Modal.Body className='bg-dark text-white'>
                        Are you sure you want to delete this user? This cannot be undone!
                    </Modal.Body>
                    <Modal.Footer className='bg-dark text-white'>
                        <Button variant='outline-info' onClick={()=>setShowModal(false)}>Cancel</Button>
                        <Button variant='outline-danger' onClick={()=>removeClient(client._id, client.company, history)}>Delete</Button>
                    </Modal.Footer>
                </Modal>
                <p className='mt-2'><strong>Phone number: </strong>{client.phone}</p>
                <p><strong>Email: </strong><a href={`mailto:${client.email}`}>{client.email}</a></p>
                <p><strong>Company: </strong><Link to={`/customer/${client.company}`}  className='text-white' style={{ textDecoration: 'none' }}>{client.companyname}</Link></p>
                </div>
                <div className='w-50 d-flex justify-content-end justify-items-end'>
                    <Button variant='outline-danger h-25' onClick={()=>setShowModal(true)}>Delete User</Button>
                </div>
                </div>
                </>
                ) : (
                    "Loading"
                )
        }
        </>
    )
}

Client.propTypes = {
    client: PropTypes.object.isRequired,
    getClient: PropTypes.func.isRequired,
    removeClient: PropTypes.func.isRequired,
}

const mapStateToProps = (state) => ({
    client: state.client.client
})

export default connect(mapStateToProps, { getClient, removeClient })(withRouter(Client))
