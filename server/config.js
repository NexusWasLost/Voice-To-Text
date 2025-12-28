import dotenv from "dotenv";
dotenv.config();

const configuration = {
    PORT: process.env.PORT,
    DEEPGRAM_API_KEY: process.env.DEEPGRAM_API_KEY
}

export default configuration;
