import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { Link } from 'react-router-dom'

export const CustomerItem = ({ customer: { company, users, _id, custnumber, active } }) => {

    return (
        <>
            <>
                <Link to={`/customer/${custnumber}`} style={{ textDecoration: 'none' }} >
                    <div className="bg-dark rounded text-white shadow p-3 mt-2">
                        <ul className='list-unstyled d-flex inline p-1 align-items-between justify-items-between justify-content-between'>
                            <li className='col-md-2'>{custnumber}</li>
                            <li className='col-md-3'>{company}</li>
                            <li className='d-none d-lg-block d-xl-block col-md-1'>{users.length}</li>
                            <li>{active?<strong className='text-success col-md-1 d-none d-lg-block d-xl-block'>Active</strong>:<strong className='text-danger  d-none d-lg-block d-xl-block'>Inactive</strong>}</li>
                        </ul>
                    </div>
                </Link>
            </>
        </>
    )
}

CustomerItem.propTypes = {
    customer: PropTypes.object.isRequired,
}

const mapStateToProps = (state) => ({

})


export default connect(mapStateToProps)(CustomerItem)
