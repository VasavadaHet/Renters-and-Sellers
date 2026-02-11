import React, { useState, useEffect } from 'react';
import { Line, Bar, Pie } from 'react-chartjs-2';
import { Chart as ChartJS, Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale, ArcElement, PointElement, LineElement } from 'chart.js';


ChartJS.register(Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale, ArcElement, PointElement, LineElement);

const MarketTrends = () => {
    const [marketTrends, setMarketTrends] = useState(null);

    useEffect(() => {
        
        fetch('http://localhost:8000/market-trend')  
            .then((response) => {
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                return response.json();
            })
            .then((data) => setMarketTrends(data))
            .catch((error) => console.error('Error fetching market trends:', error));
    }, []);

    if (!marketTrends) {
        return <div>Loading...</div>;
    }

   
    const priceByYearData = {
        labels: Object.keys(marketTrends.price_by_year),
        datasets: [{
            label: 'Average Price by Year',
            data: Object.values(marketTrends.price_by_year),
            borderColor: 'rgba(75,192,192,1)',
            backgroundColor: 'rgba(75,192,192,0.2)',
            fill: true,
        }]
    };

    const priceDistributionData = {
        labels: ['25th Percentile', 'Median', '75th Percentile'],
        datasets: [{
            data: [
                marketTrends.price_distribution['25th_percentile'],
                marketTrends.price_distribution['median_price'],
                marketTrends.price_distribution['75th_percentile']
            ],
            backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56'],
        }]
    };

    const conditionDistributionData = {
        labels: Object.keys(marketTrends.condition_distribution),
        datasets: [{
            data: Object.values(marketTrends.condition_distribution),
            backgroundColor: '#36A2EB',
        }]
    };

    const gradeDistributionData = {
        labels: Object.keys(marketTrends.grade_distribution),
        datasets: [{
            data: Object.values(marketTrends.grade_distribution),
            backgroundColor: '#FF6384',
        }]
    };

    const priceByBedroomsData = {
        labels: Object.keys(marketTrends.price_by_bedrooms),
        datasets: [{
            label: 'Price by Number of Bedrooms',
            data: Object.values(marketTrends.price_by_bedrooms),
            borderColor: 'rgba(75,192,192,1)',
            backgroundColor: 'rgba(75,192,192,0.2)',
            fill: true,
        }]
    };

    const priceByBathroomsData = {
        labels: Object.keys(marketTrends.price_by_bathrooms),
        datasets: [{
            label: 'Price by Number of Bathrooms',
            data: Object.values(marketTrends.price_by_bathrooms),
            borderColor: 'rgba(153,102,255,1)',
            backgroundColor: 'rgba(153,102,255,0.2)',
            fill: true,
        }]
    };

    return (
        <div className="market-trends-container">
            <h2>Market Trends</h2>

            <div className="chart-container">
                <div className="price-by-year-chart">
                    <h3 className="chart-title">Average Price by Year</h3>
                    <Line data={priceByYearData} />
                    <p className="chart-description">This chart shows the average property price per year.</p>
                </div>

                <div className="price-distribution-chart">
                    <h3 className="chart-title">Price Distribution</h3>
                    <Pie data={priceDistributionData} />
                    <p className="chart-description">This pie chart displays the price distribution in terms of percentiles.</p>
                </div>

                <div className="condition-distribution-chart">
                    <h3 className="chart-title">Condition of Houses Distribution</h3>
                    <Bar data={conditionDistributionData} />
                    <p className="chart-description">This bar chart shows the distribution of houses based on their condition.</p>
                </div>

                <div className="grade-distribution-chart">
                    <h3 className="chart-title">Grade of Houses Distribution</h3>
                    <Bar data={gradeDistributionData} />
                    <p className="chart-description">This bar chart displays the distribution of houses based on their grade.</p>
                </div>

                <div className="price-by-bedrooms-chart">
                    <h3 className="chart-title">Price by Number of Bedrooms</h3>
                    <Line data={priceByBedroomsData} />
                    <p className="chart-description">This chart shows the price trends based on the number of bedrooms in a property.</p>
                </div>

                <div className="price-by-bathrooms-chart">
                    <h3 className="chart-title">Price by Number of Bathrooms</h3>
                    <Line data={priceByBathroomsData} />
                    <p className="chart-description">This chart shows the price trends based on the number of bathrooms in a property.</p>
                </div>
            </div>
        </div>
    );
};

export default MarketTrends;
