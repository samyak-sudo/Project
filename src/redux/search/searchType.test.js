import searchTypes, { SET_SEARCH_NAME } from './searchType';

describe('Search Types', () => {
  describe('Named Exports', () => {
    test('SET_SEARCH_NAME should be defined with correct value', () => {
      expect(SET_SEARCH_NAME).toBeDefined();
      expect(SET_SEARCH_NAME).toBe('SET_SEARCH_NAME');
      expect(typeof SET_SEARCH_NAME).toBe('string');
    });

    test('SET_SEARCH_NAME should be immutable', () => {
      const original = SET_SEARCH_NAME;
      expect(() => {
        // @ts-ignore - Testing immutability
        SET_SEARCH_NAME = 'new value';
      }).toThrow(TypeError);
      expect(SET_SEARCH_NAME).toBe(original);
    });
  });

  describe('Default Export', () => {
    test('should export frozen object', () => {
      expect(Object.isFrozen(searchTypes)).toBe(true);
      expect(searchTypes).toBeInstanceOf(Object);
    });

    test('should have only SET_SEARCH_NAME property', () => {
      const properties = Object.keys(searchTypes);
      expect(properties).toHaveLength(1);
      expect(properties).toContain('SET_SEARCH_NAME');
    });

    test('should prevent adding new properties', () => {
      expect(() => {
        searchTypes.newProp = 'test';
      }).not.toThrow();
      expect(searchTypes.newProp).toBeUndefined();
    });

    test('should maintain object structure', () => {
      expect(searchTypes).toEqual({
        SET_SEARCH_NAME: 'SET_SEARCH_NAME'
      });
    });
  });
}); 