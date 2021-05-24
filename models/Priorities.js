const mongoose = require('mongoose');

const PrioritiesSchema = new mongoose.Schema({
    text: {
        type: String,
        required: true,
        unique: true
    }
});

module.exports = Priorities = mongoose.model('priorities', PrioritiesSchema);