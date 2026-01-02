import { createRecorder, startRecording, stopRecording, setupMic } from "./mic.js";
import { createSocket, attachSocketListeners, sendDataToServerWS } from "./sock.js";

let transcriptChunks = [], transcriptCount = 0;
let recorder;

let transcriptionArea = document.querySelector(".transcription-area");
const talkBtn = document.querySelector(".talk-btn");

const copyBtn = document.querySelector("#copy-btn");

let istalking = false;

const socket = createSocket();
attachSocketListeners(socket, function (data){
    transcriptChunks.push(data);
    displayTranscriptions();
});

talkBtn.addEventListener("click", function () {
    changeButtonState();
    changeRecordingState();
})

//changing recording state on listening
async function changeRecordingState() {
    if (istalking) {
        //setup mic
        const mediaStream = await setupMic();
        //create recorder
        recorder = createRecorder(mediaStream);
        //start recording
        startRecording(recorder);
        //whenever data is there send to the server
        recorder.addEventListener("dataavailable", function(event){
            sendDataToServerWS(socket, event.data);
        });

        return;
    }

    stopRecording(recorder);

}

function changeButtonState() {
    if (istalking) {
        istalking = false;
        talkBtn.innerHTML = 'Push to Talk <i class="fa-solid fa-microphone-slash" style="margin-left: 5px;"></i>';
        return;
    }

    istalking = true;
    talkBtn.innerHTML = 'Listening <i class="fa-solid fa-microphone" style="margin-left: 5px;"></i>';
}

copyBtn.addEventListener("click", async function(){
    let textToCopy = transcriptChunks.join(" ");

    if(!textToCopy) return;

    try {
        await navigator.clipboard.writeText(textToCopy);

        copyBtn.innerHTML = '<i class="fa-solid fa-check"></i> Copied';
        setTimeout(function() {
            copyBtn.innerHTML = '<i class="fa-solid fa-copy"></i> Copy';
        }, 2000);
    }
    catch (error) {
        console.error("Failed to copy: ", error);
    }
})

function displayTranscriptions() {
    if (transcriptChunks.length === 0) return;
    let lastElement;

    for (transcriptCount; transcriptCount < transcriptChunks.length; transcriptCount++) {
        let p = document.createElement("p");
        p.textContent = transcriptChunks[transcriptCount];
        transcriptionArea.appendChild(p);
        lastElement = p; // Keep track of the newest one
    }

    //enable smooth scrolling
    if (lastElement) {
        lastElement.scrollIntoView({
            behavior: "smooth",
            block: "end"
        });
    }
}

