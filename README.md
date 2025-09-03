# Movie Explorer

This project integrates Google Drive API, MySQL, and a React + Express web app for movie data management and search.

## Structure
- **Google Drive Integration**: Fetches movie JSON files from Google Drive using Node.js (`ingestData.js`).
- **MySQL Database**: Stores crawled movie data. Managed via Docker Compose and Prisma.
- **Express Server**: Serves movie data via REST API.
- **React Web App**: Provides UI for searching, aggregating, and adding movies.

## Setup

Run 
```
  npm install
``` 
in the backend and frontend folder.

### 1. Google Drive Ingestion
- Place project `credentials.json` in the bakcend folder.
- Run `npm run ingestData` to fetch all movie JSON files from Google Drive and export to `movie.json`.
  - First, authentication uses OAuth2. On first run, follow the printed URL to authorize.
  - Paste the code from return uri into the console and save your access token.

### 2. MySQL Database
- Install Docker
- Start MySQL with Docker Compose:
  ```bash
  docker-compose up -d
  ```
- Create tables:
  ```
  npx prisma migrate reset
  ```
  runs the migrations init step to create tables.
- Import data:
  ```bash
  npm run importDataFromFile
  ```
  This will read `movie.json` and populate the database, using `INSERT IGNORE` to avoid duplicates.

### 3. Express API
- Start the server:
  ```bash
  node index.js
  ```
- The API runs on port 4000 and serves movie data for the frontend.

#### API Endpoints

You can query movies with different parameters using the following endpoints:

- `GET /api/movies` — Get movies with default count of 10
- `GET /api/movies/search?title=Inception` — Search movies by title
- `GET /api/movies?genre=Action&year=2010&minRating=7` — Filter movies by genre, year and minRating
- `POST /api/movies` — Add a new movie (JSON body)
- `GET /api/movies/aggregate` — Get aggregate stats (e.g., count by genre)
- `GET /api/genres` - Get all genres

##### Example Queries

- Get all movies:
  ```bash
  curl http://localhost:4000/api/movies
  ```
- Search by title:
  ```bash
  curl "http://localhost:4000/api/movies/search?title=Inception"
  ```
- Filter by genre:
  ```bash
  curl "http://localhost:4000/api/movies?genre=Action"
  ```
- Filter by year:
  ```bash
  curl "http://localhost:4000/api/movies?year=2020"
  ```

## Frontend

See the [React Frontend README](./frontend/README.md) for setup and usage details.

## Features
- Search movies by title
- Filter movies by genre (multi-select)
- Add new movies with genre selection
- Aggregate movies by genre and count
