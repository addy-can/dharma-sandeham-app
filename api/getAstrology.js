export default async function handler(req, res) {
  const {
    day, month, year,
    hour, minute,
    latitude, longitude,
    timezone
  } = req.query;

  console.log('🧾 Incoming Query:', JSON.stringify(req.query, null, 2));

  console.log('🧪 Raw minute value (pre-parse):', minute);

  const userID = '642794';
  const apiKey = '4ede7b1ef630a965146a6fd678f7c23db3ca5ece';

  const payload = {
    day: parseInt(day, 10),
    month: parseInt(month, 10),
    year: parseInt(year, 10),
    hour: parseInt(hour, 10),
    minute: parseInt(minute, 10),
    latitude: parseFloat(latitude),
    longitude: parseFloat(longitude),
    timezone: parseFloat(timezone)
  };

  console.log('🟢 Payload being sent to Vedic Rishi API:', payload);
  console.log('📦 Final JSON body sent to API:', JSON.stringify(payload, null, 2));

  for (const [key, val] of Object.entries(payload)) {
    if (typeof val !== 'number' || isNaN(val) || val === -1) {
      console.error(`❌ Invalid or missing '${key}':`, val);
      return res.status(400).json({ error: `Invalid or missing value for '${key}'`, value: val });
    }
  }

  try {
    const response = await fetch('https://json.astrologyapi.com/v1/birth_details', {
      method: 'POST',
      headers: {
        'Authorization': 'Basic ' + Buffer.from(`${userID}:${apiKey}`).toString('base64'),
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload)
    });

    const data = await response.json();

    if (!response.ok || data.status === false) {
      throw new Error(JSON.stringify(data));
    }

    res.status(200).json(data);
  } catch (error) {
    console.error('❌ API request failed:', error.message);
    res.status(500).json({ error: 'Astrology API request failed', details: error.message });
  }
}