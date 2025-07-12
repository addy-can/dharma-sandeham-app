export default async function handler(req, res) {
  const city = req.query.city;

  if (!city) {
    return res.status(400).json({ error: 'Missing city parameter' });
  }

  const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(city)}`;

  try {
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'dharma-sandeham-app/1.0 (youremail@example.com)'
      }
    });

    const data = await response.json();

    if (data.length === 0) {
      return res.status(404).json({ error: 'City not found' });
    }

    const { lat, lon } = data[0];
    return res.status(200).json({ lat, lon });
  } catch (error) {
    return res.status(500).json({ error: 'Failed to fetch geolocation' });
  }
}