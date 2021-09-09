const mongoose = require('mongoose')

const cooldownsSchema = new mongoose.Schema({
    userID:{type: String, require: true, unique: true},
    guildID:{type: String, require: true, default: "1"},
    usedcooldowns: {type: Array}
})

const model = mongoose.model('cooldownsModels', cooldownsSchema);

module.exports = model;