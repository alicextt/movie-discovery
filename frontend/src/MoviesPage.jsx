import { useEffect } from "react";
import { useState } from "react";

export default function MoviesPage() {
  const [movies, setMovies] = useState([]);
  const [hasMore, setHasMore] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      const response = await fetch("http://localhost:4000/api/movies?order=desc&count=10&start=0");
      const data = await response.json();
      setMovies(data.results);
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
    <div>
      <h2>Top Rated Movies</h2>
        {movies && movies.map((movie, index) => (
        <div className="rating-container"> 
         <div className="u-bold">{index + 1}.</div>
         <div key={movie.id}>{movie.title} - {movie.rating}</div>
        </div>
        ))}

        {hasMore && <button onClick={handleShowMore}> Show more </button>}
    </div>
  );
}
