import dotenv from "dotenv";
dotenv.config();

const configuration = {
    PORT: process.env.PORT,
    DEEPGRAM_API_KEY: process.env.DEEPGRAM_API_KEY,
    DEEPGRAM_WEBSOCKET_URL: process.env.DEEPGRAM_WEBSOCKET_URL
}

export default configuration;
