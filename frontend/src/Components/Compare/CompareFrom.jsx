import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

export default function CompareProperties() {
  const [formData, setFormData] = useState({
    number_of_bedrooms: "",
    number_of_bathrooms: "",
    living_area: "",
    price_range: "",
  });

  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleCompareSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      const response = await axios.post('http://127.0.0.1:8000/compare-by-features', formData);
      const properties = response.data.properties;
      navigate("/compare-results", { state: { properties } });
    } catch (error) {
      console.error("Error fetching comparison results:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="compare-properties-page">
      <h2>Compare Apartments</h2>
      <form onSubmit={handleCompareSubmit} className="compare-properties-form">
        <div className="form-group">
          <label htmlFor="number_of_bedrooms">Number of Bedrooms</label>
          <input
            type="number"
            id="number_of_bedrooms"
            name="number_of_bedrooms"
            value={formData.number_of_bedrooms}
            onChange={handleInputChange}
            className="form-input"
          />
        </div>
        <div className="form-group">
          <label htmlFor="number_of_bathrooms">Number of Bathrooms</label>
          <input
            type="number"
            id="number_of_bathrooms"
            name="number_of_bathrooms"
            value={formData.number_of_bathrooms}
            onChange={handleInputChange}
            className="form-input"
          />
        </div>
        <div className="form-group">
          <label htmlFor="living_area">Living Area (sq. ft.)</label>
          <input
            type="number"
            id="living_area"
            name="living_area"
            value={formData.living_area}
            onChange={handleInputChange}
            className="form-input"
          />
        </div>
        <div className="form-group">
          <label htmlFor="price_range">Price Range</label>
          <input
            type="text"
            id="price_range"
            name="price_range"
            value={formData.price_range}
            onChange={handleInputChange}
            className="form-input"
          />
        </div>
        <button type="submit" className="submit-button" disabled={isLoading}>
          {isLoading ? 'Loading...' : 'Compare'}
        </button>
      </form>
    </div>
  );
}
