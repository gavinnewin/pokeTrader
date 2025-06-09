const mongoose = require('mongoose');

const CardSchema = new mongoose.Schema({
  name: String,
  image: String,
  price: Number,
  subtitle: String,
  tcgplayerUrl: String,
  rarity: String,
  number: String,
  printedTotal: Number,
});

module.exports = mongoose.model('Card', CardSchema);