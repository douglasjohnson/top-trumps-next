import Card from './Card';
import AttributeType from './AttributeType';

type Deck = {
  name: string;
  imageUrl: string;
  cards: Card[];
  attributes: AttributeType[];
};

export default Deck;
