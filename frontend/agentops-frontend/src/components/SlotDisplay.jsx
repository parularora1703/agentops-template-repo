import React, { useState, useEffect } from 'react';
import axios from 'axios';

function SlotDisplay({ city, branch, day }) {
  const [slots, setSlots] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchSlots = async () => {
      if (!city || !branch || !day) return; // Ensure that all params are available
      
      setLoading(true);
      setError(null);
      try {
        // Make the API call to fetch slots based on city, branch, and day
        const response = await axios.get(
          `http://localhost:8000/slots/${city}/${branch}/${day}`
        );
        setSlots(response.data.slots);
      } catch (err) {
        setError("Error fetching slots");
        console.error("Error fetching slots:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchSlots();
  }, [city, branch, day]); // Rerun the API call when city, branch, or day changes

  return (
    <div className="card mt-4">
      <div className="card-body">
        <h5 className="card-title">Available Slots for {branch}</h5>
        <p className="card-text">City: {city}</p>
        <p className="card-text">Day: {day}</p>

        {loading ? (
          <p>Loading...</p>
        ) : error ? (
          <p className="text-danger">{error}</p>
        ) : (
          <ul>
            {slots.length > 0 ? (
              slots.map((slot, index) => (
                <li key={index}>{slot}</li>
              ))
            ) : (
              <li>No slots available</li>
            )}
          </ul>
        )}
      </div>
    </div>
  );
}

export default SlotDisplay;
