import React from 'react';
import { screen } from '@testing-library/react';
import { renderWithProviders } from '../../test-utils';
import CardDetails from './CardDetails';
import configureStore from 'redux-mock-store';
import thunk from 'redux-thunk';

// Create mock for react-router-dom
const mockUseParams = jest.fn();

// Mock the entire react-router-dom module
jest.mock('react-router-dom', () => ({
    useParams: () => mockUseParams()
}));

// Create mockStore with thunk middleware
const middlewares = [thunk];
const mockStore = configureStore(middlewares);

// Mock the fetchCharacterDetails action
const mockFetchCharacterDetails = jest.fn();
jest.mock('../../redux', () => ({
    fetchCharacterDetails: (id) => () => mockFetchCharacterDetails(id)
}));

describe('CardDetails Component', () => {
    const mockCharacter = {
        id: 1,
        name: "Rick Sanchez",
        status: "Alive",
        species: "Human",
        gender: "Male",
        origin: { name: "Earth" },
        location: { name: "Earth" },
        image: "rick.jpg",
        episode: [
            "https://rickandmortyapi.com/api/episode/1",
            "https://rickandmortyapi.com/api/episode/2"
        ]
    };

    beforeEach(() => {
        mockFetchCharacterDetails.mockClear();
        mockUseParams.mockReturnValue({ id: '1' });
        jest.clearAllMocks();
    });

    test('renders loading state', () => {
        const store = mockStore({
            character: {
                loading: true,
                error: null,
                characterDetails: null
            }
        });

        renderWithProviders(<CardDetails />, { store });
        expect(screen.getByText('Loading...')).toBeInTheDocument();
        expect(mockFetchCharacterDetails).toHaveBeenCalledWith('1');
    });

    test('renders error state', () => {
        const store = mockStore({
            character: {
                loading: false,
                error: 'Failed to fetch character',
                characterDetails: null
            }
        });

        renderWithProviders(<CardDetails />, { store });
        expect(screen.getByText('Error: Failed to fetch character')).toBeInTheDocument();
    });

    test('renders character details successfully', () => {
        const store = mockStore({
            character: {
                loading: false,
                error: null,
                characterDetails: mockCharacter
            }
        });

        renderWithProviders(<CardDetails />, { store });
        
        // Check all rendered elements
        expect(screen.getByText('Rick Sanchez')).toBeInTheDocument();
        expect(screen.getByText('Human')).toBeInTheDocument();
        expect(screen.getByText('Gender: Male')).toBeInTheDocument();
        expect(screen.getByText('Location: Earth')).toBeInTheDocument();
        expect(screen.getByText('Origin: Earth')).toBeInTheDocument();
        
        // Check image with all attributes
        const image = screen.getByRole('img');
        expect(image).toHaveAttribute('src', 'rick.jpg');
        expect(image).toHaveAttribute('alt', 'Rick Sanchez');
        expect(image).toHaveClass('img-fluid');

        // Check episode list
        const episodes = screen.getAllByRole('listitem');
        expect(episodes).toHaveLength(2);
        expect(episodes[0]).toHaveTextContent('1');
        expect(episodes[1]).toHaveTextContent('2');
    });

    test('handles empty character data', () => {
        const store = mockStore({
            character: {
                loading: false,
                error: null,
                characterDetails: {
                    name: "",
                    status: "",
                    species: "",
                    gender: "",
                    origin: {},
                    location: {},
                    image: "",
                    episode: []
                }
            }
        });

        renderWithProviders(<CardDetails />, { store });
        expect(screen.getByText('Location: Unknown')).toBeInTheDocument();
        expect(screen.getByText('Origin: Unknown')).toBeInTheDocument();
        expect(screen.queryByRole('listitem')).not.toBeInTheDocument();
    });

    test('handles all status types', () => {
        ['Alive', 'Dead', 'unknown'].forEach(status => {
            const store = mockStore({
                character: {
                    loading: false,
                    error: null,
                    characterDetails: {
                        ...mockCharacter,
                        status
                    }
                }
            });

            const { rerender } = renderWithProviders(<CardDetails />, { store });
            const statusBadge = screen.getByText(status);
            expect(statusBadge).toHaveClass(`status-badge status-${status.toLowerCase()}`);
            rerender(<CardDetails />);
        });
    });

    test('handles undefined episode array', () => {
        const store = mockStore({
            character: {
                loading: false,
                error: null,
                characterDetails: {
                    ...mockCharacter,
                    episode: undefined
                }
            }
        });

        renderWithProviders(<CardDetails />, { store });
        expect(screen.queryByRole('listitem')).not.toBeInTheDocument();
    });

    test('handles different character IDs', () => {
        mockUseParams.mockReturnValue({ id: '2' });

        const store = mockStore({
            character: {
                loading: false,
                error: null,
                characterDetails: null
            }
        });

        renderWithProviders(<CardDetails />, { store });
        expect(mockFetchCharacterDetails).toHaveBeenCalledWith('2');
    });

    test('updates on character ID change', () => {
        mockUseParams.mockReturnValue({ id: '3' });
        const { rerender } = renderWithProviders(<CardDetails />);
        
        mockUseParams.mockReturnValue({ id: '4' });
        rerender(<CardDetails />);
        
        expect(mockFetchCharacterDetails).toHaveBeenCalledWith('4');
    });

    test('handles null characterDetails', () => {
        const store = mockStore({
            character: {
                loading: false,
                error: null,
                characterDetails: null
            }
        });

        renderWithProviders(<CardDetails />, { store });
        expect(screen.getByText('No Character Found')).toBeInTheDocument();
    });
});

