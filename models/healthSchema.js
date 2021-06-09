const mongoose = require('mongoose')

const healthSchema = new mongoose.Schema({
    userID:{type: String, require: true, unique: true},
    serverID: {type: String, require: true},
    health: {type: Number, default: 100}
})

const model = mongoose.model('HealthModels', healthSchema);

module.exports = model;