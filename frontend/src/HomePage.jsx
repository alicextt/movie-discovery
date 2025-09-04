import { useState, useEffect } from 'react';
import './HomePage.css';

function HomePage() {
  const [movies, setMovies] = useState([]);
  const [genres, setGenres] = useState([]);
  const [averageRating, setAverageRating] = useState();
  const [yearCounts, setYearCounts] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const response = await fetch("http://localhost:4000/api/movies/aggregate");
      const data = await response.json();
      setMovies(data.totalCount);
      setGenres(data.genres);
      setAverageRating(data.averageRating);
      setYearCounts(data.yearCounts);
    };
    fetchData();
  }, []);

  return (
    <div className="home-container">
      <div className="home-row"><span className='home-bold'>Total movies:</span> {movies}</div>
      <div className="home-row"><span className='home-bold'>Average ratings:</span> {averageRating ? parseFloat(averageRating).toFixed(2) : '-'}</div>
      <div className="home-section">
        <p className='home-bold'>Top 5 genres:</p>
        <table className='home-table'>
          <thead>
            <tr>
              <th>Genre</th>
              <th>Count</th>
            </tr>
          </thead>
          <tbody>
            {genres && genres.map((genre) => (
              <tr key={genre.name}>
                <td>{genre.name}</td>
                <td>{genre.count}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="home-section">
        <p className='home-bold'>Movies by year:</p>
        <table className='home-table'>
          <thead>
            <tr>
              <th>Year</th>
              <th>Count</th>
              <th>Movies</th>
            </tr>
          </thead>
          <tbody>
            {yearCounts && yearCounts.map((year) => (
              <tr key={year.year}>
                <td>{year.year}</td>
                <td>{year.count}</td>
                <td>{year.movies && year.movies.join(', ')}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default HomePage;