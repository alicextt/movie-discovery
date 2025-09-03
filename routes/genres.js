import express from 'express';
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();
const router = express.Router();

// Get all genres
router.get('/', async (req, res) => {
  const genres = await prisma.genres.findMany();
  res.json(genres);
});

export default router;
