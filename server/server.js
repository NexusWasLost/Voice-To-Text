import configuration from "./config.js";
import deepgramClient from "./utils/login.js";

import express from "express";
import cors from "cors";
import fs from "fs";

const app = express();
app.listen(configuration.PORT, function () {
    console.log(`Server Running on PORT: ${configuration.PORT}`);
})

app.use(express.json());
app.use(express.raw({ type: 'audio/webm', limit: '10mb' }));
app.use(cors());

app.post("/api/audio", async function (req, res) {
    try {
        let audioBuffer = req.body; //the audio is recieved as a node.js buffer
        if (!audioBuffer || audioBuffer.length === 0) {
            return res.status(400).json({ error: "No audio data received" });
        }

        //print its size
        console.log("Received audio size:", audioBuffer.length, "bytes");

        // save the file on the server side (used while testing to verify audio)
        fs.writeFileSync("test_recording.webm", audioBuffer);

        let transcript = "";

        const { result, error } = await deepgramClient.listen.prerecorded.transcribeFile(
            fs.createReadStream("./test_recording.webm"),
            { model: "nova-3" }
        );
        if(result){
            transcript = result.results.channels[0].alternatives[0].transcript;
        }
        else{
            console.log(error);
        }

        res.status(200).json({
            message: "Server received the audio file!",
            size: audioBuffer.length,
            transcript: transcript
        });

    }
    catch (error) {
        console.log("Error Occured on Server: ", error);
        res.status(500).json({ message: "Oops something went wrong..." });
    }
})

//handle wrong requests
app.use(function (req, res) {
    res.status(404).json({ "message": "Not a Valid Route ~!" })
})

