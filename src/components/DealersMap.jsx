import { useEffect } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerIcon2x from "leaflet/dist/images/marker-icon-2x.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";

// Fixes the missing pin image problem in Vite
const pin = L.icon({
  iconUrl: markerIcon,
  iconRetinaUrl: markerIcon2x,
  shadowUrl: markerShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
});

// Moves the map to the dealer you clicked in the list
function FlyTo({ dealer }) {
  const map = useMap();
  useEffect(() => {
    if (dealer) map.flyTo([dealer.lat, dealer.lng], 14, { duration: 1.2 });
  }, [dealer, map]);
  return null;
}

export default function DealersMap({ dealers, selected }) {
  return (
    <MapContainer center={[-6.369, 34.889]} zoom={6} className="map">
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      {dealers.map((d) => (
        <Marker key={d.id} position={[d.lat, d.lng]} icon={pin}>
          <Popup>
            <strong>{d.name}</strong>
            <br />
            {d.category} · {d.address}
            <br />
            📞 <a href={`tel:${d.phone.replace(/\s/g, "")}`}>{d.phone}</a>
          </Popup>
        </Marker>
      ))}
      <FlyTo dealer={selected} />
    </MapContainer>
  );
}