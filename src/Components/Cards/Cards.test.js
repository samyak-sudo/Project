import React from "react";
import { screen, fireEvent } from "@testing-library/react";
import { renderWithProviders } from "../../test-utils";
import Cards from "./Cards";

describe('Cards Component', () => {
    const mockStore = {
        character: {
            characters: {
                results: [
                    {
                        id: 1,
                        name: "Rick Sanchez",
                        status: "Alive",
                        species: "Human",
                        image: "rick.jpg"
                    },
                    {
                        id: 2,
                        name: "Morty Smith",
                        status: "Dead",
                        species: "Human",
                        image: "morty.jpg"
                    },
                    {
                        id: 3,
                        name: "Summer Smith",
                        status: "unknown",
                        species: "Human",
                        image: "summer.jpg"
                    }
                ]
            },
            loading: false,
            error: null
        }
    };

    test('renders loading state', () => {
        const loadingStore = {
            character: {
                loading: true,
                error: null,
                characters: null
            }
        };
        renderWithProviders(<Cards page="/" />, { preloadedState: loadingStore });
        expect(screen.getByText('Loading...')).toBeInTheDocument();
    });

    test('renders error state', () => {
        const errorStore = {
            character: {
                loading: false,
                error: 'Failed to fetch',
                characters: null
            }
        };
        renderWithProviders(<Cards page="/" />, { preloadedState: errorStore });
        expect(screen.getByText('Error: Failed to fetch')).toBeInTheDocument();
    });

    test('renders no characters found state', () => {
        const emptyStore = {
            character: {
                loading: false,
                error: null,
                characters: { results: [] }
            }
        };
        renderWithProviders(<Cards page="/" />, { preloadedState: emptyStore });
        expect(screen.getByText('No characters found')).toBeInTheDocument();
    });

    test('renders characters successfully', () => {
        renderWithProviders(<Cards page="/" />, { preloadedState: mockStore });
        
        // Check if all characters are rendered
        expect(screen.getByText('Rick Sanchez')).toBeInTheDocument();
        expect(screen.getByText('Morty Smith')).toBeInTheDocument();
        expect(screen.getByText('Summer Smith')).toBeInTheDocument();
        
        // Check if species are rendered
        expect(screen.getAllByText('Species:')).toHaveLength(3);
        expect(screen.getAllByText('Human')).toHaveLength(3);
    });

    test('renders correct status classes and text', () => {
        renderWithProviders(<Cards page="/" />, { preloadedState: mockStore });
        
        const statuses = screen.getAllByTestId('status-badge');
        expect(statuses[0]).toHaveClass('status-alive');
        expect(statuses[0]).toHaveTextContent('Alive');
        expect(statuses[1]).toHaveClass('status-dead');
        expect(statuses[1]).toHaveTextContent('Dead');
        expect(statuses[2]).toHaveClass('status-unknown');
        expect(statuses[2]).toHaveTextContent('unknown');
    });

    test('renders with different page props', () => {
        renderWithProviders(<Cards page="/episodes/" />, { preloadedState: mockStore });
        const links = screen.getAllByRole('link');
        expect(links[0]).toHaveAttribute('href', '/episodes/1');
        expect(links[1]).toHaveAttribute('href', '/episodes/2');
        expect(links[2]).toHaveAttribute('href', '/episodes/3');
    });

    test('renders images correctly', () => {
        renderWithProviders(<Cards page="/" />, { preloadedState: mockStore });
        const images = screen.getAllByRole('img');
        expect(images).toHaveLength(3);
        expect(images[0]).toHaveAttribute('src', 'rick.jpg');
        expect(images[0]).toHaveAttribute('alt', 'Rick Sanchez');
    });

    test('handles missing results in characters data', () => {
        const noResultsStore = {
            character: {
                loading: false,
                error: null,
                characters: { }
            }
        };
        renderWithProviders(<Cards page="/" />, { preloadedState: noResultsStore });
        expect(screen.getByText('No characters found')).toBeInTheDocument();
    });

    test('handles null characters state', () => {
        const nullStore = {
            character: {
                loading: false,
                error: null,
                characters: null
            }
        };
        renderWithProviders(<Cards page="/" />, { preloadedState: nullStore });
        expect(screen.getByText('No characters found')).toBeInTheDocument();
    });

    test('handles undefined characters state', () => {
        const undefinedStore = {
            character: {
                loading: false,
                error: null,
                characters: undefined
            }
        };
        renderWithProviders(<Cards page="/" />, { preloadedState: undefinedStore });
        expect(screen.getByText('No characters found')).toBeInTheDocument();
    });

    test('renders links with correct styling', () => {
        renderWithProviders(<Cards page="/" />, { preloadedState: mockStore });
        const links = screen.getAllByRole('link');
        expect(links[0]).toHaveStyle({
            textDecoration: 'none',
            color: 'black'
        });
    });
});