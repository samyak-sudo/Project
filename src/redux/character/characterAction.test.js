// import axios from "axios";
// import { fetchCharacterRequest } from "./characterAction"; // Import action
// import { FETCH_CHARACTER_REQUEST } from "./characterTypes";

// jest.mock("axios"); // 

// test("fetchCharacterRequest dispatches correct action", async () => {
//   axios.get.mockResolvedValue({ data: { results: [{ id: 1, name: "Rick Sanchez" }] } });

//   const action = fetchCharacterRequest(); 
//   expect(action).toEqual({ type: FETCH_CHARACTER_REQUEST }); 
// });


import axios from 'axios';
import * as actions from './characterAction';
import * as types from './characterTypes';

jest.mock('axios');

describe('Character Actions', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Synchronous Actions', () => {
    test('fetchCharacterRequest creates correct action', () => {
      expect(actions.fetchCharacterRequest()).toEqual({
        type: types.FETCH_CHARACTER_REQUEST
      });
    });

    test('fetchCharacterSuccess creates correct action', () => {
      const characters = { results: [{ id: 1, name: 'Rick' }] };
      expect(actions.fetchCharacterSuccess(characters)).toEqual({
        type: types.FETCH_CHARACTER_SUCCESS,
        payload: characters
      });
    });

    test('fetchCharacterFailure creates correct action', () => {
      const error = 'Error fetching characters';
      expect(actions.fetchCharacterFailure(error)).toEqual({
        type: types.FETCH_CHARACTER_FAILURE,
        payload: error
      });
    });

    test('ChangePage creates correct action', () => {
      expect(actions.ChangePage(2)).toEqual({
        type: types.CHANGE_PAGE,
        payload: 2
      });
    });

    test('SearchCharacter creates correct action', () => {
      expect(actions.SearchCharacter('Rick')).toEqual({
        type: types.SEARCH_CHARACTER,
        payload: 'Rick'
      });
    });

    test('resetPage creates correct action', () => {
      expect(actions.resetPage()).toEqual({
        type: types.RESET_PAGE
      });
    });
  });

  describe('Async Actions', () => {
    describe('fetchCharacters', () => {
      test('dispatches success action when API call succeeds', async () => {
        const mockData = { results: [{ id: 1, name: 'Rick' }] };
        axios.get.mockResolvedValueOnce({ data: mockData });

        const dispatch = jest.fn();
        await actions.fetchCharacters()(dispatch);

        expect(dispatch).toHaveBeenCalledWith(actions.fetchCharacterRequest());
        expect(axios.get).toHaveBeenCalledWith('https://rickandmortyapi.com/api/character');
        expect(dispatch).toHaveBeenCalledWith(actions.fetchCharacterSuccess(mockData));
      });

      test('dispatches failure action when API call fails', async () => {
        const error = new Error('Network error');
        axios.get.mockRejectedValueOnce(error);

        const dispatch = jest.fn();
        await actions.fetchCharacters()(dispatch);

        expect(dispatch).toHaveBeenCalledWith(actions.fetchCharacterRequest());
        expect(dispatch).toHaveBeenCalledWith(actions.fetchCharacterFailure(error.message));
      });
    });

    describe('fetchCharactersName', () => {
      test('dispatches success action with search parameters', async () => {
        const mockData = { results: [{ id: 1, name: 'Rick' }] };
        axios.get.mockResolvedValueOnce({ data: mockData });

        const dispatch = jest.fn();
        const searchName = 'Rick';
        const pageNum = 1;

        await actions.fetchCharactersName(searchName, pageNum)(dispatch);

        expect(dispatch).toHaveBeenCalledWith(actions.fetchCharacterRequest());
        expect(axios.get).toHaveBeenCalledWith(
          `https://rickandmortyapi.com/api/character/?name=${searchName}&page=${pageNum}`
        );
        expect(dispatch).toHaveBeenCalledWith(actions.fetchCharacterSuccess(mockData));
      });

      test('handles empty search parameters', async () => {
        const mockData = { results: [] };
        axios.get.mockResolvedValueOnce({ data: mockData });

        const dispatch = jest.fn();
        await actions.fetchCharactersName()(dispatch);

        expect(axios.get).toHaveBeenCalledWith(
          'https://rickandmortyapi.com/api/character/?name=&page=1'
        );
      });

      test('dispatches failure action on API error', async () => {
        const error = new Error('API Error');
        axios.get.mockRejectedValueOnce(error);

        const dispatch = jest.fn();
        await actions.fetchCharactersName('Rick', 1)(dispatch);

        expect(dispatch).toHaveBeenCalledWith(actions.fetchCharacterFailure(error.message));
      });
    });

    describe('fetchCharacterDetails', () => {
      test('dispatches success action with character details', async () => {
        const mockData = { id: 1, name: 'Rick' };
        axios.get.mockResolvedValueOnce({ data: mockData });

        const dispatch = jest.fn();
        const characterId = 1;

        await actions.fetchCharacterDetails(characterId)(dispatch);

        expect(dispatch).toHaveBeenCalledWith(actions.fetchCharacterRequest());
        expect(axios.get).toHaveBeenCalledWith(
          `https://rickandmortyapi.com/api/character/${characterId}`
        );
        expect(dispatch).toHaveBeenCalledWith({
          type: types.FETCH_CHARACTER_DETAILS,
          payload: mockData
        });
      });

      test('dispatches failure action when details fetch fails', async () => {
        const error = new Error('Failed to fetch character');
        axios.get.mockRejectedValueOnce(error);

        const dispatch = jest.fn();
        await actions.fetchCharacterDetails(1)(dispatch);

        expect(dispatch).toHaveBeenCalledWith(actions.fetchCharacterRequest());
        expect(dispatch).toHaveBeenCalledWith(actions.fetchCharacterFailure(error.message));
      });
    });

    describe('fetchCharactersPage', () => {
      test('dispatches success action with page results', async () => {
        const mockData = { results: [{ id: 1, name: 'Rick' }] };
        axios.get.mockResolvedValueOnce({ data: mockData });

        const dispatch = jest.fn();
        const pageNum = 2;

        await actions.fetchCharactersPage(pageNum)(dispatch);

        expect(axios.get).toHaveBeenCalledWith(
          `https://rickandmortyapi.com/api/character?page=${pageNum}`
        );
        expect(dispatch).toHaveBeenCalledWith(actions.fetchCharacterSuccess(mockData));
      });

      test('handles default page parameter', async () => {
        const mockData = { results: [] };
        axios.get.mockResolvedValueOnce({ data: mockData });

        const dispatch = jest.fn();
        await actions.fetchCharactersPage()(dispatch);

        expect(axios.get).toHaveBeenCalledWith(
          'https://rickandmortyapi.com/api/character?page=1'
        );
      });

      test('dispatches failure action on page fetch error', async () => {
        const error = new Error('Page not found');
        axios.get.mockRejectedValueOnce(error);

        const dispatch = jest.fn();
        await actions.fetchCharactersPage(1)(dispatch);

        expect(dispatch).toHaveBeenCalledWith(actions.fetchCharacterFailure(error.message));
      });
    });
  });
});