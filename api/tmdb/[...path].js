export default async function handler(req, res) {
    const apiKey = '3fd2be6f0c70a2a598f084ddfb75487c';
    const tmdbBaseUrl = 'https://api.themoviedb.org/3';
    
    // Set CORS headers
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    
    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }
    
    try {
        // Extract the path from the catch-all route
        const { path = [] } = req.query;
        const endpoint = '/' + (Array.isArray(path) ? path.join('/') : path);
        
        // Build query parameters
        const params = new URLSearchParams();
        Object.entries(req.query).forEach(([key, value]) => {
            if (key !== 'path' && key !== 'api_key') {
                if (Array.isArray(value)) {
                    value.forEach(v => params.append(key, v));
                } else {
                    params.set(key, value);
                }
            }
        });
        
        // Add API key
        params.set('api_key', apiKey);
        
        const url = `${tmdbBaseUrl}${endpoint}?${params.toString()}`;
        
        console.log('[TMDB Proxy] Fetching:', url);
        
        const response = await fetch(url);
        const data = await response.json();
        
        if (!response.ok) {
            console.error('[TMDB Proxy] API Error:', response.status);
            return res.status(response.status).json(data);
        }
        
        res.setHeader('Cache-Control', 'public, max-age=3600');
        return res.status(200).json(data);
    } catch (error) {
        console.error('[TMDB Proxy] Error:', error.message);
        return res.status(500).json({ 
            error: 'Failed to fetch from TMDB',
            message: error.message 
        });
    }
}
