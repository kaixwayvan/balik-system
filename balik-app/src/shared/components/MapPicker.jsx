import React, { useState, useEffect, useRef } from 'react';
import { MapContainer, TileLayer, Marker, useMapEvents, useMap } from 'react-leaflet';
import { Search, MapPin, X, Loader2 } from "lucide-react";
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Fix for default marker icon in Leaflet + React/Vite
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerIconRetina from 'leaflet/dist/images/marker-icon-2x.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';

let DefaultIcon = L.icon({
  iconUrl: markerIcon,
  iconRetinaUrl: markerIconRetina,
  shadowUrl: markerShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  tooltipAnchor: [16, -28],
  shadowSize: [41, 41]
});

L.Marker.prototype.options.icon = DefaultIcon;

function LocationMarker({ position, setPosition, setAddress }) {
  useMapEvents({
    click(e) {
      const { lat, lng } = e.latlng;
      setPosition(e.latlng);
      
      // Reverse geocoding using Nominatim
      fetch(`https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${lat}&lon=${lng}`)
        .then(res => res.json())
        .then(data => {
          if (data && data.display_name) {
            const parts = data.display_name.split(',');
            const shortAddress = parts.slice(0, 3).join(',').trim();
            setAddress(shortAddress);
          } else {
            setAddress(`${lat.toFixed(4)}, ${lng.toFixed(4)}`);
          }
        })
        .catch(() => {
          setAddress(`${lat.toFixed(4)}, ${lng.toFixed(4)}`);
        });
    },
  });

  return position === null ? null : (
    <Marker position={position}></Marker>
  );
}

function MapRef({ center }) {
  const map = useMap();
  useEffect(() => {
    if (center) {
      map.flyTo(center, 16, { duration: 1.5 });
    }
  }, [center, map]);
  return null;
}

export default function MapPicker({ onSelect, onClose }) {
  const [position, setPosition] = useState(null);
  const [address, setAddress] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const searchTimeout = useRef(null);

  useEffect(() => {
    if (searchQuery.length < 3) {
      setSuggestions([]);
      return;
    }

    if (searchTimeout.current) clearTimeout(searchTimeout.current);

    searchTimeout.current = setTimeout(async () => {
      setIsSearching(true);
      try {
        const res = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(searchQuery)}&limit=5&addressdetails=1`);
        const data = await res.json();
        setSuggestions(data);
        setShowSuggestions(true);
      } catch (err) {
        console.error("Search failed:", err);
      } finally {
        setIsSearching(false);
      }
    }, 500);

    return () => clearTimeout(searchTimeout.current);
  }, [searchQuery]);

  const handleSuggestionSelect = (item) => {
    const lat = parseFloat(item.lat);
    const lon = parseFloat(item.lon);
    const newPos = { lat, lng: lon };
    
    setPosition(newPos);
    setAddress(item.display_name.split(',').slice(0, 3).join(',').trim());
    setSearchQuery(item.display_name.split(',').slice(0, 2).join(',').trim());
    setShowSuggestions(false);
  };

  const handleConfirm = () => {
    if (position) {
      onSelect(address);
      onClose();
    }
  };

  return (
    <div className="relative h-full flex flex-col gap-4">
      {/* Search Header */}
      <div className="relative z-[1000]">
        <div className="relative group">
          <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-600 transition-colors">
            {isSearching ? <Loader2 size={20} className="animate-spin" /> : <Search size={20} />}
          </div>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search for a location (e.g. Rizal Park, Manila)"
            className="w-full bg-white border-2 border-slate-100 rounded-2xl py-4 pl-12 pr-12 text-sm font-medium shadow-sm focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-50/50 transition-all"
            onFocus={() => searchQuery.length >= 3 && setShowSuggestions(true)}
          />
          {searchQuery && (
            <button 
              onClick={() => { setSearchQuery(''); setSuggestions([]); }}
              className="absolute right-4 top-1/2 -translate-y-1/2 p-1 hover:bg-slate-100 rounded-full text-slate-400 transition-all"
            >
              <X size={16} />
            </button>
          )}
        </div>

        {/* Suggestions Dropdown */}
        {showSuggestions && suggestions.length > 0 && (
          <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-2xl shadow-2xl border border-slate-100 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
            <div className="max-h-[300px] overflow-y-auto">
              {suggestions.map((item, idx) => (
                <button
                  key={idx}
                  onClick={() => handleSuggestionSelect(item)}
                  className="w-full flex items-start gap-3 p-4 hover:bg-slate-50 text-left transition-colors border-b border-slate-50 last:border-0"
                >
                  <div className="w-8 h-8 rounded-full bg-blue-50 flex items-center justify-center shrink-0 mt-0.5">
                    <MapPin size={16} className="text-blue-600" />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-slate-900 line-clamp-1">{item.display_name.split(',')[0]}</p>
                    <p className="text-xs text-slate-500 line-clamp-1">{item.display_name.split(',').slice(1).join(',').trim()}</p>
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      <div className="flex-1 rounded-2xl overflow-hidden border-2 border-slate-100 relative group">
        <MapContainer 
          center={[14.5995, 120.9842]} // Manila default
          zoom={13} 
          scrollWheelZoom={true} 
          style={{ height: '100%', width: '100%' }}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <LocationMarker position={position} setPosition={setPosition} setAddress={setAddress} />
          <MapRef center={position} />
        </MapContainer>
        
        {/* Map Overlay Button (Crosshair center) */}
        {!position && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-[400]">
            <div className="w-12 h-12 flex items-center justify-center text-blue-600/30">
              <div className="w-1 h-1 bg-blue-600 rounded-full" />
              <div className="absolute w-8 h-[2px] bg-blue-600/20" />
              <div className="absolute h-8 w-[2px] bg-blue-600/20" />
            </div>
          </div>
        )}
      </div>

      <div className="mt-4 p-4 bg-slate-50 rounded-2xl border border-slate-200">
        <div className="flex items-start gap-3 mb-4">
          <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-600" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
            </svg>
          </div>
          <div>
            <h4 className="text-sm font-bold text-slate-900">Selected Location</h4>
            <p className="text-xs text-slate-500 leading-relaxed">
              {address || "Click on the map to select where the item was lost or found."}
            </p>
          </div>
        </div>
        
        <div className="flex gap-3">
          <button 
            onClick={onClose}
            className="flex-1 py-3 px-4 rounded-xl font-bold text-slate-600 hover:bg-slate-200 transition-colors text-sm"
          >
            Cancel
          </button>
          <button 
            onClick={handleConfirm}
            disabled={!position}
            className={`flex-1 py-3 px-4 rounded-xl font-bold text-white transition-all text-sm ${
              position 
                ? 'bg-blue-600 hover:bg-blue-700 shadow-lg shadow-blue-200 active:scale-95' 
                : 'bg-slate-300 cursor-not-allowed'
            }`}
          >
            Pick Location
          </button>
        </div>
      </div>
    </div>
  );
}
