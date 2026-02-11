from fastapi import FastAPI, HTTPException, Query
from pydantic import BaseModel, field_validator
from typing import List, Optional
import pandas as pd
import psycopg2
import logging
import joblib
import numpy as np
from fastapi.middleware.cors import CORSMiddleware

# --- Set up logging ---
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

market_df = pd.read_csv("clean_file.csv")

# --- App setup ---
app = FastAPI(title="Real Estate API")

# Allow CORS for all origins (customize for production)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Change this in production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# --- Load Models ---
try:
    regression_model = joblib.load("models/regression_model.pkl")
    logger.info("Regression model loaded successfully.")
except Exception as e:
    logger.error(f"Failed to load regression model: {e}")
    regression_model = None

try:
    knn_model = joblib.load(open("models/knn_model.pkl", "rb"))
    logger.info("KNN model loaded successfully.")
except Exception as e:
    logger.error(f"Failed to load KNN model: {e}")
    knn_model = None

# --- Database connection ---
def get_db_connection():
    try:
        conn = psycopg2.connect(
            host="localhost",
            database="real_estate",
            user="postgres",
            password="vasavada"  # ⚠️ Use environment variable in production
        )
        return conn
    except Exception as e:
        logger.error(f"Database connection failed: {e}")
        raise HTTPException(status_code=500, detail="Database connection error.")

# --- Pydantic Models ---
class Property(BaseModel):
    id: int
    number_of_bedrooms: int
    number_of_bathrooms: float
    living_area: float
    condition_of_the_house: int
    built_year: int
    lattitude: float
    longitude: float
    price: float
    price_category: str

class PricePredictionInput(BaseModel):
    number_of_bedrooms: int
    number_of_bathrooms: float
    living_area: float
    built_year: int



# --- API Endpoints ---

@app.post("/predict-price")
def predict_price(data: PricePredictionInput):
    if regression_model is None:
        raise HTTPException(status_code=500, detail="Regression model not available.")

    try:
        input_features = np.array([
            data.number_of_bedrooms,
            data.number_of_bathrooms,
            data.living_area,
            data.built_year,
        ]).reshape(1, -1)

        predicted_price = regression_model.predict(input_features)[0]
        logger.info(f"Price predicted successfully: {predicted_price}")

        return {"predicted_price": round(predicted_price, 2)}
    except Exception as e:
        logger.error(f"Error during price prediction: {e}")
        raise HTTPException(status_code=500, detail="Price prediction failed.")



@app.get("/market-trend")

