import fs from "fs";
import path from "path";
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
const __dirname = path.dirname(new URL(import.meta.url).pathname);
const file = fs.readFileSync(path.join(__dirname, "../movie.json"));
const data = JSON.parse(file);

for (const movie of data) {
  // Upsert genre
  const genre = await prisma.genres.upsert({
    where: { name: movie.genre },
    update: {},
    create: { name: movie.genre }
  });

  // Upsert movie
  const dbMovie = await prisma.movies.upsert({
    where: { title: movie.title },
    update: { rating: movie.rating, year: movie.year },
    create: { title: movie.title, rating: movie.rating, year: movie.year }
  });

  await prisma.movie_genre.upsert({
    where: {
      movie_id_genre_id: {
        movie_id: dbMovie.id,
        genre_id: genre.id
      }
    },
    update: {},
    create: {
      movie_id: dbMovie.id,
      genre_id: genre.id
    }
  });

  console.log(`Imported: ${movie.title}`);
}

await prisma.$disconnect();
console.log("All JSON files imported!");
