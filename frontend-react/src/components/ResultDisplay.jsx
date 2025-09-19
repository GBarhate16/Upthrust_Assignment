import React from 'react'
import { motion } from 'framer-motion'
import { 
  Thermometer, 
  Droplets, 
  Wind, 
  Cloud, 
  AlertTriangle, 
  Calendar,
  Lightbulb,
  Shirt,
  Star,
  TrendingUp,
  ExternalLink
} from 'lucide-react'

function ResultDisplay({ result, isModal = false }) {
  if (!result) return null

  const formatContent = () => {
    switch (result.action || detectAction(result)) {
      case 'weather':
        return formatWeatherResult(result)
      case 'github':
        return formatGitHubResult(result)
      case 'news':
        return formatNewsResult(result)
      default:
        return formatGenericResult(result)
    }
  }

  return (
    <motion.div 
      className={`bg-bg-tertiary border border-white/10 rounded-2xl p-6 mt-5 ${
        isModal ? 'bg-transparent border-none p-0 m-0' : ''
      }`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      {formatContent()}
    </motion.div>
  )
}

function detectAction(result) {
  if (result.api_response?.includes('°C') || result.api_response?.includes('weather')) {
    return 'weather'
  }
  if (result.api_response?.includes('⭐') || result.api_response?.includes('github')) {
    return 'github'
  }
  if (result.api_response?.includes('|') || result.final_result?.includes('headlines')) {
    return 'news'
  }
  return 'generic'
}

function formatWeatherResult(result) {
  console.log('🌤️ Processing weather result:', result);
  console.log('📄 API Response:', result.api_response);
  
  let weatherData

  try {
    weatherData = JSON.parse(result.api_response)
    console.log('✅ Successfully parsed weather data:', weatherData);
    
    // Check if the parsed data contains an error
    if (weatherData.error) {
      console.error('❌ Weather API returned error:', weatherData);
      return (
        <div className="text-red-400 text-center p-5 font-medium bg-red-500/10 border border-red-500/20 rounded-xl">
          <p className="mb-2">{weatherData.message || 'Weather data unavailable'}</p>
          <p className="text-sm text-gray-400">Error: {weatherData.details}</p>
          <button 
            onClick={() => window.location.reload()} 
            className="mt-3 px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg text-sm transition-colors"
          >
            Try Again
          </button>
        </div>
      )
    }
    
  } catch (e) {
    console.warn('⚠️ JSON parsing failed, trying fallback parsing:', e.message);
    console.log('🔍 Raw API response:', result.api_response);
    
    // Check if the response indicates unavailable data
    if (result.api_response && result.api_response.includes('unavailable')) {
      console.error('❌ Weather API returned unavailable message');
      return (
        <div className="text-red-400 text-center p-5 font-medium bg-red-500/10 border border-red-500/20 rounded-xl">
          <p className="mb-2">Weather data unavailable</p>
          <p className="text-sm text-gray-400">Raw response: {result.api_response}</p>
          <button 
            onClick={() => window.location.reload()} 
            className="mt-3 px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg text-sm transition-colors"
          >
            Try Again
          </button>
        </div>
      )
    }
    
    const weatherMatch = result.api_response.match(/(.+), ([\d.]+)°C/)
    if (!weatherMatch) {
      console.error('❌ Could not parse weather response:', result.api_response);
      return (
        <div className="text-red-400 text-center p-5 font-medium bg-red-500/10 border border-red-500/20 rounded-xl">
          <p className="mb-2">Weather data unavailable</p>
          <p className="text-sm text-gray-400">Unable to parse: {result.api_response}</p>
          <button 
            onClick={() => window.location.reload()} 
            className="mt-3 px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg text-sm transition-colors"
          >
            Try Again
          </button>
        </div>
      )
    }
    const [, location, temp] = weatherMatch
    weatherData = {
      location,
      temperature: parseFloat(temp),
      humidity: null,
      wind_speed: null,
      cloud_cover: null
    }
    console.log('🔄 Using fallback weather data:', weatherData);
  }

  if (!weatherData || !weatherData.location) {
    console.error('❌ Weather data invalid or missing location:', weatherData);
    return (
      <div className="text-red-400 text-center p-5 font-medium bg-red-500/10 border border-red-500/20 rounded-xl">
        <p className="mb-2">Weather data unavailable</p>
        <p className="text-sm text-gray-400">Invalid weather data structure</p>
        <button 
          onClick={() => window.location.reload()} 
          className="mt-3 px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg text-sm transition-colors"
        >
          Try Again
        </button>
      </div>
    )
  }

  const suggestions = generateWeatherSuggestions(weatherData)

  return (
    <div className="space-y-6">
      <motion.div 
        className="flex items-center gap-3 pb-4 border-b border-white/10"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
      >
        <Thermometer className="w-6 h-6 text-accent-primary" />
        <h3 className="text-xl font-semibold text-text-primary m-0">Weather in {weatherData.location}</h3>
      </motion.div>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        <motion.div 
          className="bg-gradient-primary p-4 rounded-xl flex items-center gap-3 text-white"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3 }}
        >
          <Thermometer className="w-5 h-5 flex-shrink-0" />
          <div className="flex flex-col gap-0.5 min-w-0">
            <span className="text-xs text-white/80 font-medium">Temperature</span>
            <span className="text-sm font-semibold">{weatherData.temperature}°C</span>
          </div>
        </motion.div>

        {weatherData.feels_like && (
          <motion.div 
            className="bg-accent-primary/5 border border-accent-primary/20 p-4 rounded-xl flex items-center gap-3 hover:bg-accent-primary/10 transition-colors"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.4 }}
          >
            <Thermometer className="w-5 h-5 text-accent-primary flex-shrink-0" />
            <div className="flex flex-col gap-0.5 min-w-0">
              <span className="text-xs text-text-muted font-medium">Feels Like</span>
              <span className="text-sm font-semibold text-text-primary">{weatherData.feels_like}°C</span>
            </div>
          </motion.div>
        )}

        <motion.div 
          className="bg-accent-primary/5 border border-accent-primary/20 p-4 rounded-xl flex items-center gap-3 hover:bg-accent-primary/10 transition-colors"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.4 }}
        >
          <div className="text-lg flex-shrink-0">{suggestions.condition.split(' ')[0]}</div>
          <div className="flex flex-col gap-0.5 min-w-0">
            <span className="text-xs text-text-muted font-medium">Condition</span>
            <span className="text-sm font-semibold text-text-primary">{suggestions.condition.split(' ').slice(1).join(' ')}</span>
          </div>
        </motion.div>

        {weatherData.humidity && (
          <motion.div 
            className="bg-accent-primary/5 border border-accent-primary/20 p-4 rounded-xl flex items-center gap-3 hover:bg-accent-primary/10 transition-colors"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.5 }}
          >
            <Droplets className="w-5 h-5 text-accent-primary flex-shrink-0" />
            <div className="flex flex-col gap-0.5 min-w-0">
              <span className="text-xs text-text-muted font-medium">Humidity</span>
              <span className="text-sm font-semibold text-text-primary">{weatherData.humidity}%</span>
            </div>
          </motion.div>
        )}

        {weatherData.wind_speed && (
          <motion.div 
            className="bg-accent-primary/5 border border-accent-primary/20 p-4 rounded-xl flex items-center gap-3 hover:bg-accent-primary/10 transition-colors"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.6 }}
          >
            <Wind className="w-5 h-5 text-accent-primary flex-shrink-0" />
            <div className="flex flex-col gap-0.5 min-w-0">
              <span className="text-xs text-text-muted font-medium">Wind Speed</span>
              <span className="text-sm font-semibold text-text-primary">{Math.round(weatherData.wind_speed)} km/h</span>
            </div>
          </motion.div>
        )}

        {weatherData.cloud_cover !== undefined && (
          <motion.div 
            className="bg-accent-primary/5 border border-accent-primary/20 p-4 rounded-xl flex items-center gap-3 hover:bg-accent-primary/10 transition-colors"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.7 }}
          >
            <Cloud className="w-5 h-5 text-accent-primary flex-shrink-0" />
            <div className="flex flex-col gap-0.5 min-w-0">
              <span className="text-xs text-text-muted font-medium">Cloud Cover</span>
              <span className="text-sm font-semibold text-text-primary">{weatherData.cloud_cover}%</span>
            </div>
          </motion.div>
        )}
      </div>

      <motion.div 
        className="bg-accent-success/5 border border-accent-success/20 rounded-xl p-5 space-y-4"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8 }}
      >
        <div className="flex items-start gap-3">
          <Lightbulb className="w-5 h-5 text-accent-success flex-shrink-0 mt-0.5" />
          <div className="leading-relaxed text-text-secondary">
            <strong className="text-text-primary">Today's Suggestion:</strong> {suggestions.suggestion}
          </div>
        </div>

        <div className="flex items-start gap-3">
          <Shirt className="w-5 h-5 text-accent-success flex-shrink-0 mt-0.5" />
          <div className="leading-relaxed text-text-secondary">
            <strong className="text-text-primary">What to Wear:</strong> {suggestions.outfit}
          </div>
        </div>

        {suggestions.alerts && (
          <div className="bg-accent-error/10 border border-accent-error/20 rounded-lg p-3 flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-accent-error flex-shrink-0 mt-0.5" />
            <div className="leading-relaxed text-text-secondary">
              <strong className="text-text-primary">Weather Alert:</strong> {suggestions.alerts}
            </div>
          </div>
        )}

        <div className="flex items-start gap-3">
          <Calendar className="w-5 h-5 text-accent-success flex-shrink-0 mt-0.5" />
          <div className="leading-relaxed text-text-secondary">
            <strong className="text-text-primary">Upcoming:</strong> {suggestions.forecast}
          </div>
        </div>
      </motion.div>
    </div>
  )
}

