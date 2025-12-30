//handle websocket connection with the server

import { displayTranscriptions } from "./main.js";

//create a socket connection with the server
const socket = new WebSocket("ws://127.0.0.1:3000/");
socket.binaryType = "arraybuffer";

socket.onopen = async function () {
    console.log("Connected to the backend Server");
    // if (socket.readyState === WebSocket.OPEN) {
    //     socket.send(audBuf);
    // }
}

//message recieved from the server
socket.onmessage = function (event, transcriptChunks) {
    if (event.data.length > 0) {
        const transcriptData = JSON.parse(event.data);
        console.log(transcriptData);
        // transcriptChunks.push(transcriptData.transcript);
        // displayTranscriptions(); //handle transcript display
        // return transcriptChunks;
    }
    console.log("No data sent from the server");
}

socket.onclose = function () {
    console.log("Disconnected from the backend Server");
}

socket.onerror = function () {
    console.log("Some error occured with the connection to the Server");
}

export function sendAudioToServerWS(audBuf) {
    if (!(socket.readyState === WebSocket.OPEN)) {
        console.warn("Socket not ready yet ! Current state: ", socket.readyState);
        return;
    }
    //send data to server
    socket.send(audBuf);
}
