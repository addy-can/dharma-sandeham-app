

export default async function handler(req, res) {
  const { question, moonSign, ascendant, nakshatra } = req.query;

  if (!question) {
    return res.status(400).json({ error: 'Missing user question.' });
  }

  const payload = {
    question: question,
    context: {
      moonSign: moonSign || null,
      ascendant: ascendant || null,
      nakshatra: nakshatra || null
    }
  };

  try {
    const response = await fetch('https://vedic-shastra-api.vercel.app/api/getScripture', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });

    const data = await response.json();

    if (!response.ok) {
      console.error('❌ Vedic Shastra API error:', data);
      return res.status(500).json({ error: 'Vedic Shastra API error', details: data });
    }

    res.status(200).json(data);
  } catch (err) {
    console.error('❌ Failed to fetch from Vedic Shastra API:', err.message);
    res.status(500).json({ error: 'Scripture lookup failed', details: err.message });
  }
}