import { createAudioBlob, startRecorder, stopRecorder, setupMic } from "./mic.js";

let audioChunks = [];
let transcriptChunks = [], transcriptCount = 0;

let transcriptionArea = document.querySelector(".transcription-area");

const talkBtn = document.querySelector(".talk-btn");
let istalking = false;

talkBtn.addEventListener("click", function () {
    changeButtonState();
    changeRecordingState();
})

async function changeRecordingState() {
    if (istalking) {
        //setup microphone
        const mediaStream = await setupMic();
        if (!mediaStream) return;

        //empty audio chunks for new recording
        audioChunks = [];
        startRecorder(audioChunks, mediaStream);
        return;
    }

    //stop the recording
    stopRecorder();
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

function displayTranscriptions() {
    if (transcriptChunks.length === 0) return;

    //remove the transcription area placeholder before displaying the transcriptions
    check_T_AreaContent();

    for (transcriptCount; transcriptCount < transcriptChunks.length; transcriptCount++) {
        let p = document.createElement("p");
        p.textContent = "Speaker: " + transcriptChunks[transcriptCount];
        transcriptionArea.appendChild(p);
    }
}

function check_T_AreaContent(){
    //remove the transcription placeholder
    if(transcriptionArea.classList.contains("no-content")){
        transcriptionArea.textContent = "";
        transcriptionArea.classList.remove("no-content");
    }
}

//send the Audio to the server
document.querySelector(".send-btn").addEventListener("click", function () {
    sendAudioToServer();
})

async function sendAudioToServer() {
    const audioBlob = createAudioBlob(audioChunks);
    let response = await fetch("http://127.0.0.1:3000/api/audio", {
        method: "post",
        headers: {
            "Content-Type": "audio/webm"
        },
        body: audioBlob
    });

    try {
        let jsonResponse = await response.json();
        console.log(jsonResponse.message);

        if (jsonResponse.transcript.length > 0) {
            transcriptChunks.push(jsonResponse.transcript);
        }
        displayTranscriptions();
    }
    catch (error) {
        console.log(error);
    }
}
