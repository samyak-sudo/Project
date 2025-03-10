import characterReducer from './characterReducer';
import * as types from './characterTypes';

describe('Character Reducer', () => {
  const initialState = {
    characters: {
      info: {},
      results: [],
    },
    loading: false,
    characterDetails: {},
    error: '',
    pageNum: 1,
    search_name: ''
  };

  test('should return initial state', () => {
    expect(characterReducer(undefined, {})).toEqual(initialState);
  });

  test('should handle FETCH_CHARACTER_REQUEST', () => {
    expect(
      characterReducer(initialState, {
        type: types.FETCH_CHARACTER_REQUEST
      })
    ).toEqual({
      ...initialState,
      loading: true
    });
  });

  test('should handle FETCH_CHARACTER_SUCCESS', () => {
    const mockData = {
      info: { count: 1 },
      results: [{ id: 1, name: 'Rick' }]
    };
    expect(
      characterReducer(initialState, {
        type: types.FETCH_CHARACTER_SUCCESS,
        payload: mockData
      })
    ).toEqual({
      ...initialState,
      loading: false,
      characters: mockData,
      error: ''
    });
  });

  test('should handle FETCH_CHARACTER_FAILURE', () => {
    expect(
      characterReducer(initialState, {
        type: types.FETCH_CHARACTER_FAILURE,
        payload: 'Error message'
      })
    ).toEqual({
      ...initialState,
      loading: false,
      error: 'Error message'
    });
  });

  test('should handle FETCH_CHARACTER_DETAILS', () => {
    const mockDetails = { id: 1, name: 'Rick' };
    expect(
      characterReducer(initialState, {
        type: types.FETCH_CHARACTER_DETAILS,
        payload: mockDetails
      })
    ).toEqual({
      ...initialState,
      loading: false,
      characterDetails: mockDetails,
      error: ''
    });
  });

  test('should handle CHANGE_PAGE', () => {
    expect(
      characterReducer(initialState, {
        type: types.CHANGE_PAGE,
        payload: 2
      })
    ).toEqual({
      ...initialState,
      pageNum: 2
    });
  });

  test('should handle SEARCH_CHARACTER', () => {
    expect(
      characterReducer(initialState, {
        type: types.SEARCH_CHARACTER,
        payload: 'Rick'
      })
    ).toEqual({
      ...initialState,
      search_name: 'Rick'
    });
  });

  test('should handle RESET_PAGE', () => {
    const stateWithPage = {
      ...initialState,
      pageNum: 5
    };
    expect(
      characterReducer(stateWithPage, {
        type: types.RESET_PAGE
      })
    ).toEqual({
      ...stateWithPage,
      pageNum: 1
    });
  });
});