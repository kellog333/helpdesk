import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import UserTickets from './UserTickets';


const MyTickets = ({ auth }) => {


    return (
        <>
            { auth.loading ? (
                "Loading"
            ) : (
                    auth.user ? (
                        <UserTickets />
                    ) : (
                            "Nobody there"
                        ))
            }
        </>
    );
};

const mapStateToProps = state => ({
    auth: state.auth
})

MyTickets.propTypes = {
    auth: PropTypes.object.isRequired,
}

export default connect(mapStateToProps)(MyTickets);