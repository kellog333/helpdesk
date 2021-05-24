import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { Button } from 'react-bootstrap';
import { connect } from 'react-redux';
import { allMyTickets, getUnassigned,  getMyTicketCount } from '../../actions/tickets';
import TicketItem from './TicketItem';
import TicketForm from './TicketForm';
import { Paginate } from '../utils/Paginate';

const UserTickets = ({ allMyTickets, getMyTicketCount, getUnassigned, tickets: { tickets, unassigned, pcount, loading } }) => {
    const [showModal, setShowModal] = useState(false);
    const [pages, setPages] = useState(1);
    const [pageNum, setPageNum] = useState(1);
    let active = 1;
    const [ticketsPerPage, setTicketsPerPage] = useState(10);

    useEffect(() => {
        setPageNum(active)
        allMyTickets(pageNum);
        getUnassigned();
    }, [allMyTickets, active, setPageNum, getUnassigned, pageNum])

    useEffect(() => {
        let timer = setInterval(async () => {
            setPageNum(active)
            allMyTickets();
            getUnassigned();
        }, 5000)
        return () => clearInterval(timer)
    }, [allMyTickets, active, setPageNum, getUnassigned]);

    const increaseCount = (pagnu) => {
        if (pages !== pagnu) {
            setPages(pages + 1)
        }
    }

    const decreaseCount = () => {
        if(pages > 0){
            setPages(pages - 1)
        }
    }

    const handleClick =  async (num) => {
        console.log("numberClicked")
        console.log(num)
        setPages(num)
    }

    const indexOfLastPost = pages * ticketsPerPage;
    const indexOfFirstPage = indexOfLastPost - ticketsPerPage;
    const currentTickets = tickets.slice(indexOfFirstPage, indexOfLastPost)

    return (
        <>
            <div className='ticket-list'>
                <TicketForm showModal={showModal} closeTerm={() => setShowModal(false)} />
                {unassigned.length > 0 ? (
                    <>
                        <div className='d-flex justify-content-between align-items-center mb-4 mx-5'>
                            <h2>Unassigned Tickets</h2>
                            <Button onClick={() => setShowModal(true)}>New Ticket</Button>
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
                        {unassigned.map(unassi => (
                            <TicketItem key={unassi.ticketnumber} ticket={unassi} />
                        ))}
                    </>
                ) : (
                        ""
                    )}
            </div>
            <div className='ticket-list'>
                <div className='d-flex justify-content-between align-items-center mb-4 mx-5'>
                    <h2>My Open Tickets</h2>
                    {unassigned.length === 0 ? (
                        // <Link to='/createticket' className='btn btn-primary'>New Ticket</Link>
                        <Button onClick={() => setShowModal(true)}>New Ticket</Button>
                    ) : ""}
                </div>
                <div>
                    <ul className='list-unstyled justify-content-between d-flex inline p-1'>
                        <li className='ticknumber-list'>Number</li>
                        <li className='ticktitle'>Title</li>
                        <li className='tickcust'>Customer</li>
                        <li className='tickrowstattitle ml-1 d-none d-lg-block d-xl-block'>Status</li>
                        <li className='tickrowprio d-none d-lg-block d-xl-block'>Priority</li>
                        <li className='tickrowdate d-none d-lg-block d-xl-block'>Date Created</li>
                        <li className='tickrowdate d-none d-lg-block d-xl-block'>Last Modified</li>
                        <li className='tickrow d-none d-lg-block d-xl-block'>Assigned To</li>
                    </ul>
                </div>
                {currentTickets.map(ticket => (
                    <TicketItem key={ticket.ticketnumber} ticket={ticket} />
                ))}
                <div className="justify-content-center d-flex mt-3">

                { !loading && tickets.length > ticketsPerPage ? (
                    <>
                    <Paginate totalTicks={tickets.length} page={pages} ticketsPerPage={ticketsPerPage} handleClick={(num)=>handleClick(num)} increaseCount={(pagnu)=>increaseCount(pagnu)} decreaseCount={()=> decreaseCount()}/>
                    </>
                ) : ("")}
                </div>
            </div>
        </>
    );
};

const mapStateToProps = state => ({
    tickets: state.tickets
})

UserTickets.propTypes = {
    tickets: PropTypes.object.isRequired,
    allMyTickets: PropTypes.func.isRequired,
    getUnassigned: PropTypes.func.isRequired,
    getMyTicketCount: PropTypes.func.isRequired,
}

export default connect(mapStateToProps, { allMyTickets, getMyTicketCount, getUnassigned })(UserTickets);