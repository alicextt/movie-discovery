import express from "express";
import cors from "cors";
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
const app = express();
app.use(cors());
app.use(express.json());

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
  order = order.toLowerCase() === "asc" ? "asc" : "desc";

  let query = prisma.movies.findMany({
    skip: Number(start),
    take: Number(count),
    orderBy: [
      { rating: order.toLowerCase() === 'asc' ? 'asc' : 'desc' },
      { year: 'asc' },
      { id: 'asc' }
    ],
    where: {
      AND: [
        genre ? { movie_genre: { some: { genres: { name: genre } } } } : {},
        minRating ? { rating: { gte: Number(minRating) } } : {},
        year ? { year: Number(year) } : {}
      ]
    },
    include: {
      movie_genre: {
        include: {
          genres: { select: { id: true, name: true } }
        }
      }
    }
  });

  const [rows, total] = await prisma.$transaction([
    query,
    prisma.movies.count({
      where: {
        AND: [
          genre ? { movie_genre: { some: { genres: { name: genre } } } } : {},
          minRating ? { rating: { gte: Number(minRating) } } : {},
          year ? { year: Number(year) } : {}
        ]
      }
    })
  ]);

  const moviesWithGenres = rows.map(movie => ({
    id: movie.id,
    title: movie.title,
    rating: movie.rating,
    year: movie.year,
    genres: movie.movie_genre.map(mg => mg.genres)
  }));

  res.json({ results: moviesWithGenres, start: Number(start), count: moviesWithGenres.length, total });
});

app.get("/api/movies/aggregate", async (req, res) => {
  // Total count
  const totalCount = await prisma.movies.count();

  // Genre aggregation
  const genres = await prisma.genres.findMany({
    include: {
      _count: { select: { movie_genre: true } }
    }
  });
  const genreCounts = genres.map(g => ({
    name: g.name,
    count: g._count.movie_genre
  })).sort((a, b) => b.count - a.count);

  // Average rating
  const avgRatingAgg = await prisma.movies.aggregate({
    _avg: { rating: true }
  });
  const averageRating = avgRatingAgg._avg.rating;

  // Year aggregation
  const yearCountsRaw = await prisma.movies.groupBy({
    by: ['year'],
    _count: { id: true },
    orderBy: { year: 'asc' }
  });
  const yearCounts = yearCountsRaw.map(y => ({ year: y.year, count: y._count.id }));

  res.json({ totalCount, genres: genreCounts, averageRating, yearCounts });
});

app.get("/api/movies/search", async (req, res) => {
  const { title } = req.query;

  if (!title) {
    return res.status(400).json({ error: "Missing search query" });
  }

  const rows = await prisma.movies.findMany({
    where: {
      title: { contains: title }
    },
    include: {
      movie_genre: {
        include: { genres: true }
      }
    },
    take: 5
  });

  const results = rows.map(m => ({
   id: m.id,
    title: m.title,
    rating: m.rating,
    year: m.year,
    genres: m.movie_genre.map(mg => mg.genres.name).join(", ")
  }));

  res.json(results);
});

app.listen(4000, () => console.log("Server running on port 4000"));