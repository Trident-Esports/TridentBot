const mongoose = require('mongoose')

const cooldownsSchema = new mongoose.Schema({
    userID:{type: String, require: true, unique: true},
    usedcooldowns: {type: Array}
})

const model = mongoose.model('cooldownsModels', cooldownsSchema);

module.exports = model;