import { Copy } from "lucide-react";
import { Toaster, toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { ArrowLeftRight } from "lucide-react";
import axios from "axios"; // Import axios
import "../App.css";
import { useState } from "react";
import { Icons } from "@/components/icons";
import { Volume2 } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

// import { Skeleton } from "@/components/ui/skeleton";

import "../App.css";

const TextToGloss = () => {
  const maxCharacters = 500;
  const [inputText, setInputText] = useState("");
  const [glossText, setGlossText] = useState("");
  const [isCopied, setIsCopied] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  // const [showLoadingSkeleton, setShowLoadingSkeleton] = useState(false);

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

    try {
      const response = await axios.post("http://localhost:3000/api/glosses", {
        englishText: inputText,
      });

      // Set a timeout before displaying the text
      setTimeout(() => {
        // Initiate the typing effect instead of setting the full text
        displayTypingEffect(response.data.pslGloss);
        setIsLoading(false);
      }, 3000);
    } catch (error) {
      console.error("Error fetching gloss:", error);
      toast.error("Failed to fetch gloss.");
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
    }, 40); // Adjust the speed of typing here
  };

  const handleCopyText = () => {
    navigator.clipboard.writeText(inputText).then(() => {
      setIsCopied(true);
      toast.success("Copied to clipboard!");
      setTimeout(() => setIsCopied(false), 2000);
    });
  };

  const handleListenClick = () => {
    const utterance = new SpeechSynthesisUtterance(inputText);
    speechSynthesis.speak(utterance);
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center p-4 pt-28 lg:pt-0 md:pt-0">
      <div className="bg-[#BCC7EF] shadow-xl rounded-xl p-16 md:flex md:max-w-screen-2xl w-full md:justify-center">
        <div className="bg-[#122053] shadow-lg shadow-black/40 rounded-xl p-6 md:flex md:max-w-screen-xl w-full  ">
          <div className="flex flex-col w-full md:w-1/2 md:mr-4 relative">
            <Label
              htmlFor="english-text"
              className="text-white text-md font-semibold mb-2"
            >
              English
            </Label>
            <textarea
              id="english-text"
              className="resize-none border rounded-md p-2 w-full h-64 outline-none bg-slate-100 text-black"
              placeholder="Type or paste text here..."
              value={inputText}
              onChange={handleTextChange}
            />

            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Copy
                    onClick={handleCopyText}
                    className="absolute bottom-24 right-3 text-gray-700 cursor-pointer h-4"
                  />
                </TooltipTrigger>
                <TooltipContent>
                  <p>Copy</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
            {isCopied}

            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Volume2
                    onClick={handleListenClick}
                    className="absolute bottom-24 left-3 text-gray-600 cursor-pointer h-5"
                  />
                </TooltipTrigger>
                <TooltipContent>
                  <p>Listen</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>

            <div className="text-right text-sm mt-2 text-white">
              {inputText.length}/{maxCharacters}
            </div>

            <Button
              onClick={handleGenerateClick}
              disabled={isLoading}
              className="mt-4 text-white rounded-xl p-2 bg-[#6074BC] hover:bg-[#3f62c4]"
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
          <div className="md:flex hidden">
            <ArrowLeftRight className="text-white justify-center items-center" />
          </div>

          <div className="flex flex-col w-full md:w-1/2 md:ml-4 mt-6 md:mt-0">
            <label
              htmlFor="psl-gloss"
              className="text-white text-md font-semibold mb-2 text-right"
            >
              PSL Gloss
            </label>
            <div className="border rounded-md p-2 w-full h-64 relative bg-slate-200 text-black">
              {/* {glossText || "The PSL gloss will be displayed here..."} */}
              {isLoading ? (
                <LoadingDots />
              ) : (
                // glossText || "The PSL gloss will be displayed here..."
                <p className="typing-effect">{glossText}</p>
              )}
              {glossText && (
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Copy
                        onClick={handleCopyText}
                        className="absolute bottom-4 right-3 text-gray-900 cursor-pointer h-4"
                      />
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Copy</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              )}
            </div>
          </div>
          <Toaster richColors position="bottom-center" />
        </div>
      </div>
    </div>
  );
};

export default TextToGloss;
