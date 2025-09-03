import { render, screen } from '@testing-library/react';
import SearchPage from '../src/SearchPage.jsx';

test('renders search input', () => {
  render(<SearchPage />);
  expect(screen.getByPlaceholderText(/Search movies.../)).toBeInTheDocument();
});
