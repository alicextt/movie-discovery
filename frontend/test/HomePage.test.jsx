import { render, screen } from '@testing-library/react';
import HomePage from '../src/HomePage.jsx';

// Mock fetch globally
beforeEach(() => {
  global.fetch = jest.fn();
});

afterEach(() => {
  jest.resetAllMocks();
});

test('renders HomePage headings and data', async () => {
  // Mock API response
  fetch.mockResolvedValueOnce({
    json: async () => ({
      totalCount: 42,
      averageRating: 4.25,
      genres: [
        { name: 'Action', count: 10 },
        { name: 'Comedy', count: 5 },
      ],
      yearCounts: [
        { year: 2020, count: 7 },
        { year: 2021, count: 12 },
      ],
    }),
  });

  render(<HomePage />);

  // Check headings
  expect(screen.getByText(/Total movies:/)).toBeInTheDocument();
  expect(screen.getByText(/Average ratings:/)).toBeInTheDocument();
  expect(screen.getByText(/Top 5 genres:/)).toBeInTheDocument();
  expect(screen.getByText(/Movies by year:/)).toBeInTheDocument();

  // Wait for async data to appear
  const totalMovies = await screen.findByText('42');
  expect(totalMovies).toBeInTheDocument();

  const averageRating = await screen.findByText('4.25');
  expect(averageRating).toBeInTheDocument();

  // Genres table
  expect(await screen.findByText('Action')).toBeInTheDocument();
  expect(await screen.findByText('10')).toBeInTheDocument();
  expect(await screen.findByText('Comedy')).toBeInTheDocument();
  expect(await screen.findByText('5')).toBeInTheDocument();

  // Year table
  expect(await screen.findByText('2020')).toBeInTheDocument();
  expect(await screen.findByText('7')).toBeInTheDocument();
  expect(await screen.findByText('2021')).toBeInTheDocument();
  expect(await screen.findByText('12')).toBeInTheDocument();
});
