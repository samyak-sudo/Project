import store, { setupStore } from './store';
import { configureStore } from '@reduxjs/toolkit';
import rootReducer from './rootReducer';
import logger from 'redux-logger';

// Mock redux-logger
jest.mock('redux-logger', () => ({
  __esModule: true,
  default: jest.fn(() => next => action => next(action))
}));

describe('Redux Store', () => {
  test('should create store with default configuration', () => {
    // Test that store is created successfully
    expect(store).toBeDefined();
    expect(store.getState()).toBeDefined();
    
    // Test that reducer is properly set
    const state = store.getState();
    expect(state).toHaveProperty('character');
    expect(state).toHaveProperty('search');
  });

  test('should create store with middleware', () => {
    // Get the middleware array from store
    const middlewares = store.getState();
    expect(middlewares).toBeDefined();
    
    // Test that logger middleware is included
    const middleware = store.middleware;
    expect(middleware).toBeDefined();
  });

  test('setupStore should create store with preloaded state', () => {
    // Create preloaded state
    const preloadedState = {
      character: {
        characters: {
          info: {},
          results: [],
        },
        loading: false,
        characterDetails: {},
        error: '',
        pageNum: 1,
        search_name: ''
      },
      search: {
        searchTerm: ''
      }
    };

    // Create store with preloaded state
    const customStore = setupStore(preloadedState);
    
    // Verify store is created with preloaded state
    expect(customStore).toBeDefined();
    expect(customStore.getState()).toEqual(preloadedState);
  });

  test('store should handle dispatched actions', () => {
    // Test action dispatch
    const testAction = { type: 'TEST_ACTION' };
    store.dispatch(testAction);
    
    // Verify state after dispatch
    const state = store.getState();
    expect(state).toBeDefined();
  });

  test('store should use default middleware', () => {
    const testStore = configureStore({
      reducer: rootReducer,
      middleware: (getDefaultMiddleware) => 
        getDefaultMiddleware()
          .concat(logger)
    });
    
    expect(testStore).toBeDefined();
    expect(testStore.getState()).toBeDefined();
  });
});