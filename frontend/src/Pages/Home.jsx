import React from "react";
import Header from "../Components/Header/Header";
import About from "../Components/About/About";
import Apartments from "../Components/Apartments/Apartments";
// import Works from "../Components/Works/Works";
import Services from "../Components/Services/Services";
import Agents from "../Components/Agents/Agents";
import Adverts from "../Components/Adverts/Adverts";
import Footer from "../Components/Footer/Footer";

export default function Home() {
  return (
    <>
      <Header />
      <About />
      <Apartments />
      {/* <Works /> */}
      <Services />
      <Agents />
      <Adverts />
      <Footer />
    </>
  );
}
