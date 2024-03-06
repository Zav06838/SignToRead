import { Copy } from "lucide-react";
import { Toaster, toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { ArrowLeftRight } from "lucide-react";
import "../App.css";
import { useState } from "react";
import { Icons } from "@/components/icons";
import { Volume2 } from "lucide-react";
import "./text2gloss.css";
import demoVid1 from "../assets/demo_vid1.mp4";
import demoVid2 from "../assets/demo_vid2.mp4";

import { useDispatch } from "react-redux";
import { addHistoryItems } from "../store/historyVidSlice";

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

import "../App.css";

const TextToGloss3 = () => {
  const maxCharacters = 500;
  const [inputText, setInputText] = useState("");
  const [glossText, setGlossText] = useState("");
  const [isCopied, setIsCopied] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [videoVisible, setVideoVisible] = useState(false); // State to manage the visibility of the video
  const [glossVisible, setGlossVisible] = useState(false); // State to manage the visibility of the gloss
  const [videoSource, setVideoSource] = useState("");
  const dispatch = useDispatch();

  // Add a function to toggle the gloss visibility
  const toggleGlossVisibility = () => {
    setGlossVisible(!glossVisible);
  };

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
    const textMappings: { [key: string]: { video: string; gloss: string } } = {
      "He has already finished his homework": {
        video: demoVid1,
        gloss: "he homework finish already",
      },
      "He has to eat breakfast before leaving": {
        video: demoVid2,
        gloss: "go before he breakfast eat",
      },
      // ... add other predefined texts with their videos and glosses
    };

    const mapping = textMappings[inputText];

    if (mapping) {
      // If the input text matches a predefined sentence
      setTimeout(() => {
        setVideoSource(mapping.video);
        setGlossText(mapping.gloss);
        setIsLoading(false);
        setVideoVisible(true);
        setGlossVisible(true);

        displayTypingEffect(mapping.gloss);

        // Dispatch action to add item to history
        dispatch(
          addHistoryItems({
            input: inputText,
            output: mapping.gloss, // Assuming gloss is the output
            video: mapping.video,
          })
        );
      }, 3000); // Simulate loading time
    } else {
      // Handle cases where there is no predefined video and gloss for the input
      toast.error("No predefined video and gloss for this text.");
      setIsLoading(false);
    }
  };

  const displayTypingEffect = (text: string) => {
    let index = 0;
    const intervalId = setInterval(() => {
      if (index < text.length) {
        setGlossText(text.slice(0, index + 1));
        index++;
      } else {
        clearInterval(intervalId);
        // Ensure the full text is set after the typing effect completes
        setGlossText(text);
      }
    }, 50); // Adjust the speed of typing here
  };

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
    <div className="min-h-screen body flex flex-col items-center justify-center p-4 pt-28 lg:pt-0 md:pt-0">
      {/* <div className="bg-[#BCC7EF] shadow-xl rounded-xl md:p-16 lg:p-16 md:flex md:max-w-screen-2xl w-full md:justify-center sm:p-0"> */}
      <div className="bg-white shadow-2xl shadow-white/15 rounded-xl p-6 md:flex md:max-w-screen-xl w-full justify-center">
        <div className="flex flex-col w-full md:w-1/2 md:mr-4 relative">
          <Label
            htmlFor="english-text"
            className="text-black text-md font-semibold mb-2"
          >
            English
          </Label>
          <div className="relative">
            <textarea
              id="english-text"
              className="resize-none border border-none rounded-sm p-2 w-full h-72 outline-none  text-black pr-10 placeholder-gray-500"
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
            // className="mt-4 text-white rounded-xl p-2 bg-[#6074BC] hover:bg-[#3f62c4]"
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
            className="text-black text-md font-semibold mb-2 text-right"
          >
            Glossed Video
          </label>
          <div className="flex flex-col justify-center items-center border border-sky-200 rounded-sm p-2 w-full h-72 relative bg-white border-none text-white">
            {isLoading ? (
              // <LoadingDots />
              <img
                src="/play-bg.gif"
                alt="Video will be displayed here"
                className="h-24 w-24"
              />
            ) : videoVisible ? (
              // Use the local video file from the public folder
              <video
                src={videoSource}
                autoPlay
                controls
                className="h-full w-full object-fill"
              ></video>
            ) : (
              <img
                src="/play.png"
                alt="Video will be displayed here"
                className="h-24 w-24"
              />
            )}
          </div>

          {videoVisible && (
            <div className="text-black mt-8 relative">
              <Accordion type="single" collapsible>
                <AccordionItem value="item-1">
                  <AccordionTrigger>See Gloss</AccordionTrigger>
                  <AccordionContent>
                    <div className=" text-black">
                      {isLoading ? <LoadingDots /> : <p>{glossText}</p>}
                    </div>
                    {/* {glossText} */}
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Copy
                            onClick={handleCopyGlossText}
                            className="absolute bottom-4 right-4 text-gray-700 cursor-pointer h-4"
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
    // </div>
  );
};

export default TextToGloss3;
