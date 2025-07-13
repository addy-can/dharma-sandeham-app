export default async function handler(req, res) {
  const {
    day, month, year,
    hour, minute,
    latitude, longitude,
    timezone
  } = req.query;

  console.log('🧾 Incoming Query:', JSON.stringify(req.query, null, 2));

  const payload = {
    year: parseInt(year, 10),
    month: parseInt(month, 10),
    day: parseInt(day, 10),
    hours: parseInt(hour, 10),
    minutes: parseInt(minute, 10),
    seconds: 0,
    latitude: parseFloat(latitude),
    longitude: parseFloat(longitude),
    timezone: parseFloat(timezone)
  };

  console.log('🟢 Payload to Free Astrology API:', payload);

  // Validate basic structure before sending
  for (const [key, val] of Object.entries(payload)) {
    if (typeof val !== 'number' || isNaN(val)) {
      console.error(`❌ Invalid or missing '${key}':`, val);
      return res.status(400).json({ error: `Invalid or missing value for '${key}'`, value: val });
    }
  }

  try {
    const response = await fetch('https://json.freeastrologyapi.com/planets/extended', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': '6THqThNB22aDtBIrmpIO17Ib2PobwjAG6uJMcyUa'
      },
      body: JSON.stringify(payload)
    });

    const data = await response.json();

    if (!response.ok || data.status === false) {
      console.error('❌ Free Astrology API error:', data);
      throw new Error(JSON.stringify(data));
    }

    res.status(200).json(data);
  } catch (error) {
    console.error('❌ Astrology API request failed:', error.message);
    res.status(500).json({ error: 'Astrology API request failed', details: error.message });
  }
}