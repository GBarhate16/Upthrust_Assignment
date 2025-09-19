const axios = require('axios');

async function fetchWeather(location) {
	// Use provided location or default to Delhi if empty/null/undefined
	const city = (location && location.trim()) || 'Delhi';
	console.log('🌤️ Fetching weather for:', city); // Debug log
	try {
		console.log('📍 Step 1: Getting geolocation data...');
		
		// First try to get geolocation with timeout
		const geoRequest = axios.get('https://geocoding-api.open-meteo.com/v1/search', { 
			params: { name: city, count: 1 },
			timeout: 10000 // 10 second timeout
		});
		
		const geo = await geoRequest;
		console.log('📍 Geolocation response:', geo.data);
		
		if (!geo.data?.results || geo.data.results.length === 0) {
			console.error('❌ No geolocation results found for:', city);
			// Try with a default location if the city is not found
			if (city.toLowerCase() !== 'delhi') {
				console.log('🔄 Retrying with Delhi as fallback...');
				return await fetchWeather('Delhi');
			}
			throw new Error('geocode-failed');
		}
		
		const lat = geo.data.results[0].latitude;
		const lon = geo.data.results[0].longitude;
		const foundLocation = geo.data.results[0].name || city;
		
		if (lat == null || lon == null) {
			console.error('❌ Invalid coordinates for:', city);
			throw new Error('invalid-coordinates');
		}
		
		console.log(`📍 Found coordinates: ${lat}, ${lon} for ${foundLocation}`);
		console.log('🌡️ Step 2: Getting weather data...');
		
		// Get weather data with timeout
		const weatherRequest = axios.get('https://api.open-meteo.com/v1/forecast', {
			params: { 
				latitude: lat, 
				longitude: lon, 
				current: 'temperature_2m,relative_humidity_2m,apparent_temperature,weather_code,cloud_cover,pressure_msl,wind_speed_10m',
				timezone: 'auto'
			},
			timeout: 15000 // 15 second timeout
		});
		
		const weather = await weatherRequest;
		console.log('🌡️ Weather API response status:', weather.status);
		console.log('🌡️ Weather API response data:', weather.data);
		
		const current = weather.data?.current;
		
		if (!current) {
			console.error('❌ Weather data missing in API response');
			console.log('📄 Full weather response:', JSON.stringify(weather.data, null, 2));
			throw new Error('weather-missing');
		}
		
		// Create comprehensive weather object with fallbacks
		const weatherData = {
			location: foundLocation,
			temperature: current.temperature_2m || 0,
			feels_like: current.apparent_temperature || current.temperature_2m || 0,
			humidity: current.relative_humidity_2m || 0,
			cloud_cover: current.cloud_cover || 0,
			wind_speed: current.wind_speed_10m || 0,
			pressure: current.pressure_msl || 0,
			weather_code: current.weather_code || 0
		};
		
		console.log('✅ Successfully processed weather data:', weatherData);
		
		// Return JSON string for more detailed processing in frontend
		return JSON.stringify(weatherData);
		
	} catch (error) {
		console.error('❌ Weather fetch error:', {
			message: error.message,
			code: error.code,
			response: error.response?.data,
			status: error.response?.status
		});
		
		// Return a more informative error message
		return JSON.stringify({
			location: city,
			error: true,
			message: `Weather data temporarily unavailable for ${city}`,
			details: error.message
		});
	}
}

async function fetchTrendingRepos() {
	try {
		const lastWeek = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10);
		const resp = await axios.get('https://api.github.com/search/repositories', {
			headers: { 'Accept': 'application/vnd.github+json' },
			params: { q: `created:>=${lastWeek}`, sort: 'stars', order: 'desc', per_page: 3 }
		});
		const items = resp.data?.items || [];
		if (!items.length) return 'No trending repos found';
		return items.map(r => `${r.full_name}⭐${r.stargazers_count}`).join(', ');
	} catch (_e) {
		return 'Trending repos unavailable';
	}
}

async function fetchTopHeadlines() {
	try {
		console.log('📰 Fetching top tech headlines from Hacker News...');
		
		// Use Hacker News API for global tech news
		const resp = await axios.get('https://hn.algolia.com/api/v1/search', { 
			params: { 
				tags: 'front_page', 
				hitsPerPage: 5 
			},
			timeout: 10000
		});
		
		const hits = resp.data?.hits || [];
		if (!hits.length) {
			return JSON.stringify({
				message: 'No headlines available'
			});
		}
		
		// Format headlines with title and description
		const headlines = hits.map(hit => ({
			title: hit.title || 'No title available',
			description: 'Tech news from Hacker News',
			source: 'Hacker News',
			url: hit.url || `https://news.ycombinator.com/item?id=${hit.objectID}`,
			publishedAt: hit.created_at
		}));
		
		console.log('✅ Successfully fetched tech headlines');
		
		return JSON.stringify({
			headlines: headlines,
			total: headlines.length
		});
		
	} catch (error) {
		console.error('❌ Headlines fetch error:', error);
		
		return JSON.stringify({
			error: true,
			message: 'Headlines temporarily unavailable',
			details: error.message
		});
	}
}

function hashtagForAction(action) {
	switch (action) {
		case 'weather':
			return '#weather';
		case 'github':
			return '#github';
		case 'news':
			return '#news';
		default:
			return '#ai';
	}
}

module.exports = { fetchWeather, fetchTrendingRepos, fetchTopHeadlines, hashtagForAction };


