// export const ARTICALS_API="https://notium-server.up.railway.app"
// export const ARTICALS_API= "http://localhost:5000"



// Base URLs
const PROD_BASE_URL = "https://backend-api-notium.vercel.app";
const DEV_BASE_URL = "http://localhost:5000";

// Select base URL according to environment
const BASE_URL = process.env.NODE_ENV === "production" ? PROD_BASE_URL : DEV_BASE_URL;

// Endpoints
export const ARTICALS_API = `${BASE_URL}`;
