import { useState } from 'react';
import { addDays } from 'date-fns';
import EventMap from './components/EventMap';
import DateSelector from './components/DateSelector';
import { fetchEvents, parseEvent } from './services/eventbriteService';

// IMPORTANT: Replace with your Ticketmaster API key
// Get one at: https://developer.ticketmaster.com/products-and-docs/apis/getting-started/
const TICKETMASTER_API_KEY = import.meta.env.VITE_TICKETMASTER_API_KEY || '';

function App() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(addDays(new Date(), 3));
  const [mapCenter, setMapCenter] = useState([39.8283, -98.5795]); // Center of USA
  const [mapZoom, setMapZoom] = useState(5);

  const handleMapClick = async (latlng) => {
    setLoading(true);
    setMapCenter([latlng.lat, latlng.lng]);
    setMapZoom(11); // Zoom in when user clicks

    try {
      const eventData = await fetchEvents(
        latlng.lat,
        latlng.lng,
        startDate,
        endDate,
        TICKETMASTER_API_KEY
      );
      
      console.log('Raw event data:', eventData);
      const parsedEvents = eventData.map(parseEvent).filter(e => e.lat && e.lng);
      console.log('Parsed events with coords:', parsedEvents);
      setEvents(parsedEvents);
    } catch (error) {
      console.error('Error loading events:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative w-full h-full">
      <DateSelector
        startDate={startDate}
        endDate={endDate}
        onStartDateChange={setStartDate}
        onEndDateChange={setEndDate}
      />
      
      {loading && (
        <div className="absolute top-4 right-4 z-[1000] bg-blue-500 text-white px-4 py-2 rounded-lg shadow-lg">
          Loading events...
        </div>
      )}

      {!TICKETMASTER_API_KEY && (
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-[1000] bg-yellow-100 border-2 border-yellow-400 text-yellow-800 px-6 py-4 rounded-lg shadow-lg max-w-md text-center">
          <p className="font-bold mb-2">⚠️ API Key Required</p>
          <p className="text-sm">
            Add your Ticketmaster API key to <code className="bg-yellow-200 px-1 rounded">.env</code> file:
          </p>
          <p className="text-xs mt-2">
            <code className="bg-yellow-200 px-2 py-1 rounded block mt-1">
              VITE_TICKETMASTER_API_KEY=your_key_here
            </code>
          </p>
          <p className="text-xs mt-2">
            Get a key at: <a href="https://developer.ticketmaster.com" target="_blank" rel="noopener noreferrer" className="underline">developer.ticketmaster.com</a>
          </p>
        </div>
      )}

      <EventMap
        events={events}
        onMapClick={handleMapClick}
        center={mapCenter}
        zoom={mapZoom}
      />
    </div>
  );
}

export default App;
