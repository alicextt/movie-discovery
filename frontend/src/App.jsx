import { useState } from 'react'
import './App.css'
import { useEffect } from 'react'

import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import SearchPage from "./SearchPage";
import HomePage from "./HomePage";
import MoviesPage from "./MoviesPage";

export default function App() {
  return (
    <Router>
      <h1>Movie library explorer</h1>
      <nav className="nav">
        <Link to="/">Home</Link>
        <Link to="/search">Search</Link>
        <Link to="/movies">Movies</Link>
      </nav>

      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/search" element={<SearchPage />} />
        <Route path="/movies" element={<MoviesPage />} />
      </Routes>
    </Router>
  );
}