describe('CardDetails Component Edge Cases', () => {
  test('handles malformed episode URLs', () => {
    const store = mockStore({
      character: {
        loading: false,
        error: null,
        characterDetails: {
          ...mockCharacter,
          episode: [
            'invalid-url',
            'https://rickandmortyapi.com/api/episode/',
            'https://rickandmortyapi.com/api/episode/123'
          ]
        }
      }
    });

    renderWithProviders(<CardDetails />, { store });
    const episodes = screen.getAllByRole('listitem');
    expect(episodes[0]).toHaveTextContent('invalid-url');
    expect(episodes[1]).toHaveTextContent('');
    expect(episodes[2]).toHaveTextContent('123');
  });

  test('handles all status variations', () => {
    const statusTests = [
      { status: 'Alive', expectedClass: 'status-alive' },
      { status: 'Dead', expectedClass: 'status-dead' },
      { status: 'unknown', expectedClass: 'status-unknown' },
      { status: 'Invalid Status', expectedClass: 'status-unknown' }
    ];

    statusTests.forEach(({ status, expectedClass }) => {
      const store = mockStore({
        character: {
          loading: false,
          error: null,
          characterDetails: {
            ...mockCharacter,
            status
          }
        }
      });

      const { rerender } = renderWithProviders(<CardDetails />, { store });
      const statusBadge = screen.getByText(status);
      expect(statusBadge).toHaveClass(`status-badge ${expectedClass}`);
      rerender(<CardDetails />);
    });
  });

  test('handles missing location and origin', () => {
    const store = mockStore({
      character: {
        loading: false,
        error: null,
        characterDetails: {
          ...mockCharacter,
          location: undefined,
          origin: undefined
        }
      }
    });

    renderWithProviders(<CardDetails />, { store });
    expect(screen.getByText('Location: Unknown')).toBeInTheDocument();
    expect(screen.getByText('Origin: Unknown')).toBeInTheDocument();
  });

  test('handles empty episode array', () => {
    const store = mockStore({
      character: {
        loading: false,
        error: null,
        characterDetails: {
          ...mockCharacter,
          episode: []
        }
      }
    });

    renderWithProviders(<CardDetails />, { store });
    expect(screen.queryByRole('listitem')).not.toBeInTheDocument();
  });

  test('handles missing id in params', () => {
    mockUseParams.mockReturnValue({});
    const store = mockStore({
      character: {
        loading: false,
        error: null,
        characterDetails: null
      }
    });

    renderWithProviders(<CardDetails />, { store });
    expect(mockFetchCharacterDetails).not.toHaveBeenCalled();
  });

  test('handles component unmount during loading', () => {
    const store = mockStore({
      character: {
        loading: true,
        error: null,
        characterDetails: null
      }
    });

    const { unmount } = renderWithProviders(<CardDetails />, { store });
    unmount();
    // Should not cause any errors
  });

  test('handles missing gender', () => {
    const store = mockStore({
      character: {
        loading: false,
        error: null,
        characterDetails: {
          ...mockCharacter,
          gender: undefined
        }
      }
    });

    renderWithProviders(<CardDetails />, { store });
    expect(screen.getByText('Gender: undefined')).toBeInTheDocument();
  });
});

