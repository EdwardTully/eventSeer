import { useState } from 'react';
import { addDays } from 'date-fns';
import EventMap from './components/EventMap';
import DateSelector from './components/DateSelector';
import * as ticketmasterService from './services/eventbriteService';
import * as eventbriteService from './services/eventbriteServiceReal';
import * as seatgeekService from './services/seatgeekService';

// API Keys
const TICKETMASTER_API_KEY = import.meta.env.VITE_TICKETMASTER_API_KEY || '';
const EVENTBRITE_API_TOKEN = import.meta.env.VITE_EVENTBRITE_API_TOKEN || '';
const SEATGEEK_CLIENT_ID = import.meta.env.VITE_SEATGEEK_CLIENT_ID || '';

// Fetch from multiple APIs and combine results
const USE_COMBINED_APIS = true; // Set to false to use single API mode
const SINGLE_API = 'seatgeek'; // Used when USE_COMBINED_APIS is false

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
      if (USE_COMBINED_APIS) {
        // Fetch from multiple APIs in parallel
        console.log('Fetching events from Ticketmaster and SeatGeek...');
        
        const [ticketmasterEvents, seatgeekEvents] = await Promise.all([
          ticketmasterService.fetchEvents(
            latlng.lat,
            latlng.lng,
            startDate,
            endDate,
            TICKETMASTER_API_KEY
          ).catch(err => {
            console.error('Ticketmaster fetch failed:', err);
            return [];
          }),
          seatgeekService.fetchEvents(
            latlng.lat,
            latlng.lng,
            startDate,
            endDate,
            SEATGEEK_CLIENT_ID
          ).catch(err => {
            console.error('SeatGeek fetch failed:', err);
            return [];
          })
        ]);

        const allEvents = [...ticketmasterEvents, ...seatgeekEvents];
        console.log(`Combined results: ${ticketmasterEvents.length} from Ticketmaster, ${seatgeekEvents.length} from SeatGeek`);
        setEvents(allEvents);
      } else {
        // Single API mode (legacy)
        let service, apiKey;
        
        if (SINGLE_API === 'eventbrite') {
          service = eventbriteService;
          apiKey = EVENTBRITE_API_TOKEN;
        } else if (SINGLE_API === 'seatgeek') {
          service = seatgeekService;
          apiKey = SEATGEEK_CLIENT_ID;
        } else {
          service = ticketmasterService;
          apiKey = TICKETMASTER_API_KEY;
        }
        
        console.log(`Using ${SINGLE_API} API`);
        
        const eventData = await service.fetchEvents(
          latlng.lat,
          latlng.lng,
          startDate,
          endDate,
          apiKey
        );
        
        console.log('Raw event data:', eventData);
        setEvents(eventData);
      }
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
