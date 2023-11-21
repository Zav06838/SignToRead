
import { Copy } from "lucide-react";
import { Toaster, toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { ArrowLeftRight } from "lucide-react";
import axios from "axios"; // Import axios
import "../App.css";
import { useState } from "react";

const TextToGloss = () => {
  const maxCharacters = 500;
  const [inputText, setInputText] = useState("");
  const [glossText, setGlossText] = useState("");
  const [isCopied, setIsCopied] = useState(false);

  const handleTextChange = (event) => {
    if (event.target.value.length <= maxCharacters) {
      setInputText(event.target.value);
    }
  };

  const handleGenerateClick = async () => {
    try {
      const response = await axios.post("http://localhost:3000/api/glosses", {
        englishText: inputText,
      });
      setGlossText(response.data.pslGloss);
    } catch (error) {
      console.error("Error fetching gloss:", error);
      toast.error("Failed to fetch gloss.");
      setGlossText("Failed to fetch gloss.");
    }
  };

  const handleCopyText = () => {
    navigator.clipboard.writeText(inputText).then(() => {
      setIsCopied(true);
      toast.success("Copied to clipboard!");
      setTimeout(() => setIsCopied(false), 2000);
    });
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center p-4 ">
      <div className="bg-white shadow-lg rounded-xl p-6 md:flex md:max-w-screen-xl w-full">
        <div className="flex flex-col w-full md:w-1/2 md:mr-4 relative">
          <Label
            htmlFor="english-text"
            className="text-primary text-md font-semibold mb-2"
          >
            English
          </Label>
          <textarea
            id="english-text"
            className="resize-none border rounded-md p-2 w-full h-64 outline-none"
            placeholder="Type or paste text here..."
            value={inputText}
            onChange={handleTextChange}
          />

          <Copy
            onClick={handleCopyText}
            className="absolute bottom-24 left-3 text-gray-600 cursor-pointer h-4"
          />
          {/* Message displayed when text is copied */}
          {isCopied}

          <div className="text-right text-sm mt-1">
            {inputText.length}/{maxCharacters}
          </div>
          <Button
            onClick={handleGenerateClick}
            className="mt-4 text-white rounded-xl p-2 transition-colors"
          >
            Generate
          </Button>
        </div>
        <div>
          <ArrowLeftRight className="text-primary justify-center items-center" />
        </div>

        <div className="flex flex-col w-full md:w-1/2 md:ml-4 mt-6 md:mt-0">
          <label
            htmlFor="psl-gloss"
            className="text-primary text-md font-semibold mb-2 text-right"
          >
            PSL Gloss
          </label>
          <div className="border rounded-md p-2 w-full h-64 relative">
            {glossText || "The PSL gloss will be displayed here..."}
            {glossText && (
              <Copy
                onClick={handleCopyText}
                className="absolute bottom-4 right-3 text-gray-600 cursor-pointer h-4"
              />
            )}
          </div>
        </div>
        <Toaster richColors position="bottom-center" />
      </div>
    </div>
  );
};

export default TextToGloss;
