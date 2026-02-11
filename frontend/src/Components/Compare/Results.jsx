import React from 'react';
import { useLocation, Link } from 'react-router-dom';

const CompareResults = () => {
  const { state } = useLocation();
  const { properties } = state || {}; // Get the properties data passed from the form submission

  return (
    <div className="compare-results-container">
      <h2>Comparison Results</h2>
      {properties ? (
        <div className="properties-list">
          {properties.length > 0 ? (
            properties.map((property, index) => (
              <div key={index} className="property-card">
                <h3 className="property-title">{`Property ${index + 1}`}</h3>
                <div className="property-details">
                  <div className="property-info">
                    <p><strong>Bedrooms:</strong> {property.number_of_bedrooms}</p>
                    <p><strong>Bathrooms:</strong> {property.number_of_bathrooms}</p>
                    <p><strong>Living Area:</strong> {property.living_area} sq ft</p>
                  </div>
                  <div className="property-info">
                    <p><strong>Price:</strong> ${property.price}</p>
                    <p><strong>Built Year:</strong> {property.built_year}</p>
                  </div>
                </div>
                {/* Add a link to the individual property page */}
                <Link to={`/apartment/${property.id}`} className="view-details-button">View Details</Link>
              </div>
            ))
          ) : (
            <p>No properties found matching the criteria.</p>
          )}
        </div>
      ) : (
        <p>No results to display.</p>
      )}
    </div>
  );
};

export default CompareResults;
