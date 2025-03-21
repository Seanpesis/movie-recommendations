import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import MovieCard from './MovieCard';
import '../styles/SearchPage.css';

function SearchPage() {
  const [searchType, setSearchType] = useState('top_rated');
  const [query, setQuery] = useState('');
  const [movies, setMovies] = useState([]);
  const [genres, setGenres] = useState([]);
  const [page, setPage] = useState(1);
  const API_KEY = '7926efe5ed0c909bd5775074f63c529f';

  const navigate = useNavigate();

  const handleGoHome = useCallback(() => {
    navigate('/');
  }, [navigate]);

  const fetchMoviesByDirector = useCallback(async () => {
    try {
      const personResponse = await axios.get(
        `https://api.themoviedb.org/3/search/person?api_key=${API_KEY}&query=${query}&language=he-IL`
      );
      if (personResponse.data.results.length > 0) {
        const directorId = personResponse.data.results[0].id;
        const moviesResponse = await axios.get(
          `https://api.themoviedb.org/3/discover/movie?api_key=${API_KEY}&with_crew=${directorId}&language=he-IL&page=${page}`
        );
        if (page === 1) {
          setMovies(moviesResponse.data.results);
        } else {
          setMovies((prevMovies) => [...prevMovies, ...moviesResponse.data.results]);
        }
      } else {
        console.warn('No director found with that name');
        setMovies([]);
      }
    } catch (error) {
      console.error('Error fetching movies by director:', error);
      setMovies([]);
    }
  }, [API_KEY, query, page]);

  const fetchMovies = useCallback(async () => {
    let url = '';
    if (searchType === 'top_rated') {
      url = `https://api.themoviedb.org/3/movie/top_rated?api_key=${API_KEY}&language=he-IL&page=${page}`;
    } else if (searchType === 'genre' && query) {
      url = `https://api.themoviedb.org/3/discover/movie?api_key=${API_KEY}&with_genres=${query}&language=he-IL&page=${page}`;
    } else if (searchType === 'release_date' && query) {
      url = `https://api.themoviedb.org/3/discover/movie?api_key=${API_KEY}&primary_release_year=${query}&language=he-IL&page=${page}`;
    } else if (searchType === 'movie_name' && query) {
      url = `https://api.themoviedb.org/3/search/movie?api_key=${API_KEY}&query=${query}&language=he-IL&page=${page}`;
    } else if (searchType === 'director_name' && query) {
      await fetchMoviesByDirector();
      return;
    } else {
      console.warn('No query provided or invalid search type');
      setMovies([]);
      return;
    }

    try {
      const response = await axios.get(url);
      if (page === 1) {
        setMovies(response.data.results);
      } else {
        setMovies((prevMovies) => [...prevMovies, ...response.data.results]);
      }
    } catch (error) {
      console.error('Error fetching movies:', error);
      setMovies([]);
    }
  }, [API_KEY, searchType, query, page, fetchMoviesByDirector]);

  useEffect(() => {
    const fetchGenres = async () => {
      try {
        const response = await axios.get(
          `https://api.themoviedb.org/3/genre/movie/list?api_key=${API_KEY}&language=he-IL`
        );
        setGenres(response.data.genres);
      } catch (error) {
        console.error('Error fetching genres:', error);
      }
    };

    fetchGenres();
  }, [API_KEY]);

  useEffect(() => {
    fetchMovies();
  }, [fetchMovies]);

  const handleSearch = useCallback((e) => {
    e.preventDefault();
    setPage(1);
    fetchMovies();
  }, [fetchMovies]);

  const loadMoreMovies = useCallback(() => {
    setPage((prevPage) => prevPage + 1);
  }, []);

  return (
    <div className="search-container">
      <button className="home-button" onClick={handleGoHome}>
        חזרה לעמוד הבית
      </button>
      <h1 className="search-title">חיפוש והמלצות</h1>
      <form onSubmit={handleSearch}>
        <select
          value={searchType}
          onChange={(e) => {
            setSearchType(e.target.value);
            setQuery('');
            setMovies([]);
            setPage(1);
          }}
        >
          <option value="top_rated">המובחרים</option>
          <option value="genre">ז'אנר</option>
          <option value="release_date">תאריך יציאה</option>
          <option value="movie_name">שם הסרט</option>
          <option value="director_name">שם הבמאי</option>
        </select>

        {searchType === 'genre' && (
          <select
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setPage(1);
            }}
          >
            <option value="">בחר ז'אנר</option>
            {genres.map((genre) => (
              <option key={genre.id} value={genre.id}>
                {genre.name}
              </option>
            ))}
          </select>
        )}

        {searchType !== 'top_rated' && searchType !== 'genre' && (
          <input
            type="text"
            placeholder="הכנס ערך לחיפוש"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setPage(1);
            }}
          />
        )}

        <button type="submit">חפש</button>
      </form>

      <div className="movies-grid">
        {movies && movies.length > 0 ? (
          movies.map((movie, index) => (
            <MovieCard key={`${movie.id}-${index}`} movie={movie} />
          ))
        ) : (
          <p className="no-results">לא נמצאו תוצאות עבור החיפוש שלך.</p>
        )}
      </div>

      {movies && movies.length > 0 && (
        <button className="load-more-button" onClick={loadMoreMovies}>
          טען עוד סרטים
        </button>
      )}
    </div>
  );
}

export default SearchPage;