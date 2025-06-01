const express = require('express');
const router = express.Router();
const multer = require('multer');
const streamifier = require('streamifier');
const cloudinary = require('../config/cloudinary');
const User = require('../models/user'); // or 'User'

const upload = multer();

router.post('/upload-profile', upload.single('profilePic'), async (req, res) => {
  try {
    const stream = cloudinary.uploader.upload_stream(
      { folder: 'profile_pics' },
      async (err, result) => {
        if (err) return res.status(500).json({ error: 'Upload failed' });

        await User.findOneAndUpdate(
          { username: req.body.email }, // or email depending on your schema
          { profilePic: result.secure_url }
        );

        res.json({ message: 'Uploaded successfully', url: result.secure_url });
      }
    );
    streamifier.createReadStream(req.file.buffer).pipe(stream);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
