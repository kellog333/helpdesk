const Email = require('email-templates');
const mongoose = require('mongoose');
const Float = require('mongoose-float').loadType(mongoose);

const CustomerSchema = new mongoose.Schema({
    company: {
        type: String,
        required: true,
        unique: true
    },
    date: {
        type: Date,
        default: Date.now
    },
    primaryphone: {
        type: String,
        required: true,
    },
    custnumber: {
        type: Number,
        required: true,
        unique: true
    },
    streetaddress: {
        type: String
    },
    usstate: {
        type: String
    },
    zipcode: {
        type: String
    },
    city: {
        type: String
    },
    primaryemail: {
        type: String
    },
    users: [
        {
            user: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'client'
            },
            name: {
                type: String,
                required: true
            },
            email: {
                type: String
            },
            phone: {
                type: String
            }
        }
    ],
    date: {
        type: Date,
        default: Date.now
    },
    hours: {
        type: Float,
        default: 0
    },
    timezone: {
        type: String,
        default: 'central'
    },
    active: {
        type: Boolean,
        default: true
    }
});

module.exports = Customer = mongoose.model('customer', CustomerSchema);