export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();

  const { endpoint, ...params } = req.query;

  if (!endpoint) return res.status(400).json({ error: 'Missing endpoint' });

  const key = process.env.PLACES_API_KEY;

  if (!key) return res.status(500).json({ error: 'API key not configured' });

  const qs = new URLSearchParams({ ...params, key, language: 'es' }).toString();
  const url = `https://maps.googleapis.com/maps/api/place/${endpoint}/json?${qs}`;

  try {
    const response = await fetch(url);
    const data = await response.json();
    return res.status(200).json(data);
  } catch (err) {
    return res.status(500).json({ error: 'Fetch failed', detail: err.message });
  }
}
