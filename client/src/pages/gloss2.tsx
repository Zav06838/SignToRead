import React, { useState, useEffect } from "react";
import axios from "axios"; // Import axios
import { Button } from "@/components/ui/button";
import data from "../../sentences.json";

function GlossApp() {
  const [currentSentence, setCurrentSentence] = useState(0);
  const [gloss, setGloss] = useState("");
  const [isSaved, setIsSaved] = useState(false);
  const [glossEntries, setGlossEntries] = useState([]);

  useEffect(() => {
    // Fetch gloss entries when the component mounts
    fetchGlossEntries();
  }, []);

  const handleGlossChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setGloss(event.target.value);
    setIsSaved(false);
  };

  const saveGloss = () => {
    // Make a POST request to save the gloss
    axios
      .post("/api/gloss", {
        sentence: data.sentences[currentSentence],
        userGloss: gloss,
      })
      .then((response) => {
        setIsSaved(true);
        fetchGlossEntries(); // Refresh gloss entries after saving
      })
      .catch((error) => {
        console.error("Error saving gloss:", error);
      });
  };

  const loadNextSentence = () => {
    if (currentSentence < data.sentences.length - 1) {
      setCurrentSentence(currentSentence + 1);
      setGloss("");
      setIsSaved(false);
    }
  };

  // Function to fetch gloss entries
  const fetchGlossEntries = () => {
    axios
      .get("/api/gloss")
      .then((response) => {
        setGlossEntries(response.data);
      })
      .catch((error) => {
        console.error("Error fetching gloss entries:", error);
      });
  };

  return (
    <div className="flex flex-col justify-center items-center h-screen p-8">
      <div className="p-8 rounded-lg shadow-xl bg-white">
        <h2 className="text-2xl mb-4 font-semibold text-primary text-center">
          Gloss for Pakistan Sign Language
        </h2>
        <p className="text-lg mb-4">{data.sentences[currentSentence]}</p>
        <input
          className="w-full p-2 mb-4 border rounded"
          type="text"
          value={gloss}
          onChange={handleGlossChange}
          placeholder="Enter gloss"
        />
        <div className="flex justify-center space-x-4">
          <Button
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

        {isSaved && (
          <p className="text-green-500 text-center mt-4">Gloss saved!</p>
        )}
      </div>
    </div>
  );
}

export default GlossApp;
