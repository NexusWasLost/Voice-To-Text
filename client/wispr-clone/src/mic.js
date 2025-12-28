let audioChunks = [];
let recorder;

async function setupMic() {
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

export async function startRecorder(){
    //empty audio chunks for new recording
    emptyAudioChunks();

    const mediaStream = await setupMic();
    if(!mediaStream) return;

    recorder = new MediaRecorder(mediaStream);
    //start the media recorder
    recorder.start(250);

    recorder.ondataavailable = function(event){
        if(event.data.size > 0){
            audioChunks.push(event.data);
            console.log("New data recorded");
        }
    }
}

export function stopRecorder(){
    recorder.stop();
    recorder.onstop = function(){
        console.log("Recording stopped...");
    }
}

export function playAudio(){
    const blob = new Blob(audioChunks, { type: 'audio/webm' });

    // 2. Create a "link" to this file in the computer's memory
    const url = URL.createObjectURL(blob);

    // 3. Play it!
    const audio = new Audio(url);
    audio.play();
}

function emptyAudioChunks(){
    //empty the audio chunks array
    audioChunks = [];
}
