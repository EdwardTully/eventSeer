import axios from 'axios';

const EVENTBRITE_API_URL = 'https://www.eventbriteapi.com/v3';

/**
 * Fetch events from Eventbrite API based on location and date range
 * @param {number} lat - Latitude
 * @param {number} lng - Longitude
 * @param {Date} startDate - Start date for event search
 * @param {Date} endDate - End date for event search
 * @param {string} apiKey - Eventbrite private token
 */
export const fetchEvents = async (lat, lng, startDate, endDate, apiKey) => {
  if (!apiKey) {
    console.warn('Eventbrite API token not provided');
    return [];
  }

  try {
    // First, test authentication with /users/me/ endpoint
    console.log('Testing Eventbrite authentication...');
    const authTest = await axios.get(`${EVENTBRITE_API_URL}/users/me/`, {
      params: { token: apiKey }
    });
    console.log('Authentication successful:', authTest.data);

    // Format dates for Eventbrite API (ISO 8601 format)
    const formatDate = (date) => {
      return date.toISOString();
    };

    console.log('Fetching events near:', { lat, lng });
    
    // Try the destination search endpoint instead
    // Eventbrite's event search by location might require OAuth
    // Let's try searching by destination/location
    const response = await axios.get(`${EVENTBRITE_API_URL}/destination/events/`, {
      params: {
        token: apiKey,
        'location.latitude': lat,
        'location.longitude': lng,
        'location.within': '16km',
        'start_date.range_start': formatDate(startDate),
        'start_date.range_end': formatDate(endDate),
        expand: 'venue',
      },
    });

    console.log('Eventbrite API Response:', response.data);
    
    const events = response.data.events || response.data.results || [];
    const parsedEvents = events.map(parseEvent).filter(e => e.lat && e.lng);
    
    console.log('Parsed Eventbrite events:', parsedEvents);
    return parsedEvents;
  } catch (error) {
    console.error('Error fetching Eventbrite events:', {
      status: error.response?.status,
      statusText: error.response?.statusText,
      data: error.response?.data,
      error_description: error.response?.data?.error_description,
      error_detail: error.response?.data?.error_detail,
      message: error.message,
      url: error.config?.url,
    });
    
    console.log('NOTE: Eventbrite public event search may require OAuth authentication, not just a private token.');
    console.log('The private token works for managing YOUR events, but searching ALL public events needs OAuth.');
    
    return [];
  }
};

/**
 * Parse Eventbrite event data for display
 * @param {Object} event - Raw event data from Eventbrite
 */
export const parseEvent = (event) => {
  const venue = event.venue;
  
  return {
    id: event.id,
    name: event.name?.text || 'Untitled Event',
    description: event.description?.text || event.summary || '',
    startDate: event.start?.local || event.start?.utc || '',
    endDate: event.end?.local || event.end?.utc || '',
    url: event.url || '',
    isFree: event.is_free || false,
    lat: venue?.latitude ? parseFloat(venue.latitude) : null,
    lng: venue?.longitude ? parseFloat(venue.longitude) : null,
    venue: {
      name: venue?.name || 'Venue TBA',
      address: venue?.address?.localized_address_display 
        || venue?.address?.address_1 
        || 'Address TBA',
    },
  };
};
