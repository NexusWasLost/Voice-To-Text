import configuration from "./config.js";

import { WebSocketServer } from "ws";
import WebSocket from "ws";
import { getTranscript } from "./utils/getTranscript.js";

const wss = new WebSocketServer({ port: 8080 });

wss.on("connection", function (client) {
    console.log("Client Connected with Server");

    let deepgramConn = new WebSocket(configuration.DEEPGRAM_WEBSOCKET_URL,
        ["token", configuration.DEEPGRAM_API_KEY]
    );

    deepgramConn.on("open", function () {
        console.log("Connected to Deepgram itself");
    });

    deepgramConn.on("message", function (message) {
        const transcript = getTranscript(message);
        if (transcript !== "") {
            console.log("Transcript: ", transcript);
        }
    });

    deepgramConn.on("error", function (error) {
        console.log("Error from Deepgram: ", error);
    })

    client.on("message", function (buffer) {
        // console.log("Message Recieved Buffer: ", buffer[0]); //for debugging
        if (!buffer || buffer.length === 0) {
            client.send(JSON.stringify({
                message: "No Audio Recieved"
            }));

            return;
        }

        if (buffer[0] === 26) {
            // console.log("buffer is a metadata");

            //if there is an active connection - terminate it
            if (deepgramConn) {
                deepgramConn.terminate();
            }

            //create a new webscoket connection to deepgram
            deepgramConn = new WebSocket(configuration.DEEPGRAM_WEBSOCKET_URL,
                ["token", configuration.DEEPGRAM_API_KEY]
            );

            deepgramConn.on("open", function () {
                console.log("New Pipe Open. Sending Header now.");
                deepgramConn.send(buffer);
            });

            //reattach the event listener
            deepgramConn.on("message", function (message) {
                const transcript = getTranscript(message);
                if (transcript !== "") {
                    console.log("Transcript: ", transcript);
                }
            });

            return;
        }

        if (deepgramConn.readyState === WebSocket.OPEN) {
            // console.log("Sent Data too Deepgram...");
            deepgramConn.send(buffer);
        }
    });

    client.on("error", function (error) {
        console.log("SERVER ERROR: ", error.data);
        if (deepgramConn) {
            deepgramConn.terminate();
        }
    });

    client.on("close", function () {
        deepgramConn.terminate();
        console.log("Client disconnected");
    });
})
