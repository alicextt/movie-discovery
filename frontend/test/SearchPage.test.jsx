// test/SearchPage.test.jsx
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import SearchPage from '../src/SearchPage';

beforeEach(() => {
  global.fetch = jest.fn();
});

afterEach(() => {
  jest.resetAllMocks();
});

test('searches movies and displays details on selection', async () => {
  const mockResults = [
    { id: 1, title: 'Inception', year: 2010, rating: 8.8, genres: 'Action, Sci-Fi' },
    { id: 2, title: 'Interstellar', year: 2014, rating: 8.6, genres: 'Adventure, Drama' }
  ];

  fetch.mockResolvedValueOnce({
    ok: true,
    json: async () => mockResults
  });

  render(<SearchPage />);

  const input = screen.getByPlaceholderText(/search movies/i);
  await userEvent.type(input, 'In');

  // Wait for dropdown results to appear
  await waitFor(() => {
    expect(screen.getByText(/Inception\s*\(\s*2010\s*\)/i)).toBeInTheDocument();
    expect(screen.getByText(/Interstellar\s*\(\s*2014\s*\)/i)).toBeInTheDocument();
  });

  // Click first result (Inception)
  const inceptionButton = screen.getByText(/Inception\s*\(\s*2010\s*\)/i);
  await userEvent.click(inceptionButton);

  // Check details card
  await waitFor(() => {
    expect(screen.getByText('Inception')).toBeInTheDocument();
    expect(screen.getByText(/Year:\s*2010/)).toBeInTheDocument();
    expect(screen.getByText(/Rating:\s*8.8/)).toBeInTheDocument();
    expect(screen.getByText(/Genres:\s*Action, Sci-Fi/)).toBeInTheDocument();
  });

  // Dropdown should disappear and input cleared
  expect(screen.queryByText(/Interstellar\s*\(\s*2014\s*\)/i)).not.toBeInTheDocument();
  expect(input.value).toBe('');
});
