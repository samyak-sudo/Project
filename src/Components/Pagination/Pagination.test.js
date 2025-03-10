import React from 'react';
import { screen, fireEvent } from '@testing-library/react';
import { renderWithProviders } from '../../test-utils';
import Pagination from './Pagination';
import { ChangePage, fetchCharactersPage } from '../../redux';
import configureStore from 'redux-mock-store';

const mockStore = configureStore([]);

jest.mock('react-paginate', () => {
    return function MockPaginate(props) {
        return (
            <div data-testid="mock-paginate">
                <button 
                    onClick={() => props.onPageChange({ selected: 0 })}
                    data-testid="page-change"
                >
                    Change Page
                </button>
                <span>Pages: {props.pageCount}</span>
                <span>Current: {props.forcePage}</span>
            </div>
        );
    };
});

describe('Pagination Component', () => {
    let store;

    beforeEach(() => {
        store = mockStore({
            character: {
                characters: {
                    info: {
                        pages: 42
                    }
                },
                pageNum: 1
            },
            search: {
                searchName: ''
            }
        });
        store.dispatch = jest.fn();
    });

    test('renders pagination component', () => {
        renderWithProviders(<Pagination />, { store });
        expect(screen.getByTestId('mock-paginate')).toBeInTheDocument();
    });

    test('handles page change', () => {
        renderWithProviders(<Pagination />, { store });
        const pageChangeButton = screen.getByTestId('page-change');
        fireEvent.click(pageChangeButton);
        expect(store.dispatch).toHaveBeenCalledWith(ChangePage(1));
    });

    test('fetches characters on page change when no search term', () => {
        renderWithProviders(<Pagination />, { store });
        expect(store.dispatch).toHaveBeenCalledWith(fetchCharactersPage(1));
    });

    test('does not fetch characters when search term exists', () => {
        store = mockStore({
            character: {
                characters: {
                    info: {
                        pages: 42
                    }
                },
                pageNum: 1
            },
            search: {
                searchName: 'Rick'
            }
        });
        store.dispatch = jest.fn();

        renderWithProviders(<Pagination />, { store });
        expect(store.dispatch).not.toHaveBeenCalledWith(fetchCharactersPage(1));
    });

    test('handles missing info in characters state', () => {
        store = mockStore({
            character: {
                characters: {},
                pageNum: 1
            },
            search: {
                searchName: ''
            }
        });

        renderWithProviders(<Pagination />, { store });
        expect(screen.getByText('Pages: 1')).toBeInTheDocument();
    });

    test('handles page number updates', () => {
        store = mockStore({
            character: {
                characters: {
                    info: {
                        pages: 42
                    }
                },
                pageNum: 2
            },
            search: {
                searchName: ''
            }
        });

        renderWithProviders(<Pagination />, { store });
        expect(screen.getByText('Current: 1')).toBeInTheDocument();
    });

    test('updates on search name change', () => {
        const { rerender } = renderWithProviders(<Pagination />, { store });
        
        store = mockStore({
            character: {
                characters: {
                    info: {
                        pages: 42
                    }
                },
                pageNum: 1
            },
            search: {
                searchName: 'Rick'
            }
        });

        rerender(<Pagination />);
        expect(store.dispatch).not.toHaveBeenCalledWith(fetchCharactersPage(1));
    });

    test('handles undefined characters data', () => {
        store = mockStore({
            character: {
                characters: undefined,
                pageNum: 1
            },
            search: {
                searchName: ''
            }
        });

        renderWithProviders(<Pagination />, { store });
        expect(screen.getByText('Pages: 1')).toBeInTheDocument();
    });
}); 