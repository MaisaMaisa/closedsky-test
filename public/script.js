// public/script.js

const map = L.map('map').setView([20, 0], 2); // Center of world

// default style
// L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
//   maxZoom: 7,
//   attribution: '&copy; OpenStreetMap contributors'
// }).addTo(map);

const accessToken = 'YbDDX62fwZrbcqPNB3t4osLH6Pt7xrD5gI7rxGMxWOKG44WIl6KVNTXsQYSqGUVX';

const Jawg_Dark = L.tileLayer(`https://tile.jawg.io/jawg-dark/{z}/{x}/{y}{r}.png?access-token=${accessToken}`, {
  attribution: '<a href="https://jawg.io" title="Tiles Courtesy of Jawg Maps" target="_blank">&copy; <b>Jawg</b>Maps</a> &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
  minZoom: 0,
  maxZoom: 22,
  accessToken: accessToken
});

Jawg_Dark.addTo(map);


// Load custom airplane icon
const planeIcon = L.icon({
  iconUrl: 'https://cdn-icons-png.flaticon.com/512/190/190601.png',
  iconSize: [30, 30],
  iconAnchor: [15, 15]
});

// Keep track of plane markers
let planeMarkers = {};

function fetchFlights() {
  fetch('/flights')
    .then(res => res.json())
    .then(flights => {
      // Remove old markers
      for (let id in planeMarkers) {
        map.removeLayer(planeMarkers[id]);
      }
      planeMarkers = {};

      // Add new markers
    //   flights.forEach(flight => {
    //     if (flight.latitude && flight.longitude) {
    //       const marker = L.marker([flight.latitude, flight.longitude], { icon: planeIcon })
    //         .addTo(map)
    //         .bindPopup(`<b>${flight.callsign || 'Unknown'}</b><br>${flight.origin_country}`);
    //       planeMarkers[flight.icao24] = marker;
    //     }
    //   });
    flights.forEach(flight => {
        if (flight.latitude && flight.longitude) {
          const marker = L.circleMarker([flight.latitude, flight.longitude], {
            radius: 5,           // size of the dot
            fillColor: 'blue',   // fill color
            color: '#0033cc',    // stroke color (border)
            weight: 1,           // border thickness
            opacity: 1,
            fillOpacity: 0.8
          }).addTo(map)
            .bindPopup(`<b>${flight.callsign || 'Unknown'}</b><br>${flight.origin_country}`);
        }
      });

    })
    .catch(err => console.error('Error loading flights:', err));
}

// Initial load
fetchFlights();

// Refresh every 15 seconds
setInterval(fetchFlights, 15000);

const markers = L.markerClusterGroup();

flights.forEach(flight => {
  if (flight.latitude && flight.longitude) {
    const marker = L.marker([flight.latitude, flight.longitude], { icon: planeIcon })
      .bindPopup(`<b>${flight.callsign || 'Unknown'}</b><br>${flight.origin_country}`);
    markers.addLayer(marker);
  }
});

map.addLayer(markers);
