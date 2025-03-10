import searchReducer from './searchReducer';
import { SET_SEARCH_NAME } from './searchType';

describe('Search Reducer', () => {
  const initialState = {
    searchName: "",
  };

  test('should return initial state', () => {
    expect(searchReducer(undefined, {})).toEqual(initialState);
  });

  test('should handle SET_SEARCH_NAME', () => {
    expect(
      searchReducer(initialState, {
        type: SET_SEARCH_NAME,
        payload: 'Rick'
      })
    ).toEqual({
      searchName: 'Rick'
    });
  });
});