describe('CardDetails Component Additional Edge Cases', () => {
  test('handles undefined id in useParams', () => {
    mockUseParams.mockReturnValue({ id: undefined });
    const store = mockStore({
      character: {
        loading: false,
        error: null,
        characterDetails: null
      }
    });

    renderWithProviders(<CardDetails />, { store });
    expect(mockFetchCharacterDetails).toHaveBeenCalledWith(undefined);
  });

  test('handles dispatch error in useEffect', () => {
    mockFetchCharacterDetails.mockImplementationOnce(() => {
      throw new Error('Dispatch error');
    });

    const store = mockStore({
      character: {
        loading: false,
        error: null,
        characterDetails: null
      }
    });

    renderWithProviders(<CardDetails />, { store });
    expect(mockFetchCharacterDetails).toHaveBeenCalled();
  });

  test('handles missing name in character details', () => {
    const store = mockStore({
      character: {
        loading: false,
        error: null,
        characterDetails: {
          ...mockCharacter,
          name: undefined
        }
      }
    });

    renderWithProviders(<CardDetails />, { store });
    const image = screen.getByRole('img');
    expect(image).toHaveAttribute('alt', '');
  });

  test('handles missing image in character details', () => {
    const store = mockStore({
      character: {
        loading: false,
        error: null,
        characterDetails: {
          ...mockCharacter,
          image: undefined
        }
      }
    });

    renderWithProviders(<CardDetails />, { store });
    const image = screen.getByRole('img');
    expect(image).toHaveAttribute('src', '');
  });

  test('handles null values in character details', () => {
    const store = mockStore({
      character: {
        loading: false,
        error: null,
        characterDetails: {
          ...mockCharacter,
          status: null,
          species: null,
          gender: null,
          location: null,
          origin: null,
          episode: null
        }
      }
    });

    renderWithProviders(<CardDetails />, { store });
    expect(screen.getByText('Location: Unknown')).toBeInTheDocument();
    expect(screen.getByText('Origin: Unknown')).toBeInTheDocument();
    expect(screen.getByText('Gender: null')).toBeInTheDocument();
    expect(screen.queryByRole('listitem')).not.toBeInTheDocument();
  });

  test('handles malformed location and origin objects', () => {
    const store = mockStore({
      character: {
        loading: false,
        error: null,
        characterDetails: {
          ...mockCharacter,
          location: { notName: 'Something' },
          origin: { notName: 'Something' }
        }
      }
    });

    renderWithProviders(<CardDetails />, { store });
    expect(screen.getByText('Location: Unknown')).toBeInTheDocument();
    expect(screen.getByText('Origin: Unknown')).toBeInTheDocument();
  });

  test('handles episode URLs without trailing ID', () => {
    const store = mockStore({
      character: {
        loading: false,
        error: null,
        characterDetails: {
          ...mockCharacter,
          episode: ['https://rickandmortyapi.com/api/episode']
        }
      }
    });

    renderWithProviders(<CardDetails />, { store });
    const episodes = screen.getAllByRole('listitem');
    expect(episodes[0]).toHaveTextContent('');
  });
});

