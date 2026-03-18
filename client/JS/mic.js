import { sendDataToServerWS } from "./sock.js";

let recorder;

export async function setupMic() {
    //check if media devices are available or not
    if (!(navigator.mediaDevices && navigator.mediaDevices.getUserMedia)) {
        console.log("Error Setting Up Mic");
        return;
    }

    try {
        //get permission from the user to use media device (audio)
        const mediaStream = await navigator.mediaDevices.getUserMedia({ audio: true });
        if (!mediaStream) {
            console.log("Mic Permission denied by User !");
            alert("Please allow Mic Permission to talk...");
            return;
        }

        return mediaStream;
    }
    catch (error) {
        console.log("Error Getting Mic Permission: ", error);
    }
}

export function createRecorder(mediaStream, socket) {
    recorder = new MediaRecorder(mediaStream, { mimeType: "audio/webm" });

    //attach event listener to send data audio data to the server
    recorder.ondataavailable = function(event) {
        if (event.data.size > 0 && socket.readyState === WebSocket.OPEN) {
            sendDataToServerWS(socket, event.data);
        }
    };

    return recorder;
}

export function startRecording(recorder) {
    recorder.start(250);
}

export function stopRecording(recorder, socket) {
    recorder.requestData();
    recorder.onstop = function () {
        console.log("Recording stopped...");
        socket.send(JSON.stringify({ type: "STOP" }));
    }

    if(recorder && recorder.state !== "inactive"){
        recorder.stop();
    }
}

export async function createAudioBuffer(audioBlob) {
    const audioBuf = await audioBlob.arrayBuffer();
    return audioBuf;
}
