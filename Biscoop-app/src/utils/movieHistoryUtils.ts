// Utility functions for managing movie history

import type { Movie } from '../types';

/**
 * Get movie history from localStorage
 */
export const getMovieHistory = (): Movie[] => {
  try {
    const savedHistory = localStorage.getItem('movieHistory');
    if (savedHistory) {
      return JSON.parse(savedHistory);
    }
  } catch (error) {
    console.error('Error loading movie history:', error);
  }
  return [];
};

/**
 * Save movie history to localStorage
 */
export const saveMovieHistory = (movies: Movie[]): boolean => {
  try {
    localStorage.setItem('movieHistory', JSON.stringify(movies));
    return true;
  } catch (error) {
    console.error('Error saving movie history:', error);
    return false;
  }
};

/**
 * Add a movie to history
 */
export const addMovieToHistory = (movie: Omit<Movie, 'watchedDate'>): boolean => {
  try {
    const history = getMovieHistory();
    
    // Check if movie already exists
    const existingIndex = history.findIndex(m => m.id === movie.id);
    
    const newMovie: Movie = {
      ...movie,
      watchedDate: new Date().toISOString().split('T')[0] // Current date in YYYY-MM-DD format
    };
    
    if (existingIndex !== -1) {
      // Update existing movie
      history[existingIndex] = newMovie;
    } else {
      // Add new movie to the beginning
      history.unshift(newMovie);
    }
    
    return saveMovieHistory(history);
  } catch (error) {
    console.error('Error adding movie to history:', error);
    return false;
  }
};

/**
 * Remove a movie from history
 */
export const removeMovieFromHistory = (movieId: number): boolean => {
  try {
    const history = getMovieHistory();
    const filteredHistory = history.filter(m => m.id !== movieId);
    return saveMovieHistory(filteredHistory);
  } catch (error) {
    console.error('Error removing movie from history:', error);
    return false;
  }
};

/**
 * Update movie rating or review
 */
export const updateMovieInHistory = (
  movieId: number, 
  updates: Partial<Pick<Movie, 'rating' | 'review'>>
): boolean => {
  try {
    const history = getMovieHistory();
    const movieIndex = history.findIndex(m => m.id === movieId);
    
    if (movieIndex !== -1) {
      history[movieIndex] = {
        ...history[movieIndex],
        ...updates
      };
      return saveMovieHistory(history);
    }
    return false;
  } catch (error) {
    console.error('Error updating movie in history:', error);
    return false;
  }
};

/**
 * Clear all movie history
 */
export const clearMovieHistory = (): boolean => {
  try {
    localStorage.removeItem('movieHistory');
    return true;
  } catch (error) {
    console.error('Error clearing movie history:', error);
    return false;
  }
};

/**
 * Get statistics from movie history
 */
export const getMovieStatistics = () => {
  const movies = getMovieHistory();
  
  const totalMovies = movies.length;
  const totalMinutes = movies.reduce((sum, movie) => sum + movie.duration, 0);
  const totalHours = Math.round(totalMinutes / 60);
  const avgRating = totalMovies > 0
    ? (movies.reduce((sum, movie) => sum + movie.rating, 0) / totalMovies).toFixed(1)
    : '0.0';
  
  // Get genre distribution
  const genreCount: Record<string, number> = {};
  movies.forEach(movie => {
    genreCount[movie.genre] = (genreCount[movie.genre] || 0) + 1;
  });
  
  const favoriteGenre = Object.entries(genreCount).sort((a, b) => b[1] - a[1])[0]?.[0] || 'None';
  
  return {
    totalMovies,
    totalHours,
    avgRating,
    favoriteGenre,
    genreDistribution: genreCount
  };
};

/**
 * Initialize movie history with sample data
 */
export const initializeSampleHistory = (): boolean => {
  // Only initialize if no history exists
  if (getMovieHistory().length > 0) {
    return false;
  }
  
  const sampleMovies: Movie[] = [
    {
      id: 1,
      title: "Psych: The Movie",
      poster: "🎬",
      genre: "Comedy",
      year: 2017,
      duration: 88,
      rating: 5,
      watchedDate: "2024-10-15",
      review: "Hilarious continuation of the series! Perfect blend of mystery and humor."
    },
    {
      id: 2,
      title: "The Shawshank Redemption",
      poster: "🎭",
      genre: "Drama",
      year: 1994,
      duration: 142,
      rating: 5,
      watchedDate: "2024-10-10",
      review: "Absolutely masterpiece. One of the best films ever made."
    },
    {
      id: 3,
      title: "Inception",
      poster: "🌀",
      genre: "Science Fiction",
      year: 2010,
      duration: 148,
      rating: 5,
      watchedDate: "2024-10-05",
      review: "Mind-bending thriller that keeps you thinking long after it ends."
    }
  ];
  
  return saveMovieHistory(sampleMovies);
};