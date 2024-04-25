import React from "react";
import "../Styles/Footer.css";
import SubscribeNewsletter from "./SubscribeNewsletter";
import { Link } from "react-router-dom";

function Footer() {
  return (
    <div className="footer-section">
      <div className="footer-container">
        <div className="ft-info">
          <div className="ft-info-p1">
            <p className="ft-title">
              Snamba
            </p>
            <p className="ft-description">
              Have fun and make money competing against other players in the world's first snake money game
            </p>
          </div>

          <SubscribeNewsletter />
        </div>

        <div className="ft-list">
          
        </div>

        <div className="ft-list">
           
        </div>

        <div className="ft-list" id="contact">
          
        </div>
      </div>

      <div className="ft-copyright">
         
      </div>
    </div>
  );
}

export default Footer;
