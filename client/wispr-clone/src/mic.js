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

export async function startRecorder(audioChunks, mediaStream){
    recorder = new MediaRecorder(mediaStream);
    //start the media recorder (with 250ms slices)
    recorder.start(250);

    //push every non empty audio blob object into the audioChunks array
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

export function createAudioBlob(audioChunks){
    const blob = new Blob(audioChunks, { type: 'audio/webm' });
    return blob;
}
