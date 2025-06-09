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

// Only create the model if it hasn't been created yet
module.exports = mongoose.models.Card || mongoose.model('Card', CardSchema);