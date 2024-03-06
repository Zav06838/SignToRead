import { useState, useEffect } from 'react';
import axios from 'axios'; // If needed for future expansions
import { Button } from "@/components/ui/button"; // Adjust according to your actual imports
import { Copy, Volume2, ArrowLeftRight } from "lucide-react";
import { useDispatch } from "react-redux";
// import { addHistoryItems } from "../store/historyVidSlice";
import "../App.css";
import "./text2gloss.css";
import { toast, Toaster } from "sonner";

const S3_BASE_URL = 'https://YOUR_BUCKET_NAME.s3.YOUR_REGION.amazonaws.com/';

const TextToGloss3 = () => {
  const maxCharacters = 500;
  const [inputText, setInputText] = useState("");
  const [glossText, setGlossText] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [videoVisible, setVideoVisible] = useState(false);
  const [videoSources, setVideoSources] = useState([]);
  const [currentVideoIndex, setCurrentVideoIndex] = useState(0);
  const [preloadedVideo, setPreloadedVideo] = useState("");
  const dispatch = useDispatch();

  const handleTextChange = (event:any) => {
    if (event.target.value.length <= maxCharacters) {
      setInputText(event.target.value);
    }
  };

  const handleGenerateClick = async () => {
    setIsLoading(true);

    const words = inputText.split(' ');
    const videos = words.map(word => `${S3_BASE_URL}${word}.mp4`);

    const [videoSources, setVideoSources] = useState<string[]>([]);
    setCurrentVideoIndex(0);

    if (videos.length > 1) {
      setPreloadedVideo(videos[1]);
    }

    setIsLoading(false);
    setVideoVisible(true);
  };

  const playNextVideo = () => {
    const nextIndex = currentVideoIndex + 1;

    if (nextIndex < videoSources.length) {
      setCurrentVideoIndex(nextIndex);

      const nextPreloadIndex = nextIndex + 1;
      if (nextPreloadIndex < videoSources.length) {
        setPreloadedVideo(videoSources[nextPreloadIndex]);
      } else {
        setPreloadedVideo("");
      }
    } else {
      console.log('All videos played');
    }
  };

  useEffect(() => {
    if (videoSources.length > 0) {
      setCurrentVideoIndex(0);
    }
  }, [videoSources]);

  return (
    <div className="min-h-screen bg-[#BCC7EF] flex flex-col items-center justify-center p-4 pt-28 lg:pt-0 md:pt-0">
      <div className="bg-[#122053] shadow-xl shadow-black/40 rounded-md p-6 md:flex md:max-w-screen-2xl w-full justify-center">
        {/* Text Input Section */}
        <div className="flex flex-col w-full md:w-1/2 md:mr-4 relative">
          {/* Text Input and other UI elements... */}
          {/* Generate Button */}
          <Button onClick={handleGenerateClick} disabled={isLoading} className="mt-4 text-white rounded-xl p-2 bg-[#6074BC] transition duration-300 transform hover:scale-105 hover:bg-[#3f62c4]">
            {isLoading ? "Generating..." : "Generate"}
          </Button>
        </div>

        <div className="md:flex hidden ">
          <ArrowLeftRight className={`text-white justify-center items-center ${isLoading ? "color-animated-arrow" : ""}`} />
        </div>

        {/* Video Display Section */}
        <div className="flex flex-col w-full md:w-1/2 md:ml-4 mt-6 md:mt-0">
          <label htmlFor="psl-gloss" className="text-white text-md font-semibold mb-2 text-right">Glossed Video</label>
          <div className="flex flex-col justify-center items-center border border-sky-200 rounded-sm p-2 w-full h-72 relative bg-[#122053] text-white">
            {isLoading ? (
              <img src="/play-bg.gif" alt="Loading" className="h-24 w-24" />
            ) : videoVisible ? (
              <>
                <video
                  key={videoSources[currentVideoIndex]}
                  src={videoSources[currentVideoIndex]}
                  autoPlay
                  controls
                  className="h-full w-full object-fill"
                  onEnded={playNextVideo}
                ></video>
                <video
                  key={preloadedVideo}
                  src={preloadedVideo}
                  style={{ display: 'none' }}
                  preload="auto"
                ></video>
              </>
            ) : (
              <img src="/play.png" alt="Video placeholder" className="h-24 w-24" />
            )}
          </div>
          {/* Additional UI for Gloss Text, etc. */}
        </div>

        <Toaster richColors position="bottom-center" />
      </div>
    </div>
  );
};

export default TextToGloss3;
