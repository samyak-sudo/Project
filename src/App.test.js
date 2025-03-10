import React from 'react';
import { render, screen, fireEvent, act } from '@testing-library/react';
import { Provider } from 'react-redux';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import configureStore from 'redux-mock-store';
import App, { Home } from './App';
import { renderWithProviders } from "./test-utils";

// Mock Redux module
jest.mock('./redux', () => ({
  fetchCharactersName: jest.fn((searchName, pageNum) => ({ 
    type: 'FETCH_CHARACTERS_REQUEST', 
    payload: { searchName, pageNum } 
  })),
  setSearchName: jest.fn((name) => ({ 
    type: 'SET_SEARCH_NAME', 
    payload: name 
  }))
}));

// Now import the mocked module
import { fetchCharactersName, setSearchName } from './redux';

// Mock all components
jest.mock('./Components/Search/Search', () => {
  const Search = () => <div data-testid="search-component">Search Component</div>;
  return Search;
});

jest.mock('./Components/Cards/Cards', () => {
  const Cards = () => <div data-testid="cards-component">Cards Component</div>;
  return Cards;
});

jest.mock('./Components/Pagination/Pagination', () => {
  const Pagination = () => <div data-testid="pagination-component">Pagination Component</div>;
  return Pagination;
});

jest.mock('./Components/Cards/CardDetails', () => {
  const CardDetails = () => <div data-testid="card-details-component">Card Details Component</div>;
  return CardDetails;
});

jest.mock('./Pages/Episodes', () => {
  const Episodes = () => <div data-testid="episodes-component">Episodes Component</div>;
  return Episodes;
});

jest.mock('./Pages/Location', () => {
  const Location = () => <div data-testid="location-component">Location Component</div>;
  return Location;
});

// Create a mock store
const mockStore = configureStore([]);

