const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Card = require('../models/Card');
const PortfolioHistory = require('../models/PortfolioHistory');


// Add to collection
router.post('/add-to-collection', async (req, res) => {
  const { email, cardId } = req.body;

  try {
    const user = await User.findOne({ email });
    const card = await Card.findById(cardId);
    if (!user || !card) return res.status(404).json({ error: 'User or card not found' });

    user.cardCollection.push(cardId);
    user.activityLog ||= [];
    user.activityLog.unshift({ message: `Added ${card.name} to collection`, timestamp: new Date() });
    user.activityLog = user.activityLog.slice(0, 10);

    await user.save();
    res.json({ message: 'Card added to collection' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to add card' });
  }
});


// Optional debug route to list all users
router.get('/users', async (req, res) => {
  try {
    const users = await User.find().select('-password');
    res.json(users);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch users' });
  }
});

// Remove from collection
router.post('/remove-from-collection', async (req, res) => {
  const { email, cardId } = req.body;

  try {
    const user = await User.findOne({ email }).populate('cardCollection');
    if (!user) return res.status(404).json({ error: 'User not found' });

    const card = user.cardCollection.find(c => c._id.toString() === cardId);
    const cardName = card ? card.name : 'Unknown card';

    user.cardCollection.pull(cardId);
    user.activityLog ||= [];
    user.activityLog.unshift({ message: `Removed ${cardName} from collection`, timestamp: new Date() });
    user.activityLog = user.activityLog.slice(0, 10);

    await user.save();
    res.json({ message: 'Card removed', updated: user });
  } catch (err) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Add to watchlist
router.post('/add-to-watchlist', async (req, res) => {
  const { email, cardId } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ error: 'User not found' });

    if (!user.watchlist.includes(cardId)) {
      user.watchlist.push(cardId);
      await user.save();
    }

    res.json({ message: 'Added to watchlist' });
  } catch (err) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Remove from watchlist
router.post('/remove-from-watchlist', async (req, res) => {
  const { email, cardId } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ error: 'User not found' });

    user.watchlist.pull(cardId);
    await user.save();

    res.json({ message: 'Removed from watchlist' });
  } catch (err) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get watchlist
router.get('/watchlist', async (req, res) => {
  const { email } = req.query;
  const user = await User.findOne({ email }).populate('watchlist');
  if (!user) return res.status(404).json({ error: 'User not found' });

  res.json(user.watchlist);
});

// Owned cards
router.get('/owned-cards', async (req, res) => {
  const email = req.query.email;
  const user = await User.findOne({ email }).populate('cardCollection');
  if (!user) return res.status(404).json({ error: 'User not found' });

  res.json(user.cardCollection);
});

// Collection count
router.get('/collection-count', async (req, res) => {
  const user = await User.findOne({ email: req.query.email });
  if (!user) return res.status(404).json({ error: 'User not found' });

  res.json({ count: user.cardCollection.length });
});

// Collection value
router.get('/collection-value', async (req, res) => {
  const user = await User.findOne({ email: req.query.email }).populate('cardCollection');
  if (!user) return res.status(404).json({ error: 'User not found' });

  const total = user.cardCollection.reduce((sum, card) => sum + (card.price || 0), 0);
  res.json({ total });
});

// Activity log
router.get('/activity', async (req, res) => {
  const { email } = req.query;
  const user = await User.findOne({ email });
  if (!user) return res.status(404).json({ error: 'User not found' });

  res.json((user.activityLog || []).slice(0, 2));
});

// Portfolio history
router.get('/portfolio-history', async (req, res) => {
  try {
    const { email, range } = req.query;
    if (!email) return res.status(400).json({ error: 'Email is required' });

    const now = new Date();
    let startDate;
    const ranges = {
      '1D': 1, '3D': 3, '7D': 7, '30D': 30, '3M': 90, '6M': 180, '1Y': 365
    };
    startDate = new Date(now - (ranges[range] || 7) * 86400000);

    const history = await PortfolioHistory.find({
      email,
      timestamp: { $gte: startDate }
    }).sort({ timestamp: 1 });

    if (history.length === 0) {
      const user = await User.findOne({ email }).populate('cardCollection');
      const total = user.cardCollection.reduce((sum, card) => sum + (card.price || 0), 0);
      const entries = [];

      for (let i = 6; i >= 0; i--) {
        const date = new Date(now - i * 86400000);
        entries.push({ email, value: total, timestamp: date });
      }

      await PortfolioHistory.insertMany(entries);
      return res.json(entries);
    }

    res.json(history);
  } catch (err) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Update portfolio value
router.post('/update-portfolio-value', async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email }).populate('cardCollection');
    if (!user) return res.status(404).json({ error: 'User not found' });

    const total = user.cardCollection.reduce((sum, card) => sum + (card.price || 0), 0);

    await PortfolioHistory.create({ email, value: total, timestamp: new Date() });

    res.json({ message: 'Portfolio value updated' });
  } catch (err) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;
