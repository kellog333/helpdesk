import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import renderHTML from 'react-render-html';
import Moment from 'react-moment';

export const NoteItem = ({ ticketId, note: { _id, text, notetaker, date, priv, time } }) => {
    return (
        <div>
            <h5>{notetaker}</h5>
            <div className="d-flex inline align-items-center">
                <small><Moment format='MM/DD/YY hh:mm a'>{date}</Moment>{time? ` - Time Spent - ${time}` : ''}</small>
                {priv ? (<strong className='ml-2'>Private</strong>) : ''}
            </div>
            <p>{renderHTML(text)}</p>
            <hr/>
        </div>
    )
}

NoteItem.propTypes = {
    ticketId: PropTypes.string.isRequired,
    note: PropTypes.object.isRequired,
}

const mapStateToProps = (state) => ({
    
})

export default connect(mapStateToProps)(NoteItem)
