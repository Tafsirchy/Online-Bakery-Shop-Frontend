'use client';

import { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

export default function MapComponent() {
  const [isMounted, setIsMounted] = useState(false);
  const position = [23.8103, 90.4125];

  useEffect(() => {
    setIsMounted(true);
    
    // Fix for Leaflet marker icons in Next.js
    // We do this inside useEffect to ensure it only runs on the client
    // and doesn't interfere with other instances during SSR/HMR
    if (typeof window !== 'undefined') {
      delete L.Icon.Default.prototype._getIconUrl;
      L.Icon.Default.mergeOptions({
        iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
        iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
        shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
      });
    }
  }, []);

  if (!isMounted) {
    return (
      <div className="h-full w-full bg-cream-highlight flex items-center justify-center">
        <p className="text-muted font-serif">Initializing Map...</p>
      </div>
    );
  }

  return (
    <div className="h-full w-full overflow-hidden">
      <MapContainer 
        center={position} 
        zoom={13} 
        style={{ height: '100%', width: '100%' }} 
        scrollWheelZoom={false}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <Marker position={position}>
          <Popup>
            The Cozy Bakery Kitchen <br /> Freshness starts here!
          </Popup>
        </Marker>
      </MapContainer>
    </div>
  );
}
