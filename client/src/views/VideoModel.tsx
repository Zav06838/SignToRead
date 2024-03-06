import { Copy } from "lucide-react";
import { Toaster, toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { ArrowLeftRight } from "lucide-react";
import "../App.css";
import { useEffect, useState } from "react";
import { Icons } from "@/components/icons";
import { Volume2 } from "lucide-react";
import "../pages/text2gloss.css";

import { useDispatch } from "react-redux";

import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import axios from "axios";

const VideoModel = () => {
  const maxCharacters = 500;
  const [inputText, setInputText] = useState("");
  const [glossText, setGlossText] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [videoSource, setVideoSource] = useState("");
  const [generationCount, setGenerationCount] = useState(0);

  const dispatch = useDispatch();
  const [isCopied, setIsCopied] = useState(false);
  const [videoVisible, setVideoVisible] = useState(false);

  const handleTextChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    if (event.target.value.length <= maxCharacters) {
      setInputText(event.target.value);
    }
  };

  const LoadingDots = () => {
    return (
      <div className="loading-dots-wrapper">
        <div className="loading-dots">
          <div className="dot"></div>
          <div className="dot"></div>
          <div className="dot"></div>
        </div>
      </div>
    );
  };

  const handleGenerateClick = async () => {
    setIsLoading(true);
    setVideoSource(""); // Reset video source
    setGlossText(""); // Reset gloss text
    setVideoVisible(false);

    try {
      const response = await axios.post(
        "http://localhost:3000/merge-videos",
        { words: inputText.split(" ") },
        { responseType: "blob" }
      );

      if (response.data) {
        const videoBlobUrl = URL.createObjectURL(response.data);
        setVideoSource(videoBlobUrl);
        setVideoVisible(true);

        // Trigger Sign to Read model with the generated gloss
        setGenerationCount((count) => count + 1);
      } else {
        toast.error("No video found for this text.");
      }
    } catch (error) {
      console.error("Error merging videos:", error);
      toast.error("Error merging videos.");
    }

    setIsLoading(false);
  };

  useEffect(() => {
    // Call Sign to Read model API with the generated gloss
    const fetchGloss = async () => {
      try {
        const response = await axios.post(
          "http://localhost:3000/process-gloss",
          { generatedGloss: glossText }
        );

        if (response.data && response.data.processedGloss) {
          setGlossText(response.data.processedGloss);
        }
      } catch (error) {
        console.error("Error fetching gloss from Sign to Read model:", error);
      }
    };

    fetchGloss();
  }, [glossText]);

  const handleCopyText = () => {
    navigator.clipboard.writeText(inputText).then(() => {
      setIsCopied(true);
      toast.success("Copied to clipboard!");
      setTimeout(() => setIsCopied(false), 2000);
    });
  };

  const handleCopyGlossText = () => {
    navigator.clipboard.writeText(glossText).then(() => {
      toast.success("Gloss copied to clipboard!");
    });
  };

  const handleListenClick = () => {
    const utterance = new SpeechSynthesisUtterance(inputText);
    speechSynthesis.speak(utterance);
  };

  return (
    <div className="min-h-screen bg-[#BCC7EF] flex flex-col items-center justify-center p-4 pt-28 lg:pt-0 md:pt-0">
      <div className="bg-[#122053] shadow-xl shadow-black/40 rounded-md p-6 md:flex md:max-w-screen-2xl w-full justify-center">
        <div className="flex flex-col w-full md:w-1/2 md:mr-4 relative">
          <Label
            htmlFor="english-text"
            className="text-white text-md font-semibold mb-2"
          >
            English
          </Label>
          <div className="relative">
            <textarea
              id="english-text"
              className="resize-none border rounded-sm p-2 w-full h-72 outline-none bg-slate-100 text-black pr-10"
              placeholder="Type or paste text here..."
              value={inputText}
              onChange={handleTextChange}
            />
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Copy
                    onClick={handleCopyText}
                    className="absolute bottom-4 right-3 text-gray-700 cursor-pointer h-4"
                  />
                </TooltipTrigger>
                <TooltipContent>
                  <p>Copy</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>

            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Volume2
                    onClick={handleListenClick}
                    className="absolute bottom-4 left-3 text-gray-600 cursor-pointer h-5"
                  />
                </TooltipTrigger>
                <TooltipContent>
                  <p>Listen</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>

          <div className="text-right text-sm mt-2 text-white">
            {inputText.length}/{maxCharacters}
          </div>

          <Button
            onClick={handleGenerateClick}
            disabled={isLoading}
            className="mt-4 text-white rounded-xl p-2 bg-[#6074BC] transition duration-300 transform hover:scale-105 hover:bg-[#3f62c4] "
          >
            {isLoading ? (
              <>
                <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
                Generating...
              </>
            ) : (
              "Generate"
            )}
          </Button>
        </div>
        <div className="md:flex hidden ">
          <ArrowLeftRight
            className={`text-white justify-center items-center ${
              isLoading ? "color-animated-arrow" : ""
            }`}
          />
        </div>

        <div className="flex flex-col w-full md:w-1/2 md:ml-4 mt-6 md:mt-0">
          <label
            htmlFor="psl-gloss"
            className="text-white text-md font-semibold mb-2 text-right"
          >
            Glossed Video
          </label>

          <div className="flex flex-col justify-center items-center border border-sky-200 rounded-sm p-2 w-full h-72 relative bg-[#122053] text-white">
            {isLoading ? (
              // Loading indicator (e.g., spinner) while the server is processing the video merge
              <img src="/play-bg.gif" alt="Loading" className="h-24 w-24" />
            ) : videoVisible && videoSource ? (
              // Render the video player with the merged video source
              <video
                src={videoSource}
                autoPlay
                controls
                className="h-full w-full object-fill"
              ></video>
            ) : (
              // Placeholder or message when no video is available
              <img
                src="/play.png"
                alt="Video will be displayed here"
                className="h-24 w-24"
              />
            )}
          </div>

          {videoVisible && (
            <div className="text-white mt-8 relative">
              <Accordion type="single" collapsible>
                <AccordionItem value="item-1">
                  <AccordionTrigger>See Gloss</AccordionTrigger>
                  <AccordionContent>
                    <div className=" text-white">
                      {isLoading ? <LoadingDots /> : <p>{glossText}</p>}
                    </div>
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Copy
                            onClick={handleCopyGlossText}
                            className="absolute bottom-4 right-4 text-gray-300 cursor-pointer h-4"
                          />
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Copy</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </div>
          )}
        </div>
        <Toaster richColors position="bottom-center" />
      </div>
    </div>
  );
};

export default VideoModel;
