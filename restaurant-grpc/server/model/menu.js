const mongoose = require('mongoose')

const menuSchema = mongoose.Schema({
    _id: { type: mongoose.Types.ObjectId, auto: true },
    name: String,
    price: Number
})
module.exports = mongoose.model('Menu', menuSchema)