export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Only POST method is allowed' });
  }

  let body;
  try {
    body = await req.json();
  } catch (error) {
    return res.status(400).json({ error: 'Invalid JSON in request body' });
  }

  const {
    day, month, year,
    hour, minute,
    latitude, longitude,
    timezone
  } = body;

  const userID = '642794'; // Replace with your real userID
  const apiKey = '4ede7b1ef630a965146a6fd678f7c23db3ca5ece'; // Replace with your real API key

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
