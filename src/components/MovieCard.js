// MovieCard.js
import React from 'react';
import '../styles/MovieCard.css';

function MovieCard({ movie }) {
  const posterUrl = movie.poster_path
    ? `https://image.tmdb.org/t/p/w300${movie.poster_path}`
    : 'https://via.placeholder.com/300x450?text=No+Image';

  const searchUrl = `https://www.google.com/search?q=${encodeURIComponent(movie.title)}+לצפייה+ישירה`;

  return (
    <div className="movie-card">
      <img src={posterUrl} alt={movie.title} />
      <div className="movie-info">
        <h3>{movie.title}</h3>
        <p>דירוג: {movie.vote_average}</p>
        <p>תאריך יציאה: {movie.release_date}</p>
        <a href={searchUrl} target="_blank" rel="noopener noreferrer" className="watch-button">
          חפש לצפייה ישירה
        </a>
      </div>
    </div>
  );
}

export default MovieCard;
