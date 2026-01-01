export function getTranscript(dataBuffer){
    const str = dataBuffer.toString();

    try{
        const json = JSON.parse(str);
        const isFinal = json.is_final;
        const transcript = json.channel?.alternatives[0]?.transcript;
        if(transcript && isFinal){
            return transcript;
        }
        else{
            return "";
        }
    }
    catch (error) {
        console.log("Error extracting Transcription: ", error);
        return "";
    }
}
