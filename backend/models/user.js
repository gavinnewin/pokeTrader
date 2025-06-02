const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  fullName: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  profilePic: String,
  cardCollection: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Card' }],
  activityLog: {
    type: [
      {
        message: String,
        timestamp: Date
      }
    ],
    default: []
  }
});

module.exports = mongoose.model('User', userSchema);