describe('App Component', () => {
  const mockStore = {
    character: {
      characters: { results: [] },
      loading: false,
      error: null,
      pageNum: 1
    },
    search: { searchName: '' }
  };

  beforeEach(() => {
    jest.clearAllMocks();
    console.error = jest.fn();
  });

  test('renders main app structure', () => {
    renderWithProviders(
      <MemoryRouter>
        <App />
      </MemoryRouter>,
      { preloadedState: mockStore }
    );
    expect(screen.getByTestId('search-component')).toBeInTheDocument();
    expect(screen.getByText('Characters')).toBeInTheDocument();
  });

  test('renders loading state', () => {
    renderWithProviders(
      <MemoryRouter>
        <App />
      </MemoryRouter>,
      {
        preloadedState: {
          ...mockStore,
          character: { ...mockStore.character, loading: true }
        }
      }
    );
    expect(screen.getByText('Loading...')).toBeInTheDocument();
  });

  test('renders error state', () => {
    renderWithProviders(
      <MemoryRouter>
        <App />
      </MemoryRouter>,
      {
        preloadedState: {
          ...mockStore,
          character: { ...mockStore.character, error: 'Test error' }
        }
      }
    );
    expect(screen.getByText('Error: Test error')).toBeInTheDocument();
  });

  test('renders success state', () => {
    renderWithProviders(
      <MemoryRouter>
        <App />
      </MemoryRouter>,
      {
        preloadedState: {
          ...mockStore,
          character: {
            ...mockStore.character,
            characters: { results: [{ id: 1, name: 'Rick' }] }
          }
        }
      }
    );
    expect(screen.getByTestId('cards-component')).toBeInTheDocument();
    expect(screen.getByTestId('pagination-component')).toBeInTheDocument();
  });

  test('renders different routes', () => {
    const routes = [
      { path: '/episodes', testId: 'episodes-component' },
      { path: '/location', testId: 'location-component' },
      { path: '/1', testId: 'card-details-component' },
      { path: '/episodes/1', testId: 'card-details-component' },
      { path: '/location/1', testId: 'card-details-component' }
    ];

    routes.forEach(({ path, testId }) => {
      const { unmount } = renderWithProviders(
        <MemoryRouter initialEntries={[path]}>
          <App />
        </MemoryRouter>,
        { preloadedState: mockStore }
      );
      expect(screen.getByTestId(testId)).toBeInTheDocument();
      unmount();
    });
  });

  test('dispatches fetchCharactersName', () => {
    const { fetchCharactersName } = require('./redux');
    renderWithProviders(
      <MemoryRouter>
        <App />
      </MemoryRouter>,
      {
        preloadedState: {
          ...mockStore,
          search: { searchName: 'rick' },
          character: { ...mockStore.character, pageNum: 2 }
        }
      }
    );
    expect(fetchCharactersName).toHaveBeenCalledWith('rick', 2);
  });

  test('renders network error state', () => {
    renderWithProviders(
      <MemoryRouter>
        <App />
      </MemoryRouter>,
      {
        preloadedState: {
          character: {
            loading: false,
            error: 'NETWORK_ERROR',
            characters: null,
            pageNum: 1
          },
          search: { searchName: '' }
        }
      }
    );
    expect(screen.getByTestId('network-error')).toBeInTheDocument();
  });

  test('renders 404 page for invalid route', () => {
    renderWithProviders(
      <MemoryRouter initialEntries={['/invalid-route']}>
        <App />
      </MemoryRouter>
    );
    expect(screen.getByTestId('not-found')).toBeInTheDocument();
  });

  test('handles different error types', () => {
    const errorTypes = ['NETWORK_ERROR', 'API_ERROR', 'OTHER_ERROR'];
    
    errorTypes.forEach(errorType => {
      const { unmount } = renderWithProviders(
        <MemoryRouter>
          <App />
        </MemoryRouter>,
        {
          preloadedState: {
            character: {
              loading: false,
              error: errorType,
              characters: null,
              pageNum: 1
            },
            search: { searchName: '' }
          }
        }
      );

      if (errorType === 'NETWORK_ERROR') {
        expect(screen.getByTestId('network-error')).toBeInTheDocument();
      } else {
        expect(screen.getByTestId('app-container')).toBeInTheDocument();
      }

      unmount();
    });
  });

  test('handles all route combinations', () => {
    const routes = [
      '/',
      '/123',
      '/episodes',
      '/episodes/123',
      '/location',
      '/location/123',
      '/invalid-route'
    ];

    routes.forEach(route => {
      const { unmount } = renderWithProviders(
        <MemoryRouter initialEntries={[route]}>
          <App />
        </MemoryRouter>
      );

      if (route === '/invalid-route') {
        expect(screen.getByTestId('not-found')).toBeInTheDocument();
      } else {
        expect(screen.getByTestId('app-container')).toBeInTheDocument();
      }

      unmount();
    });
  });
});

