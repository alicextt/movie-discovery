# Movie Explorer

This project integrates Google Drive API, MySQL, and a React + Express web app for movie data management and search.

## Structure
- **Google Drive Integration**: Fetches movie JSON files from Google Drive using Node.js (`ingest.js`).
- **MySQL Database**: Stores crawled movie data. Managed via Docker Compose and SQL scripts.
- **Express Server**: Serves movie data via REST API (`index.js`).
- **React Web App**: Provides UI for searching, aggregating, and adding movies.

## Setup

### 1. Google Drive Ingestion
- Place your `credentials.json` in the project folder.
- Run `node scripts/ingest.js` to fetch all movie JSON files from Google Drive and export to `movie.json`.
- Authentication uses OAuth2. On first run, follow the printed URL to authorize and save your token.

### 2. MySQL Database
- Start MySQL with Docker Compose:
  ```bash
  docker-compose up -d
  ```
- Create tables (example):
  ```sql
  CREATE TABLE movies (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255) UNIQUE,
    rating FLOAT,
    year INT
  );
  CREATE TABLE genres (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) UNIQUE
  );
  CREATE TABLE movie_genre (
    movie_id INT,
    genre_id INT,
    PRIMARY KEY (movie_id, genre_id)
  );
  ```
- Import data:
  ```bash
  node scripts/import.js
  ```
  This will read `movie.json` and populate the database, using `INSERT IGNORE` to avoid duplicates.

### 3. Express API
- Start the server:
  ```bash
  node index.js
  ```
- The API runs on port 4000 and serves movie data for the frontend.

### 4. React Frontend

## Features
- Search movies by title
- Aggregate by genre/count
- Add new movies

## Files
- `scripts/ingest.js`: Google Drive to JSON export
- `scripts/import.js`: Import JSON to MySQL
- `movie.json`: Exported movie data
- `index.js`: Express server
- `docker-compose.yml`: MySQL setup
- `credentials.json`, `token.json`: Google API credentials
