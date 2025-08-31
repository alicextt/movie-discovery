import fs from "fs";
import path from "path";
import mysql from "mysql2/promise";

const connection = await mysql.createConnection({
  host: "127.0.0.1", 
  port: 3306,
  user: "root",
  password: "root",
  database: "movies",
});

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const file = fs.readFileSync(path.join(__dirname, "../movie.json"));
const data = JSON.parse(file);

for(let i = 0; i < data.length; i++) {
  const title = data[i].title;
  const genre = data[i].genre;

  await connection.execute(
    "INSERT IGNORE INTO movies (title, rating, year) VALUES (?, ?, ?)",
    [title, data[i].rating, data[i].year]
  );

  await connection.execute(
    "INSERT IGNORE INTO genres (name) VALUES (?)",
        [genre]
  );

  const [[{ id: movieId }]] = await connection.execute(
    "SELECT id FROM movies WHERE title = ?",
    [title]
  );

  const [[{ id: genreId }]] = await connection.execute(
    "SELECT id FROM genres WHERE name = ?",
    [genre]
  );

    await connection.execute(
        "INSERT IGNORE INTO movie_genre (movie_id, genre_id) VALUES (?, ?)",
        [movieId, genreId]
    );
}


await connection.end();
console.log("All JSON files imported!");
