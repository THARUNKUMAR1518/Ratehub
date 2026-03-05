export default async (req, res) => {
    try {
        // Get the full URL from the request
        const originalUrl = req.url;
        const queryIndex = originalUrl.indexOf('?');
        const queryString = queryIndex > -1 ? originalUrl.substring(queryIndex + 1) : '';
        const params = new URLSearchParams(queryString);
        const url = params.get('url');
        
        if (!url) {
            return res.status(400).json({ error: 'url parameter required' });
        }
        
        console.log('Fetching:', url);
        
        const response = await fetch(url);
        if (!response.ok) {
            return res.status(response.status).json({ error: `API returned ${response.status}` });
        }
        
        const data = await response.json();
        
        res.setHeader('Access-Control-Allow-Origin', '*');
        res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
        res.setHeader('Content-Type', 'application/json');
        res.setHeader('Cache-Control', 'public, max-age=3600');
        
        return res.status(200).json(data);
    } catch (error) {
        console.error('Proxy error:', error);
        return res.status(500).json({ error: error.message });
    }
};
