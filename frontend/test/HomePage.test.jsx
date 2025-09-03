import { render, screen } from '@testing-library/react';
import HomePage from '../src/HomePage.jsx';

test('renders HomePage headings', () => {
  render(<HomePage />);
  expect(screen.getByText(/Total movies:/)).toBeInTheDocument();
  expect(screen.getByText(/Average ratings:/)).toBeInTheDocument();
  expect(screen.getByText(/Top genres:/)).toBeInTheDocument();
  expect(screen.getByText(/Movies by year:/)).toBeInTheDocument();
});
