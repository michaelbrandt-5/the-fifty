import { useRef, useEffect } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

// Category → pin color (matches badge colors from CLAUDE.md)
const CATEGORY_COLORS = {
  Eat: "#a83c32",
  Drink: "#964b5a",
  Coffee: "#b48250",
  Stay: "#375a64",
  Experience: "#5a6e46",
  Shop: "#8c6482",
};

// Custom circle marker for each category
function createMarker(latlng, entry) {
  const color = CATEGORY_COLORS[entry.category] || "#B8864E";
  return L.circleMarker(latlng, {
    radius: 7,
    fillColor: color,
    fillOpacity: 0.9,
    color: "#fff",
    weight: 1.5,
    opacity: 1,
  });
}

export default function CityMap({ entries, locations, cityName }) {
  const mapRef = useRef(null);
  const mapInstanceRef = useRef(null);

  useEffect(() => {
    if (mapInstanceRef.current) return; // already initialized
    if (!mapRef.current) return;

    // Collect valid coordinates
    const points = entries
      .map((e) => {
        const loc = locations[e.id];
        if (!loc) return null;
        return { ...e, lat: loc.lat, lng: loc.lng };
      })
      .filter(Boolean);

    if (points.length === 0) return;

    // Calculate center from all points
    const avgLat = points.reduce((s, p) => s + p.lat, 0) / points.length;
    const avgLng = points.reduce((s, p) => s + p.lng, 0) / points.length;

    // Initialize map
    const map = L.map(mapRef.current, {
      center: [avgLat, avgLng],
      zoom: 12,
      scrollWheelZoom: false,
      attributionControl: true,
    });
    mapInstanceRef.current = map;

    // CartoDB Voyager tiles (clean, editorial look, free)
    L.tileLayer(
      "https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png",
      {
        attribution:
          '&copy; <a href="https://www.openstreetmap.org/copyright">OSM</a> &copy; <a href="https://carto.com/">CARTO</a>',
        subdomains: "abcd",
        maxZoom: 19,
      }
    ).addTo(map);

    // Add markers
    points.forEach((p) => {
      const marker = createMarker([p.lat, p.lng], p);
      marker.addTo(map);

      const popupContent = `
        <div style="font-family: 'Inter', system-ui, sans-serif; min-width: 160px;">
          <div style="font-size: 10px; font-weight: 600; letter-spacing: 0.06em; text-transform: uppercase; color: ${CATEGORY_COLORS[p.category] || "#B8864E"}; margin-bottom: 3px;">
            ${p.category}
          </div>
          <div style="font-size: 14px; font-weight: 600; color: #1A1A1A; margin-bottom: 2px;">
            ${p.name}
          </div>
          <div style="font-size: 12px; color: #666;">
            ${p.neighborhood}
          </div>
        </div>
      `;

      marker.bindPopup(popupContent, {
        closeButton: false,
        offset: [0, -4],
        className: "fifty-popup",
      });

      marker.on("mouseover", function () {
        this.openPopup();
      });
    });

    // Fit bounds with padding
    const bounds = L.latLngBounds(points.map((p) => [p.lat, p.lng]));
    map.fitBounds(bounds, { padding: [40, 40] });

    return () => {
      map.remove();
      mapInstanceRef.current = null;
    };
  }, [entries, locations]);

  // Legend items
  const categories = ["Eat", "Drink", "Coffee", "Stay", "Experience", "Shop"];

  return (
    <section style={{ backgroundColor: "#1a1a1a", padding: "60px 0 0" }}>
      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 40px 40px" }}>
        <p
          style={{
            fontFamily: "system-ui, sans-serif",
            fontSize: 11,
            fontWeight: 600,
            letterSpacing: 2,
            textTransform: "uppercase",
            color: "rgba(255,255,255,0.3)",
            marginBottom: 20,
          }}
        >
          The Map
        </p>
        <h3
          style={{
            fontFamily: "'Georgia', serif",
            fontSize: 28,
            fontWeight: 400,
            color: "#f5f0e8",
            margin: "0 0 8px",
          }}
        >
          All 50 picks, pinned
        </h3>
        <p
          style={{
            fontFamily: "'Georgia', serif",
            fontSize: 14,
            color: "rgba(255,255,255,0.4)",
            margin: "0 0 24px",
          }}
        >
          Hover a pin to see the spot. Zoom and drag to explore.
        </p>
        {/* Legend */}
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            gap: "12px 20px",
            marginBottom: 20,
          }}
        >
          {categories.map((cat) => (
            <div
              key={cat}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 6,
              }}
            >
              <span
                style={{
                  display: "inline-block",
                  width: 10,
                  height: 10,
                  borderRadius: "50%",
                  backgroundColor: CATEGORY_COLORS[cat],
                  border: "1.5px solid rgba(255,255,255,0.3)",
                }}
              />
              <span
                style={{
                  fontFamily: "system-ui, sans-serif",
                  fontSize: 12,
                  color: "rgba(255,255,255,0.5)",
                  letterSpacing: "0.02em",
                }}
              >
                {cat}
              </span>
            </div>
          ))}
        </div>
      </div>
      {/* Map container */}
      <div
        ref={mapRef}
        style={{
          width: "100%",
          height: 500,
          backgroundColor: "#e8e0d0",
        }}
      />
      <style>{`
        .fifty-popup .leaflet-popup-content-wrapper {
          border-radius: 6px;
          box-shadow: 0 3px 14px rgba(0,0,0,0.15);
          padding: 0;
        }
        .fifty-popup .leaflet-popup-content {
          margin: 12px 14px;
        }
        .fifty-popup .leaflet-popup-tip {
          box-shadow: 0 3px 14px rgba(0,0,0,0.1);
        }
      `}</style>
    </section>
  );
}
