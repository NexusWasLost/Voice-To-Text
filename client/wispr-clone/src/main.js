import { createAudioBuffer, startRecorder, stopRecorder, setupMic } from "./mic.js";
import { sendAudioToServerWS } from "./sock.js";

let transcriptChunks = [], transcriptCount = 0;
let recorder;

let transcriptionArea = document.querySelector(".transcription-area");

const talkBtn = document.querySelector(".talk-btn");
let istalking = false;

talkBtn.addEventListener("click", function () {
    changeButtonState();
    changeRecordingState();
})

//changing recording state on listening
async function changeRecordingState() {
    if (istalking) {
        await record();
        return;
    }

    //stop the recording
    stopRecorder();
}

async function record() {
    //setup microphone
    const mediaStream = await setupMic();
    if (!mediaStream) return;

    //get the recorder
    recorder = startRecorder(mediaStream);

    recorder.ondataavailable = async function (event) {
        if (event.data.size > 0) {
            console.log("New data recorded");
            //event.data is the audio blob
            let audBuf = await createAudioBuffer(event.data);
            sendAudioToServerWS(audBuf); //send the data to the server as soon as its available
        }
    }
}

function changeButtonState() {
    if (istalking) {
        istalking = false;
        talkBtn.innerHTML = 'Push to Talk<i class="fa-solid fa-microphone-slash" style="margin-left: 5px;"></i>';
        return;
    }

    istalking = true;
    talkBtn.innerHTML = 'Listening<i class="fa-solid fa-microphone" style="margin-left: 5px;"></i>';
}

function check_T_AreaContent() {
    //remove the transcription placeholder
    if (transcriptionArea.classList.contains("no-content")) {
        transcriptionArea.textContent = "";
        transcriptionArea.classList.remove("no-content");
    }
}

export function displayTranscriptions() {
    if (transcriptChunks.length === 0) return;

    //remove the transcription area placeholder before displaying the transcriptions
    check_T_AreaContent();

    for (transcriptCount; transcriptCount < transcriptChunks.length; transcriptCount++) {
        let p = document.createElement("p");
        p.textContent = "Speaker: " + transcriptChunks[transcriptCount];
        transcriptionArea.appendChild(p);
    }
}

// function sendAudioToServerWS(audBuf) {
//     const socket = new WebSocket("ws://127.0.0.1:3000/");
//     socket.binaryType = "arraybuffer";

//     socket.onopen = async function () {
//         console.log("Connected to the backend Server");
//         if (socket.readyState === WebSocket.OPEN) {
//             socket.send(audBuf);
//         }
//     }

//     //message recieved from the server
//     socket.onmessage = function (event) {
//         if (event.data.length > 0) {
//             const transcriptData = JSON.parse(event.data);
//             transcriptChunks.push(transcriptData.transcript);
//             displayTranscriptions();
//             return;
//         }
//         console.log("No data sent from the server");
//     }

//     socket.onclose = function () {
//         console.log("Disconnected from the backend Server");
//     }

//     socket.onerror = function () {
//         console.log("Some error occured with the connection to the Server");
//     }
// }

//send the Audio to the server
// document.querySelector(".send-btn").addEventListener("click", function () {
//     sendAudioToServer();
// })

// async function sendAudioToServer() {
//     const audioBlob = createAudioBlob(audioChunks);
//     let response = await fetch("http://127.0.0.1:3000/api/audio", {
//         method: "post",
//         headers: {
//             "Content-Type": "audio/webm"
//         },
//         body: audioBlob
//     });

//     try {
//         let jsonResponse = await response.json();
//         console.log(jsonResponse.message);

//         if (jsonResponse.transcript.length > 0) {
//             transcriptChunks.push(jsonResponse.transcript);
//         }
//         displayTranscriptions();
//     }
//     catch (error) {
//         console.log(error);
//     }
// }
