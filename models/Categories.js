const mongoose = require('mongoose');

const CategoriesSchema = new mongoose.Schema({
    text: {
        type: String,
        required: true,
        unique: true
    }
});

module.exports = Categories = mongoose.model('categories', CategoriesSchema);