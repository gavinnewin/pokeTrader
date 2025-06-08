const mongoose = require('mongoose');
const axios = require('axios');
require('dotenv').config();
const Card = require('./models/Card');

const API_KEY = process.env.POKEMON_API_KEY;

const fetchCards = async () => {
  const res = await axios.get('https://api.pokemontcg.io/v2/cards?pageSize=50', {
    headers: { 'X-Api-Key': API_KEY }
  });

  return res.data.data
    .filter(card => card.tcgplayer?.url && card.tcgplayer?.prices?.holofoil?.market)
    .map(card => {
      // Get the full card number (e.g., "1/132" or "H1/132")
      const fullNumber = card.number || '';
      
      return {
        name: card.name,
        image: card.images?.large || card.images?.small,
        price: parseFloat(card.tcgplayer.prices.holofoil.market.toFixed(2)),
        subtitle: card.set.name,
        tcgplayerUrl: card.tcgplayer.url,
        rarity: card.rarity || 'Unknown',
        number: fullNumber,
        printedTotal: card.set?.printedTotal || 0,
      };
    });
};

const seed = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    const cards = await fetchCards();
    await Card.deleteMany();
    await Card.insertMany(cards);
    console.log('✅ Seeded 50 cards with extended info');
    process.exit();
  } catch (err) {
    console.error('❌ Error seeding:', err);
    process.exit(1);
  }
};

seed();
