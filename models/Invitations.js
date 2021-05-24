const mongoose = require('mongoose');

const InvitationSchema = new mongoose.Schema({
    invitecode: {
        type: String,
        required: true,
        unique: true
    },
    company: {
        type: mongoose.Schema.Types.ObjectId,
    },
    datecreated: {
        type: Date,
        default: Date.now,
        index: { expires: 86400 }
    }
});

module.exports = Invitation = mongoose.model('invitation', InvitationSchema);