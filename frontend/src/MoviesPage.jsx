import { useEffect, useState } from "react";
import './MoviesPage.css';

export default function MoviesPage() {
  const [movies, setMovies] = useState([]);
  const [hasMore, setHasMore] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      const response = await fetch("http://localhost:4000/api/movies?order=desc&count=10&start=0");
      const data = await response.json();
      setMovies(data.results);
      setHasMore(data.total > data.start + data.count);
    };
    fetchData();
  }, []);

  const handleShowMore = async () => {
    const response = await fetch(`http://localhost:4000/api/movies?order=desc&count=10&start=${movies.length}`);
    const data = await response.json();
    setMovies((prevMovies) => [...prevMovies, ...data.results]);
    setHasMore(data.total > data.start + data.count);
  };

  return (
    <div className="movies-container">
      <h2 className="movies-title">Top Rated Movies</h2>
      <div className="movies-list">
        {movies && movies.map((movie, index) => (
          <div className="movie-card" key={movie.id}>
            <div className="movie-rank">{index + 1}.</div>
            <div className="movie-info">
              <div className="movie-title">{movie.title}</div>
              <div className="movie-rating">⭐ {movie.rating}</div>
              <div className="movie-year">Year: {movie.year}</div>
              {movie.genres && Array.isArray(movie.genres) && (
                <div className="movie-genres">
                  {movie.genres.map(g => g.name).join(', ')}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
      {hasMore && <button className="show-more-btn" onClick={handleShowMore}>Show more</button>}
    </div>
  );
}
