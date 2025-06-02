const express = require('express');
const router = express.Router();
const multer = require('multer');
const streamifier = require('streamifier');
const cloudinary = require('../config/cloudinary');
const User = require('../models/user'); // or 'User'

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
