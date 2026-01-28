import axios from 'axios';

const SEATGEEK_API_URL = 'https://api.seatgeek.com/2';

/**
 * Fetch events from SeatGeek API based on location and date range
 * @param {number} lat - Latitude
 * @param {number} lng - Longitude
 * @param {Date} startDate - Start date for event search
 * @param {Date} endDate - End date for event search
 * @param {string} clientId - SeatGeek client ID
 */
export const fetchEvents = async (lat, lng, startDate, endDate, clientId) => {
  if (!clientId) {
    console.warn('SeatGeek client ID not provided');
    return [];
  }

  try {
    // Format dates for SeatGeek API (YYYY-MM-DD format)
    const formatDate = (date) => {
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const day = String(date.getDate()).padStart(2, '0');
      return `${year}-${month}-${day}`;
    };

    console.log('Fetching SeatGeek events near:', { lat, lng });
    
    const response = await axios.get(`${SEATGEEK_API_URL}/events`, {
      params: {
        client_id: clientId,
        lat: lat,
        lon: lng,
        range: '10mi',
        'datetime_utc.gte': formatDate(startDate),
        'datetime_utc.lte': formatDate(endDate),
        per_page: 100,
      },
    });

    console.log('SeatGeek API Response:', response.data);
    
    const events = response.data.events || [];
    const parsedEvents = events.map(parseEvent).filter(e => e.lat && e.lng);
    
    console.log('Parsed SeatGeek events:', parsedEvents);
    return parsedEvents;
  } catch (error) {
    console.error('Error fetching SeatGeek events:', {
      status: error.response?.status,
      statusText: error.response?.statusText,
      data: error.response?.data,
      message: error.message,
      url: error.config?.url,
    });
    return [];
  }
};

/**
 * Parse SeatGeek event data for display
 * @param {Object} event - Raw event data from SeatGeek
 */
export const parseEvent = (event) => {
  const venue = event.venue;
  const performers = event.performers || [];
  
  // SeatGeek provides datetime_local which includes date and time
  const datetime = event.datetime_local || event.datetime_utc || '';
  let startTime = '';
  if (datetime) {
    try {
      const date = new Date(datetime);
      startTime = date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true });
    } catch (e) {
      startTime = '';
    }
  }
  
  return {
    id: `sg-${event.id}`, // Prefix to avoid ID conflicts with other APIs
    name: event.title || event.short_title || 'Untitled Event',
    description: event.description || '',
    startDate: datetime,
    startTime: startTime,
    endDate: datetime,
    url: event.url || '',
    imageUrl: performers[0]?.image || event.performers?.[0]?.images?.huge || null,
    isFree: event.stats?.lowest_price === 0 || false,
    lat: venue?.location?.lat ? parseFloat(venue.location.lat) : null,
    lng: venue?.location?.lon ? parseFloat(venue.location.lon) : null,
    source: 'SeatGeek',
    venue: {
      name: venue?.name || 'Venue TBA',
      address: venue?.address 
        ? `${venue.address}, ${venue.city || ''}, ${venue.state || ''}`
        : venue?.display_location || 'Address TBA',
    },
  };
};
