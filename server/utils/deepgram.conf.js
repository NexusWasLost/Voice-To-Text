//handle deepgram event listeners

import configuration from "../config.js";
import { getTranscript } from "./utils/getTranscript.js";

let deepgramConn = new WebSocket(configuration.DEEPGRAM_WEBSOCKET_URL,
    ["token", configuration.DEEPGRAM_API_KEY]
);

deepgramConn.on("open", function () {
    console.log("Connected to Deepgram itself");
});

deepgramConn.on("message", function (message) {
    console.log(message);
    const transcript = getTranscript(message);
    console.log(transcript);
});

deepgramConn.on("error", function (error) {
    console.log("Error from Deepgram: ", error);
});
