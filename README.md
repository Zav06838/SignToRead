# SignToRead

[![Watch the video](![image](https://github.com/Zav06838/SignToRead/assets/78081958/4e4525cf-849c-4a64-bb84-07a43c61e2b6)
)](https://github.com/Zav06838/SignToRead/raw/main/demo/SignToRead_Demo.mp4)


## About:
This project aims to bridge the communication gap for the deaf community by providing a text-to-video translator. It converts English text into a video displaying sign language gestures, enabling easier comprehension for deaf individuals. The solution utilizes AI technology to convert text into Pakistan Sign Language (PSL) Gloss, which is then translated into sign language gestures performed by human signers. The system leverages videos from PSL.org for sign language gestures.

## Setup and Usage

1. Clone the repository.
2. Install dependencies with `npm install`.
3. Start the development server with `npm start`.
4. Access the website through the provided link.
5. Input text and click "Generate" to create the corresponding sign language video and gloss.
6. Optionally, log in to save query history and generated videos.

## System Pipeline:
The system pipeline shows how the system takes an input text and converts it into a corresponding sign language video.

<img src="https://github.com/Zav06838/SignToRead/assets/78081958/155488e7-d4af-4958-95ea-89e7893e839f" alt="Image" width="500">


## AI utilization:
- **AI Models:**
  - **LLama2:** Fine-tuned on our data, serving as the gloss engine.
  - **T5-Model:** Used as the PSL relevance engine to extract contextual information from sentences.

