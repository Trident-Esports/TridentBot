const mongoose = require('mongoose')

const inventorySchema = new mongoose.Schema({
    userID:{type: String, require: true, unique: true},
    guildID:{type: String, require: true, default: "1"},
    items: {type: Array},
    consumables: {type: Array},
    powers: {type: Array}
})

const model = mongoose.model('InventoryModels', inventorySchema);

module.exports = model;