import React from "react";
import { useNavigate } from "react-router-dom";

// 20+ Random Apartment Images (from Unsplash)
const apartmentImages = [
  "https://assets.aptamigo.com/GA/Atlanta/Apartment/link-apartments-grant-park/int01.jpeg",
  "https://resource.rentcafe.com/image/upload/x_0,y_0,w_5000,h_2500,c_crop/q_auto,f_auto,c_lfill,w_576,ar_1.029,g_auto/s3/2/3585/lagp_a1%20unit_sm.jpg",
  "https://static.apartmentadvisor.com/i/c984b46af1eb52f4ee84c7af87402943.jpeg_652_416.jpeg",
  "https://greenbeltapts.com/wp-content/uploads/Greenbelt-Apts-Interior-Kitchen-3.jpg",
  "https://rentpath-res.cloudinary.com/$img_current/t_3x2_webp_2xl/2afc9ffcfd849ae32a03680b7634da6d",
  "https://rentpath-res.cloudinary.com/$img_current/t_3x2_webp_2xl/3c0f5bfddf18d4bc7893217ad447a9e0",
  "https://rentpath-res.cloudinary.com/$img_current/t_3x2_webp_2xl/d445463f9371e87c18194fd88cad2b03",
  "https://res.cloudinary.com/apartmentlist/image/upload/c_fit,dpr_auto,f_auto,h_640,q_auto,w_640/271f50caa0e014e5baa29a0c51242588.jpg",
  "https://rentpath-res.cloudinary.com/$img_current/t_3x2_webp_2xl/dcec1df5b4d396990f8dc905c633c22d",
  "https://image1.apartmentfinder.com/i2/Y3AucG6vXbRYYPEwPuK-eOPwVq8g4o7NRja8zancJ44/110/madera-san-antonio-tx-primary-photo.jpg",
  "https://image1.apartmentfinder.com/i2/FC0fTT8ux_Zb2bj94lVQOxJrdtJia4KGISETZbVFp5s/110/university-lofts---all-inclusive-jonesboro-ar-1-br-1-ba---l-with-balcony.jpg",
  "https://www.tollbrothersapartmentliving.com/wp-content/uploads/2023/03/526_Lapis_MU_Cam2_dop_D3-RESIZED-2048x1365.jpg",
  "https://livebh.com/wp-content/uploads/2022/12/Living-Room-Unit3-03-Springhouse-Newport-News-11.jpg",
  "https://rentpath-res.cloudinary.com/$img_current/t_3x2_webp_2xl/4a96bc1781eb2421b896288c2d0319e4",
  "https://res.cloudinary.com/apartmentlist/image/upload/c_fill,dpr_auto,f_auto,g_center,h_415,q_auto,w_640/7891d72351c09d6e5f8e0b4592d14388.jpg",
  "https://img.zumpercdn.com/432289637/1280x960?dpr=1&fit=crop&h=400&q=76&w=711",
  "https://rentpath-res.cloudinary.com/$img_current/t_3x2_webp_2xl/b602507fe96e470f9226b0ecc411bfd6",
  "https://www.exxelpacific.com/wp-content/uploads/2017/08/26-Large.jpg",
  "https://www.seniorliving.com/sites/default/files/styles/flexslider_full/public/senior-community/1362984/original_7.png?itok=jD85XcL5",
  "https://image1.apartmentfinder.com/i2/Zw6InPfgskZZcacPrhcieOUhB6vK6gZkWK0xOkYX0h8/110/river-oaks-apartments-tyler-tx-building-photo.jpg",
];

const ApartmentCard = ({ apartment }) => {
  const navigate = useNavigate();

  // Stable Random Image Based on Apartment ID
  const imageIndex = apartment.id % apartmentImages.length;
  const selectedImage = apartmentImages[imageIndex];

  const handleCardClick = () => {
    navigate(`/apartment/${apartment.id}`);
  };

  return (
    <div className="apartment-card" onClick={handleCardClick}>
      <img src={selectedImage} alt="Apartment" className="apartment-image" />

      <div className="apartment-details">
        <h3>{apartment.name}</h3>
        <p><strong>Location:</strong> {apartment.location}</p>
        <p><strong>Price:</strong> ₹{apartment.price.toLocaleString()}</p>
        <p><strong>Bedrooms:</strong> {apartment.number_of_bedrooms}</p>
        <p><strong>Bathrooms:</strong> {apartment.number_of_bathrooms}</p>
      </div>
    </div>
  );
};

export default ApartmentCard;
