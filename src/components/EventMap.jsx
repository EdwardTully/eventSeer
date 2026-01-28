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
                <Popup closeButton={true} maxWidth={240}>
                  <div style={{ padding: '8px' }}>
                    {event.imageUrl && (
                      <img 
                        src={event.imageUrl} 
                        alt={event.name}
                        style={{ width: '100%', height: '100px', objectFit: 'cover', borderRadius: '4px', marginBottom: '6px' }}
                      />
                    )}
                    <h3 style={{ fontWeight: 'bold', fontSize: '14px', marginBottom: '4px', lineHeight: '1.3' }}>{event.name}</h3>
                    <p style={{ fontSize: '12px', color: '#6B7280', marginBottom: '4px' }}>
                      {new Date(event.startDate).toLocaleDateString()}
                      {event.startTime && (
                        <span style={{ marginLeft: '6px' }}>• {event.startTime}</span>
                      )}
                    </p>
                    <p style={{ fontSize: '12px', marginBottom: '2px' }}>{event.venue.name}</p>
                    <p style={{ fontSize: '11px', color: '#9CA3AF', marginBottom: '6px' }}>{event.venue.address}</p>
                    {event.isFree && (
                      <span style={{ display: 'inline-block', backgroundColor: '#D1FAE5', color: '#065F46', fontSize: '10px', padding: '2px 8px', borderRadius: '4px', marginBottom: '6px' }}>
                        FREE
                      </span>
                    )}
                    {event.url && (
                      <>
                        <br />
                        <a
                          href={event.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          style={{ color: '#2563EB', fontSize: '12px', textDecoration: 'none' }}
                          onMouseOver={(e) => e.target.style.textDecoration = 'underline'}
                          onMouseOut={(e) => e.target.style.textDecoration = 'none'}
                        >
                          View Event →
                        </a>
                      </>
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
