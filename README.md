# EventSeer 🗺️

A mobile-first web app for travelers to discover local events (flea markets, festivals, music events, etc.) on an interactive map using the Ticketmaster Discovery API.

## Getting Started

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn
- A Ticketmaster API key (free at [developer.ticketmaster.com](https://developer.ticketmaster.com/))

### Quick Start

1. **Clone the repository**
```bash
git clone <your-repo-url>
cd eventSeer
```

2. **Install dependencies**
```bash
npm install
```

3. **Get your Ticketmaster API key**
   - Go to [https://developer.ticketmaster.com/](https://developer.ticketmaster.com/)
   - Sign up for a free account
   - Create an app to get your API key

4. **Create a `.env` file** in the project root:
```
VITE_TICKETMASTER_API_KEY=your_api_key_here
```

5. **Start the development server**
```bash
npm run dev
```

6. **Open your browser** to `http://localhost:5173`

### Usage
- Click anywhere on the map to search for events near that location
- Use the date selector to filter events by date range
- Click on event markers to view details
- Drag to pan, scroll to zoom

---

## Features

- 🗺️ Interactive map with click-to-search functionality
- 📍 Event markers with clustering for clean visualization
- 📅 Date range selector (defaults to 3-day window)
- 📱 Mobile-optimized interface
- 🎉 Discover local community events, markets, festivals, and more

## Tech Stack

- **React 19** with Vite for fast development
- **React-Leaflet** for interactive maps with OpenStreetMap tiles
- **Ticketmaster Discovery API** for event data
- **Tailwind CSS** for styling
- **react-leaflet-cluster** for marker clustering
- **date-fns** for date formatting

## Setup

*See "Getting Started" section above for installation instructions.*

## How to Use

1. Click anywhere on the map to search for events near that location
2. Events within a 10-mile radius will appear as markers
3. Click a marker to view event details (name, venue, date, link to tickets)
4. Adjust the date range to filter events (default is today + 3 days)
5. Drag to pan, scroll to zoom the map

## Project Structure

```
eventSeer/
├── src/
│   ├── components/
│   │   ├── EventMap.jsx       # Main map component
│   │   └── DateSelector.jsx   # Date range picker
│   ├── services/
│   │   └── eventbriteService.js  # Eventbrite API integration
│   ├── App.jsx                # Main app component
│   ├── main.jsx              # Entry point
│   └── index.css             # Global styles
├── index.html
├── package.json
├── vite.config.js
└── tailwind.config.js
```

## Development

- `npm run dev` - Start development server (usually runs on http://localhost:5173)
- `npm run build` - Build for production
- `npm run preview` - Preview production build

## Future Enhancements

### Eventbrite API Integration (Preferred)

**Why Eventbrite is a better fit:**
- Focuses on community events, local gatherings, flea markets, and neighborhood festivals
- Better aligned with the traveler discovery use case
- More grassroots and local event coverage vs. Ticketmaster's commercial focus

**What's needed to implement:**
1. **Backend server** - Eventbrite requires OAuth authentication, which cannot be done client-side
   - Options: Node.js/Express server, Netlify Functions, Cloudflare Workers, Vercel Serverless Functions
2. **OAuth flow implementation** - Handle the OAuth 2.0 authentication flow to get access tokens
3. **API proxy endpoint** - Server-side endpoint that:
   - Handles authentication with Eventbrite
   - Accepts requests from the frontend
   - Makes authenticated calls to Eventbrite API
   - Returns event data to the frontend
4. **Frontend updates** - Minimal changes needed:
   - Update `eventbriteService.js` to call your backend instead of Ticketmaster
   - Adjust event data parsing if Eventbrite's response format differs

The current frontend architecture (map, clustering, date filtering, click-to-search) will work seamlessly with Eventbrite once the backend is implemented.

## Notes on Deployment

**⚠️ API Key Security**: The current implementation stores the API key client-side (via VITE_ prefix). This is fine for personal/local use, but if deploying publicly:

1. Review Ticketmaster's API Terms of Service regarding public applications
2. Consider implementing a backend proxy (Netlify Functions, Cloudflare Workers, etc.) to keep the API key server-side
3. Set rate limiting to avoid exceeding API quotas

This project is primarily designed for personal/local use. Public deployment should include proper API key protection.

## License

MIT