function formatGitHubResult(result) {
  const repos = result.api_response.split(', ').map(repo => {
    const [name, stars] = repo.split('⭐')
    return { name: name?.trim(), stars: stars?.trim() }
  }).filter(repo => repo.name && repo.stars)

  return (
    <div className="space-y-6">
      <motion.div 
        className="flex items-center gap-3 pb-4 border-b border-white/10"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
      >
        <TrendingUp className="w-6 h-6 text-accent-primary" />
        <h3 className="text-xl font-semibold text-text-primary m-0">🔥 Trending GitHub Repositories</h3>
      </motion.div>

      <p className="text-text-secondary leading-relaxed mb-5">
        Check out these hot repositories that are trending right now:
      </p>

      <div className="space-y-3">
        {repos.map((repo, index) => (
          <motion.div 
            key={index}
            className="bg-accent-primary/5 border border-accent-primary/20 rounded-xl p-4 flex items-center justify-between hover:bg-accent-primary/10 hover:border-accent-primary/40 hover:-translate-y-0.5 transition-all duration-200"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 + index * 0.1 }}
          >
            <div className="flex items-center gap-2 flex-1 min-w-0">
              <ExternalLink className="w-4 h-4 text-accent-primary flex-shrink-0" />
              <span className="font-medium text-text-primary truncate">{repo.name}</span>
            </div>
            <div className="flex items-center gap-1 text-text-secondary text-sm">
              <Star className="w-3.5 h-3.5 text-yellow-400" />
              <span>{repo.stars} stars</span>
            </div>
          </motion.div>
        ))}
      </div>

      <motion.div 
        className="bg-accent-success/5 border border-accent-success/20 rounded-xl p-5"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8 }}
      >
        <div className="flex items-start gap-3">
          <Lightbulb className="w-5 h-5 text-accent-success flex-shrink-0 mt-0.5" />
          <div className="leading-relaxed text-text-secondary">
            <strong className="text-text-primary">Tip:</strong> These repos are gaining momentum - perfect time to contribute or learn from them!
          </div>
        </div>
      </motion.div>
    </div>
  )
}

