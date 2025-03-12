import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../styles/HomePage.css';

function HomePage() {
  const navigate = useNavigate();
  const [backgroundImages, setBackgroundImages] = useState([]);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const API_KEY = '7926efe5ed0c909bd5775074f63c529fתח_שלך';

  useEffect(() => {
    const fetchBackgroundImages = async () => {
      try {
        const response = await axios.get(
          `https://api.themoviedb.org/3/movie/popular?api_key=${API_KEY}&language=he-IL&page=1`
        );
        const movies = response.data.results;
        const images = movies
          .map((movie) => `https://image.tmdb.org/t/p/original${movie.backdrop_path}`)
          .filter((path) => path); 
        setBackgroundImages(images);
      } catch (error) {
        console.error('Error fetching background images:', error);
      }
    };

    fetchBackgroundImages();
  }, []);

  useEffect(() => {
    let interval;
    if (backgroundImages.length > 0) {
      interval = setInterval(() => {
        setCurrentImageIndex((prevIndex) => (prevIndex + 1) % backgroundImages.length);
      }, 5000);
    }
    return () => clearInterval(interval);
  }, [backgroundImages]);

  const handleSearchClick = () => {
    navigate('/search');
  };

  return (
    <div
      className="home-container"
      style={{
        backgroundImage: `url(${backgroundImages[currentImageIndex]})`,
      }}
    >
      <h1 className="home-title">גלה את הסרט הבא שלך</h1>
      <button className="search-button" onClick={handleSearchClick}>
        חיפוש סרטים
      </button>
      <footer>© זכויות יוצרים - שון פסיס</footer>
    </div>
  );
}

export default HomePage;
