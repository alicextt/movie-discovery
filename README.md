# Movie Explorer

This project integrates Google Drive API, MySQL, and a React + Express web app for movie data management and search.

## Structure
- **Google Drive Integration**: Fetches movie JSON files from Google Drive using Node.js (`ingestData.js`).
- **MySQL Database**: Stores crawled movie data. Managed via Docker Compose and Prsima.
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

### 4. React Frontend

See the [React Frontend README](./frontend/README.md) for setup and usage details.

## Features
- Search movies by title
- Filter movies by genre (multi-select)
- Add new movies with genre selection
- Aggregate movies by genre and count
