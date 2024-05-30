import Attribute from './Attribute';

type Card = {
  name: string;
  description: string;
  imageUrl: string;
  attributes: Attribute[];
};
export default Card;
