import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Button } from 'react-bootstrap';
import { allTheTickets } from '../../actions/tickets';
import TicketItem from './TicketItem';
import TicketForm from './TicketForm';

const AllTickets = ({ allTheTickets, tickets: { tickets } }) => {
    const [showModal, setShowModal] = useState(false);

    useEffect(() => {
        allTheTickets();
    }, [allTheTickets]);
    
    useEffect(() => {
        let timer = setInterval(() => {
            allTheTickets();
        }, 5000)
        return () => clearInterval(timer)
    }, [allTheTickets]);

    return (
        <>
        <div className='ticket-list'>
            <div className='d-flex justify-content-between align-items-center mb-4 mx-5'>
            <h2>All Open Tickets</h2>
            <TicketForm showModal={showModal} closeTerm={() => setShowModal(false)} />
            <Button onClick={()=>setShowModal(true)}>New Ticket</Button>
            </div>
            <div>
            <ul className='list-unstyled d-flex inline p-1'>
                <li className='ticknumber-list'>Number</li>
                <li className='ticktitle'>Title</li>
                <li className='tickcust ml-5'>Customer</li>
                <li className='tickrowstattitle d-none d-lg-block d-xl-block'>Status</li>
                <li className='tickrowprio d-none d-lg-block d-xl-block'>Priority</li>
                <li className='tickrowdate d-none d-lg-block d-xl-block'>Date Created</li>
                <li className='tickrowdate d-none d-lg-block d-xl-block'>Last Modified</li>
                <li className='tickrow d-none d-lg-block d-xl-block'>Assigned To</li>
            </ul>
            </div>
            { tickets.map(ticket => (
                <TicketItem key={ticket.ticketnumber} ticket={ticket} />
            ))}
        </div>
        </>
    );
};

const mapStateToProps = state => ({
    tickets: state.tickets
})

AllTickets.propTypes = {
    tickets: PropTypes.array.isRequired,
    allTheTickets: PropTypes.func.isRequired,
}

export default connect(mapStateToProps, { allTheTickets })(AllTickets);