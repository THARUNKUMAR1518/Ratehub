export default async function handler(req, res) {
    const apiKey = '3fd2be6f0c70a2a598f084ddfb75487c';
    const tmdbBaseUrl = 'https://api.themoviedb.org/3';
    
    // Debug logging
    console.log('Incoming URL:', req.url);
    console.log('Query params:', req.query);
    
    // Extract path from URL (remove /api/tmdb prefix)
    const urlPath = req.url.split('?')[0].replace('/api/tmdb', '');
    const queryString = req.url.split('?')[1] || '';
    
    // Add CORS headers
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    
    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }
    
    try {
        // Parse query params
        const params = new URLSearchParams(queryString);
        params.delete('api_key'); // Remove client's api_key
        
        // Build final URL
        const paramsStr = params.toString();
        const finalUrl = `${tmdbBaseUrl}${urlPath}?${paramsStr}${paramsStr ? '&' : ''}api_key=${apiKey}`;
        
        console.log('Fetching:', finalUrl);
        
        const response = await fetch(finalUrl);
        
        if (!response.ok) {
            console.error(`TMDb API error: ${response.status}`);
            throw new Error(`API returned ${response.status}`);
        }
        
        const data = await response.json();
        
        res.setHeader('Cache-Control', 'public, max-age=3600');
        res.status(200).json(data);
    } catch (error) {
        console.error('Error:', error.message);
        res.status(500).json({ 
            error: 'Failed to fetch from TMDB', 
            details: error.message,
            receivedUrl: req.url 
        });
    }
}
