import { createRecorder, startRecording, stopRecording, setupMic } from "./mic.js";
import { sendDataToServerWS } from "./sock.js";

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
        //setup mic
        const mediaStream = await setupMic();
        //create recorder
        recorder = createRecorder(mediaStream);
        //start recording
        startRecording(recorder);
        //whenever data is there send to the server
        recorder.addEventListener("dataavailable", function(event){
            sendDataToServerWS(event.data);
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
