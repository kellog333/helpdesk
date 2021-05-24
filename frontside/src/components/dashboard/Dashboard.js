import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'

export const Dashboard = () => {
    return (
        <div className='mt-2'>
            Welcome
        </div>
    )
}

Dashboard.propTypes = {

}

const mapStateToProps = (state) => ({
    
})

export default connect(mapStateToProps)(Dashboard);