describe('Home Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    console.error = jest.fn();
  });

  test('renders loading state', () => {
    const { store } = renderWithProviders(<Home />, {
      initialState: {
        search: { searchName: 'Rick' },
        character: {
          characters: {},
          loading: true,
          error: null,
          pageNum: 1
        }
      }
    });
    
    expect(screen.getByText('Loading...')).toBeInTheDocument();
    expect(fetchCharactersName).toHaveBeenCalledWith('Rick', 1);
    expect(fetchCharactersName).toHaveBeenCalledTimes(1);
  });
  
  test('renders error state', () => {
    renderWithProviders(<Home />, {
      initialState: {
        search: { searchName: 'Rick' },
        character: {
          characters: {},
          loading: false,
          error: 'Failed to fetch characters',
          pageNum: 1
        }
      }
    });
    
    expect(screen.getByText('Error: Failed to fetch characters')).toBeInTheDocument();
    expect(fetchCharactersName).toHaveBeenCalledWith('Rick', 1);
    expect(fetchCharactersName).toHaveBeenCalledTimes(1);
  });
  
  test('renders character results', () => {
    const mockCharacters = {
      results: [
        { id: 1, name: 'Rick Sanchez' },
        { id: 2, name: 'Morty Smith' }
      ],
      info: { pages: 3 }
    };
    
    renderWithProviders(<Home />, {
      initialState: {
        search: { searchName: 'Rick' },
        character: {
          characters: mockCharacters,
          loading: false,
          error: null,
          pageNum: 1
        }
      }
    });
    
    expect(screen.getByTestId('cards-component')).toBeInTheDocument();
    expect(screen.getByTestId('pagination-component')).toBeInTheDocument();
    expect(console.log).toHaveBeenCalledWith('Characters:', mockCharacters.results);
    expect(fetchCharactersName).toHaveBeenCalledWith('Rick', 1);
    expect(fetchCharactersName).toHaveBeenCalledTimes(1);
  });

  test('fetches characters data with correct parameters', () => {
    const { store } = renderWithProviders(<Home />, {
      initialState: {
        search: { searchName: 'Beth' },
        character: {
          characters: { results: [] },
          loading: false,
          error: null,
          pageNum: 3
        }
      }
    });
    
    expect(fetchCharactersName).toHaveBeenCalledWith('Beth', 3);
    expect(fetchCharactersName).toHaveBeenCalledTimes(1);
  });
  
  test('re-fetches characters when searchName changes', () => {
    const initialState = {
      search: { searchName: 'Rick' },
      character: {
        characters: { results: [] },
        loading: false,
        error: null,
        pageNum: 1
      }
    };
    
    const { store, rerender } = renderWithProviders(<Home />, { initialState });
    
    expect(fetchCharactersName).toHaveBeenCalledWith('Rick', 1);
    
    // Clear mock calls from initial render
    fetchCharactersName.mockClear();
    
    // Update search name and rerender
    const newState = {
      ...initialState,
      search: { searchName: 'Morty' }
    };
    
    rerender(
      <Provider store={mockStore(newState)}>
        <MemoryRouter>
          <Home />
        </MemoryRouter>
      </Provider>
    );
    
    expect(fetchCharactersName).toHaveBeenCalledWith('Morty', 1);
    expect(fetchCharactersName).toHaveBeenCalledTimes(1);
  });
  
  test('re-fetches characters when pageNum changes', () => {
    const initialState = {
      search: { searchName: 'Rick' },
      character: {
        characters: { results: [] },
        loading: false,
        error: null,
        pageNum: 1
      }
    };
    
    const { rerender } = renderWithProviders(<Home />, { initialState });
    
    expect(fetchCharactersName).toHaveBeenCalledWith('Rick', 1);
    
    // Clear mock calls from initial render
    fetchCharactersName.mockClear();
    
    // Update page number and rerender
    const newState = {
      ...initialState,
      character: {
        ...initialState.character,
        pageNum: 2
      }
    };
    
    rerender(
      <Provider store={mockStore(newState)}>
        <MemoryRouter>
          <Home />
        </MemoryRouter>
      </Provider>
    );
    
    expect(fetchCharactersName).toHaveBeenCalledWith('Rick', 2);
    expect(fetchCharactersName).toHaveBeenCalledTimes(1);
  });
  
  test('handles case when characters.results is undefined', () => {
    renderWithProviders(<Home />, {
      initialState: {
        search: { searchName: 'NonExistentCharacter' },
        character: {
          characters: {}, // No results property
          loading: false,
          error: null,
          pageNum: 1
        }
      }
    });
    
    expect(screen.getByTestId('cards-component')).toBeInTheDocument();
    expect(screen.getByTestId('pagination-component')).toBeInTheDocument();
    expect(console.log).toHaveBeenCalledWith('Characters:', undefined);
  });
  
  test('ensures Cards component receives correct props', () => {
    const mockCharacters = {
      results: [
        { id: 1, name: 'Rick Sanchez' },
        { id: 2, name: 'Morty Smith' }
      ]
    };
    
    renderWithProviders(<Home />, {
      initialState: {
        search: { searchName: 'Rick' },
        character: {
          characters: mockCharacters,
          loading: false,
          error: null,
          pageNum: 1
        }
      }
    });
    
    const cardsComponent = screen.getByTestId('cards-component');
    expect(cardsComponent).toHaveAttribute('data-page', '/');
  });
  
  test('ensures proper dependency array for useEffect', () => {
    const initialState = {
      search: { searchName: 'Rick' },
      character: {
        characters: { results: [] },
        loading: false,
        error: null,
        pageNum: 1
      }
    };
    
    const { rerender } = renderWithProviders(<Home />, { initialState });
    fetchCharactersName.mockClear();
    
    // Rerender with same props should not trigger useEffect
    rerender(
      <Provider store={mockStore(initialState)}>
        <MemoryRouter>
          <Home />
        </MemoryRouter>
      </Provider>
    );
    
    expect(fetchCharactersName).not.toHaveBeenCalled();
    
    // Change both searchName and pageNum - should trigger useEffect once
    fetchCharactersName.mockClear();
    
    const newState = {
      search: { searchName: 'Summer' },
      character: {
        characters: { results: [] },
        loading: false,
        error: null,
        pageNum: 3
      }
    };
    
    rerender(
      <Provider store={mockStore(newState)}>
        <MemoryRouter>
          <Home />
        </MemoryRouter>
      </Provider>
    );
    
    expect(fetchCharactersName).toHaveBeenCalledWith('Summer', 3);
    expect(fetchCharactersName).toHaveBeenCalledTimes(1);
  });

  test('handles undefined searchName', () => {
    renderWithProviders(<Home />, {
      initialState: {
        search: { searchName: undefined },
        character: {
          characters: { results: [] },
          loading: false,
          error: null,
          pageNum: 1
        }
      }
    });
    expect(fetchCharactersName).not.toHaveBeenCalled();
  });

  test('handles invalid pageNum', () => {
    renderWithProviders(<Home />, {
      initialState: {
        search: { searchName: 'rick' },
        character: {
          characters: { results: [] },
          loading: false,
          error: null,
          pageNum: 0
        }
      }
    });
    expect(fetchCharactersName).not.toHaveBeenCalled();
  });

  test('handles missing characters data', () => {
    renderWithProviders(<Home />, {
      initialState: {
        search: { searchName: '' },
        character: {
          characters: null,
          loading: false,
          error: null,
          pageNum: 1
        }
      }
    });
    expect(screen.getByTestId('no-data')).toBeInTheDocument();
  });

  test('handles dispatch error', () => {
    const mockError = new Error('Dispatch failed');
    const { fetchCharactersName } = require('./redux');
    fetchCharactersName.mockImplementation(() => {
      throw mockError;
    });

    renderWithProviders(<Home />, {
      initialState: {
        search: { searchName: 'rick' },
        character: {
          characters: { results: [] },
          loading: false,
          error: null,
          pageNum: 1
        }
      }
    });

    expect(console.error).toHaveBeenCalledWith('Error fetching characters:', mockError);
  });

  test('conditionally renders pagination', () => {
    const { rerender } = renderWithProviders(<Home />, {
      initialState: {
        search: { searchName: '' },
        character: {
          characters: { results: [] },
          loading: false,
          error: null,
          pageNum: 1
        }
      }
    });
    expect(screen.queryByTestId('pagination-component')).not.toBeInTheDocument();

    rerender(
      <Home />,
      {
        initialState: {
          search: { searchName: '' },
          character: {
            characters: { results: [{ id: 1 }] },
            loading: false,
            error: null,
            pageNum: 1
          }
        }
      }
    );
    expect(screen.getByTestId('pagination-component')).toBeInTheDocument();
  });

  test('handles null characters state', () => {
    renderWithProviders(<Home />, {
      initialState: {
        search: { searchName: '' },
        character: {
          characters: null,
          loading: false,
          error: null,
          pageNum: 1
        }
      }
    });
    expect(screen.getByTestId('no-data')).toBeInTheDocument();
  });

  test('handles undefined characters state', () => {
    renderWithProviders(<Home />, {
      initialState: {
        search: { searchName: '' },
        character: {
          characters: undefined,
          loading: false,
          error: null,
          pageNum: 1
        }
      }
    });
    expect(screen.getByTestId('no-data')).toBeInTheDocument();
  });

  test('handles null results in characters', () => {
    renderWithProviders(<Home />, {
      initialState: {
        search: { searchName: '' },
        character: {
          characters: { results: null },
          loading: false,
          error: null,
          pageNum: 1
        }
      }
    });
    expect(screen.getByTestId('no-data')).toBeInTheDocument();
  });

  test('handles empty results array', () => {
    renderWithProviders(<Home />, {
      initialState: {
        search: { searchName: '' },
        character: {
          characters: { results: [] },
          loading: false,
          error: null,
          pageNum: 1
        }
      }
    });
    expect(screen.queryByTestId('pagination-component')).not.toBeInTheDocument();
  });

  test('handles non-empty results array', () => {
    renderWithProviders(<Home />, {
      initialState: {
        search: { searchName: '' },
        character: {
          characters: { results: [{ id: 1 }] },
          loading: false,
          error: null,
          pageNum: 1
        }
      }
    });
    expect(screen.getByTestId('pagination-component')).toBeInTheDocument();
  });

  test('handles error in fetchCharactersName', () => {
    const mockError = new Error('Test error');
    const { fetchCharactersName } = require('./redux');
    fetchCharactersName.mockImplementationOnce(() => {
      throw mockError;
    });

    renderWithProviders(<Home />, {
      initialState: {
        search: { searchName: 'test',  },
        character: {
          characters: { results: [] },
          loading: false,
          error: null,
          pageNum: 1
        }
      }
    });

    expect(console.error).toHaveBeenCalledWith('Error fetching characters:', mockError);
  });
});

