export default async function handler(req, res) {
    const apiKey = '3fd2be6f0c70a2a598f084ddfb75487c';
    
    // Extract the path after /api/movies
    let path = req.url.replace('/api/movies', '');
    if (!path.startsWith('/')) path = '/' + path;
    
    // Build final URL
    const tmdbUrl = `https://api.themoviedb.org/3${path}${path.includes('?') ? '&' : '?'}api_key=${apiKey}`;
    
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
    res.setHeader('Content-Type', 'application/json');
    
    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }
    
    try {
        const response = await fetch(tmdbUrl);
        const data = await response.json();
        res.setHeader('Cache-Control', 'max-age=3600');
        return res.status(200).json(data);
    } catch (err) {
        return res.status(500).json({ error: err.message });
    }
}
