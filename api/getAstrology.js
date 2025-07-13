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

  const userID = '642794';
  const apiKey = '4ede7b1ef630a965146a6fd678f7c23db3ca5ece';

  const payload = {
    day: Number(day),
    month: Number(month),
    year: Number(year),
    hour: Number(hour),
    minute: Number(minute),
    latitude: Number(latitude),
    longitude: Number(longitude),
    timezone: Number(timezone)
  };

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