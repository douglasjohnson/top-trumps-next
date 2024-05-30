import Deck from './Deck';

type PersistedDeck = {
  id: string;
} & Deck;

export default PersistedDeck;
