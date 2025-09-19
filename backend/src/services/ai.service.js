let geminiClient = null;
try {
	const { GoogleGenerativeAI } = require('@google/generative-ai');
	if (process.env.GEMINI_API_KEY) {
		geminiClient = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
	}
} catch (_err) {}

async function generateAiResponse(prompt, action, apiResponse) {
	const fallback = () => `✨ ${prompt.slice(0, 60)}...`;
	if (!geminiClient) return fallback();
	try {
		// Create a contextual prompt based on the action and API response
		let contextualPrompt = prompt;
		
		if (action && apiResponse) {
			switch (action) {
				case 'weather':
					contextualPrompt = `Write a short, engaging tweet about today's weather. The current weather is: ${apiResponse}. Make it feel personal and tweet-like, don't mention checking weather apps or websites. Keep it under 100 characters and make it sound natural.`;
					break;
				case 'github':
					contextualPrompt = `${prompt}. Here are trending GitHub repos: ${apiResponse}. Create a short, engaging tweet about these trending projects.`;
					break;
				case 'news':
					contextualPrompt = `${prompt}. Here are top headlines: ${apiResponse}. Create a short, engaging tweet about these news stories.`;
					break;
				default:
					contextualPrompt = `${prompt}. Based on this data: ${apiResponse}, create a short, engaging response.`;
			}
		}

		const model = geminiClient.getGenerativeModel({ model: 'gemini-1.5-flash' });
		const result = await model.generateContent({ contents: [{ role: 'user', parts: [{ text: contextualPrompt }] }] });
		const text = result?.response?.text?.() || result?.response?.candidates?.[0]?.content?.parts?.[0]?.text;
		if (!text) return fallback();
		return text.trim().slice(0, 200);
	} catch (_e) {
		return fallback();
	}
}

module.exports = { generateAiResponse };


