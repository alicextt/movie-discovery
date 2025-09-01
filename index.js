import express from "express";
import cors from "cors";
import mysql from "mysql2/promise";

const app = express();
app.use(cors());
app.use(express.json());

export const pool = mysql.createPool({
  host: "127.0.0.1",
  port: 3306,
  user: "root",
  password: "root",
  database: "movies",
  waitForConnections: true,
  connectionLimit: 10,
});

/**
 * Get a list of movies with optional filters
 *
 * @request.query.genre - (optional) Filter by a genre name
 * @request.query.minRating - (optional) Filter by minimum rating
 * @request.query.year - (optional) Filter by year
 * @request.query.order - (optional) Sort order (asc or desc) by rating, default is desc
 * @request.query.count - (optional) Number of results to return (default is 10)
 * @request.query.start - (optional) Starting index for pagination (default is 0)
 *
 * The results are returned by order of rating, year(asc), and id(asc).
 */
app.get("/api/movies", async (req, res) => {
  let { genre, minRating, year, order = "desc", count = 10, start = 0 } = req.query;

  const sortBy = "rating";
  order = order.toLowerCase() === "asc" ? "ASC" : "DESC";

  let query = `
    SELECT
      m.id, m.title, m.rating, m.year, GROUP_CONCAT(g.name) AS genres
    FROM movies m
    JOIN movie_genre mg
      ON m.id = mg.movie_id
    JOIN genres g
      ON mg.genre_id = g.id
    WHERE 1=1
  `;

  const params = [];

  if (genre) {
    query += " AND g.name = ? ";
    params.push(genre);
  }

  if (minRating) {
    query += " AND m.rating >= ? ";
    params.push(Number(minRating));
  }

  if (year) {
    query += " AND m.year = ? ";
    params.push(Number(year));
  }

  // Get total count
  const countSql = "SELECT COUNT(*) as total FROM (" + query + " GROUP BY m.id, m.title, m.rating, m.year) t";
  const [[{ total }]] = await pool.query(countSql, params);

  query += `
    GROUP BY m.id, m.title, m.rating, m.year
    ORDER BY rating ${order}, year, id
    LIMIT ? OFFSET ?
  `;

  params.push(Number(count), Number(start));

  // Get actual results with pagination
  const [rows] = await pool.query(query, params);
  res.json({ results: rows , start: Number(start), count: rows.length, total });
});

app.get("/api/movies/aggregate", async (req, res) => {
  const [rows] = await pool.query("SELECT COUNT(*) as totalCount FROM movies");
  const [genreRows] = await pool.query(
    `SELECT
      name, count(*) as count
    FROM genres
    JOIN movie_genre
      ON genres.id = movie_genre.genre_id
    GROUP BY genres.id
    ORDER BY count DESC`
  );

  const [ratingRows] = await pool.query("SELECT AVG(rating) as averageRating FROM movies");

  const [yearCountRows] = await pool.query("SELECT year, count(*) as count FROM movies GROUP BY year ORDER BY year ASC");

  res.json({ totalCount: rows[0].totalCount, genres: genreRows, averageRating: ratingRows[0].averageRating, yearCounts: yearCountRows });
});

app.get("/api/movies/search", async (req, res) => {
  const { title } = req.query;

  if (!title) {
    return res.status(400).json({ error: "Missing search query" });
  }

    const [rows] = await pool.query(
      `SELECT
         m.title,
         m.year,
         m.rating,
         GROUP_CONCAT(g.name) as genres
      FROM movies m
      JOIN movie_genre mg
        ON m.id = mg.movie_id
      JOIN genres g
        ON mg.genre_id = g.id
      WHERE m.title LIKE ?
      GROUP BY m.title, m.year, m.rating
      LIMIT 5`,
      [`%${title}%`]
    );
  console.log('search', rows);
  res.json(rows);
});

app.listen(4000, () => console.log("Server running on port 4000"));