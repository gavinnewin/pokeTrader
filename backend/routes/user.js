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




module.exports = router;
