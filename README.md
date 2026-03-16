#  Voice To Text Application (Wispr Flow Clone)

A lightweight and simple Voice-To-Text web app made using **Node.js** and **Deepgram**.

## 📦 Features
- *Simple and Lightweight:* Zero-Bloat, minimal UI !.

- *Smooth Auto-Scroll:* New transcriptions pin to the bottom for a seamless experience.

- *Live Transcriptions:* Live Transcriptions that appear as user speaks made possible using Websockets.

- *Minimalistic UI:* Incredibly Minimal UI made with Bulma CSS and custom CSS styling.

- *Copy Transcriptions:* Copy all transcriptions with just one click of a button.

### 💻 Tech Stack
- *Frontend:* HTML, CSS, JavaScript.
- *Backend:* Node.js, Websockets (ws).
- *AI:* Deepgram SDK for real-time transcription,

---

### 🚀 How to run locally

Pre-requisites:
    [Node.js](https://nodejs.org/en),

1. Clone the Repository
```shell
git clone https://github.com/NexusWasLost/Voice-To-Text.git
```

2. navigate into the directory
```shell
cd Voice-To-Text
```

3. Setup Backend
	- From client directory, navigate to server directory
	```shell
	cd ../../server
	```
	- install the server dependencies
	```shell
	npm install
	```
    - Create a `.env` file and enter envs.

	- Start the server
	```shell
	npm run dev
	```

4. Start frontend using extension like live server.

### `.env` contents
Here is an example `.env`
```toml
PORT=8080
DEEPGRAM_API_KEY=<your_api_key>
DEEPGRAM_WEBSOCKET_URL=wss://api.deepgram.com/v1/listen?model=nova-3&smart_format=true&interim_results=true
```

## 🔢 Getting Deepgram API Key
1. Login to Deepgram or Create an Account. > https://deepgram.com/

2. Create a Project (if Deepgram didnt create one already),

3. Navigate to **"API KEY"** and create an API KEY and copy its value.

4. Inside the `.env` type the value `DEEPGRAM_API_KEY=<your_api_key>` (The API Key Goes there) !

---

## ✨ Architecture

The Architecture for this whole system is more or less much straightforward.

- The Client connects to the Node.js server using a WebSocket connection.
- The Client is ready to send data to the server.
- Upon sending the first chunk of data, the server then initiates a WebSocket connection to Deepgram's open socket.
- On ready, the data is sent to Deepgram via WebSocket and Deepgram processes our audio data and transcripts data in real time and then returns transcripts.
- On recieving the transcript data from Deepgram, the Node server processes it and then sends back the transcription to the Client.

## 💭 Decisions

Here are a few decision I made while making this project:

- *Server (middleman):* Even though Deepgram provides URL to their open WebSocket connection and its the same thing being used in the application, I preferred to maintain a server to keep the DEEPGRAM API key secure and also to process the transcription data.

- *Minimalistic UI:* The UI made is using base HTML, CSS and JavaScript while using Bulma CSS and custom CSS styling, I focused totally on the core functionality of the application rather than having a detailed frontend.

- *Code Modularity:* I tried to keep the code as modular as possible to ensure better readability and maintainability. Trying to encapsulate similiar functioning parts together.

- *Hosting:* Unfortunately, hosting a server that primarily uses WebSockets for free is a big hassle and inefficient, keeping that in mind I decided not to host the server.

- *Transcription Latency:* I utilized Deepgram's `is_final` flag to ensure transcript accuracy and readability. While this introduces a slight delay as the AI determines sentence boundaries, it prevents word redundancy, common in raw interim streams.

## 🔑 A Key Challenge

A key challenge I faced was managing the initial audio metadata.

The issue I faced was that after the initial audio streaming was done, Deepgram won't process the second stream of audio. Upon debugging and referring to AI, the bug I found was the *audio metadata* !

While streaming, the first byte of the buffer contains the metadata for the audio. Deepgram expects that metadata only once per connection. If the connection remained open and a metadata is received again, Deepgram will discard that byte and any data further sent.

To resolve this, implemented a check for the metadata byte(`26`) to see for this byte in the buffer. When detected, the server creates a new WebSocket connection to Deepgram; terminating any previous ones, ensuring that the first byte a connection receives is the metadata and all the rest are always audio data.

### ℹ️  References

- https://github.com/deepgram/deepgram-js-sdk/
- https://udn.realityripple.com/docs/Web/API/MediaRecorder/onstop
- https://chatgpt.com
- https://gemini.google.com
- https://developers.deepgram.com/reference/speech-to-text/listen-streaming
