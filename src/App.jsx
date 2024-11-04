import React, { useState, useEffect, useRef } from 'react';
import reactLogo from './assets/react.svg';
import viteLogo from '/vite.svg';
import './App.css';

function App() {
  const [restaurantName, setRestaurantName] = useState('');
  const [results, setResults] = useState([]);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const searchTimeout = useRef(null);
  const fetchRestaurantData = async (name) => {
    setIsLoading(true);
    setError('');
    setResults([]);

    try {
      const response = await fetch(`https://restaurant-inspection-api-40554916dc60.herokuapp.com/search?restaurant_name=${encodeURIComponent(name)}`);
      if (!response.ok) throw new Error('Network response was not ok');
      const { data } = await response.json();

      if (data && data.length > 0) {
        setResults(data);
      } else {
        setError('No results found.');
      }
    } catch (error) {
      setError('Error fetching results.');
      console.error('Error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchWithPromises = (name) => {
    setIsLoading(true);
    setError('');
    setResults([]);

    fetch(`https://restaurant-inspection-api-40554916dc60.herokuapp.com/search?restaurant_name=${encodeURIComponent(name)}`)
      .then((response) => {
        if (!response.ok) throw new Error('Network response was not ok');
        return response.json();
      })
      .then((data) => {
        if (data && data.length > 0) {
          setResults(data);
        } else {
          setError('No results found.');
        }
      })
      .catch((error) => {
        setError('Error fetching results.');
        console.error('Error:', error);
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  const handleInputChange = (event) => {
    const name = event.target.value;
    setRestaurantName(name);

    clearTimeout(searchTimeout.current);
    if (name.trim()) {
      searchTimeout.current = setTimeout(() => {
        fetchRestaurantData(name.trim()); 
      }, 500);
    } else {
      setResults([]);
      setError('');
    }
  };

  useEffect(() => {
    return () => clearTimeout(searchTimeout.current);
  }, []);

  return (
    <>
      <div>
        <a href="https://vite.dev" target="_blank">
          <img src={viteLogo} className="logo" alt="Vite logo" />
        </a>
        <a href="https://react.dev" target="_blank">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
      </div>
      <h1>Restaurant Inspection Search</h1>
      <div id="search">
        <label htmlFor="restaurantName">Restaurant Name:</label>
        <input
          type="text"
          id="restaurantName"
          value={restaurantName}
          onChange={handleInputChange}
          placeholder="Enter a Restaurant Name"
        />
      </div>
      
      {isLoading && <p>Loading...</p>}
      {error && <p className="error">{error}</p>}

      <div id="results">
        {results.map((inspection, index) => (
          <div key={index} className="inspection">
            <h4>{inspection.restaurant_name}</h4>
            <p><strong>Borough:</strong> {inspection.borough}</p>
            <p><strong>Cuisine:</strong> {inspection.cuisine}</p>
            <p><strong>Grade:</strong> {inspection.grade}</p>
            <p><strong>Grade Date:</strong> {inspection.grade_date}</p>
            <p><strong>Inspection Date:</strong> {inspection.inspection_date}</p>
            <p><strong>Restaurant Id:</strong> {inspection.restaurant_id}</p>
            <p><strong>Score:</strong> {inspection.score}</p>
            <p><strong>Violation Code:</strong> {inspection.violation_code}</p>
            <p><strong>Violation Description:</strong> {inspection.violation_description}</p>
            <p><strong>Zipcode:</strong> {inspection.zipcode}</p>
          </div>
        ))}
      </div>
    </>
  );
}

export default App;
