import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import ApartmentCard from "./AppartmentCard";

export default function Apartments() {
  const [allApartments, setAllApartments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("http://127.0.0.1:8000/properties")
      .then((res) => res.json())
      .then((data) => {
        if (data && data.properties) {
          const shuffled = data.properties.sort(() => 0.5 - Math.random());
          const cleaned = shuffled
            .filter((apt) => apt.id !== undefined)
            .slice(0, 6);
          setAllApartments(cleaned);
        } else {
          console.warn("No properties found in response:", data);
        }
        setLoading(false);
      })
      .catch((err) => {
        console.error("Failed to fetch properties:", err);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return <div className="main-apartment">Loading apartments...</div>;
  }

  return (
    <div className="main-apartment" id="apartments">
      <p className="apartment-heading">
        More Than 500+ <br /> Apartments For Rent
      </p>
      <div className="apartments-container">
        <div className="apartment-list">
          {allApartments.map((apartment) => (
            <ApartmentCard key={apartment.id} apartment={apartment} />
          ))}
        </div>
      </div>
      <div className="apartment-footer">
        <div className="search-location">
          <input type="text" placeholder="Search Location " />
          <button>Search</button>
        </div>
        <div className="viewButton">
          <Link to="/all-properties">
            <button className="apartment-btn">View All Apartments</button>
          </Link>
        </div>
      </div>
    </div>
  );
}
