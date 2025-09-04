// test/MoviesPage.test.jsx
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import MoviesPage from '../src/MoviesPage';

// Mock fetch
beforeEach(() => {
  global.fetch = jest.fn();
});

afterEach(() => {
  jest.resetAllMocks();
});

test('renders movies and handles Show more', async () => {
  // Mock first API response
  fetch.mockResolvedValueOnce({
    ok: true,
    json: async () => ({
      results: [
        { id: 1, title: 'Movie 1', rating: 9.0, year: 2023, genres: ['Action', 'Drama'] },
        { id: 2, title: 'Movie 2', rating: 8.5, year: 2022, genres: ['Comedy'] },
      ],
      total: 4,
      start: 0,
      count: 2
    }),
  });

  // Mock second API response (Show more)
  fetch.mockResolvedValueOnce({
    ok: true,
    json: async () => ({
      results: [
        { id: 3, title: 'Movie 3', rating: 8.8, year: 2021, genres: ['Thriller'] },
        { id: 4, title: 'Movie 4', rating: 7.5, year: 2020, genres: ['Horror'] },
      ],
      total: 4,
      start: 2,
      count: 2
    }),
  });

  render(<MoviesPage />);

  // Wait for initial movies to render
  await waitFor(() => {
    expect(screen.getByText('Movie 1')).toBeInTheDocument();
    expect(screen.getByText('Movie 2')).toBeInTheDocument();
  });

  // Check genres display
  expect(screen.getByText('Action, Drama')).toBeInTheDocument();
  expect(screen.getByText('Comedy')).toBeInTheDocument();

  // Show more button exists
  const showMoreBtn = screen.getByText('Show more');
  expect(showMoreBtn).toBeInTheDocument();

  // Click Show more
  userEvent.click(showMoreBtn);

  // Wait for new movies to render
  await waitFor(() => {
    expect(screen.getByText('Movie 3')).toBeInTheDocument();
    expect(screen.getByText('Movie 4')).toBeInTheDocument();
  });

  // Check new genres
  expect(screen.getByText('Thriller')).toBeInTheDocument();
  expect(screen.getByText('Horror')).toBeInTheDocument();

  // Show more button disappears after all movies loaded
  await waitFor(() => {
    expect(screen.queryByText('Show more')).not.toBeInTheDocument();
  });
});
