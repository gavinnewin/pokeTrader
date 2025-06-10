const mongoose = require('mongoose');

const portfolioHistorySchema = new mongoose.Schema({
  email: {
    type: String,
    required: true
  },
  value: {
    type: Number,
    required: true
  },
  timestamp: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('PortfolioHistory', portfolioHistorySchema); 