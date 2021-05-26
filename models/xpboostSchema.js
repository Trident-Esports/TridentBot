const mongoose = require('mongoose')

const XPBoostSchema = new mongoose.Schema({
    userID:{type: String, require: true, unique: true},
    serverID: {type: String, require: true},
    xpboost: {type: Number, default: 1}
})

const model = mongoose.model('XPBoostModels', XPBoostSchema);

module.exports = model;