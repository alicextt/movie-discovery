import { useState, useEffect } from 'react';
import Select from 'react-select';
import './AddMoviePage.css';

function AddMoviePage() {
  const [title, setTitle] = useState('');
  const [rating, setRating] = useState('');
  const [year, setYear] = useState('');
  const [genreOptions, setGenreOptions] = useState([]);
  const [selectedGenres, setSelectedGenres] = useState([]);
  const [message, setMessage] = useState('');
  const [errors, setErrors] = useState({});

  useEffect(() => {
    fetch('http://localhost:4000/api/genres')
      .then(res => res.json())
      .then(data => setGenreOptions(data.map(g => ({ value: g.id, label: g.name }))));
  }, []);

  const validate = () => {
    const errs = {};
    if (!title.trim()) errs.title = 'Title is required';
    if (!rating || isNaN(rating) || Number(rating) < 0 || Number(rating) > 10) errs.rating = 'Rating must be 0-10';
    if (!year || isNaN(year) || Number(year) < 1900 || Number(year) > new Date().getFullYear() + 1) errs.year = 'Year is invalid';
    if (!selectedGenres.length) errs.genres = 'At least one genre required';
    return errs;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    const errs = validate();
    setErrors(errs);
    if (Object.keys(errs).length) return;
    const genreIds = selectedGenres.map(g => g.value);
    const res = await fetch('http://localhost:4000/api/movies', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title, rating: Number(rating), year: Number(year), genreIds })
    });
    if (res.ok) {
      setMessage('Movie added!');
      setTitle(''); 
      setRating(''); 
      setYear(''); 
      setSelectedGenres([]); 
      setErrors({});
    } else {
      setMessage('Failed to add movie');
    }
  };

  return (
    <div className="add-movie-container">
      <h2 className="add-movie-title">Add Movie</h2>
      <form onSubmit={handleSubmit} className="add-movie-form">
        <div className="form-group">
          <label htmlFor="title">Title:</label>
          <input id="title" value={title} onChange={e => setTitle(e.target.value)} required className="form-input" />
          {errors.title && <div className="form-error">{errors.title}</div>}
        </div>
        <div className="form-group">
          <label htmlFor="rating">Rating:</label>
          <input id="rating" type="number" step="0.1" value={rating} onChange={e => setRating(e.target.value)} required className="form-input" />
          {errors.rating && <div className="form-error">{errors.rating}</div>}
        </div>
        <div className="form-group">
          <label htmlFor="year">Year:</label>
          <input id="year" type="number" value={year} onChange={e => setYear(e.target.value)} required className="form-input" />
          {errors.year && <div className="form-error">{errors.year}</div>}
        </div>
        <div className="form-group">
          <label>Genres:</label>
          <Select
            isMulti
            options={genreOptions}
            value={selectedGenres}
            onChange={setSelectedGenres}
            placeholder="Select genres"
            classNamePrefix="react-select"
          />
          {errors.genres && <div className="form-error">{errors.genres}</div>}
        </div>
        <button type="submit" className="add-movie-btn">Add Movie</button>
      </form>
      {message && <div className="add-movie-message">{message}</div>}
    </div>
  );
}

export default AddMoviePage;
