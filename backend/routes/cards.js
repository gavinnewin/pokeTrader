const express = require('express');
const router = express.Router();
const Card = require('../models/Card');

// GET all cards
router.get('/', async (req, res) => {
  const cards = await Card.find();
  res.json(cards);
});

// POST a new card
router.post('/', async (req, res) => {
  const card = new Card(req.body);
  await card.save();
  res.status(201).json(card);
});

module.exports = router;
