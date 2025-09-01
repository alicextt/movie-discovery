import { useState } from "react";
import './Search.css';

export default function SearchPage() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [selected, setSelected] = useState(null);

  const handleSearch = async (query) => {
    setQuery(query);
    setSelected(null);

    if(query.length < 2) {
        setResults([]);
        return;
    }

    const res = await fetch(`http://localhost:4000/api/movies/search?title=${encodeURIComponent(query)}`);
    const data = await res.json();
    setResults(data);
  };

  const handleSelect = (movieId) => {
    setSelected(results.find(m => m.id === movieId));
    setResults([]);
    setQuery("");
  };

  return (
     <div className="container">
      <div className="search-wrapper">
        <input
          type="text"
          value={query}
          onChange={(e) => handleSearch(e.target.value)}
          placeholder="Search movies..."
          className={results.length > 0 ? "search-input open" : "search-input"}
        />

        {results.length > 0 && (
            <div className="dropdown">
            {results.map((movie) => (
                <button
                key={movie.id}
                className="dropdown-item"
                onClick={() => handleSelect(movie.id, movie.title)}
                >
                {movie.title} ({movie.year})
                </button>
            ))}
            </div>
        )}
      </div>

      {selected && (
        <div className="details-card">
          <h2>{selected.title}</h2>
          <p>Year: {selected.year}</p>
          <p>Rating: {selected.rating}</p>
          <p>Genres: {selected.genres}</p>
        </div>
      )}
    </div>
  );
}
