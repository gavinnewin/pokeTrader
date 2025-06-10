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


router.get('/owned-cards', async (req, res) => {
  const { email } = req.query;

  console.log('➡️ Getting owned cards for:', email);

  try {
    const user = await User.findOne({ email }).populate('cardCollection.card');
    if (!user) {
      console.warn('⚠️ User not found:', email);
      return res.status(404).json({ error: 'User not found' });
    }

    console.log('✅ User found:', user.fullName, '- cardCollection length:', user.cardCollection.length);

    // Optional: log first few entries
    console.log('🧪 Sample entry:', user.cardCollection[0]);

    const cards = user.cardCollection.map(entry => {
      if (!entry.card) throw new Error(`Null card in entry: ${JSON.stringify(entry)}`);
      return {
        ...entry.card.toObject(),
        qty: entry.qty
      };
    });

    console.log('✅ Cards mapped:', cards.length);
    res.json(cards);

  } catch (err) {
    console.error('❌ Failed to get owned cards:', err.message);
    console.error(err.stack);
    res.status(500).json({ error: 'Failed to retrieve owned cards', details: err.message });
  }
});



router.post('/remove-from-collection', async (req, res) => {
  const { email, cardId, quantity = 1 } = req.body;

  try {
    const user = await User.findOne({ email }).populate('cardCollection.card');
    if (!user) return res.status(404).json({ error: 'User not found' });

    const entry = user.cardCollection.find(c => c.card._id.toString() === cardId);
    if (!entry) return res.status(404).json({ error: 'Card not found in collection' });

    const cardName = entry.card.name;

    if (entry.qty > quantity) {
      entry.qty -= quantity;
    } else {
      user.cardCollection = user.cardCollection.filter(c => c.card._id.toString() !== cardId);
    }

    user.activityLog ||= [];
    user.activityLog.unshift({ 
      message: `Removed ${Math.min(quantity, entry.qty)}x ${cardName} from collection`, 
      timestamp: new Date() 
    });
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
    const days = ranges[range] || 7;
    startDate = new Date(now - days * 86400000);

    console.log('Fetching portfolio history for:', email);
    console.log('Date range:', { startDate, now, days });

    const history = await PortfolioHistory.find({
      email,
      timestamp: { $gte: startDate }
    }).sort({ timestamp: 1 });

    console.log('Found history entries:', history.length);

    if (history.length === 0) {
      console.log('No history found, creating initial entries');
      const user = await User.findOne({ email }).populate('cardCollection.card');
      
      // Calculate total value of collection
      const total = user.cardCollection.reduce((sum, entry) => {
        if (!entry.card) {
          console.log('Warning: Card not found for entry:', entry);
          return sum;
        }
        const cardValue = parseFloat(entry.card.price) || 0;
        const quantity = parseInt(entry.qty) || 1;
        const entryValue = cardValue * quantity;
        console.log('Card value calculation:', {
          name: entry.card.name,
          price: cardValue,
          qty: quantity,
          entryValue
        });
        return sum + entryValue;
      }, 0);

      console.log('Total collection value:', total);

      const entries = [];
      // Create appropriate number of data points based on range
      const numPoints = Math.min(days, 30); // Cap at 30 points for performance
      const interval = days / numPoints;

      for (let i = numPoints; i >= 0; i--) {
        const date = new Date(now - i * interval * 86400000);
        entries.push({ email, value: total, timestamp: date });
      }

      await PortfolioHistory.insertMany(entries);
      console.log('Created initial entries:', entries);
      return res.json(entries);
    }

    // If we have history entries, ensure we have enough data points
    if (history.length < 2) {
      // If we only have one entry, duplicate it for the start date
      const firstEntry = history[0];
      const newEntry = new PortfolioHistory({
        email,
        value: firstEntry.value,
        timestamp: startDate
      });
      await newEntry.save();
      history.unshift(newEntry);
    }

    console.log('Sending history:', history);
    res.json(history);
  } catch (err) {
    console.error('Error in portfolio history:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Update portfolio value
router.post('/update-portfolio-value', async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email }).populate('cardCollection.card');
    if (!user) return res.status(404).json({ error: 'User not found' });

    // Calculate total value of collection
    const total = user.cardCollection.reduce((sum, entry) => {
      if (!entry.card) {
        console.log('Warning: Card not found for entry:', entry);
        return sum;
      }
      const cardValue = parseFloat(entry.card.price) || 0;
      const quantity = parseInt(entry.qty) || 1;
      const entryValue = cardValue * quantity;
      console.log('Card value calculation:', {
        name: entry.card.name,
        price: cardValue,
        qty: quantity,
        entryValue
      });
      return sum + entryValue;
    }, 0);

    console.log('Total collection value:', total);

    // Create new history entry
    const historyEntry = new PortfolioHistory({
      email,
      value: total,
      timestamp: new Date()
    });

    await historyEntry.save();
    console.log('Created new history entry:', historyEntry);

    res.json({ message: 'Portfolio value updated', value: total });
  } catch (err) {
    console.error('Error updating portfolio value:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;
