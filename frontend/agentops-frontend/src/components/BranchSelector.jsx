import React, { useState, useEffect } from 'react';
import axios from 'axios';

function BranchSelector({ city, onBranchChange }) {
  const [branches, setBranches] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (city) {
      const fetchBranches = async () => {
        setLoading(true);
        setError(null);
        try {
          // Make the API call to fetch branches for the selected city
          const response = await axios.get(`http://localhost:8000/branches/${city}`);
          setBranches(response.data.branches);
        } catch (err) {
          setError("Error fetching branches");
          console.error("Error fetching branches:", err);
        } finally {
          setLoading(false);
        }
      };

      fetchBranches();
    }
  }, [city]);

  return (
    <div className="mb-3">
      <label htmlFor="branch" className="form-label">Select Branch: </label>
      {loading ? (
        <p>Loading...</p>
      ) : error ? (
        <p className="text-danger">{error}</p>
      ) : (
        <select
          id="branch"
          className="form-select"
          onChange={(e) => onBranchChange(e.target.value)}
        >
          <option value="">--Select--</option>
          {branches.map((branch) => (
            <option key={branch} value={branch}>
              {branch}
            </option>
          ))}
        </select>
      )}
    </div>
  );
}

export default BranchSelector;
