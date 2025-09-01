import { useState } from 'react'
import './App.css'
import { useEffect } from 'react'

function App() {
  useEffect(() => {
    // Fetch movie data from the API
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

  const [movies, setMovies] = useState([]);
  const [genres, setGenres] = useState([]);
  const [averageRating, setAverageRating] = useState();
  const [yearCounts, setYearCounts] = useState([]);

  return (
    <>
        <div> <span className='u-bold'>Total movies:</span> {movies} </div>
        <div> <span className='u-bold'>Average ratings:</span> {parseFloat(averageRating).toFixed(2)} </div>
        <div> 
          <p className='u-bold'>Top genres:</p>
          <table className='genre-table'>
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
      <div > 
          <p className='u-bold'>Movies by year:</p>
          <table className='genre-table'>
            <thead>
              <tr>
                <th>Year</th>
                <th>Count</th>
              </tr>
            </thead>
            <tbody>
              {yearCounts && yearCounts.map((year) => (
                <tr key={year.year}>
                  <td>{year.year}</td>
                  <td>{year.count}</td>
                </tr>
              ))}
            </tbody>
          </table>
      </div>
    </>
  )
}

export default App