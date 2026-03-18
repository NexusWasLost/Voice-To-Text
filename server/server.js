import configuration from "./config.js";
import { WebSocketServer } from "ws";
import WebSocket from "ws";
import { getConnection, attachDGListeners } from "./utils/deepgram.conf.js";

const wss = new WebSocketServer({ port: configuration.PORT });

wss.on("connection", function (client) {
    console.log("Client Connected with Server");

    let deepgramConn = null;

    client.on("message", function (buffer) {
        // console.log("Message Recieved Buffer: ", buffer[0]); //for debugging
        if (!buffer || buffer.length === 0) {
            client.send(JSON.stringify({
                message: "No Audio Recieved"
            }));

            return;
        }

        if (typeof buffer === "string") {
            const msg = JSON.parse(buffer);
            if (msg.type !== "STOP") return;


            if (deepgramConn && deepgramConn.readyState === WebSocket.OPEN) {
                deepgramConn.send(JSON.stringify({ type: "CloseStream" }));
                deepgramConn = null;
            }
            return;
        }

        //check if the first byte in the buffer is 26 (0x1A) which is apparently denotes the start of Webm header
        if (buffer[0] === 26) {
            // console.log("buffer is a metadata");

            //if there is an active connection - gracefully close it
            if (deepgramConn) {

                let closingConnection = deepgramConn;
                //check if the old connection is still open then send a graceful closing request
                if (closingConnection.readyState === WebSocket.OPEN) {
                    closingConnection.send(JSON.stringify({ type: "CloseStream" }));
                }

                deepgramConn = null;
            }

            //create a new webscoket connection to deepgram
            deepgramConn = getConnection();
            attachDGListeners(deepgramConn, function (transcript) {
                client.send(JSON.stringify({
                    type: "TRANSCRIPT",
                    transcript: transcript
                }));
            });

            //send listener
            deepgramConn.on("open", function () {
                console.log("Connection Open to Deepgram...");
                deepgramConn.send(buffer);
            });

            return;
        }

        if (deepgramConn.readyState === WebSocket.OPEN) {
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
        if (deepgramConn) {
            deepgramConn.terminate();
        }
        console.log("Client disconnected");
    });
});
