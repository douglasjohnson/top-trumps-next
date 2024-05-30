import { deleteDeck, findAll, save, update } from './DeckService';
import Http from './Http';
import PersistedDeck from '../types/PersistedDeck';
import Deck from '../types/Deck';

jest.mock('./Http');

describe('Deck Service', () => {
  const mockedHttpPost = jest.mocked(Http.post);
  afterEach(mockedHttpPost.mockClear);
  describe('findAll', () => {
    beforeEach(() => {
      mockedHttpPost.mockImplementation(() => new Promise(jest.fn()));
    });
    it('should GET all decks', () => {
      findAll();

      expect(Http.post).toHaveBeenCalledWith('/decks', {
        query: `
query {
  decks {
    id
    name
    imageUrl
    attributes {
      name
      units
    }
    cards {
      name
      description
      imageUrl
      attributes {
        type
        value
      }
    }
  }
}`,
      });
    });
    it('should resolve decks on success', async () => {
      const decks: PersistedDeck[] = [];
      mockedHttpPost.mockResolvedValue({ data: { data: { decks } } });

      await expect(findAll()).resolves.toBe(decks);
    });
    it('should reject on failure', async () => {
      mockedHttpPost.mockRejectedValue('error');

      await expect(findAll()).rejects.toMatch('error');
    });
  });
  describe('save', () => {
    let deck: Deck;
    beforeEach(() => {
      mockedHttpPost.mockImplementation(() => new Promise(jest.fn()));
      deck = {
        name: 'Deck 1',
        imageUrl: 'http://imageurl',
        attributes: [],
        cards: [],
      };
    });
    it('should POST deck', () => {
      save(deck);

      expect(Http.post).toHaveBeenCalledWith('/decks', {
        query: `
mutation ($deck: CreateOnedecksInput!) {
  deckCreate(record: $deck) {
    record {
    id
    name
    imageUrl
    attributes {
      name
      units
    }
    cards {
      name
      description
      imageUrl
      attributes {
        type
        value
      }
    }
  }
  }
}`,
        variables: {
          deck,
        },
      });
    });
    it('should resolve deck on success', async () => {
      const savedDeck = { ...deck, id: 1 };
      mockedHttpPost.mockResolvedValue({ data: { data: { deckCreate: { record: savedDeck } } } });

      await expect(save(deck)).resolves.toBe(savedDeck);
    });
    it('should reject on failure', async () => {
      mockedHttpPost.mockRejectedValue('error');

      await expect(save(deck)).rejects.toMatch('error');
    });
  });
  describe('update', () => {
    let deck: PersistedDeck;
    beforeEach(() => {
      mockedHttpPost.mockImplementation(() => new Promise(jest.fn()));
      deck = {
        id: '1',
        name: 'Deck 1',
        imageUrl: 'http://imageurl',
        attributes: [],
        cards: [],
      };
    });
    it('should PATCH deck', () => {
      update(deck);

      expect(Http.post).toHaveBeenCalledWith('/decks', {
        query: `
mutation ($id: MongoID!, $deck: UpdateByIddecksInput!) {
  deckUpdate(_id: $id, record: $deck) {
    record {
    id
    name
    imageUrl
    attributes {
      name
      units
    }
    cards {
      name
      description
      imageUrl
      attributes {
        type
        value
      }
    }
  }
  }
}`,
        variables: {
          id: deck.id,
          deck: { ...deck, id: undefined },
        },
      });
    });
    it('should resolve deck on success', async () => {
      const updatedDeck = { ...deck };
      mockedHttpPost.mockResolvedValue({ data: { data: { deckUpdate: { record: updatedDeck } } } });

      await expect(update(deck)).resolves.toBe(updatedDeck);
    });
    it('should reject on failure', async () => {
      mockedHttpPost.mockRejectedValue('error');

      await expect(update(deck)).rejects.toMatch('error');
    });
  });
  describe('delete', () => {
    let deck: PersistedDeck;
    beforeEach(() => {
      mockedHttpPost.mockImplementation(() => new Promise(jest.fn()));
      deck = {
        id: '1',
        name: 'Deck 1',
        imageUrl: 'http://imageurl',
        attributes: [],
        cards: [],
      };
    });
    it('should DELETE deck', () => {
      deleteDeck(deck);

      expect(Http.post).toHaveBeenCalledWith('/decks', {
        query: `
mutation ($id: MongoID!) {
  deckDelete(_id: $id) {
    record {
      id
    }
  }
}`,
        variables: { id: '1' },
      });
    });
    it('should resolve deck on success', async () => {
      mockedHttpPost.mockResolvedValue({});

      await expect(deleteDeck(deck)).resolves.toBe(deck);
    });
    it('should reject on failure', async () => {
      mockedHttpPost.mockRejectedValue('error');

      await expect(deleteDeck(deck)).rejects.toMatch('error');
    });
  });
});