describe('Combined Component Integration', () => {
  test('full component integration', () => {
    const mockCharacters = {
      results: [
        { id: 1, name: 'Rick Sanchez' },
        { id: 2, name: 'Morty Smith' }
      ],
      info: { pages: 3 }
    };
    
    renderWithProviders(<App />, {
      initialState: {
        search: { searchName: 'Rick' },
        character: {
          characters: mockCharacters,
          loading: false,
          error: null,
          pageNum: 1
        }
      }
    });
    
    // Check that all components are properly rendered
    expect(screen.getByTestId('search-component')).toBeInTheDocument();
    expect(screen.getByText('Characters')).toBeInTheDocument();
    expect(screen.getByTestId('cards-component')).toBeInTheDocument();
    expect(screen.getByTestId('pagination-component')).toBeInTheDocument();
    
    // Test that the correct characters are rendered
    expect(fetchCharactersName).toHaveBeenCalledWith('Rick', 1);
  });
});

describe('App and Home Components', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('renders Home component with all states', () => {
    // Test loading state
    const { rerender } = renderWithProviders(
      <MemoryRouter>
        <App />
      </MemoryRouter>,
      {
        preloadedState: {
          character: {
            loading: true,
            error: null,
            characters: { results: [] },
            pageNum: 1
          },
          search: { searchName: '' }
        }
      }
    );
    expect(screen.getByText('Loading...')).toBeInTheDocument();

    // Test error state
    rerender(
      <MemoryRouter>
        <App />
      </MemoryRouter>,
      {
        preloadedState: {
          character: {
            loading: false,
            error: 'Test error',
            characters: { results: [] },
            pageNum: 1
          },
          search: { searchName: '' }
        }
      }
    );
    expect(screen.getByText('Error: Test error')).toBeInTheDocument();

    // Test success state
    rerender(
      <MemoryRouter>
        <App />
      </MemoryRouter>,
      {
        preloadedState: {
          character: {
            loading: false,
            error: null,
            characters: { results: [{ id: 1 }] },
            pageNum: 1
          },
          search: { searchName: '' }
        }
      }
    );
    expect(screen.getByTestId('cards-component')).toBeInTheDocument();
  });

  test('tests all routes', () => {
    const routes = [
      { path: '/', testId: 'cards-component' },
      { path: '/episodes', testId: 'episodes-component' },
      { path: '/location', testId: 'location-component' },
      { path: '/1', testId: 'card-details-component' },
      { path: '/episodes/1', testId: 'card-details-component' },
      { path: '/location/1', testId: 'card-details-component' }
    ];

    routes.forEach(({ path, testId }) => {
      renderWithProviders(
        <MemoryRouter initialEntries={[path]}>
          <App />
        </MemoryRouter>
      );
      expect(screen.getByTestId(testId)).toBeInTheDocument();
    });
  });

  test('tests useEffect dependencies', () => {
    const { fetchCharactersName } = require('./redux');
    renderWithProviders(
      <MemoryRouter>
        <App />
      </MemoryRouter>,
      {
        preloadedState: {
          character: {
            loading: false,
            error: null,
            characters: { results: [] },
            pageNum: 2
          },
          search: { searchName: 'rick' }
        }
      }
    );
    expect(fetchCharactersName).toHaveBeenCalledWith('rick', 2);
  });
});

