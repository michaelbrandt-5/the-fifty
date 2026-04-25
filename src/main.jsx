import React, { useEffect } from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { HelmetProvider } from "react-helmet-async";

// GA4 — measurement ID hardcoded with env var override. GA4 IDs are public
// (visible in every served HTML), so committing them is fine. Override with
// VITE_GA4_ID at build time, or set to "" to disable.
const GA4_ID = import.meta.env.VITE_GA4_ID ?? "G-XLTG16BJ0B";
if (typeof window !== "undefined" && GA4_ID) {
  const s = document.createElement("script");
  s.async = true;
  s.src = `https://www.googletagmanager.com/gtag/js?id=${GA4_ID}`;
  document.head.appendChild(s);
  window.dataLayer = window.dataLayer || [];
  window.gtag = function () {
    window.dataLayer.push(arguments);
  };
  window.gtag("js", new Date());
  window.gtag("config", GA4_ID, { send_page_view: false });
}

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
import PhotoCredits from "./PhotoCredits.jsx";
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

// GA4: fire a page_view on every route change (SPA navigation).
function PageviewTracker() {
  const { pathname, search } = useLocation();
  useEffect(() => {
    if (typeof window === "undefined" || typeof window.gtag !== "function") return;
    const page_path = pathname + search;
    window.gtag("event", "page_view", {
      page_path,
      page_location: window.location.href,
      page_title: document.title,
    });
  }, [pathname, search]);
  return null;
}

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <HelmetProvider>
      <PasswordGate>
        <BrowserRouter>
          <ScrollToTop />
          <PageviewTracker />
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
            <Route path="/photo-credits" element={<PhotoCredits />} />
          </Routes>
        </BrowserRouter>
      </PasswordGate>
    </HelmetProvider>
  </React.StrictMode>
);

// Signal vite-plugin-prerender that React has hydrated and the head is populated.
// Uses requestIdleCallback to wait for React's render cycle + Helmet's effects to flush.
if (typeof window !== "undefined") {
  const fire = () =>
    setTimeout(() => document.dispatchEvent(new Event("render-event")), 200);
  if ("requestIdleCallback" in window) {
    window.requestIdleCallback(fire, { timeout: 1500 });
  } else {
    setTimeout(fire, 500);
  }
}
