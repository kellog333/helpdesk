import React, { useState, useEffect } from 'react'
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux'
import { getUserById } from '../../actions/tickets';
import { getCustomerName } from '../../actions/tickets';
import Moment from 'react-moment';

const TicketItem = ({ getUserById, getCustomerName, ticket: { title, name, contactname, assignedname, ticketnumber, lastmodified, date, status, priority, assignedto, customer, contact } }) => {
    const [ isLoading, setIsLoading ] = useState(true);

    useEffect(() => {
        setIsLoading(false)
    }, [])


    return (
        <>
        {!isLoading && (
                <>
                    <Link to={`/ticket/${ticketnumber}`} style={{ textDecoration: 'none' }} >
                        <div className="bg-dark rounded text-white shadow p-3 mt-2">
            <ul className='list-unstyled d-flex inline p-1 align-items-center justify-content-between'>
                <li className='ticknumber-list'>{ticketnumber}</li>
                <li className='ticktitle'>{title}</li>
                <li className='tickcust'><ul className='list-unstyled'><li><small>{name}</small></li><li><small>{contactname}</small></li></ul></li>
                <li className='tickrowstat d-none d-lg-block d-xl-block'>{status}</li>
                <li className='tickrowprio d-none d-lg-block d-xl-block'>{priority}</li>
                <li className='tickrowdate d-none d-lg-block d-xl-block'><Moment format="MM/DD/YY">{date}</Moment></li>
                <li className='tickrowdate d-none d-lg-block d-xl-block'><Moment format="MM/DD/YY">{lastmodified}</Moment></li>
                <li className='tickrow d-none d-lg-block d-xl-block'>{assignedname ? assignedname : 'Unassigned'}</li>
            </ul>
        </div>
                    </Link>
                </>
        )
        }
        </>
    )
}

TicketItem.propTypes = {
    getUserById: PropTypes.func.isRequired,
    getCustomerName: PropTypes.func.isRequired,
}

const mapStateToProps = state => ({

})



export default connect(mapStateToProps, { getUserById, getCustomerName })(TicketItem)
