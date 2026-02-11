import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Line } from "react-chartjs-2";
import formatCurrency from "../../utils";
import ApartmentCard from "./AppartmentCard";

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

const ApartmentDetails = () => {
  const { id } = useParams();
  const [property, setProperty] = useState(null);
  const [similarProperties, setSimilarProperties] = useState([]);
  const [estimatedValue, setEstimatedValue] = useState(null);
  const [priceTrends, setPriceTrends] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchPropertyDetails = async () => {
      try {
        setLoading(true);
        setError("");

        const [propertyRes, trendsRes, estimateRes, similarRes] = await Promise.all([
          fetch(`http://127.0.0.1:8000/properties/${id}`),
          fetch(`http://127.0.0.1:8000/price-trends/${id}`),
          fetch(`http://127.0.0.1:8000/market-value-estimator/${id}`),
          fetch(`http://127.0.0.1:8000/similar-properties/${id}`)
        ]);

        if (!propertyRes.ok) throw new Error("Property not found");
        const propertyData = await propertyRes.json();
        setProperty(propertyData);

        if (trendsRes.ok) {
          const trendsData = await trendsRes.json();
          setPriceTrends(trendsData);
        }

        if (estimateRes.ok) {
          const estimateData = await estimateRes.json();
          setEstimatedValue(estimateData.predicted_market_value);
        }

        if (similarRes.ok) {
          const similarData = await similarRes.json();
          setSimilarProperties(similarData);
        }
      } catch (err) {
        console.error(err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    fetchPropertyDetails();
  }, [id]);

  if (loading) return <p className="loading-message">Loading...</p>;
  if (error) return <p className="error-message">Error: {error}</p>;
  if (!property) return <p className="error-message">No property found.</p>;

  const { title, price, location, number_of_bedrooms, number_of_bathrooms, image_url } = property;

  // Random image selection
  const imageIndex = id % apartmentImages.length;
  const selectedImage = apartmentImages[imageIndex];

  return (
    <div className="apartment-details-page">
      <div className="apartment-top-section">
        <img
          className="apartment-image"
          src={image_url || selectedImage}
          alt={title || "Apartment Image"}
        />

        <div className="property-info">
          <h2>{title || `Apartment ID: ${id}`}</h2>
          <p className="current-price">{formatCurrency(price)}</p>
          <p><strong>Location:</strong> {location || "N/A"}</p>
          <p><strong>Bedrooms:</strong> {number_of_bedrooms}</p>
          <p><strong>Bathrooms:</strong> {number_of_bathrooms}</p>

          {estimatedValue && (
            <p className="estimated-value">
              Estimated Market Value: {formatCurrency(estimatedValue)}
            </p>
          )}
        </div>
      </div>

      {/* Price Trends */}
      {priceTrends && (
        <div className="price-trends-section">
          <h3>Price Trends in the Area</h3>
          <Line
            data={{
              labels: Object.keys(priceTrends),
              datasets: [
                {
                  label: "Average Price",
                  data: Object.values(priceTrends),
                  borderColor: "rgba(75,192,192,1)",
                  fill: false,
                  tension: 0.3,
                },
              ],
            }}
          />
        </div>
      )}

      {/* Similar Properties */}
      <div className="similar-properties-section">
        <h3>Similar Properties</h3>
        {similarProperties.length > 0 ? (
          <div className="similar-properties-grid">
            {similarProperties.map((apartment) => (
              <ApartmentCard key={apartment.id} apartment={apartment} />
            ))}
          </div>
        ) : (
          <p>No similar properties found.</p>
        )}
      </div>
    </div>
  );
};

export default ApartmentDetails;
