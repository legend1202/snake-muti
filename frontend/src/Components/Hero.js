import React, { useEffect, useState } from "react";
// import GameVideo from "../Assets/game.mp4"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAngleUp } from "@fortawesome/free-solid-svg-icons";
import { useNavigate  } from "react-router-dom";
import "../Styles/Hero.css";
import ReactPlayer from 'react-player'

function Hero() {
  const navigate = useNavigate();
  const [goUp, setGoUp] = useState(false);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  useEffect(() => {
    const onPageScroll = () => {
      if (window.scrollY > 600) {
        setGoUp(true);
      } else {
        setGoUp(false);
      }
    };
    window.addEventListener("scroll", onPageScroll);

    return () => {
      window.removeEventListener("scroll", onPageScroll);
    };
  }, []);

  return (
    <div className="section-container">
      <div className="hero-section">
        <div className="text-section">
          <p className="text-headline">Earning much funds in fighting Snake Game</p>
          <h6 className="text-title">
            Have fun and make money competing against other players in the world's first snake money game
          </h6>
          <p className="text-descritpion">
            Play freeroll tournaments with real money prices every single day
          </p>
          <button
            className="text-appointment-btn"
            type="button"
          >
            Join a Tournament
          </button>
          <div className="text-stats">
            <div className="text-stats-container">
              <p>145k+</p>
              <p>Top Player earning</p>
            </div>

            <div className="text-stats-container">
              <p>50+</p>
              <p>Player</p>
            </div>

          </div>
        </div>

        <div className="hero-image-section">
          {/* <ReactPlayer url={} 
                       loop={true} 
                       width="100%"
                       height="100%"
                       playing={true}
                       muted={true}
                      /> */}

        </div>
      </div>

      <div
        onClick={scrollToTop}
        className={`scroll-up ${goUp ? "show-scroll" : ""}`}
      >
        <FontAwesomeIcon icon={faAngleUp} />
      </div>
    </div>
  );
}

export default Hero;
