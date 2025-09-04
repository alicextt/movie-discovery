import express from 'express';
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();
const router = express.Router();

// Create a new movie
router.post('/', async (req, res) => {
  const { title, rating, year, genreIds } = req.body;
  if (!title || !rating || !year || !genreIds || !genreIds.length) {
    return res.status(400).json({ error: "Missing required fields" });
  }
  try {
    const movie = await prisma.movies.create({
      data: {
        title,
        rating,
        year,
        movie_genre: {
          create: genreIds.map(id => ({ genres: { connect: { id } } }))
        }
      }
    });
    res.status(201).json(movie);
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
});

// Get movies with filters and pagination
router.get('/', async (req, res) => {
  let { genre, minRating, year, order = "desc", count = 10, start = 0 } = req.query;
  order = order.toLowerCase() === "asc" ? "asc" : "desc";

  let query = prisma.movies.findMany({
    skip: Number(start),
    take: Number(count),
    orderBy: [
      { rating: order },
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
    genres: movie.movie_genre.map(mg => mg.genres.name)
  }));
  res.json({ results: moviesWithGenres, start: Number(start), count: moviesWithGenres.length, total });
});

// Search movies by title
router.get('/search', async (req, res) => {
  const { title } = req.query;
  if (!title) {
    return res.status(400).json({ error: "Missing search query" });
  }
  const rows = await prisma.movies.findMany({
    where: { title: { contains: title } },
    include: { movie_genre: { include: { genres: true } } },
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

// Get movie aggregation data
router.get('/aggregate', async (req, res) => {
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
  })).sort((a, b) => b.count - a.count).slice(0, 5);

  // Average rating
  const avgRatingAgg = await prisma.movies.aggregate({
    _avg: { rating: true }
  });
  const averageRating = avgRatingAgg._avg.rating;

  // Year aggregation with movie names
  const years = await prisma.movies.findMany({
    select: {
      year: true,
      title: true,
    },
    orderBy: { year: 'asc' }
  });
  // Group by year
  const yearMap = {};
  years.forEach(({ year, title }) => {
    if (!yearMap[year]) yearMap[year] = [];
    yearMap[year].push(title);
  });
  const yearCounts = Object.entries(yearMap).map(([year, titles]) => ({
    year: Number(year),
    count: titles.length,
    movies: titles
  })).sort((a, b) => a.year - b.year);

  res.json({ totalCount, genres: genreCounts, averageRating, yearCounts });
});

export default router;
