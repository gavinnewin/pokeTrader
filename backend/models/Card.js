const mongoose = require('mongoose');

const CardSchema = new mongoose.Schema({
  name: String,
  image: String,
  price: Number,
  subtitle: String
});

module.exports = mongoose.model('Card', CardSchema);