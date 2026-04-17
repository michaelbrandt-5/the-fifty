import React, { useEffect } from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";

import Homepage from "../the-fifty-homepage.jsx";
import Austin from "../austin-city-page.jsx";
import NewYork from "../new-york-city-page.jsx";
import Nashville from "../nashville-city-page.jsx";
import Chicago from "../chicago-city-page.jsx";
import LosAngeles from "../los-angeles-city-page.jsx";
import Seattle from "../seattle-city-page.jsx";
import SanFrancisco from "../san-francisco-city-page.jsx";
import Miami from "../miami-city-page.jsx";
import Portland from "../portland-city-page.jsx";
import Denver from "../denver-city-page.jsx";
import Methodology from "../methodology-page.jsx";
import PasswordGate from "./PasswordGate.jsx";

function ScrollToTop() {
  const { pathname, hash } = useLocation();
  useEffect(() => {
    if (hash) {
      const el = document.querySelector(hash);
      if (el) {
        el.scrollIntoView({ behavior: "smooth", block: "start" });
        return;
      }
    }
    window.scrollTo(0, 0);
  }, [pathname, hash]);
  return null;
}

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <PasswordGate>
      <BrowserRouter>
        <ScrollToTop />
        <Routes>
          <Route path="/" element={<Homepage />} />
          <Route path="/austin" element={<Austin />} />
          <Route path="/new-york" element={<NewYork />} />
          <Route path="/nashville" element={<Nashville />} />
          <Route path="/chicago" element={<Chicago />} />
          <Route path="/los-angeles" element={<LosAngeles />} />
          <Route path="/seattle" element={<Seattle />} />
          <Route path="/san-francisco" element={<SanFrancisco />} />
          <Route path="/miami" element={<Miami />} />
          <Route path="/portland" element={<Portland />} />
          <Route path="/denver" element={<Denver />} />
          <Route path="/methodology" element={<Methodology />} />
        </Routes>
      </BrowserRouter>
    </PasswordGate>
  </React.StrictMode>
);
