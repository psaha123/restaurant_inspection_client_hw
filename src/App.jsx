import React, { useState, useEffect, useRef } from 'react';
import './App.css';

function App() {
  const [restaurantName, setRestaurantName] = useState('');
  const [results, setResults] = useState([]);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const searchTimeout = useRef(null);

  // Function to handle input changes with debounce
  const handleInputChange = (event) => {
    const name = event.target.value;
    setRestaurantName(name);

    clearTimeout(searchTimeout.current);
    if (name.trim()) {
      // Set a debounce to delay the API call
      searchTimeout.current = setTimeout(() => {
        fetchRestaurantData(name.trim());
      }, 500);
    } else {
      setResults([]);
      setError('');
    }
  };

  // Function to fetch restaurant data
  const fetchRestaurantData = async (name) => {
    setIsLoading(true);
    setError('');
    setResults([]);
    
    try {
      const response = await fetch(`https://restaurant-inspection-api-40554916dc60.herokuapp.com/search?restaurant_name=${encodeURIComponent(name)}`);
      
      if (!response.ok) throw new Error('Network response was not ok');

      const jsonResponse = await response.json();
      const { data } = jsonResponse;

      if (data && data.length > 0) {
        setResults(data);
      } else {
        setError('No results found.');
      }
    } catch (error) {
      setError('Error fetching results.');
      console.error('Error:', error);
    }
    setIsLoading(false);
  };

  // Cleanup timeout on component unmount
  useEffect(() => {
    return () => clearTimeout(searchTimeout.current);
  }, []);

  return (
    <div className="app">
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
    </div>
  );
}

export default App;
