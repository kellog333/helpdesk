import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { Link } from 'react-router-dom'

export const Userlist = (user) => {
    return (
        <Link to={`/client/${user.user.user}`} style={{ textDecoration: 'none' }}>
        <div className='text-white'>
            {user.user.name} - {user.user.email}
        </div>
        </Link>
    )
}

Userlist.propTypes = {
    user: PropTypes.object.isRequired,
}

const mapStateToProps = (state) => ({

})

const mapDispatchToProps = {

}

export default connect(mapStateToProps, mapDispatchToProps)(Userlist)
