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
    const cards = await Card.find({ name: nameQuery });

    if (!cards.length) {
      return res.status(404).json({ message: 'No matching cards found' });
    }

    res.json(cards);
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
