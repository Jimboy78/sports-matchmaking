// Web implementation: react-native-maps has no web support, so render Leaflet with keyless Esri dark tiles.
import React, { useEffect } from "react";
import { MapContainer, Marker, TileLayer, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { HOME_LOCATION, SPORTS, type Court } from "../data/demo";
import type { CourtsMapProps } from "./CourtsMap";

const PIN_CSS = `
.mp-pin{width:40px;height:40px;border-radius:50%;background:#131a17;border:2px solid #c6f432;display:flex;align-items:center;justify-content:center;font-size:18px;box-shadow:0 6px 16px rgba(0,0,0,.5);transition:transform .25s}
.mp-pin.on{background:#c6f432;transform:scale(1.25);box-shadow:0 0 0 8px rgba(198,244,50,.25)}
.mp-me{width:18px;height:18px;border-radius:50%;background:#4cc9f0;border:3px solid #fff;position:relative}
.mp-me:after{content:"";position:absolute;inset:-10px;border-radius:50%;border:2px solid #4cc9f0;animation:mp-pulse 1.8s ease-out infinite}
@keyframes mp-pulse{from{transform:scale(.5);opacity:1}to{transform:scale(1.6);opacity:0}}
.leaflet-container{background:#0a0f0d;font-family:inherit}
`;

function useInjectedCss() {
  useEffect(() => {
    if (document.getElementById("mp-pin-css")) return;
    const style = document.createElement("style");
    style.id = "mp-pin-css";
    style.textContent = PIN_CSS;
    document.head.appendChild(style);
  }, []);
}

const pinIcon = (emoji: string, on: boolean) =>
  L.divIcon({ className: "", html: `<div class="mp-pin ${on ? "on" : ""}">${emoji}</div>`, iconSize: [40, 40], iconAnchor: [20, 20] });

const meIcon = L.divIcon({ className: "", html: '<div class="mp-me"></div>', iconSize: [18, 18], iconAnchor: [9, 9] });

function FlyTo({ court }: { court?: Court }) {
  const map = useMap();
  useEffect(() => {
    if (court) map.flyTo([court.lat, court.lng], 16, { duration: 0.8 });
  }, [court, map]);
  return null;
}

export default function CourtsMap({ courts, selectedId, onSelect }: CourtsMapProps) {
  useInjectedCss();
  return (
    <MapContainer
      center={[HOME_LOCATION.lat, HOME_LOCATION.lng]}
      zoom={14}
      zoomControl={false}
      attributionControl={false}
      style={{ position: "absolute", inset: 0 }}
    >
      <TileLayer url="https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Dark_Gray_Base/MapServer/tile/{z}/{y}/{x}" maxZoom={16} />
      <TileLayer url="https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Dark_Gray_Reference/MapServer/tile/{z}/{y}/{x}" maxZoom={16} />
      {courts.map((c) => (
        <Marker
          key={c.id}
          position={[c.lat, c.lng]}
          icon={pinIcon(SPORTS[c.sports[0]].emoji, c.id === selectedId)}
          eventHandlers={{ click: () => onSelect(c.id) }}
        />
      ))}
      <Marker position={[HOME_LOCATION.lat, HOME_LOCATION.lng]} icon={meIcon} interactive={false} />
      <FlyTo court={courts.find((c) => c.id === selectedId)} />
    </MapContainer>
  );
}
