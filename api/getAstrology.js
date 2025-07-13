export default async function handler(req, res) {
  const {
    day, month, year,
    hour, minute,
    latitude, longitude,
    timezone
  } = req.query;

  if (!day || !month || !year || !hour || !minute || !latitude || !longitude || !timezone) {
    return res.status(400).json({ error: 'Missing required query parameters' });
  }

  console.log('🧾 Incoming Query:', JSON.stringify(req.query, null, 2));

  const userID = '642794';
  const apiKey = '4ede7b1ef630a965146a6fd678f7c23db3ca5ece';

  const payload = {
    day: parseInt(day, 10),
    month: parseInt(month, 10),
    year: parseInt(year, 10),
    hour: parseInt(hour, 10),
    minute: typeof minute === 'string' && minute.trim() !== '' ? parseInt(minute.trim(), 10) : -1,
    latitude: parseFloat(latitude),
    longitude: parseFloat(longitude),
    timezone: parseFloat(timezone)
  };

  console.log('🟢 Payload being sent to Vedic Rishi API:', payload);

  for (const [key, val] of Object.entries(payload)) {
    if (typeof val !== 'number' || isNaN(val) || val === -1) {
      console.error(`❌ Invalid or missing '${key}':`, val);
      return res.status(400).json({ error: `Invalid or missing value for '${key}'`, value: val });
    }
  }

  const response = await fetch('https://json.astrologyapi.com/v1/astro_details', {
    method: 'POST',
    headers: {
      'Authorization': 'Basic ' + Buffer.from(`${userID}:${apiKey}`).toString('base64'),
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(payload)
  });

  const data = await response.json();
  res.status(200).json(data);
}