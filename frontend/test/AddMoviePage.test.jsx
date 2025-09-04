// test/AddMoviePage.test.jsx
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import AddMoviePage from '../src/AddMoviePage';

beforeEach(() => {
  // Mock fetch for genres and movies
  global.fetch = jest.fn((url) => {
    if (url.endsWith('/api/genres')) {
      return Promise.resolve({
        ok: true,
        json: () => Promise.resolve([
          { id: 1, name: 'Action' },
          { id: 2, name: 'Comedy' },
        ]),
      });
    }
    if (url.endsWith('/api/movies')) {
      return Promise.resolve({ ok: true });
    }
  });
});

afterEach(() => {
  jest.clearAllMocks();
});

test('renders AddMoviePage form and submits successfully', async () => {
  render(<AddMoviePage />);

  const user = userEvent.setup();
  // Wait for genres to load (react-select renders options in portal)
  await waitFor(() => expect(screen.getByText('Select genres')).toBeInTheDocument());

  // Fill out form
  await user.type(screen.getByLabelText(/title/i), 'My Movie');
  await user.type(screen.getByLabelText(/rating/i), '8.5');
  await user.type(screen.getByLabelText(/year/i), '2025');

  // open the select menu
  const selectControl = document.querySelector('.react-select__control');
  await user.click(selectControl);

  await waitFor(() => screen.getByText('Action'));
  await user.click(screen.getByText('Action'));

  await user.click(screen.getByTestId('add-movie-btn'));

  // Wait for success message
  const successMessage = await screen.findByText('Movie added!');
  expect(successMessage).toBeInTheDocument();
});
