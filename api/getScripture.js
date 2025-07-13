export default async function handler(req, res) {
  const { question, moonSign, ascendant, nakshatra, force } = req.query;

  if (!question) {
    return res.status(400).json({ error: 'Missing user question.' });
  }

  const payload = {
    question,
    context: { moonSign, ascendant, nakshatra }
  };

  const tryVedicShastra = async () => {
    try {
      const vedicRes = await fetch('https://vedic-shastra-api.vercel.app/api/scriptures', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      const rawText = await vedicRes.text();
      let vedicData;
      try {
        vedicData = JSON.parse(rawText);
      } catch {
        console.warn('Vedic response not JSON. Falling back to GPT.');
        throw new Error('Vedic API failed');
      }

      if (vedicRes.ok && vedicData && vedicData.guidance) {
        return { source: 'vedic-shastra', ...vedicData };
      }

      console.warn('Vedic API gave no valid guidance. Falling back to GPT.');
      throw new Error('Invalid scripture response');

    } catch (err) {
      throw err;
    }
  };

  const tryLovableGPT = async () => {
    try {
      const gptRes = await fetch('https://run.lovable.so/api/run/YOUR_AGENT_ID', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${process.env.LOVABLE_API_KEY}`
        },
        body: JSON.stringify({
          input: { question, moonSign, ascendant, nakshatra }
        })
      });

      const gptData = await gptRes.json();

      if (!gptRes.ok) {
        throw new Error(gptData?.error || 'Lovable GPT error');
      }

      return { source: 'lovable', ...gptData.output };

    } catch (err) {
      throw err;
    }
  };

  try {
    if (force === 'gpt') {
      const fallback = await tryLovableGPT();
      return res.status(200).json(fallback);
    }

    const vedicResult = await tryVedicShastra();
    return res.status(200).json(vedicResult);
  } catch (vedicErr) {
    try {
      const fallback = await tryLovableGPT();
      return res.status(200).json(fallback);
    } catch (gptErr) {
      return res.status(500).json({ error: 'All lookups failed', details: gptErr.message });
    }
  }
}