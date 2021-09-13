const mongoose = require('mongoose')

const musicSchema = new mongoose.Schema({
    userID:{type: String, require: true, unique: true},
    guildID:{type: String, require: true, unique: true},
    songs: {type: Array},
})

const model = mongoose.model('MusicModels', musicSchema);

module.exports = model;