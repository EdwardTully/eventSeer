import axios from 'axios';

const TICKETMASTER_API_URL = 'https://app.ticketmaster.com/discovery/v2';

/**
 * Fetch events from Ticketmaster Discovery API based on location and date range
 * @param {number} lat - Latitude
 * @param {number} lng - Longitude
 * @param {Date} startDate - Start date for event search
 * @param {Date} endDate - End date for event search
 * @param {string} apiKey - Ticketmaster API key
 */
export const fetchEvents = async (lat, lng, startDate, endDate, apiKey) => {
  if (!apiKey) {
    console.warn('Ticketmaster API key not provided');
    return [];
  }

  try {
    // Format dates for Ticketmaster API (YYYY-MM-DDTHH:mm:ss format without Z)
    const formatDate = (date) => {
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const day = String(date.getDate()).padStart(2, '0');
      return `${year}-${month}-${day}T00:00:00Z`;
    };
    
    const response = await axios.get(`${TICKETMASTER_API_URL}/events.json`, {
      params: {
        apikey: apiKey,
        latlong: `${lat},${lng}`,
        radius: '10',
        unit: 'miles',
        startDateTime: formatDate(startDate),
        endDateTime: formatDate(endDate),
        size: 100, // Max results per page
      },
    });

   
    const events = response.data._embedded?.events || [];
   
    return events;
  } catch (error) {
    console.error('Error fetching events:', error);
    return [];
  }
};

/**
 * Parse Ticketmaster event data for display
 * @param {Object} event - Raw event data from Ticketmaster
 */
export const parseEvent = (event) => {
  const venue = event._embedded?.venues?.[0];
  
  return {
    id: event.id,
    name: event.name || 'Untitled Event',
    description: event.info || event.pleaseNote || '',
    startDate: event.dates?.start?.localDate || '',
    endDate: event.dates?.end?.localDate || event.dates?.start?.localDate || '',
    url: event.url || '',
    isFree: event.priceRanges?.[0]?.min === 0 || false,
    lat: venue?.location?.latitude ? parseFloat(venue.location.latitude) : null,
    lng: venue?.location?.longitude ? parseFloat(venue.location.longitude) : null,
    venue: {
      name: venue?.name || 'Venue TBA',
      address: venue?.address?.line1 
        ? `${venue.address.line1}, ${venue.city?.name || ''}, ${venue.state?.stateCode || ''}`
        : 'Address TBA',
    },
  };
};
