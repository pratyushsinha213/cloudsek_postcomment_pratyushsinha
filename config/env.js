import { config } from 'dotenv';

config({ path: `.env` });

export const {
    PORT, MONGODB_URI, JWT_SECRET
} = process.env;