import { setSearchName } from './searchAction';
import { SET_SEARCH_NAME } from './searchType';

describe('Search Actions', () => {
    test('setSearchName should create action with name', () => {
        const name = 'Rick';
        const expectedAction = {
            type: SET_SEARCH_NAME,
            payload: name
        };
        expect(setSearchName(name)).toEqual(expectedAction);
    });

    test('setSearchName should handle empty string', () => {
        const name = '';
        const expectedAction = {
            type: SET_SEARCH_NAME,
            payload: name
        };
        expect(setSearchName(name)).toEqual(expectedAction);
    });

    test('setSearchName should handle null', () => {
        const name = null;
        const expectedAction = {
            type: SET_SEARCH_NAME,
            payload: name
        };
        expect(setSearchName(name)).toEqual(expectedAction);
    });

    test('setSearchName should handle undefined', () => {
        const expectedAction = {
            type: SET_SEARCH_NAME,
            payload: undefined
        };
        expect(setSearchName()).toEqual(expectedAction);
    });
}); 