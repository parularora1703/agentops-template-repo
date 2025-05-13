import React, { useState, useEffect } from 'react';
import axios from 'axios';

function CitySelector({ onCityChange }) {
  const [cities, setCities] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCities = async () => {
      setLoading(true);
      setError(null);
      try {
        // Make the API call to fetch cities
        const response = await axios.get('http://localhost:8000/cities');
        setCities(response.data.cities);
      } catch (err) {
        setError("Error fetching cities");
        console.error("Error fetching cities:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchCities();
  }, []);

  return (
    <div className="mb-3">
      <label htmlFor="city" className="form-label">Select City: </label>
      {loading ? (
        <p>Loading...</p>
      ) : error ? (
        <p className="text-danger">{error}</p>
      ) : (
        <select
          id="city"
          className="form-select"
          onChange={(e) => onCityChange(e.target.value)}
        >
          <option value="">--Select--</option>
          {cities.map((city) => (
            <option key={city} value={city}>
              {city}
            </option>
          ))}
        </select>
      )}
    </div>
  );
}

export default CitySelector;
