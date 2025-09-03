# Movie Explorer Frontend

This is the React frontend for the Movie Explorer app, built with Vite for fast development and minimal configuration.

## Features
- Search movies by title
- Filter movies by genre (multi-select)
- Add new movies with genre selection
- Aggregate movies by genre and count
- Minimal, clean UI with responsive design
- Home page, Movies page, and Add Movie page
- API integration with Express backend

## Getting Started

1. Install dependencies:
   ```bash
   npm install
   ```
2. Start the development server:
   ```bash
   npm run dev
   ```
3. Open your browser at [http://localhost:5173](http://localhost:5173) (default Vite port).

## Project Structure
- `src/` — React components and pages
- `public/` — Static assets
- `App.js` — Main app component
- `MoviesPage.jsx`, `AddMoviePage.jsx`, `HomePage.jsx` — Main pages

## API Integration
The frontend communicates with the backend API (see backend README for setup). Update API URLs in the code if your backend runs on a different port.

## Customization
- Edit styles in `src/*.css` for minimal UI changes.
- Add new features or pages in `src/`.

## Development Tools
- [Vite](https://vitejs.dev/) for fast development and HMR
- [React](https://react.dev/) for UI
- [react-select](https://react-select.com/) for genre multi-select

See the [main project README](../README.md) for backend and overall setup instructions.
