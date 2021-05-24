const mongoose = require('mongoose');

const StatusesSchema = new mongoose.Schema({
    text: {
        type: String,
        required: true,
        unique: true
    }
});

module.exports = Categories = mongoose.model('statuses', StatusesSchema);