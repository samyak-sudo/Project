import React from 'react';
import { screen, waitFor } from '@testing-library/react';
import { renderWithProviders } from '../test-utils';
import Episodes from './Episodes';

describe('Episodes Component', () => {
  const mockEpisodeData = {
    name: "Test Episode",
    air_date: "December 2, 2013"
  };

  const mockEmptyData = {
    name: "",
    air_date: ""
  };

  beforeEach(() => {
    // Mock fetch before each test
    global.fetch = jest.fn();
  });

  afterEach(() => {
    // Clean up after each test
    jest.resetAllMocks();
  });

  test('renders initial episodes component structure', () => {
    global.fetch.mockResolvedValueOnce({
      json: () => Promise.resolve(mockEpisodeData)
    });

    renderWithProviders(<Episodes />);
    
    expect(screen.getByText(/Episodes:/i)).toBeInTheDocument();
    expect(screen.getByText(/Air Date/i)).toBeInTheDocument();
  });

  test('displays episode data after successful fetch', async () => {
    global.fetch.mockResolvedValueOnce({
      json: () => Promise.resolve(mockEpisodeData)
    });

    renderWithProviders(<Episodes />);

    await waitFor(() => {
      expect(screen.getByText(mockEpisodeData.name)).toBeInTheDocument();
    });

    await waitFor(() => {
      expect(screen.getByText(mockEpisodeData.air_date)).toBeInTheDocument();
    });

    expect(global.fetch).toHaveBeenCalledWith(
      'https://rickandmortyapi.com/api/episode/1'
    );
  });

  test('displays "Unknown" for empty episode data', async () => {
    global.fetch.mockResolvedValueOnce({
      json: () => Promise.resolve(mockEmptyData)
    });

    renderWithProviders(<Episodes />);

    await waitFor(() => {
      expect(screen.getByText('Unknown')).toBeInTheDocument();
    });
  });

  test('handles fetch error gracefully', async () => {
    global.fetch.mockRejectedValueOnce(new Error('Failed to fetch'));

    renderWithProviders(<Episodes />);

    // Component should not crash and should maintain its structure
    expect(screen.getByText(/Episodes:/i)).toBeInTheDocument();
  });

  test('updates state with fetched data', async () => {
    global.fetch.mockResolvedValueOnce({
      json: () => Promise.resolve(mockEpisodeData)
    });

    renderWithProviders(<Episodes />);

    await waitFor(() => {
      expect(screen.getByText(mockEpisodeData.name)).toBeInTheDocument();
    });

    await waitFor(() => {
      expect(screen.getByText(mockEpisodeData.air_date)).toBeInTheDocument();
    });
  });

  test('makes API call with correct initial ID', () => {
    global.fetch.mockResolvedValueOnce({
      json: () => Promise.resolve(mockEpisodeData)
    });

    renderWithProviders(<Episodes />);

    expect(global.fetch).toHaveBeenCalledTimes(1);
    expect(global.fetch).toHaveBeenCalledWith(
      'https://rickandmortyapi.com/api/episode/1'
    );
  });
}); 