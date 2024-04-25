import React from "react";
import "../Styles/Common.css";
import Navbar from "../Components/Navbar";
import Tournament from "../Components/Tournament";

function Tournaments() {
  return (
    <div className="section-container">
        <Navbar />
        <Tournament />
    </div>
  );
}

export default Tournaments;
