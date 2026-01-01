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

export function createRecorder(mediaStream){
    recorder = new MediaRecorder(mediaStream, { mimeType: "audio/webm" });
    return recorder;
}

export function startRecording(recorder){
    recorder.start(250);
}

export function stopRecording(recorder){
    recorder.stop();
    recorder.onstop = function(){
        console.log("Recording stopped...");
    }
}

export async function createAudioBuffer(audioBlob){
    const audioBuf = await audioBlob.arrayBuffer();
    return audioBuf;
}
