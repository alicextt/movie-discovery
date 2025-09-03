import express from "express";
import cors from "cors";
import { PrismaClient } from '@prisma/client';
import moviesRouter from './routes/movies.js';
import genresRouter from './routes/genres.js';

const prisma = new PrismaClient();
const app = express();
app.use(cors());
app.use(express.json());

app.use('/api/movies', moviesRouter);
app.use('/api/genres', genresRouter);

app.listen(4000, () => console.log("Server running on port 4000"));