CREATE DATABASE IF NOT EXISTS movies;
USE movies;

CREATE TABLE IF NOT EXISTS movies (
  id INT AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(255) NOT NULL UNIQUE,
  rating FLOAT,
  year INT
);

CREATE TABLE IF NOT EXISTS genres (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) UNIQUE
);

CREATE TABLE IF NOT EXISTS movie_genre (
  movie_id INT,
  genre_id INT,
  PRIMARY KEY (movie_id, genre_id),
  FOREIGN KEY (movie_id) REFERENCES movies(id),
  FOREIGN KEY (genre_id) REFERENCES genres(id)
);

CREATE INDEX idx_movies_rating_year_id ON movies (rating DESC, year, id);