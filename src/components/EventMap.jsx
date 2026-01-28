import { useEffect, useRef } from 'react';
import { MapContainer, TileLayer, useMapEvents, Marker, Popup, useMap } from 'react-leaflet';
import MarkerClusterGroup from 'react-leaflet-cluster';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Fix for default marker icons in React-Leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

const MapClickHandler = ({ onMapClick }) => {
  const map = useMapEvents({
    click: (e) => {
      // Only trigger if map wasn't dragged
      if (!map.dragging._moving) {
        onMapClick(e.latlng);
      }
    },
  });
  return null;
};

const MapUpdater = ({ center, zoom }) => {
  const map = useMap();
  
  useEffect(() => {
    if (center && zoom) {
      map.setView(center, zoom);
    }
  }, [center, zoom, map]);
  
  return null;
};

const EventMap = ({ events, onMapClick, center = [39.8283, -98.5795], zoom = 5 }) => {
  console.log('EventMap rendering with', events.length, 'events');
  
  return (
    <MapContainer
      center={center}
      zoom={zoom}
      className="w-full h-full"
      scrollWheelZoom={true}
      zoomControl={false}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <MapClickHandler onMapClick={onMapClick} />
      <MapUpdater center={center} zoom={zoom} />
      
      {events.length > 0 && (
        <MarkerClusterGroup 
          chunkedLoading 
          maxClusterRadius={30}
          disableClusteringAtZoom={10}
          spiderfyOnMaxZoom={true}
          showCoverageOnHover={false}
        >
          {events.map((event) => (
            event.lat && event.lng && (
              <Marker 
                key={event.id} 
                position={[event.lat, event.lng]}
              >
                <Popup closeButton={true}>
                  <div className="p-2">
                    <h3 className="font-bold text-lg mb-1">{event.name}</h3>
                    <p className="text-sm text-gray-600 mb-1">
                      {new Date(event.startDate).toLocaleDateString()}
                    </p>
                    <p className="text-sm mb-1">{event.venue.name}</p>
                    <p className="text-xs text-gray-500 mb-2">{event.venue.address}</p>
                    {event.isFree && (
                      <span className="inline-block bg-green-100 text-green-800 text-xs px-2 py-1 rounded mb-2">
                        FREE
                      </span>
                    )}
                    <br />
                    {event.url && (
                      <a
                        href={event.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:underline text-sm"
                      >
                        View Event →
                      </a>
                    )}
                  </div>
                </Popup>
              </Marker>
            )
          ))}
        </MarkerClusterGroup>
      )}
    </MapContainer>
  );
};

export default EventMap;
