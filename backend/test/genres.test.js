// test/genres.mock.test.js
import { describe, it, expect, vi } from 'vitest';
import request from 'supertest';
import express from 'express';

// Mock PrismaClient
vi.mock('@prisma/client', () => {
  return {
    PrismaClient: vi.fn().mockImplementation(() => ({
      genres: {
        findMany: vi.fn().mockResolvedValue([
          { id: 1, name: 'Action' },
          { id: 2, name: 'Comedy' },
          { id: 3, name: 'Drama' }
        ])
      },
      $disconnect: vi.fn()
    }))
  };
});

import genresRouter from '../routes/genres.js';

const app = express();
app.use('/api/genres', genresRouter);

describe('Genres API (mocked Prisma)', () => {
  it('GET / - get all genres', async () => {
    const res = await request(app).get('/api/genres');
    expect(res.status).toBe(200);
    expect(res.body.length).toBe(3);
    expect(res.body[0]).toHaveProperty('id');
    expect(res.body[0]).toHaveProperty('name');
  });
});
