const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Card = require('../models/Card');
const PortfolioHistory = require('../models/PortfolioHistory');


router.post('/add-to-collection', async (req, res) => {
  const { email, cardId, quantity = 1 } = req.body;

  try {
    const user = await User.findOne({ email });
    const card = await Card.findById(cardId);
    if (!user || !card) return res.status(404).json({ error: 'User or card not found' });

    // Check if the card already exists in collection
    const existing = user.cardCollection.find(entry => entry.card.toString() === cardId);

    if (existing) {
      existing.qty += quantity;
    } else {
      user.cardCollection.push({ card: cardId, qty: quantity });
    }

    user.activityLog ||= [];
    user.activityLog.unshift({ message: `Added ${quantity}x ${card.name} to collection`, timestamp: new Date() });
    user.activityLog = user.activityLog.slice(0, 10);

    await user.save();
    res.json({ message: 'Card added to collection' });
  } catch (err) {
    console.error(err);
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


// Get cards owned by a user
router.get('/owned-cards', async (req, res) => {
  const { email } = req.query;

  try {
    const user = await User.findOne({ email }).populate('cardCollection.card');
    if (!user) return res.status(404).json({ error: 'User not found' });

    // Flatten cardCollection for frontend
    const cards = user.cardCollection.map(entry => ({
      ...entry.card.toObject(),
      qty: entry.qty
    }));

    res.json(cards);
  } catch (err) {
    console.error('Failed to get owned cards:', err);
    res.status(500).json({ error: 'Failed to retrieve owned cards' });
  }
});

router.post('/remove-from-collection', async (req, res) => {
  const { email, cardId } = req.body;

  try {
    const user = await User.findOne({ email }).populate('cardCollection.card');
    if (!user) return res.status(404).json({ error: 'User not found' });

    const entry = user.cardCollection.find(c => c.card._id.toString() === cardId);
    if (!entry) return res.status(404).json({ error: 'Card not found in collection' });

    const cardName = entry.card.name;

    // Decrease qty or remove
    if (entry.qty > 1) {
      entry.qty -= 1;
    } else {
      user.cardCollection = user.cardCollection.filter(c => c.card._id.toString() !== cardId);
    }

    user.activityLog ||= [];
    user.activityLog.unshift({ message: `Removed 1x ${cardName} from collection`, timestamp: new Date() });
    user.activityLog = user.activityLog.slice(0, 10);

    await user.save();
    res.json({ message: 'Card updated', updated: user });
  } catch (err) {
    console.error(err);
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