describe('App Component Edge Cases', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('handles undefined searchName and pageNum', () => {
    renderWithProviders(
      <MemoryRouter>
        <App />
      </MemoryRouter>,
      {
        preloadedState: {
          search: { searchName: undefined },
          character: {
            characters: null,
            loading: false,
            error: null,
            pageNum: undefined
          }
        }
      }
    );
    expect(fetchCharactersName).not.toHaveBeenCalled();
  });

  test('handles error in fetchCharactersName dispatch', () => {
    const mockError = new Error('Dispatch failed');
    fetchCharactersName.mockImplementationOnce(() => {
      throw mockError;
    });

    renderWithProviders(
      <MemoryRouter>
        <App />
      </MemoryRouter>,
      {
        preloadedState: {
          search: { searchName: 'rick' },
          character: {
            characters: null,
            loading: false,
            error: null,
            pageNum: 1
          }
        }
      }
    );
    expect(console.error).toHaveBeenCalledWith('Error fetching characters:', mockError);
  });

  test('handles null characters state', () => {
    renderWithProviders(
      <MemoryRouter>
        <App />
      </MemoryRouter>,
      {
        preloadedState: {
          search: { searchName: 'rick' },
          character: {
            characters: null,
            loading: false,
            error: null,
            pageNum: 1
          }
        }
      }
    );
    expect(screen.getByTestId('no-data')).toBeInTheDocument();
  });

  test('handles undefined results in characters', () => {
    renderWithProviders(
      <MemoryRouter>
        <App />
      </MemoryRouter>,
      {
        preloadedState: {
          search: { searchName: 'rick' },
          character: {
            characters: { results: undefined },
            loading: false,
            error: null,
            pageNum: 1
          }
        }
      }
    );
    expect(screen.getByTestId('no-data')).toBeInTheDocument();
  });

  test('handles state transitions', () => {
    const { rerender } = renderWithProviders(
      <MemoryRouter>
        <App />
      </MemoryRouter>,
      {
        preloadedState: {
          search: { searchName: 'rick' },
          character: {
            characters: null,
            loading: true,
            error: null,
            pageNum: 1
          }
        }
      }
    );

    // Test loading to error transition
    rerender(
      <MemoryRouter>
        <App />
      </MemoryRouter>,
      {
        preloadedState: {
          search: { searchName: 'rick' },
          character: {
            characters: null,
            loading: false,
            error: 'Test error',
            pageNum: 1
          }
        }
      }
    );
    expect(screen.getByTestId('error-state')).toBeInTheDocument();

    // Test error to success transition
    rerender(
      <MemoryRouter>
        <App />
      </MemoryRouter>,
      {
        preloadedState: {
          search: { searchName: 'rick' },
          character: {
            characters: { results: [{ id: 1 }] },
            loading: false,
            error: null,
            pageNum: 1
          }
        }
      }
    );
    expect(screen.getByTestId('home-content')).toBeInTheDocument();
  });

  test('handles route changes with loading states', () => {
    const { rerender } = renderWithProviders(
      <MemoryRouter initialEntries={['/']}>
        <App />
      </MemoryRouter>,
      {
        preloadedState: {
          search: { searchName: '' },
          character: {
            characters: null,
            loading: true,
            error: null,
            pageNum: 1
          }
        }
      }
    );
    expect(screen.getByTestId('loading-state')).toBeInTheDocument();

    // Test route change while loading
    rerender(
      <MemoryRouter initialEntries={['/episodes']}>
        <App />
      </MemoryRouter>
    );
    expect(screen.getByTestId('episodes-component')).toBeInTheDocument();
  });

  test('handles multiple error types', () => {
    const errorTypes = [
      'NETWORK_ERROR',
      'API_ERROR',
      'VALIDATION_ERROR',
      'UNKNOWN_ERROR'
    ];

    errorTypes.forEach(errorType => {
      const { unmount } = renderWithProviders(
        <MemoryRouter>
          <App />
        </MemoryRouter>,
        {
          preloadedState: {
            search: { searchName: '' },
            character: {
              characters: null,
              loading: false,
              error: errorType,
              pageNum: 1
            }
          }
        }
      );

      if (errorType === 'NETWORK_ERROR') {
        expect(screen.getByTestId('network-error')).toBeInTheDocument();
      } else {
        expect(screen.getByTestId('error-state')).toBeInTheDocument();
      }

      unmount();
    });
  });

  test('handles component cleanup', () => {
    const { unmount } = renderWithProviders(
      <MemoryRouter>
        <App />
      </MemoryRouter>
    );
    unmount();
    // Should not cause any errors
  });

  test('handles 404 route', () => {
    renderWithProviders(
      <MemoryRouter initialEntries={['/invalid-route']}>
        <App />
      </MemoryRouter>,
      { preloadedState: mockStore }
    );
    expect(screen.getByTestId('not-found')).toBeInTheDocument();
  });

  test('handles network error', () => {
    renderWithProviders(
      <MemoryRouter>
        <App />
      </MemoryRouter>,
      {
        preloadedState: {
          ...mockStore,
          character: {
            ...mockStore.character,
            error: 'NETWORK_ERROR'
          }
        }
      }
    );
    expect(screen.getByTestId('network-error')).toBeInTheDocument();
  });

  test('tests all searchName and pageNum combinations', () => {
    const testCases = [
      { searchName: undefined, pageNum: 0, shouldCall: false },
      { searchName: undefined, pageNum: 1, shouldCall: false },
      { searchName: '', pageNum: 0, shouldCall: false },
      { searchName: '', pageNum: 1, shouldCall: true },
      { searchName: 'rick', pageNum: 0, shouldCall: false },
      { searchName: 'rick', pageNum: 1, shouldCall: true }
    ];

    testCases.forEach(({ searchName, pageNum, shouldCall }) => {
      jest.clearAllMocks();
      renderWithProviders(
        <MemoryRouter>
          <Home />
        </MemoryRouter>,
        {
          preloadedState: {
            search: { searchName },
            character: {
              ...mockStore.character,
              pageNum
            }
          }
        }
      );

      if (shouldCall) {
        expect(fetchCharactersName).toHaveBeenCalledWith(searchName, pageNum);
      } else {
        expect(fetchCharactersName).not.toHaveBeenCalled();
      }
    });
  });

  test('tests Pagination rendering conditions', () => {
    const testCases = [
      { results: [], shouldRender: false },
      { results: [{ id: 1 }], shouldRender: true }
    ];

    testCases.forEach(({ results, shouldRender }) => {
      const { container } = renderWithProviders(
        <MemoryRouter>
          <Home />
        </MemoryRouter>,
        {
          preloadedState: {
            ...mockStore,
            character: {
              ...mockStore.character,
              characters: { results }
            }
          }
        }
      );

      if (shouldRender) {
        expect(screen.getByTestId('pagination-component')).toBeInTheDocument();
      } else {
        expect(screen.queryByTestId('pagination-component')).not.toBeInTheDocument();
      }
    });
  });
});

