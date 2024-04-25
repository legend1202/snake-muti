import React from 'react';
import "../Styles/Common.css";
import Navbar from "../Components/Navbar";
import Login from "../Components/Login";

const SignIn = () => {

  return (
    <div className="section-container">
        <Navbar />
        <div style={{ padding:"200px" }}>
          <Login />
        </div>
    </div>
  );
};

export default SignIn;