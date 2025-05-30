const mongoose = require('mongoose');
require('dotenv').config();
const Card = require('../models/Card');
const cards = require('./cards');

mongoose.connect(process.env.MONGO_URI)
  .then(async () => {
    console.log('MongoDB connected');
    await Card.deleteMany(); // optional: clears existing cards
    await Card.insertMany(cards);
    console.log('Cards inserted');
    process.exit();
  })
  .catch(err => {
    console.error('Error:', err);
    process.exit(1);
  });