def get_market_trends():
    
    try:
        # Average trends
        avg_price = np.round(market_df['price'].mean(), 2)
        avg_bedrooms = np.round(market_df['number_of_bedrooms'].mean(), 2)
        avg_bathrooms = np.round(market_df['number_of_bathrooms'].mean(), 2)
        avg_living_area = np.round(market_df['living_area'].mean(), 2)

        # Price trends over time (by year)
        price_by_year = market_df.groupby('built_year')['price'].mean().to_dict()

        # Distribution of prices (median, 25th and 75th percentiles)
        price_distribution = {
            "median_price": np.round(market_df['price'].median(), 2),
            "25th_percentile": np.round(market_df['price'].quantile(0.25), 2),
            "75th_percentile": np.round(market_df['price'].quantile(0.75), 2)
        }

        # Condition and Grade of Houses
        condition_counts = market_df['condition_of_the_house'].value_counts().to_dict()
        grade_counts = market_df['grade_of_the_house'].value_counts().to_dict()

        # Price by Bedroom and Bathroom count
        price_by_bedrooms = market_df.groupby('number_of_bedrooms')['price'].mean().to_dict()
        price_by_bathrooms = market_df.groupby('number_of_bathrooms')['price'].mean().to_dict()

        return {
            "average_price": avg_price,
            "average_bedrooms": avg_bedrooms,
            "average_bathrooms": avg_bathrooms,
            "average_living_area": avg_living_area,
            "price_by_year": price_by_year,
            "price_distribution": price_distribution,
            "condition_distribution": condition_counts,
            "grade_distribution": grade_counts,
            "price_by_bedrooms": price_by_bedrooms,
            "price_by_bathrooms": price_by_bathrooms
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to fetch market trends: {e}")


@app.get("/properties")
def get_properties(
    page: int = Query(1, ge=1),
    limit: int = Query(10, le=100),
    min_number_of_bedrooms: Optional[int] = None,
    max_number_of_bedrooms: Optional[int] = None,
    min_living_area: Optional[float] = None,
    max_living_area: Optional[float] = None,
    price_category: Optional[str] = None
):
    try:
        offset = (page - 1) * limit
        conn = get_db_connection()
        cur = conn.cursor()

        base_query = """
            SELECT id, number_of_bedrooms, number_of_bathrooms, living_area,
                   condition_of_the_house, built_year, lattitude, longitude,
                   price,
                   CASE
                       WHEN living_area > 2500 OR number_of_bedrooms >= 4 THEN 'Premium'
                       WHEN price BETWEEN 4000000 AND 8000000 THEN 'Mid-Range'
                       ELSE 'Budget'
                   END AS price_category
            FROM final_ml_properties
            WHERE 1=1
        """

        filters = []
        params = []

        if min_number_of_bedrooms is not None:
            filters.append("number_of_bedrooms >= %s")
            params.append(min_number_of_bedrooms)
        if max_number_of_bedrooms is not None:
            filters.append("number_of_bedrooms <= %s")
            params.append(max_number_of_bedrooms)
        if min_living_area is not None:
            filters.append("living_area >= %s")
            params.append(min_living_area)
        if max_living_area is not None:
            filters.append("living_area <= %s")
            params.append(max_living_area)
        if price_category:
            filters.append("""(
                CASE
                    WHEN living_area > 2500 OR number_of_bedrooms >= 4 THEN 'Premium'
                    WHEN price BETWEEN 4000000 AND 8000000 THEN 'Mid-Range'
                    ELSE 'Budget'
                END
            ) = %s""")
            params.append(price_category)

        if filters:
            base_query += " AND " + " AND ".join(filters)

        base_query += " ORDER BY id LIMIT %s OFFSET %s"
        params.extend([limit, offset])

        cur.execute(base_query, tuple(params))
        rows = cur.fetchall()

        cur.execute("SELECT COUNT(*) FROM final_ml_properties")
        total_count = cur.fetchone()[0]

        cur.close()
        conn.close()

        properties = [
            Property(
                id=row[0],
                number_of_bedrooms=row[1],
                number_of_bathrooms=row[2],
                living_area=row[3],
                condition_of_the_house=row[4],
                built_year=row[5],
                lattitude=row[6],
                longitude=row[7],
                price=row[8],
                price_category=row[9]
            )
            for row in rows
        ]

        return {
            "properties": properties,
            "total_count": total_count,
            "page": page,
            "limit": limit
        }
    except Exception as e:
        logger.error(f"Error fetching properties: {e}")
        raise HTTPException(status_code=500, detail="Failed to fetch properties.")

@app.get("/properties/{id}")
def get_property(id: int):
    try:
        conn = get_db_connection()
        cur = conn.cursor()

        query = """
            SELECT id, number_of_bedrooms, number_of_bathrooms, living_area,
                   condition_of_the_house, built_year,
                   lattitude, longitude, price,
                   CASE
                       WHEN living_area > 2500 OR number_of_bedrooms >= 4 THEN 'Premium'
                       WHEN price BETWEEN 4000000 AND 8000000 THEN 'Mid-Range'
                       ELSE 'Budget'
                   END AS price_category
            FROM final_ml_properties
            WHERE id = %s
        """
        cur.execute(query, (id,))
        row = cur.fetchone()

        cur.close()
        conn.close()

        if row is None:
            raise HTTPException(status_code=404, detail="Property not found.")

        return Property(
            id=row[0],
            number_of_bedrooms=row[1],
            number_of_bathrooms=row[2],
            living_area=row[3],
            condition_of_the_house=row[4],
            built_year=row[5],
            lattitude=row[6],
            longitude=row[7],
            price=row[8],
            price_category=row[9]
        )
    except Exception as e:
        logger.error(f"Error fetching property: {e}")
        raise HTTPException(status_code=500, detail="Failed to fetch property.")

@app.get("/similar-properties/{property_id}")
def get_similar_properties(property_id: int):
    try:
        conn = get_db_connection()
        cur = conn.cursor()

        query = """
            SELECT number_of_bedrooms, number_of_bathrooms, living_area,
                   built_year, grade_of_the_house, condition_of_the_house,
                   price, lattitude, longitude
            FROM final_ml_properties
            WHERE id = %s
        """
        cur.execute(query, (property_id,))
        row = cur.fetchone()

        if row is None:
            cur.close()
            conn.close()
            raise HTTPException(status_code=404, detail="Property not found.")

        property_features = np.array(row).reshape(1, -1)
        distances, indices = knn_model.kneighbors(property_features, n_neighbors=6)
        similar_indices = indices[0][1:]

        cur.execute("SELECT id FROM final_ml_properties ORDER BY id")
        all_ids = [r[0] for r in cur.fetchall()]

        similar_property_ids = [all_ids[i] for i in similar_indices]

        format_ids = tuple(similar_property_ids)
        fetch_similars_query = f"""
            SELECT id, price, number_of_bedrooms, number_of_bathrooms,
                   living_area, built_year, grade_of_the_house, condition_of_the_house,
                   lattitude, longitude
            FROM final_ml_properties
            WHERE id IN %s
        """
        cur.execute(fetch_similars_query, (format_ids,))
        similar_rows = cur.fetchall()

        cur.close()
        conn.close()

        similar_properties = []
        for row in similar_rows:
            similar_properties.append({
                "id": row[0],
                "price": row[1],
                "number_of_bedrooms": row[2],
                "number_of_bathrooms": row[3],
                "living_area": row[4],
                "built_year": row[5],
                "grade_of_the_house": row[6],
                "condition_of_the_house": row[7],
                "lattitude": row[8],
                "longitude": row[9],
            })

        return similar_properties
    except Exception as e:
        logger.error(f"Error fetching similar properties: {e}")
        raise HTTPException(status_code=500, detail="Failed to fetch similar properties.")

@app.get("/market-value-estimator/{property_id}")
def market_value_estimator(property_id: int):
    try:
        conn = get_db_connection()
        cur = conn.cursor()

        query = """
            SELECT number_of_bedrooms, number_of_bathrooms, living_area,
                   built_year
            FROM final_ml_properties
            WHERE id = %s
        """
        cur.execute(query, (property_id,))
        row = cur.fetchone()

        if row is None:
            cur.close()
            conn.close()
            raise HTTPException(status_code=404, detail="Property not found.")

        property_features = np.array(row).reshape(1, -1)
        predicted_price = regression_model.predict(property_features)

        cur.close()
        conn.close()

        return {"predicted_market_value": round(predicted_price[0], 2)}
    except Exception as e:
        logger.error(f"Error predicting market value: {e}")
        raise HTTPException(status_code=500, detail="Failed to estimate market value.")

@app.get("/price-trends/{latitude}/{longitude}")
def price_trends(latitude: float, longitude: float):
    try:
        conn = get_db_connection()
        cur = conn.cursor()

        query = """
            SELECT price FROM final_ml_properties
            WHERE lattitude BETWEEN %s AND %s
              AND longitude BETWEEN %s AND %s
        """
        cur.execute(query, (latitude - 0.05, latitude + 0.05, longitude - 0.05, longitude + 0.05))
        rows = cur.fetchall()

        if not rows:
            cur.close()
            conn.close()
            raise HTTPException(status_code=404, detail="No properties found in the area.")

        prices = [row[0] for row in rows]
        average_price = sum(prices) / len(prices)

        cur.close()
        conn.close()

        return {
            "average_price_in_area": round(average_price, 2),
            "number_of_properties_considered": len(prices)
        }
    except Exception as e:
        logger.error(f"Error fetching price trends: {e}")
        raise HTTPException(status_code=500, detail="Failed to fetch price trends.")
    

@app.post("/compare-by-features")
def compare_by_features(
    number_of_bedrooms: Optional[int] = None,
    number_of_bathrooms: Optional[int] = None,
    min_living_area: Optional[int] = None,
    min_built_year: Optional[int] = None,
    min_price: Optional[int] = None,
    max_price: Optional[int] = None
):
    try:
        conn = get_db_connection()
        cur = conn.cursor()

        conditions = []
        params = []

        
        if number_of_bedrooms:
            conditions.append("number_of_bedrooms >= %s")
            params.append(number_of_bedrooms)

        if number_of_bathrooms:
            conditions.append("number_of_bathrooms >= %s")
            params.append(number_of_bathrooms)

        if min_living_area:
            conditions.append("living_area >= %s")
            params.append(min_living_area)

        if min_built_year:
            conditions.append("built_year >= %s")
            params.append(min_built_year)

        if min_price:
            conditions.append("price >= %s")
            params.append(min_price)

        if max_price:
            conditions.append("price <= %s")
            params.append(max_price)

        where_clause = " AND ".join(conditions) if conditions else "1=1"

        query = f"""
            SELECT id, number_of_bedrooms, number_of_bathrooms, living_area,
                   built_year, price, condition_of_the_house
            FROM final_ml_properties
            WHERE {where_clause}
            LIMIT 5
        """

        cur.execute(query, tuple(params))
        rows = cur.fetchall()

        cur.close()
        conn.close()

        if not rows:
            raise HTTPException(status_code=404, detail="No properties match the criteria.")

        properties = []
        for row in rows:
            properties.append({
                "id": row[0],
                "number_of_bedrooms": row[1],
                "number_of_bathrooms": row[2],
                "living_area": row[3],
                "built_year": row[4],
                "price": row[5],
                "condition_of_the_house": row[6]
            })

        
        properties = sorted(properties, key=lambda x: x["price"])

        
        return {"properties": properties}

    except Exception as e:
        logger.error(f"Error during compare by features: {e}")
        raise HTTPException(status_code=500, detail="Failed to compare properties.")
