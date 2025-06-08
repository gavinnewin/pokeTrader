const express = require('express');
const router = express.Router();
const multer = require('multer');
const streamifier = require('streamifier');
const cloudinary = require('../config/cloudinary');
const User = require('../models/user'); // or 'User'
const PortfolioHistory = require('../models/PortfolioHistory');

const upload = multer();

router.post('/upload-profile', upload.single('profilePic'), async (req, res) => {
  try {
    const userEmail = req.body.email;
    if (!userEmail) return res.status(400).json({ error: 'Missing email' });

    const stream = cloudinary.uploader.upload_stream(
      { folder: 'profile_pics' },
      async (err, result) => {
        if (err) {
          console.error('Cloudinary error:', err);
          return res.status(500).json({ error: 'Upload failed' });
        }

        try {
          const updatedUser = await User.findOneAndUpdate(
            { email: userEmail },                        // ✅ find by email
            { profilePic: result.secure_url },
            { new: true }
          );

          if (!updatedUser) {
            return res.status(404).json({ error: 'User not found' });
          }

          res.json({ message: 'Uploaded successfully', url: result.secure_url });
        } catch (mongoErr) {
          console.error('MongoDB update error:', mongoErr);
          res.status(500).json({ error: 'Database update failed' });
        }
      }
    );

    streamifier.createReadStream(req.file.buffer).pipe(stream);
  } catch (err) {
    console.error('Server error:', err);
    res.status(500).json({ error: 'Server error' });
  }
});


router.post('/add-to-collection', async (req, res) => {
  const { email, cardId } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ error: 'User not found' });

    const card = await Card.findById(cardId);
    if (!card) return res.status(404).json({ error: 'Card not found' });

    user.cardCollection.push(cardId);
    
    if (!Array.isArray(user.activityLog)) {
    user.activityLog = [];
    }
    user.activityLog.unshift({
      message: `Added ${card.name} to collection`,
      timestamp: new Date()
    });

    user.activityLog = user.activityLog.slice(0, 10); // keep last 10
    await user.save();

    res.json({ message: 'Card added to collection' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to add card' });
  }
});


router.get('/collection-count', async (req, res) => {
  try {
    const user = await User.findOne({ email: req.query.email });
    if (!user) return res.status(404).json({ error: 'User not found' });

    const count = user.cardCollection.length;
    res.json({ count });
  } catch (err) {
    res.status(500).json({ error: 'Failed to count collection' });
  }
});


const Card = require('../models/Card'); // make sure it's imported

router.get('/collection-value', async (req, res) => {
  try {
    const user = await User.findOne({ email: req.query.email }).populate('cardCollection');
    if (!user) return res.status(404).json({ error: 'User not found' });

    const total = user.cardCollection.reduce((sum, card) => sum + (card.price || 0), 0);
    res.json({ total });
  } catch (err) {
    console.error('Failed to compute collection value:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.get('/portfolio-history', async (req, res) => {
  try {
    const { email, range } = req.query;
    if (!email) return res.status(400).json({ error: 'Email is required' });

    const now = new Date();
    let startDate;

    // Calculate start date based on range
    switch (range) {
      case '1D':
        startDate = new Date(now - 24 * 60 * 60 * 1000);
        break;
      case '3D':
        startDate = new Date(now - 3 * 24 * 60 * 60 * 1000);
        break;
      case '7D':
        startDate = new Date(now - 7 * 24 * 60 * 60 * 1000);
        break;
      case '30D':
        startDate = new Date(now - 30 * 24 * 60 * 60 * 1000);
        break;
      case '3M':
        startDate = new Date(now - 90 * 24 * 60 * 60 * 1000);
        break;
      case '6M':
        startDate = new Date(now - 180 * 24 * 60 * 60 * 1000);
        break;
      case '1Y':
        startDate = new Date(now - 365 * 24 * 60 * 60 * 1000);
        break;
      default:
        startDate = new Date(now - 7 * 24 * 60 * 60 * 1000); // Default to 7D
    }

    const history = await PortfolioHistory.find({
      email,
      timestamp: { $gte: startDate }
    }).sort({ timestamp: 1 });

    // If no history exists, create initial entries
    if (history.length === 0) {
      const user = await User.findOne({ email }).populate('cardCollection');
      if (!user) return res.status(404).json({ error: 'User not found' });

      const total = user.cardCollection.reduce((sum, card) => sum + (card.price || 0), 0);
      
      // Create entries for the past week
      const entries = [];
      for (let i = 6; i >= 0; i--) {
        const date = new Date(now - i * 24 * 60 * 60 * 1000);
        entries.push({
          email,
          value: total,
          timestamp: date
        });
      }
      
      await PortfolioHistory.insertMany(entries);
      return res.json(entries);
    }

    res.json(history);
  } catch (err) {
    console.error('Failed to fetch portfolio history:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.post('/update-portfolio-value', async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email }).populate('cardCollection');
    if (!user) return res.status(404).json({ error: 'User not found' });

    const total = user.cardCollection.reduce((sum, card) => sum + (card.price || 0), 0);
    
    await PortfolioHistory.create({
      email,
      value: total,
      timestamp: new Date()
    });

    res.json({ message: 'Portfolio value updated' });
  } catch (err) {
    console.error('Failed to update portfolio value:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.post('/remove-from-collection', async (req, res) => {
  const { email, cardId } = req.body;

  try {
    const user = await User.findOne({ email }).populate('cardCollection');

    if (!user) return res.status(404).json({ error: 'User not found' });

    // Get card name from populated collection
    const card = user.cardCollection.find(c => c._id.toString() === cardId);
    const cardName = card ? card.name : 'Unknown card';

    // Remove card from collection
    user.cardCollection.pull(cardId);

    // Log activity
    if (!Array.isArray(user.activityLog)) {
    user.activityLog = [];
    }
    user.activityLog.unshift({
    message: `Removed ${cardName} from collection`,
    timestamp: new Date()
    });


    // Keep only last 10 logs
    user.activityLog = user.activityLog.slice(0, 10);

    await user.save();

    res.json({ message: 'Card removed', updated: user });
  } catch (err) {
    console.error('Failed to remove card:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.get('/owned-cards', async (req, res) => {
  const email = req.query.email;
  const user = await User.findOne({ email }).populate('cardCollection');
  if (!user) return res.status(404).json({ error: 'User not found' });

  res.json(user.cardCollection);
});

router.get('/activity', async (req, res) => {
  try {
    const { email } = req.query;
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ error: 'User not found' });

    const log = user.activityLog || []; // fallback if undefined
    res.json(log.slice(0, 2));
  } catch (err) {
    console.error('Activity fetch error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});


module.exports = router;