function formatNewsResult(result) {
  console.log('📰 Processing news result:', result);
  console.log('📄 API Response:', result.api_response);
  
  let newsData
  
  try {
    newsData = JSON.parse(result.api_response)
    console.log('✅ Successfully parsed news data:', newsData);
    
    // Check if the parsed data contains an error
    if (newsData.error) {
      console.error('❌ News API returned error:', newsData);
      return (
        <div className="text-red-400 text-center p-5 font-medium bg-red-500/10 border border-red-500/20 rounded-xl">
          <p className="mb-2">{newsData.message || 'News headlines unavailable'}</p>
          <p className="text-sm text-gray-400">Error: {newsData.details}</p>
        </div>
      )
    }
    
    // Check if the data indicates no headlines available (but not an error)
    if (newsData.message && !newsData.headlines) {
      console.log('⚠️ No headlines available');
      return (
        <div className="text-yellow-400 text-center p-5 font-medium bg-yellow-500/10 border border-yellow-500/20 rounded-xl">
          <p className="mb-2">No headlines available</p>
          <p className="text-sm text-gray-400">Please try again later.</p>
        </div>
      )
    }
    
  } catch (e) {
    console.warn('⚠️ JSON parsing failed, trying fallback parsing:', e.message);
    console.log('🔍 Raw API response:', result.api_response);
    
    // Fallback to old format (pipe-separated headlines)
    const headlines = result.api_response.split(' | ').filter(h => h.trim())
    if (headlines.length === 0) {
      return (
        <div className="text-red-400 text-center p-5 font-medium bg-red-500/10 border border-red-500/20 rounded-xl">
          <p className="mb-2">News headlines unavailable</p>
          <p className="text-sm text-gray-400">Unable to parse news data</p>
        </div>
      )
    }
    
    // Use fallback format
    newsData = {
      headlines: headlines.map(title => ({ title, description: 'No description available' })),
      total: headlines.length
    }
    console.log('🔄 Using fallback news data:', newsData);
  }
  
  if (!newsData || !newsData.headlines || newsData.headlines.length === 0) {
    console.log('⚠️ News data has no headlines:', newsData);
    return (
      <div className="text-yellow-400 text-center p-5 font-medium bg-yellow-500/10 border border-yellow-500/20 rounded-xl">
        <p className="mb-2">No headlines available</p>
        <p className="text-sm text-gray-400">No news articles found for this region</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <motion.div 
        className="flex items-center gap-3 pb-4 border-b border-white/10"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
      >
        <div className="text-2xl">📰</div>
        <h3 className="text-xl font-semibold text-text-primary m-0">Top Tech Headlines</h3>
      </motion.div>

      <p className="text-text-secondary leading-relaxed mb-5">
        Here are the trending tech stories from Hacker News:
      </p>

      <div className="space-y-4">
        {newsData.headlines.map((article, index) => (
          <motion.div 
            key={index}
            className="bg-accent-primary/5 border border-accent-primary/20 rounded-xl p-5 hover:bg-accent-primary/10 hover:border-accent-primary/40 transition-all duration-200"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 + index * 0.1 }}
          >
            <div className="flex items-start gap-3">
              <div className="bg-accent-primary text-white rounded-full w-6 h-6 flex items-center justify-center text-xs font-semibold flex-shrink-0">
                {index + 1}
              </div>
              <div className="flex-1 space-y-2">
                <h4 className="font-semibold text-text-primary leading-snug">{article.title}</h4>
                {article.description && article.description !== 'No description available' && (
                  <p className="text-sm text-text-secondary leading-relaxed">{article.description}</p>
                )}
                {article.source && (
                  <div className="flex items-center gap-2 text-xs text-text-muted">
                    <span className="bg-accent-primary/20 px-2 py-1 rounded-full">{article.source}</span>
                    {article.publishedAt && (
                      <span>{new Date(article.publishedAt).toLocaleDateString()}</span>
                    )}
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      <motion.div 
        className="bg-accent-success/5 border border-accent-success/20 rounded-xl p-5"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8 }}
      >
        <div className="flex items-start gap-3">
          <Lightbulb className="w-5 h-5 text-accent-success flex-shrink-0 mt-0.5" />
          <div className="leading-relaxed text-text-secondary">
            <strong className="text-text-primary">Stay informed:</strong> These stories are trending in the tech community! Total articles found: {newsData.total}
          </div>
        </div>
      </motion.div>
    </div>
  )
}

function formatGenericResult(result) {
  return (
    <div className="bg-accent-primary/5 border border-accent-primary/20 rounded-xl p-5">
      <div className="leading-relaxed text-text-primary">
        {result.final_result || result.ai_response || 'No result available'}
      </div>
    </div>
  )
}

// Import the same intelligent weather suggestion logic from the original code
function generateWeatherSuggestions(weatherData) {
  const temp = weatherData.temperature
  const humidity = weatherData.humidity || 50
  const windSpeed = weatherData.wind_speed || 0
  const cloudCover = weatherData.cloud_cover || 50
  const precipitation = weatherData.rain || weatherData.precipitation || 0
  const feelsLike = weatherData.feels_like || temp
  const rainProb = weatherData.upcoming_rain_probability || []

  let condition = getWeatherCondition(temp, humidity, windSpeed, cloudCover, precipitation, weatherData.weather_code)
  
  let suggestion = ''
  let outfit = ''
  let alerts = ''
  
  if (temp >= 35) {
    suggestion = 'Extremely hot! Stay indoors during peak hours (11 AM - 4 PM).'
    outfit = '🥵 Light, loose cotton clothing, wide-brimmed hat, and sunscreen (SPF 30+)'
    alerts = 'Heat wave conditions. Stay hydrated and avoid prolonged sun exposure.'
  } else if (temp >= 30) {
    suggestion = 'Hot weather perfect for swimming or indoor activities.'
    outfit = '👕 Light cotton clothing, sunglasses, and sunscreen'
  } else if (temp >= 25) {
    suggestion = 'Great weather for outdoor activities and sports!'
    outfit = '👔 T-shirt and light pants, comfortable for most activities'
  } else if (temp >= 15) {
    suggestion = 'Pleasant weather for walking, cycling, or outdoor dining.'
    outfit = '👔 Light jacket or long sleeves recommended'
  } else if (temp >= 5) {
    suggestion = 'Cool weather, perfect for warm beverages and cozy activities.'
    outfit = '🧥 Jacket, long pants, and closed shoes'
  } else {
    suggestion = 'Cold weather! Perfect for warm indoor activities.'
    outfit = '🧥 Heavy coat, warm layers, scarf, and gloves'
  }
  
  if (windSpeed > 25) {
    suggestion += ' Very windy conditions - secure loose items!'
    outfit += '. Avoid umbrellas, wear fitted clothing'
    alerts += alerts ? ' | ' : ''
    alerts += 'Strong winds expected.'
  } else if (windSpeed > 15) {
    suggestion += ' Breezy conditions.'
    outfit += '. Light windbreaker recommended'
  }
  
  if (humidity > 80) {
    suggestion += ' High humidity will make it feel warmer.'
    outfit += '. Choose breathable fabrics'
  } else if (humidity < 30) {
    suggestion += ' Low humidity - keep skin moisturized.'
  }
  
  if (precipitation > 5) {
    suggestion = 'Rainy weather - great for indoor activities or cozy reading!'
    outfit += '. Don\'t forget waterproof jacket and umbrella ☂️'
  } else if (precipitation > 0) {
    suggestion += ' Light rain possible.'
    outfit += '. Carry a light umbrella just in case'
  }
  
  let forecast = 'Weather expected to remain similar throughout the day.'
  if (rainProb.length > 0) {
    const avgRainProb = rainProb.reduce((a, b) => a + b, 0) / rainProb.length
    if (avgRainProb > 70) {
      forecast = 'High chance of rain in the next few hours. Plan indoor activities.'
    } else if (avgRainProb > 40) {
      forecast = 'Possible rain later today. Keep an umbrella handy.'
    } else {
      forecast = 'Clear skies expected for the rest of the day.'
    }
  }
  
  return { condition, suggestion, outfit, alerts, forecast }
}

function getWeatherCondition(temp, humidity, windSpeed, cloudCover, precipitation, weatherCode) {
  if (weatherCode !== undefined) {
    const weatherConditions = {
      0: '☀️ Clear Sky',
      1: '🌤️ Mainly Clear',
      2: '⛅ Partly Cloudy',
      3: '☁️ Overcast',
      45: '🌫️ Foggy',
      48: '🌫️ Depositing Rime Fog',
      51: '🌦️ Light Drizzle',
      53: '🌦️ Moderate Drizzle',
      55: '🌦️ Dense Drizzle',
      61: '🌧️ Light Rain',
      63: '🌧️ Moderate Rain',
      65: '🌧️ Heavy Rain',
      71: '🌨️ Light Snow',
      73: '🌨️ Moderate Snow',
      75: '🌨️ Heavy Snow',
      95: '⛈️ Thunderstorm',
      96: '⛈️ Thunderstorm with Hail',
      99: '⛈️ Heavy Thunderstorm'
    }
    return weatherConditions[weatherCode] || '🌤️ Variable'
  }
  
  if (precipitation > 5) return '🌧️ Rainy'
  if (precipitation > 0) return '🌦️ Light Rain'
  if (cloudCover > 80) return '☁️ Overcast'
  if (cloudCover > 50) return '⛅ Partly Cloudy'
  if (temp >= 30) return '☀️ Hot & Sunny'
  if (temp >= 20) return '🌤️ Pleasant'
  if (temp >= 10) return '🌥️ Cool'
  return '❄️ Cold'
}

export default ResultDisplay