describe('App Component Advanced Cases', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('handles searchName and pageNum combinations', () => {
    const testCases = [
      { searchName: '', pageNum: 0, shouldCall: false },
      { searchName: 'rick', pageNum: -1, shouldCall: false },
      { searchName: 'rick', pageNum: 1, shouldCall: true },
      { searchName: '', pageNum: 1, shouldCall: true },
      { searchName: undefined, pageNum: 1, shouldCall: false }
    ];

    testCases.forEach(({ searchName, pageNum, shouldCall }) => {
      jest.clearAllMocks();
      renderWithProviders(
        <MemoryRouter>
          <Home />
        </MemoryRouter>,
        {
          preloadedState: {
            search: { searchName },
            character: {
              characters: { results: [] },
              loading: false,
              error: null,
              pageNum
            }
          }
        }
      );

      if (shouldCall) {
        expect(fetchCharactersName).toHaveBeenCalledWith(searchName, pageNum);
      } else {
        expect(fetchCharactersName).not.toHaveBeenCalled();
      }
    });
  });

  test('handles characters data structure variations', () => {
    const testCases = [
      { characters: null, expected: 'no-data' },
      { characters: undefined, expected: 'no-data' },
      { characters: {}, expected: 'no-data' },
      { characters: { results: null }, expected: 'no-data' },
      { characters: { results: [] }, expected: 'home-content' },
      { characters: { results: [{ id: 1 }] }, expected: 'home-content' }
    ];

    testCases.forEach(({ characters, expected }) => {
      const { unmount } = renderWithProviders(
        <MemoryRouter>
          <Home />
        </MemoryRouter>,
        {
          preloadedState: {
            search: { searchName: 'rick' },
            character: {
              characters,
              loading: false,
              error: null,
              pageNum: 1
            }
          }
        }
      );
      expect(screen.getByTestId(expected)).toBeInTheDocument();
      unmount();
    });
  });

  test('handles useEffect cleanup', () => {
    let error = null;
    const originalError = console.error;
    console.error = jest.fn((...args) => {
      error = args[0];
    });

    const { unmount } = renderWithProviders(
      <MemoryRouter>
        <Home />
      </MemoryRouter>
    );
    unmount();

    expect(error).toBeNull();
    console.error = originalError;
  });

  test('handles concurrent state updates', () => {
    const { rerender } = renderWithProviders(
      <MemoryRouter>
        <Home />
      </MemoryRouter>,
      {
        preloadedState: {
          search: { searchName: 'rick' },
          character: {
            characters: { results: [] },
            loading: true,
            error: null,
            pageNum: 1
          }
        }
      }
    );

    // Simulate concurrent updates
    rerender(
      <MemoryRouter>
        <Home />
      </MemoryRouter>,
      {
        preloadedState: {
          search: { searchName: 'morty' },
          character: {
            characters: { results: [] },
            loading: true,
            error: null,
            pageNum: 2
          }
        }
      }
    );

    expect(fetchCharactersName).toHaveBeenCalledWith('morty', 2);
  });

  test('handles error during render', () => {
    const originalError = console.error;
    console.error = jest.fn();

    fetchCharactersName.mockImplementationOnce(() => {
      throw new Error('Render error');
    });

    renderWithProviders(
      <MemoryRouter>
        <Home />
      </MemoryRouter>,
      {
        preloadedState: {
          search: { searchName: 'rick' },
          character: {
            characters: { results: [] },
            loading: false,
            error: null,
            pageNum: 1
          }
        }
      }
    );

    expect(console.error).toHaveBeenCalled();
    console.error = originalError;
  });

  test('handles route changes with state updates', () => {
    const { rerender } = renderWithProviders(
      <MemoryRouter initialEntries={['/']}>
        <App />
      </MemoryRouter>,
      {
        preloadedState: {
          search: { searchName: 'rick' },
          character: {
            characters: { results: [] },
            loading: true,
            error: null,
            pageNum: 1
          }
        }
      }
    );

    // Change route while loading
    rerender(
      <MemoryRouter initialEntries={['/episodes']}>
        <App />
      </MemoryRouter>
    );

    // Change route with error
    rerender(
      <MemoryRouter initialEntries={['/location']}>
        <App />
      </MemoryRouter>,
      {
        preloadedState: {
          search: { searchName: 'rick' },
          character: {
            characters: { results: [] },
            loading: false,
            error: 'Test error',
            pageNum: 1
          }
        }
      }
    );

    expect(screen.getByTestId('location-component')).toBeInTheDocument();
  });
});