import { render, screen } from '@testing-library/react';
import AddMoviePage from '../src/AddMoviePage.jsx';

test('renders Add Movie form', () => {
  render(<AddMoviePage />);

  expect(screen.getByLabelText(/Title:/)).toBeInTheDocument();
  expect(screen.getByLabelText(/Rating:/)).toBeInTheDocument();
  expect(screen.getByLabelText(/Year:/)).toBeInTheDocument();
  expect(screen.getByText(/Genres:/)).toBeInTheDocument();
  expect(screen.getByRole('button', { name: /Add Movie/ })).toBeInTheDocument();
});
