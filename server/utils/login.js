// Contains code that logs in Deepgram using the API KEY (For server only)

import configuration from "../config.js";
import { createClient } from "@deepgram/sdk";

// Must use accessToken property in options object
const deepgramClient = createClient({ accessToken: configuration.DEEPGRAM_API_KEY });

export default deepgramClient;
