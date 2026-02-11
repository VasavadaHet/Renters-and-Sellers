import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
// import './PredictPrice.css';

const PredictPrice = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    number_of_bedrooms: '',
    number_of_bathrooms: '',
    living_area: '',
    // condition_of_the_house: '',
    // grade_of_the_house: '',
    built_year: '',
    // lattitude: '',
    // longitude: ''
  });

  const [predictedPrice, setPredictedPrice] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handlePredict = async () => {
    setLoading(true);
    setError('');

    try {
      const response = await fetch('http://localhost:8000/predict-price', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          number_of_bedrooms: parseInt(formData.number_of_bedrooms),
          number_of_bathrooms: parseFloat(formData.number_of_bathrooms),
          living_area: parseFloat(formData.living_area),
          // condition_of_the_house: parseInt(formData.condition_of_the_house),
          // grade_of_the_house: parseInt(formData.grade_of_the_house),
          built_year: parseInt(formData.built_year),
          // lattitude: parseFloat(formData.lattitude),
          // longitude: parseFloat(formData.longitude)
        })
      });

      if (!response.ok) {
        throw new Error('Prediction request failed');
      }

      const data = await response.json();
      setPredictedPrice(data.predicted_price);
    } catch (err) {
      console.error('Prediction Error:', err);
      setError('Failed to predict price.');
    } finally {
      setLoading(false);
    }
  };

  const handleGoBack = () => {
    navigate(-1);
  };

  return (
    <div className="predict-price-container">
      <div className="predict-price-card">
        <h2>🏡 Predict Property Price</h2>

        <div className="form-group">
          <input type="number" name="number_of_bedrooms" value={formData.number_of_bedrooms} onChange={handleChange} placeholder="Number of Bedrooms" />
          <input type="number" step="0.5" name="number_of_bathrooms" value={formData.number_of_bathrooms} onChange={handleChange} placeholder="Number of Bathrooms" />
          <input type="number" name="living_area" value={formData.living_area} onChange={handleChange} placeholder="Living Area (sq ft)" />
          {/* <input type="number" name="condition_of_the_house" value={formData.condition_of_the_house} onChange={handleChange} placeholder="Condition of the House (1-5)" /> */}
          {/* <input type="number" name="grade_of_the_house" value={formData.grade_of_the_house} onChange={handleChange} placeholder="Grade of the House (1-13)" /> */}
          <input type="number" name="built_year" value={formData.built_year} onChange={handleChange} placeholder="Built Year" />
          {/* <input type="number" step="0.000001" name="lattitude" value={formData.lattitude} onChange={handleChange} placeholder="Latitude" /> */}
          {/* <input type="number" step="0.000001" name="longitude" value={formData.longitude} onChange={handleChange} placeholder="Longitude" /> */}
        </div>

        <button onClick={handlePredict} className="predict-button" disabled={loading}>
          {loading ? 'Predicting...' : 'Predict Price'}
        </button>

        {predictedPrice !== null && (
          <div className="prediction-result">
            <h3>Estimated Price: <span className="price">₹{predictedPrice}</span></h3>
          </div>
        )}

        {error && <p className="error">{error}</p>}

        <button onClick={handleGoBack} className="back-button">Go Back</button>
      </div>
    </div>
  );
};

export default PredictPrice;
