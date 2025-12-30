import configuration from "./config.js";
import deepgramClient from "./utils/login.js";

import express from "express";
import cors from "cors";
import { WebSocketServer } from 'ws';
import fs from "fs";

const app = express();
const server = app.listen(configuration.PORT, function () {
    console.log(`Server Running on PORT: ${configuration.PORT}`);
})

app.use(express.json());
app.use(express.raw({ type: 'audio/webm', limit: '10mb' }));
app.use(cors());

const wss = new WebSocketServer({ server });
wss.on("connection", function (client) {
    //create a write file stream
    const w_stream = fs.createWriteStream("test_record.webm");

    client.on("error", console.error);


    client.on("close", function () {
        console.log("Client Disconnected");
    });

    client.on("message", async function (audioBuffer) {
        // check if audio is recieved or not
        if (!audioBuffer || audioBuffer.length === 0) {
            client.send(JSON.stringify({ error: "No audio data received" }));
            return;
        }
        console.log("Received audio size:", audioBuffer.length, "bytes");

        //write into the file stream
        w_stream.write(audioBuffer);


        //check if audio is recieved or not
        // if (!audioBuffer || audioBuffer.length === 0) {
        //     client.send(JSON.stringify({ error: "No audio data received" }));
        //     return;
        // }
        // console.log("Received audio size:", audioBuffer.length, "bytes");

        // //save the file on the server side
        // fs.writeFileSync("test_recording.webm", audioBuffer);

        // let transcript = "";

        //handle late transcripts (left to impelement) - Deepgram will send one transcription if a long pause need to fix that somehow lol
        // const { result, error } = await deepgramClient.listen.prerecorded.transcribeFile(
        //     fs.createReadStream("./test_recording.webm"),
        //     { model: "nova-3" }
        // );
        // if (result) {
        //     transcript = result.results.channels[0].alternatives[0].transcript;
        // }
        // else {
        //     console.log(error);
        // }

        client.send(JSON.stringify({
            message: "Server received the audio file!",
            transcript: "The audio file lol"
        }));
    });
});

// app.post("/api/audio", async function (req, res) {
//     try {
//         let audioBuffer = req.body; //the audio is recieved as a node.js buffer
//         if (!audioBuffer || audioBuffer.length === 0) {
//             return res.status(400).json({ error: "No audio data received" });
//         }

//         //print its size
//         console.log("Received audio size:", audioBuffer.length, "bytes");

//         // save the file on the server side (used while testing to verify audio)
//         fs.writeFileSync("test_recording.webm", audioBuffer);

//         let transcript = "";

//         //handle late transcripts (left to impelement) - Deepgram will send one transcription if a long pause need to fix that somehow lol

//         const { result, error } = await deepgramClient.listen.prerecorded.transcribeFile(
//             fs.createReadStream("./test_recording.webm"),
//             { model: "nova-3" }
//         );
//         if(result){
//             transcript = result.results.channels[0].alternatives[0].transcript;
//         }
//         else{
//             console.log(error);
//         }

//         res.status(200).json({
//             message: "Server received the audio file!",
//             size: audioBuffer.length,
//             transcript: transcript
//         });

//     }
//     catch (error) {
//         console.log("Error Occured on Server: ", error);
//         res.status(500).json({ message: "Oops something went wrong..." });
//     }
// })

//handle wrong requests
app.use(function (req, res) {
    res.status(404).json({ "message": "Not a Valid Route ~!" })
})

