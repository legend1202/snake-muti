import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBars,
  faXmark,
} from "@fortawesome/free-solid-svg-icons";
import "../Styles/Navbar.css";
import { Link } from "react-router-dom";
import { Select, Space } from "antd";

function Navbar() {
  const [nav, setNav] = useState(false);

  const openNav = () => {
    setNav(!nav);
  };


  return (
    <div className="navbar-section">
      <h1 className="navbar-title">
         <Link to="/">
            Snamba <span className="navbar-sign"></span>
         </Link>
      </h1>

      {/* Desktop */}
      <ul className="navbar-items">
         <li>
            <Link to="/tournaments" className="navbar-links">
            Tournaments
            </Link>
         </li>
         <li>
            <a href="#services" className="navbar-links">
            Lobby
            </a>
         </li>
         <li>
            <a href="#about" className="navbar-links">
            Cashier 
            </a>
         </li>
         <li>
            <a href="#reviews" className="navbar-links">
            Account 
            </a>
         </li>
         <li>
            <a href="#about" className="navbar-links">
            Rankings 
            </a>
         </li>
         <li>
            <a href="#about" className="navbar-links">
            Results 
            </a>
         </li>
      </ul>

      <Space size={30}>

         <Link to="/login" className="navbar-links">
            Login 
         </Link>
         <Select className="lang" defaultValue="0">
            <Select.Option value="0">languages</Select.Option>
            <Select.Option value="english">English</Select.Option>
            <Select.Option value="spanish">Spanish</Select.Option>
         </Select>
      </Space>

      {/* Mobile */}
      <div className={`mobile-navbar ${nav ? "open-nav" : ""}`}>
        <div onClick={openNav} className="mobile-navbar-close">
          <FontAwesomeIcon icon={faXmark} className="hamb-icon" />
        </div>
        <ul className="mobile-navbar-links">
            <li>
               <Link onClick={openNav} to="/" className="navbar-links">
                  Tournaments
               </Link>
            </li>
            <li>
               <a onClick={openNav} href="#services" className="navbar-links">
                  Lobby
               </a>
            </li>
            <li>
               <a onClick={openNav} href="#about" className="navbar-links">
                  Cashier 
               </a>
            </li>
            <li>
               <a onClick={openNav} href="#reviews" className="navbar-links">
                  Account 
               </a>
            </li>
            <li>
               <a onClick={openNav} href="#about" className="navbar-links">
                  Rankings
               </a>
            </li>
            <li>
               <a onClick={openNav} href="#about" className="navbar-links">
                  Results 
               </a>
            </li>
        </ul>
      </div>

      {/* Hamburger Icon */}
      <div className="mobile-nav">
        <FontAwesomeIcon
            icon={faBars}
            onClick={openNav}
            className="hamb-icon"
        />
      </div>
    </div>
  );
}

export default Navbar;
