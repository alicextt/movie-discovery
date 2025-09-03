import { render, screen, within } from '@testing-library/react';
import App from '../src/App.jsx';

test('renders navigation links with correct hrefs', () => {
  render(<App />);

  const nav = screen.getByRole('navigation');

  const links = [
    { text: 'Home', href: '/' },
    { text: 'Search', href: '/search' },
    { text: 'Movies', href: '/movies' },
    { text: 'Add Movie', href: '/add-movie' },
  ];

  links.forEach(({ text, href }) => {
    const link = within(nav).getByText(text);
    expect(link).toBeInTheDocument();
    expect(link.closest('a')).toHaveAttribute('href', href);
  });
});
