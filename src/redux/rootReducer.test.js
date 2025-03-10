import rootReducer from './rootReducer';
import characterReducer from './character/characterReducer';
import searchReducer from './search/searchReducer';

describe('rootReducer', () => {
    test('should return the initial state', () => {
        const expectedState = {
            character: characterReducer(undefined, {}),
            search: searchReducer(undefined, {})
        };
        
        expect(rootReducer(undefined, {})).toEqual(expectedState);
    });

    test('should handle actions for both reducers', () => {
        const initialState = {
            character: characterReducer(undefined, {}),
            search: searchReducer(undefined, {})
        };

        const action = { type: 'TEST_ACTION' };
        const newState = rootReducer(initialState, action);

        expect(newState).toHaveProperty('character');
        expect(newState).toHaveProperty('search');
    });
});