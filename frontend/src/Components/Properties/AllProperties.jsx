import React, { useState, useEffect } from "react";
import ApartmentCard from "../Apartments/AppartmentCard";

const AllProperties = () => {
  const [properties, setProperties] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedBedrooms, setSelectedBedrooms] = useState("");
  const [selectedBathrooms, setSelectedBathrooms] = useState("");
  
  const propertiesPerPage = 10;

  const handleCategoryChange = (event) => {
    setSelectedCategory(event.target.value);
    setCurrentPage(1);
  };

  const handleBedroomsChange = (event) => {
    setSelectedBedrooms(event.target.value);
    setCurrentPage(1);
  };

  const handleBathroomsChange = (event) => {
    setSelectedBathrooms(event.target.value);
    setCurrentPage(1);
  };

  useEffect(() => {
    const fetchProperties = async () => {
      const url = new URL("http://127.0.0.1:8000/properties");
      url.searchParams.append("page", currentPage);
      url.searchParams.append("limit", propertiesPerPage);
      
      if (selectedCategory) url.searchParams.append("price_category", selectedCategory);

      // Bedrooms filter
      if (selectedBedrooms) {
        if (selectedBedrooms === "4") {
          url.searchParams.append("min_number_of_bedrooms", 4);
        } else {
          url.searchParams.append("min_number_of_bedrooms", selectedBedrooms);
          url.searchParams.append("max_number_of_bedrooms", selectedBedrooms);
        }
      }

      // Bathrooms filter (for now only showing, not filtering because your backend doesn't have bathrooms filtering yet)
      if (selectedBathrooms) {
        // Just for display now
      }

      try {
        const response = await fetch(url);
        const data = await response.json();
        setProperties(data.properties);
        setTotalCount(data.total_count);
      } catch (error) {
        console.error("Error fetching properties:", error);
      }
    };

    fetchProperties();
  }, [currentPage, selectedCategory, selectedBedrooms, selectedBathrooms]);

  const totalPages = Math.ceil(totalCount / propertiesPerPage);

  return (
    <div className="all-properties-page">
      <p className="page-heading">All Properties</p>

      <div className="filter-section">
        {/* Category Filter */}
        <select onChange={handleCategoryChange} value={selectedCategory}>
          <option value="">All Categories</option>
          <option value="Budget">Budget</option>
          <option value="Mid-Range">Mid-Range</option>
          <option value="Premium">Premium</option>
        </select>

        {/* Bedrooms Filter */}
        <select onChange={handleBedroomsChange} value={selectedBedrooms}>
          <option value="">All Bedrooms</option>
          <option value="1">1</option>
          <option value="2">2</option>
          <option value="3">3</option>
          <option value="4">4+</option>
        </select>

        {/* Bathrooms Filter (not functional yet) */}
        <select onChange={handleBathroomsChange} value={selectedBathrooms}>
          <option value="">All Bathrooms</option>
          <option value="1">1</option>
          <option value="2">2</option>
          <option value="3">3+</option>
        </select>
      </div>

      <div className="property-grid">
        {properties.map((property) => (
          <ApartmentCard key={property.id} apartment={property} />
        ))}
      </div>

      <div className="pagination">
  <button
    className="pagination-btn"
    onClick={() => setCurrentPage(currentPage - 1)}
    disabled={currentPage === 1}
  >
    Previous
  </button>
  <span>
    Page {currentPage} of {totalPages}
  </span>
  <button
    className="pagination-btn"
    onClick={() => setCurrentPage(currentPage + 1)}
    disabled={currentPage === totalPages}
  >
    Next
  </button>
</div>

    </div>
  );
};

export default AllProperties;
