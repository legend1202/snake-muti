import React from "react";
import Navbar from "../Components/Navbar";
import Hero from "../Components/Hero";
import Info from "../Components/Info";
import About from "../Components/About";
import Footer from "../Components/Footer";

function Home() {
  return (
    <div className="home-section">
      <Navbar />
      <Hero />
      <Info />
      <About />
      <Footer />
    </div>
  );
}

export default Home;
