import { playAudio, startRecorder, stopRecorder } from "./mic.js";

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
    setTimeout(function() {
        playAudio();
    }, 100);

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