describe('CardDetails Component Complete Coverage', () => {
  test('handles species display', () => {
    const store = mockStore({
      character: {
        loading: false,
        error: null,
        characterDetails: {
          ...mockCharacter,
          species: 'Alien'
        }
      }
    });

    renderWithProviders(<CardDetails />, { store });
    expect(screen.getByText('Alien')).toBeInTheDocument();
  });

  test('handles status badge with empty string', () => {
    const store = mockStore({
      character: {
        loading: false,
        error: null,
        characterDetails: {
          ...mockCharacter,
          status: ''
        }
      }
    });

    renderWithProviders(<CardDetails />, { store });
    const statusBadge = screen.getByText('');
    expect(statusBadge).toHaveClass('status-badge status-unknown');
  });

  test('handles episode array with invalid URLs', () => {
    const store = mockStore({
      character: {
        loading: false,
        error: null,
        characterDetails: {
          ...mockCharacter,
          episode: ['not-a-url', '', null, undefined]
        }
      }
    });

    renderWithProviders(<CardDetails />, { store });
    const episodes = screen.getAllByRole('listitem');
    expect(episodes[0]).toHaveTextContent('not-a-url');
    expect(episodes[1]).toHaveTextContent('');
    expect(episodes[2]).toHaveTextContent('');
    expect(episodes[3]).toHaveTextContent('');
  });

  test('handles location and origin with empty name properties', () => {
    const store = mockStore({
      character: {
        loading: false,
        error: null,
        characterDetails: {
          ...mockCharacter,
          location: { name: '' },
          origin: { name: '' }
        }
      }
    });

    renderWithProviders(<CardDetails />, { store });
    expect(screen.getByText('Location: Unknown')).toBeInTheDocument();
    expect(screen.getByText('Origin: Unknown')).toBeInTheDocument();
  });

  test('handles characterDetails with minimal data', () => {
    const store = mockStore({
      character: {
        loading: false,
        error: null,
        characterDetails: {
          name: 'Test',
          status: 'Alive'
        }
      }
    });

    renderWithProviders(<CardDetails />, { store });
    expect(screen.getByText('Test')).toBeInTheDocument();
    expect(screen.getByText('Gender: undefined')).toBeInTheDocument();
    expect(screen.getByText('Location: Unknown')).toBeInTheDocument();
    expect(screen.getByText('Origin: Unknown')).toBeInTheDocument();
    expect(screen.queryByRole('listitem')).not.toBeInTheDocument();
  });

  test('handles empty string id in useParams', () => {
    mockUseParams.mockReturnValue({ id: '' });
    const store = mockStore({
      character: {
        loading: false,
        error: null,
        characterDetails: null
      }
    });

    renderWithProviders(<CardDetails />, { store });
    expect(mockFetchCharacterDetails).toHaveBeenCalledWith('');
  });

  test('handles multiple rerenders with same id', () => {
    mockUseParams.mockReturnValue({ id: '1' });
    const { rerender } = renderWithProviders(<CardDetails />);
    
    // First rerender with same ID
    rerender(<CardDetails />);
    // Second rerender with same ID
    rerender(<CardDetails />);
    
    expect(mockFetchCharacterDetails).toHaveBeenCalledTimes(1);
  });

  test('handles characterDetails with all null values', () => {
    const store = mockStore({
      character: {
        loading: false,
        error: null,
        characterDetails: {
          name: null,
          status: null,
          species: null,
          image: null,
          location: null,
          origin: null,
          gender: null,
          episode: null
        }
      }
    });

    renderWithProviders(<CardDetails />, { store });
    expect(screen.getByText('null')).toBeInTheDocument();
    expect(screen.getByText('Location: Unknown')).toBeInTheDocument();
    expect(screen.getByText('Origin: Unknown')).toBeInTheDocument();
    expect(screen.getByText('Gender: null')).toBeInTheDocument();
  });
});