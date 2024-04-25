import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "./App.css";
import Home from "./Pages/Home";
import Tournaments from "./Pages/Tournaments";
import GameRoom from "./Pages/GameRoom";
import SignIn from "./Pages/SignIn";
import NotFound from "./Pages/NotFound";

function App() {
  return (
    <div className="App">
            <Router basename="/">
               <Routes>
                  <Route path="/" element={<Home />} />
                  <Route path="/tournaments" element={<Tournaments />} />
                  <Route path="/gameroom" element={<GameRoom />} />
                  <Route path="/login" element={<SignIn />} />
                  <Route path="*" element={<NotFound />} />
               </Routes>
            </Router>
    </div>
  );
}

export default App;
