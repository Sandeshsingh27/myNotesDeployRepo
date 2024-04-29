// Define the base URL for your local development server
const localApiUrl = "http://127.0.0.1:8000/";

// Define the base URL for your Choreo service
const choreoApiUrl = "https://8fefd478-911c-4aa1-9a2c-728cfa7d54a2-dev.e1-us-east-azure.choreoapis.dev/mynotes/backend/rest-api-074/v1.0";

// Determine which URL to use based on the environment or condition
const apiUrl = process.env.NODE_ENV === "production" ? choreoApiUrl : localApiUrl;

export default apiUrl;