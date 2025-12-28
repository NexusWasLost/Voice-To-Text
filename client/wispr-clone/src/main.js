import { playAudio, startRecorder, stopRecorder, emptyAudioChunks } from "./mic.js";

const talkBtn = document.querySelector(".talk-btn");
let istalking = false;

talkBtn.addEventListener("click", function () {
    changeButtonState();
    changeRecordingState();
})

function changeRecordingState(){
    if(istalking){
        startRecorder();
        return;
    }

    //stop the recording
    stopRecorder();
    //play the recording
    playAudio();
    //empty the audio chunks once recording is finished
    emptyAudioChunks();
}//bus are there

function changeButtonState() {
    if (istalking) {
        istalking = false;
        talkBtn.innerHTML = 'Push to Talk<i class="fa-solid fa-microphone-slash" style="margin-left: 5px;"></i>';
        return;
    }

    istalking = true;
    talkBtn.innerHTML = 'Listening<i class="fa-solid fa-microphone" style="margin-left: 5px;"></i>';
}

