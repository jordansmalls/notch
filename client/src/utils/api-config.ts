// 1. Check the environment variable (set in production via Netlify as VITE_API_BASE_URL)
const VITE_API_URL = import.meta.env.VITE_API_BASE_URL;

// 2. Normalize production URL to always include the '/api' prefix
function normalizeApiBase(url: string) {
	if (!url) return url;
	// strip trailing slash
	const trimmed = url.replace(/\/$/, "");
	return trimmed.endsWith("/api") ? trimmed : `${trimmed}/api`;
}

// If VITE_API_URL exists (production), use it (normalized). Otherwise (development), use the Vite proxy path '/api'.
export const API_BASE_URL = VITE_API_URL ? normalizeApiBase(VITE_API_URL) : '/api';