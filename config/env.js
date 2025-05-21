import { config } from 'dotenv';

// Load environment variables from .env file
config({ path: `.env` });

// Export required environment variables
export const {
    PORT,           // Server port number
    MONGODB_URI,    // MongoDB connection string
    JWT_SECRET      // Secret key for JWT token generation
} = process.env;