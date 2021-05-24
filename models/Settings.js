const mongoose = require('mongoose');

const SettingsSchema = new mongoose.Schema({
    ref: {
        type: String,
        required: true,
        unique: true
    },
    value: {
    	type: String,
    	required: true
    }
});

module.exports = Settings = mongoose.model('settings', SettingsSchema);