import { composeWithMongoose } from 'graphql-compose-mongoose';
import Deck from '../model/deck';

const DeckTC = composeWithMongoose(Deck, {});
DeckTC.addFields({
  id: 'MongoID',
});
DeckTC.removeField('_id');

const DeckQuery = {
  decks: DeckTC.getResolver('findMany'),
  deck: DeckTC.getResolver('findById'),
  deckOne: DeckTC.getResolver('findOne'),
  deckMany: DeckTC.getResolver('findMany'),
};
const DeckMutation = {
  deckCreate: DeckTC.getResolver('createOne'),
  deckUpdate: DeckTC.getResolver('updateById'),
  deckDelete: DeckTC.getResolver('removeById'),
};

export { DeckQuery, DeckMutation };
