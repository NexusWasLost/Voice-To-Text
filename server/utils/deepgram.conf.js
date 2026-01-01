//handle deepgram event listeners

import configuration from "../config.js";
import WebSocket from "ws";
import { getTranscript } from "./getTranscript.js";

export function getConnection() {
    let deepgramConn = new WebSocket(configuration.DEEPGRAM_WEBSOCKET_URL,
        ["token", configuration.DEEPGRAM_API_KEY]
    );

    return deepgramConn;
}

export function attachDGListeners(deepgramConn, onTranscript) {
    deepgramConn.on("open", function () {
        console.log("Server Connected to Deepgram");
    });

    deepgramConn.on("message", function (message) {
        const transcript = getTranscript(message);
        if (transcript !== "") {
            onTranscript(transcript);
            console.log(transcript);
        }
    });

    deepgramConn.on("close", function () {
        console.log("Server Disconnected from Deepgram")
    })

    deepgramConn.on("error", function (error) {
        console.log("Error from Deepgram: ", error);
    });
}

export function fetchTranscript(){

}
