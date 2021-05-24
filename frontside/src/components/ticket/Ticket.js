import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { getTicketById, addNote } from '../../actions/tickets';
import { Link, withRouter } from 'react-router-dom';
import Moment from 'react-moment';
import { NoteItem } from './NoteItem';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { Button } from 'react-bootstrap';
import { getCustomerName, closeTicket, takeTicket } from '../../actions/tickets';
import { getCustomer } from '../../actions/customers';
import renderHTML from 'react-render-html';

const Ticket = ({ getTicketById, getCustomer, addNote, loading, auth, ticket, match, history, closeTicket, takeTicket, customer }) => {
    const [ priv, setPriv ] = useState(false);
    const [noteText, setNoteText] = useState('');
    const [editing, setEditing] = useState(false);
    const [time, setTime] = useState('');


    useEffect(() => {
        getTicketById(match.params.id);
    }, [getTicketById, match.params.id])

    const saveNote = (priv) => {
        const tim = parseInt(time)
        addNote(ticket.ticketnumber, noteText, tim, priv);
    }

    const grabTicket = async () => {
        await takeTicket(ticket.ticketnumber, auth._id, auth.name);
        await getTicketById(match.params.id)
    }

    const timeConvert = (num) => {
        var hours = Math.floor(num / 60);
        var mins = num % 60;
        return hours + ":" + mins;
    }


    return (
        <>
        <div className='m-5 bg-dark rounded shadow'>
            <div className='p-2 ml-5'>

                {loading || ticket === null ? (
                    <p>LOADING</p>
                ) : (
                        <>
                                <div className='d-flex inline ticket-sm' style={{ minHeight: "75%" }}>
                                <div style={{width: "30%"}}>
                                        <div className="d-flex inline align-items-center">
                                            <h1 >Ticket #{ticket.ticketnumber}</h1>
                                            <div className="d-flex flex-column mt-4 ml-4 align-items-end">
                                                <Button variant='outline-info' onClick={() => setEditing(!editing)} className='ml-3 mt-5 w-100' style={{ height: "50%" }}>Edit</Button>
                                                <Button variant='outline-info' onClick={() => grabTicket()} className='ml-3 mt-1 w-100'>Take</Button>
                                                <Button variant='outline-danger' onClick={() => closeTicket(ticket.ticketnumber, history)} className='ml-5 mt-1 w-100'>Close</Button>
                                            </div>
                                        </div>
                                    <h2>{ticket.title}</h2>
                                        <Link to={`/customer/${ticket.custnumber}`}>
                                        <h5>{ticket.name}</h5>
                                        </Link>
                                        <h5>{ticket.contactname}</h5>
                                    <p>Created:{` `}<Moment format='MM/DD/YY hh:mm a'>{ticket.date}</Moment></p>
                                        <p>Last Modified:{` `}<Moment format='MM/DD/YY hh:mm a'>{ticket.lastmodified}</Moment></p>
                                    <p>Status: {ticket.status}</p>
                                    <p>Category: {ticket.category}</p>
                                    <p>Priority: {ticket.priority}</p>
                                        {ticket.assignedname ? <p>Assigned to {ticket.assignedname}</p> : <p>Unassigned</p>}
                                        <p><strong>Time Spent: </strong>{timeConvert(ticket.timeon)}</p>
                                    <strong>Description:</strong>
                                    <p>{renderHTML(ticket.description)}</p>
                                </div>
                                    <div className='justify-items-center ticket-note-sm' style={{ width: "70%" }}>
                                    <h4 className='mt-4 ml-5'>Notes</h4>
                                        <form onSubmit={() => { saveNote(priv) }} className='d-flex ticket-note-sm flex-column justify-items-end align-items-end mr-5'>
                                            {/* <textarea ref={note} className='text-white rounded bg-secondary' style={{ width: "95%", height: '9rem' }}></textarea> */}
                                            <ReactQuill style={{ width: "95%", height: "8rem" }} theme="snow" value={noteText} onChange={setNoteText} />
                                            <div className='d-flex inline mt-5 ticket-note-sm align-items-center justify-content-end'>
                                                <input value={priv} onChange={() => setPriv(!priv)} className='mb-2 ticket-btn-sm' type="checkbox" />
                                                <label className='ml-2 ticket-btn-sm'>Private</label>
                                                <input value={time} onChange={(e) => setTime(e.currentTarget.value)} type="number" className='ml-5 rounded w-50 mb-1' placeholder='Minutes Spent' />
                                        </div>
                                            <button className='btn btn-primary d-flex justify-content-center' style={{ width: "15%" }}>Save</button>
                                    </form>
                                    <div className="ml-5">

                                    { ticket.notes.map((note) => (
                                        <NoteItem key={note._id} ticketId={ticket._id} note={note} />
                                    ))}
                                    </div>
                                </div>
                            </div>
                        </>)}
            </div>
        </div>
        </>
    )
}

Ticket.propTypes = {
    ticket: PropTypes.object,
    getTicketById: PropTypes.func.isRequired,
    getCustomerName: PropTypes.func.isRequired,
    getCustomer: PropTypes.func.isRequired,
    closeTicket: PropTypes.func.isRequired,
    takeTicket: PropTypes.func.isRequired,
    auth: PropTypes.object
}

const mapStateToProps = state => ({
    ticket: state.tickets.ticket,
    loading: state.ticket,
    customer: state.customer,
    auth: state.auth.user
})


export default connect(mapStateToProps, { getTicketById, addNote, closeTicket, getCustomerName, takeTicket, getCustomer })(withRouter(Ticket));


