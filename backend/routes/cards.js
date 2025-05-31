const express = require('express');
const router = express.Router();
const Card = require('../models/Card');

// GET all cards
router.get('/', async (req, res) => {
  const cards = await Card.find();
  res.json(cards);
});

// GET a single card by name (e.g., /api/cards/pikachu)
router.get('/:name', async (req, res) => {
  try {
    const nameQuery = new RegExp(req.params.name, 'i'); // case-insensitive partial match
    const card = await Card.findOne({ name: nameQuery });

    if (!card) {
      return res.status(404).json({ message: 'Card not found' });
    }

    res.json(card);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// POST a new card
router.post('/', async (req, res) => {
  const card = new Card(req.body);
  await card.save();
  res.status(201).json(card);
});




module.exports = router;
