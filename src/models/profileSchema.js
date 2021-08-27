const mongoose = require('mongoose')

const profileSchema = new mongoose.Schema({
    userID: { type: String, require: true, unique: true },
    guildID:{type: String, require: true, default: "1"},
    serverID: { type: String, require: true },
    gold: { type: Number, default: 1000 },
    bank: { type: Number },
    minions: { type: Number },
    title: { type: String }
})

const model = mongoose.model('ProfileModels', profileSchema);

module.exports = model;
