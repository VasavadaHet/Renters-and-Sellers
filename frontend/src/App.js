import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./Components/Header/Navbar";
import Home from "./Pages/Home";
import MarketTrends from "./Components/MarketTrends/MarketTrends";
import AllProperties from "./Components/Properties/AllProperties";
import ApartmentDetails from "./Components/Apartments/AppartmentDetails"; // Corrected typo in 'ApartmentDetails'
import PredictPrice from "./Components/Predict/PredictPrice"; // PredictPrice page
import CompareProperties from "./Components/Compare/CompareFrom";
import CompareResults from "./Components/Compare/Results";
import "./App.css";

function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/Real-Estate-Website" element={<Home />} />
        <Route path="/market-trend" element={<MarketTrends />} />
        <Route path="/all-properties" element={<AllProperties />} />
        <Route path="/apartment/:id" element={<ApartmentDetails />} />
        <Route path="/predict-price" element={<PredictPrice />} />
        <Route path="/compare-properties" element={<CompareProperties />} />
        <Route path="/compare-results" element={<CompareResults />} />
      </Routes>
    </Router>
  );
}

export default App;
