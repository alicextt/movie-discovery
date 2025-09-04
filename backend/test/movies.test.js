// test/movies.mock.test.js
import { describe, it, expect, vi, beforeAll } from 'vitest';
import request from 'supertest';
import express from 'express';

// Mock PrismaClient
vi.mock('@prisma/client', () => {
  return {
    PrismaClient: vi.fn().mockImplementation(() => ({
      movies: {
        create: vi.fn().mockResolvedValue({
          id: 1,
          title: 'Inception',
          rating: 9,
          year: 2010,
          movie_genre: []
        }),
        findMany: vi.fn().mockResolvedValue([
          { id: 1, title: 'Inception', rating: 9, year: 2010, movie_genre: [{ genres: { name: 'Action' } }] }
        ]),
        count: vi.fn().mockResolvedValue(1),
        aggregate: vi.fn().mockResolvedValue({ _avg: { rating: 9 } }),
        groupBy: vi.fn().mockResolvedValue([{ year: 2010, _count: { id: 1 } }])
      },
      genres: {
        findMany: vi.fn().mockResolvedValue([{ name: 'Action', _count: { movie_genre: 1 } }])
      },
      $transaction: vi.fn((args) => Promise.all(args)),
      $disconnect: vi.fn()
    }))
  };
});

import moviesRouter from '../routes/movies.js';

const app = express();
app.use(express.json());
app.use('/api/movies', moviesRouter);

describe('Movies API (mocked Prisma)', () => {
  it('POST / - create a movie', async () => {
    const res = await request(app)
      .post('/api/movies')
      .send({ title: 'Inception', rating: 9, year: 2010, genreIds: [1] });

    expect(res.status).toBe(201);
    expect(res.body.title).toBe('Inception');
  });

  it('GET / - get movies', async () => {
    const res = await request(app).get('/api/movies');
    expect(res.status).toBe(200);
    expect(res.body.results[0].title).toBe('Inception');
    expect(res.body.results[0].genres).toContain('Action');
  });

  it('GET /search - search movies', async () => {
    const res = await request(app).get('/api/movies/search?title=Inception');
    expect(res.status).toBe(200);
    expect(res.body[0].title).toBe('Inception');
    expect(res.body[0].genres).toBe('Action');
  });

  it('GET /aggregate - aggregate data', async () => {
    const res = await request(app).get('/api/movies/aggregate');
    expect(res.status).toBe(200);
    expect(res.body.totalCount).toBeGreaterThan(0);
    expect(res.body.genres[0]).toHaveProperty('name');
    expect(res.body.genres[0]).toHaveProperty('count');
    expect(res.body.averageRating).toBe(9);
  });
});
