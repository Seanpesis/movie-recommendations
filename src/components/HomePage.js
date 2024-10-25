// HomePage.js
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../styles/HomePage.css';

function HomePage() {
  const navigate = useNavigate();
  const [backgroundImages, setBackgroundImages] = useState([]);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  // טוען את מפתח ה-API של TMDB ממשתני הסביבה
  const TMDB_API_KEY = process.env.REACT_APP_TMDB_API_KEY;

  // בדיקה לראות אם המפתח נטען
  console.log('TMDB API Key:', TMDB_API_KEY);

  useEffect(() => {
    const fetchBackgroundImages = async () => {
      try {
        // בדיקה נוספת לוודא שהמפתח נטען
        if (!TMDB_API_KEY) {
          throw new Error('TMDB API Key is not defined');
        }

        const response = await axios.get(
          `https://api.themoviedb.org/3/movie/popular?api_key=${TMDB_API_KEY}&language=he-IL&page=1`
        );
        const movies = response.data.results;
        const images = movies
          .map((movie) => `https://image.tmdb.org/t/p/original${movie.backdrop_path}`)
          .filter((path) => path); // סינון של תמונות תקינות
        setBackgroundImages(images);
      } catch (error) {
        console.error('Error fetching background images:', error);
      }
    };

    fetchBackgroundImages();
  }, [TMDB_API_KEY]);

  useEffect(() => {
    let interval;
    if (backgroundImages.length > 0) {
      interval = setInterval(() => {
        setCurrentImageIndex((prevIndex) => (prevIndex + 1) % backgroundImages.length);
      }, 10000); // משנה תמונה כל 10 שניות
    }
    return () => clearInterval(interval);
  }, [backgroundImages]);

  const handleSearchClick = () => {
    navigate('/search');
  };

  const handleChatNavigate = () => {
    navigate('/chat');
  };

  return (
    <div className="home-container">
      {backgroundImages.map((img, index) => (
        <div
          key={index}
          className={`background-image ${index === currentImageIndex ? 'active' : ''}`}
          style={{ backgroundImage: `url(${img})` }}
        />
      ))}
      <h1 className="home-title">גלה את הסרט הבא שלך</h1>
      <button className="search-button" onClick={handleSearchClick}>
        חיפוש סרטים
      </button>
      <button className="search-button" onClick={handleChatNavigate}>
        לא בטוחים במה לצפות? תנו לנו לעזור לכם
      </button>
      <footer>© זכויות יוצרים - שון פסיס</footer>
    </div>
  );
}

export default HomePage;
