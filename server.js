// server.js
const express = require('express');
const fetch = require('node-fetch'); // Make sure this is version 2.x
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.static(path.join(__dirname, 'public')));

// ✅ This uses the LIVE flights API, NOT historical
app.get('/flights', async (req, res) => {
  try {
    const response = await fetch('https://opensky-network.org/api/states/all');
    const data = await response.json();

    if (!data.states) {
      return res.status(500).json({ error: 'No states returned from OpenSky' });
    }

    //THIS TO SHOW ALL LIVE FLIGHTS FROM THE WORLD
    // const flights = data.states
    //   .filter(state => state[5] !== null && state[6] !== null) // only flights with lat/lon
    //   .map(state => ({
    //     icao24: state[0],
    //     callsign: state[1]?.trim(),
    //     origin_country: state[2],
    //     longitude: state[5],
    //     latitude: state[6],
    //     heading: state[10],
    //     altitude: state[7],
    //   }));

    // Filter flights from US and Guatemala
    const flights = data.states
    .filter(state => state[5] !== null && state[6] !== null) // only flights with lat/lon
    .filter(state => {
      const originCountry = state[2]?.toLowerCase();
      return originCountry === 'united states' || originCountry === 'guatemala';
    })
    .map(state => ({
      icao24: state[0],
      callsign: state[1]?.trim(),
      origin_country: state[2],
      longitude: state[5],
      latitude: state[6],
    }));


    // console.log(`✅ Sent ${flights.length} live flights`);
    console.log(flights);

    res.json(flights);
  } catch (error) {
    console.error('❌ Error fetching flights:', error);
    res.status(500).json({ error: 'Failed to fetch flights' });
  }
});

app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});
