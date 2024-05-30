import mongoose from 'mongoose';

const DeckSchema = new mongoose.Schema(
  {
    name: String,
    imageUrl: String,
    attributes: [
      {
        name: String,
        units: String,
      },
    ],
    cards: [
      {
        name: String,
        description: String,
        imageUrl: String,
        attributes: [
          {
            type: String,
            value: Number,
          },
        ],
      },
    ],
  },
  { typeKey: '$type' },
);
const Deck = mongoose.models.decks || mongoose.model('decks', DeckSchema);
export default Deck;
