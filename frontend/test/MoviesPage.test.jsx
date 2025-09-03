import { render, screen } from '@testing-library/react';
import MoviesPage from '../src/MoviesPage.jsx';

test('renders MoviesPage title', () => {
  render(<MoviesPage />);
  expect(screen.getByText(/Top Rated Movies/)).toBeInTheDocument();
});
