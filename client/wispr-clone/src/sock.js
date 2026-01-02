//handle sockets

export function createSocket() {
    const socket = new WebSocket("ws://127.0.0.1:8080/");
    return socket;
}

export function attachSocketListeners(socket, onData) {
    socket.onopen = function () {
        console.log("Connected to Backend Server");
    }

    socket.onclose = function () {
        console.log("Disconnected from Backend Server");
    }

    socket.onmessage = function (message) {
        const recieved = JSON.parse(message.data);
        onData(recieved.transcript);
    }

    socket.onerror = function (error) {
        console.log("WebSocket ERROR: ", error);
    }
}

export function sendDataToServerWS(socket, data) {
    socket.send(data);
}
