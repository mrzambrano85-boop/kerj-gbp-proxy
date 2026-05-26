export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  if (req.method === 'OPTIONS') return res.status(200).end();

  const { endpoint, ...params } = req.query;
  if (!endpoint) return res.status(400).json({ error: 'Missing endpoint' });

  const key = process.env.PLACES_API_KEY;
  if (!key) return res.status(500).json({ error: 'No API key' });

  const qs = new URLSearchParams({ ...params, key, language: 'es' }).toString();
  const url = `https://maps.googleapis.com/maps/api/place/${endpoint}?${qs}`;

  const response = await fetch(url);
  const text = await response.text();

  try {
    const json = JSON.parse(text);
    return res.status(200).json(json);
  } catch {
    return res.status(200).json({ raw: text.substring(0, 300), url_called: url.replace(key, 'KEY_HIDDEN') });
  }
}
