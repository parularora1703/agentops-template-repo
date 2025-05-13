import React, { useState, useEffect } from 'react';
import CitySelector from './components/CitySelector';
import BranchSelector from './components/BranchSelector';
import SlotDisplay from './components/SlotDisplay';
import './App.css';
import 'aos/dist/aos.css';
import AOS from 'aos';

function App() {
  const [city, setCity] = useState('');
  const [branch, setBranch] = useState('');
  const [day, setDay] = useState('');
  const [slots, setSlots] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    AOS.init({ duration: 800 });
  }, []);

  const handleCityChange = (city) => {
    setCity(city);
    setBranch('');
    setDay('');
    setSlots([]);
  };

  const handleBranchChange = (branch) => {
    setBranch(branch);
    setDay('');
    setSlots([]);
  };

  const handleDayChange = (event) => {
    setDay(event.target.value);
  };

  useEffect(() => {
    if (branch && day) {
      setLoading(true);
      setError(null);
      fetch(`http://localhost:8000/slots/${city}/${branch}/${day}`)
        .then((response) => {
          if (!response.ok) throw new Error('Network response was not ok');
          return response.json();
        })
        .then((data) => {
          setSlots(data.slots || []);
          setLoading(false);
        })
        .catch((err) => {
          console.error(err);
          setError('Error fetching slots');
          setLoading(false);
        });
    }
  }, [branch, day, city]);

  return (
    <div
      className="app-container text-center text-white"
      style={{
        backgroundImage: `url('/grill-bg.jpg')`,
        backgroundSize: 'cover',
        minHeight: '100vh',
        padding: '2rem',
      }}
    >
      <header className="app-header mb-4" data-aos="fade-down">
        <img src="/bbq-logo.jpg" alt="Barbeque Nation" className="logo mb-3" style={{ maxWidth: '150px' }} />
        <h1>Barbeque Nation Booking Agent</h1>
      </header>

      <div className="selectors container" data-aos="fade-up">
        <CitySelector onCityChange={handleCityChange} />
        {city && <BranchSelector city={city} onBranchChange={handleBranchChange} />}
        {branch && (
          <div className="form-group mt-3">
            <label htmlFor="day" className="form-label">Select Day:</label>
            <select id="day" className="form-select" onChange={handleDayChange}>
              <option value="">--Select--</option>
              {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'].map(d => (
                <option key={d} value={d}>{d}</option>
              ))}
            </select>
          </div>
        )}
      </div>

      {loading && <p className="mt-4">Loading slots...</p>}
      {error && <p className="mt-4 text-danger">{error}</p>}

      {branch && day && !loading && !error && (
        <div className="slot-display mt-4" data-aos="zoom-in">
          {slots.length > 0 ? (
            <SlotDisplay city={city} branch={branch} day={day} slots={slots} />
          ) : (
            <p>No slots available for the selected branch and day.</p>
          )}
        </div>
      )}
    </div>
  );
}

export default App;