import { useState } from "react";
import data from "../../sentences.json";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Toaster, toast } from "sonner";

function GlossApp() {
  const [currentSentence, setCurrentSentence] = useState(0);
  const [gloss, setGloss] = useState("");
  const [isSaved, setIsSaved] = useState(false);

  const handleGlossChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setGloss(event.target.value);
    setIsSaved(false);
  };

  const saveGloss = () => {
    setIsSaved(true);
    toast.success("Gloss saved!");
    setGloss("");
  };

  const loadNextSentence = () => {
    if (currentSentence < data.sentences.length - 1) {
      setCurrentSentence(currentSentence + 1);
      setGloss("");
      setIsSaved(false);
    }
  };

  return (
    <div className="flex flex-col justify-center items-center h-screen p-8">
      <div className="p-8 rounded-lg shadow-xl bg-white">
        <h2 className="text-2xl mb-4 font-semibold text-primary text-center">
          Gloss for Pakistan Sign Language
        </h2>
        <p className="text-lg mb-4">{data.sentences[currentSentence]}</p>
        <Input
          className="w-full p-2 mb-4 border rounded"
          type="text"
          value={gloss}
          onChange={handleGlossChange}
          placeholder="Enter gloss"
        />
        <div className="flex justify-center space-x-4">
          <Toaster richColors position="bottom-center" />

          <Button
            // className="bg-green-600 hover:bg-green-500"
            className={`px-8 ${
              gloss
                ? "bg-green-600 hover:bg-green-500"
                : "bg-gray-400 cursor-not-allowed"
            }`}
            onClick={saveGloss}
            disabled={!gloss}
          >
            Save
          </Button>
          <Button
            className="bg-blue-700 hover:bg-blue-500"
            onClick={loadNextSentence}
          >
            Next Sentence
          </Button>
        </div>

        {/* {isSaved && (
          <p className="text-green-500 text-center mt-4">Gloss saved!</p>
        )} */}
      </div>
    </div>
  );
}

export default GlossApp;
