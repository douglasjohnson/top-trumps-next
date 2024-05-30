import { SchemaComposer } from 'graphql-compose';
import { DeckQuery, DeckMutation } from './deck';

const schemaComposer = new SchemaComposer();
schemaComposer.Query.addFields(DeckQuery);
schemaComposer.Mutation.addFields(DeckMutation);
const schema = schemaComposer.buildSchema();
export default schema;
