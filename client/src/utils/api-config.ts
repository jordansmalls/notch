// 1. Check the environment variable (which is set ONLY in production via .env.production)
const VITE_API_URL = import.meta.env.VITE_API_BASE_URL;

// 2. Set the final constant based on the environment
// If VITE_API_URL exists (production), use it. Otherwise (development), use the Vite proxy path '/api'.
export const API_BASE_URL = VITE_API_URL || '/api';