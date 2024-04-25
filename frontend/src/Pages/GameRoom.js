import React, { useEffect, useLayoutEffect, useRef, useState } from "react";
import { useLocation } from "react-router-dom";
import Game from "../Components/GameRoom/game"
import Phaser from "phaser-ce"
function GameRoom() {

  const location = useLocation();
  const interval = useRef(setTimeout(() => {}, 0));
  const { roomId, playerId } = location.state;
  const [ loading, setLoading ] = useState(true);
  const timeOut = 3000;
  let game = null;

  const snakeInit = async () => {

    (function() {
        game = new Phaser.Game(window.innerWidth, window.innerHeight, Phaser.AUTO, {
            roomId: roomId,
            playerId: playerId
        });
        game.state.add('Game', Game);
        game.state.start('Game');

    })();
    
    setLoading(false);
  }

  const LoadinDialog = () => {

      const loadingStyles = { 
          top: "50%",
          left: "50%",
          position: "absolute",
          fontSize: "85px",
          transform: "translateX(-50%) translateY(-50%)",
          color: "white"
      }

      return (
          <div style={loadingStyles} >Loading...</div>
      )
  }

  useLayoutEffect(() => {

        interval.current = setTimeout(snakeInit, timeOut);
        
        return () => {
            clearTimeout(interval.current); // cleanup
        };

  },[]);

  useEffect(() => {
    return () => {
          if(game) {
              game.destroy();
          }
        }
    }, [])

  return ( 
    <>
      { 
        loading ? <LoadinDialog/>
                : null
      }
      <canvas id = "gameCanvas" style={{ position: loading == false ? "fixed" : "relative" }} ></canvas>
    </>
  );
}

export default GameRoom;