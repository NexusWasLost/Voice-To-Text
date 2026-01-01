#  Voice To Text Application

A lightweight and simple Voice-To-Text Cross-Platform Application made using **Tauri**, **Node.js** and **Deepgram**.

## 📦 Features
- *Simple and Lightweight:* Zero-Bloat, minimal UI with fast performance.

- *Cross Platform:* Fully cross-platform support enabled using Tauri

- *Smooth Auto-Scroll:* New transcriptions pin to the bottom for a seamless experience.

- *Live Transcriptions:* Live Transcriptions that appear as user speaks made possible using Websockets.

- *Minimalistic UI:* Incredibly Minimal UI made with Pico CSS and a bit of custom CSS.

- *Copy Transcriptions:* Copy all transcriptions with just one click of a button.

### 💻 Tech Stack
- *Frontend:* Tauri, HTML, CSS, JavaScript.
- *Backend:* Node.js, Websockets (ws).
- *AI:* Deepgram SDK for real-time transcription,

---

### 🚀 How to run locally

Pre-requisites: Node.js, Tauri, Rust (Tauri Dependency)

1. Clone the Repository
```shell
git clone https://github.com/NexusWasLost/Voice-To-Text.git
```

2. navigate into the directory
```shell
cd Voice-To-Text
```

3. Set Up Frontend
	- navigate into client directory
	```shell
	cd client/wispr-clone
	```
	- Install all the dependencies
	```shell
	npm install
	```
	- Start the frontend client
	```shell
	npm run tauri dev
	```

4. Setup Backend
	- From client directory, navigate to server directory
	```shell
	cd ../../server
	```
	- install the server dependencies
	```shell
	npm install
	```
	- Start the server
	```shell
	npm run dev
	```

5. Refresh the frontend Client to connect if running to connect to the Server.

---

### ✨ Architecture

The Architecture for this whole system is more or less much straightforward.

- The Client connects to the Node.js server using a WebSocket connection.
- The Client is ready to send data to the server.
- Upon sending the first chunk of data, the server then initiates another WebSocket connection to Deepgram's open socket.
- On ready, the data is sent to Deepgram via WebSocket and Deepgram processes our audio data and transcripts data in real time and then returns transcripts.
- On recieving the transcript data from Deepgram, the Node server processes it and then sends back the transcription to the Client.

### 🔑 A Key Challenge

A key challenge I faced was managing the initial audio metadata.

The issue I was faced was after the initial audio streaming was done, Deepgram won't process the second stream of audio. Upon debugging and referring to AI, the bug I found was the *audio metadata* !

While streaming, the first byte of the buffer contains the metadata for the audio. Deepgram expects that metadata only once per connection. If the connection remained open and a metadata is received, Deepgram will discard that byte and any data further sent.

To resolve this, implemented a check for the metadata byte(`26`) to see for this byte in the buffer. When detected, the server creates a new WebSocket connection to Deepgram; terminating any previous ones, ensuring that the first byte a connection receives is the metadata and all the rest are always audio data.

### ℹ️  References

- https://github.com/deepgram/deepgram-js-sdk/
- https://udn.realityripple.com/docs/Web/API/MediaRecorder/onstop
- https://chatgpt.com
- https://gemini.google.com
- https://v2.tauri.app/start/create-project/
- https://developers.deepgram.com/reference/speech-to-text/listen-streaming
