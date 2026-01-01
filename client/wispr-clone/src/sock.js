//handle sockets

const socket = new WebSocket("ws://127.0.0.1:8080/");

socket.onopen = function () {
    console.log("Connected to Backend Server");
}

socket.onclose = function () {
    console.log("Disconnected from Backend Server");
}

socket.onmessage = function (message) {
    const recieved = JSON.parse(message.data);
    console.log(recieved);
}

socket.onerror = function (error) {
    console.log("WebSocket ERROR: ", error);
}

export function sendDataToServerWS(data){
    socket.send(data);
}
