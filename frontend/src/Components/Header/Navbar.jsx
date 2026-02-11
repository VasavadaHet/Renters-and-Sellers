import React, { useState } from "react";
import { Link as RouterLink } from "react-router-dom";
import { Link as ScrollLink } from "react-scroll";

export default function Navbar() {
  const [menu, setMenu] = useState(true);

  const showMenu = () => {
    setMenu(!menu);
  };

  return (
    <nav>
      <div className="logo">
        <RouterLink to="/">Renters and Sellers</RouterLink>
      </div>

      <div className={`toggler ${!menu ? "close" : ""}`} onClick={showMenu}>
        <div className="btn-line"></div>
        <div className="btn-line"></div>
        <div className="btn-line"></div>
      </div>

      <div className={menu ? "nav-links" : "nav-links show"}>
        {/* Homepage link */}
        <div className="nav-link">
          <RouterLink to="/Real-Estate-Website" onClick={showMenu}>Home</RouterLink>
        </div>

        {/* Scroll-based links for homepage sections */}
        {["about", "contacts"].map((section, index) => (
          <div className="nav-link" key={index}>
            <ScrollLink
              to={section}
              spy={true}
              smooth={true}
              duration={800}
              offset={-100}
              onClick={showMenu}
            >
              {section.charAt(0).toUpperCase() + section.slice(1)}
            </ScrollLink>
          </div>
        ))}

        {/* Other route-based links */}
        <div className="nav-link">
          <RouterLink to="/market-trend" onClick={showMenu}>Trends Around</RouterLink>
        </div>
        {/* <div className="nav-link">
          <RouterLink to="/list-for-sell" onClick={showMenu}>List for Sell</RouterLink>
        </div> */}
        <div className="nav-link">
          <RouterLink to="/all-properties" onClick={showMenu}>Browse Properties</RouterLink>
        </div>
        <div className="nav-link">
          <RouterLink to="/predict-price" onClick={showMenu}>Predict Price</RouterLink>
        </div>

        {/* Comparison Link */}
        <div className="nav-link">
          <RouterLink to="/compare-properties" onClick={showMenu}>
            Compare Properties
          </RouterLink>
        </div>
      </div>
    </nav>
  );
}
