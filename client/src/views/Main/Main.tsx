import { useEffect, useState } from "react";
import "./Main.css";
import Card from "./Card";
import bulb_icon from "../../assets/idea.png";
import bulb_icon2 from "../../assets/idea2.png";
import pen from "../../assets/pen.png";
import pen2 from "../../assets/pen2.png";
import send from "../../assets/send2.png";
import send2 from "../../assets/send-bgwhite.png";
import stop from "../../assets/stop3.png";
import stop2 from "../../assets/stop2.png";
import axios from "axios";
import { useDispatch } from "react-redux";
import { toast } from "sonner";
import { addHistoryItems } from "@/store/historyModelSlice";
import { Button } from "@/components/ui/button";
import { Icons } from "@/components/icons";
import { useUser } from "@clerk/clerk-react";
import Nav from "@/pages/Nav";
import { useTheme } from "@/components/theme-provider"; // Adjust the import based on your actual theme provider hook

const Main = () => {
  const [inputText, setInputText] = useState<string>("");
  const [showResult, setShowResult] = useState<boolean>(false);
  const [greetAndCardsVisible, setGreetAndCardsVisible] =
    useState<boolean>(true);
  const [videoSource, setVideoSource] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [glossText, setGlossText] = useState<string>("");
  const [stopGeneration, setStopGeneration] = useState<boolean>(false);
  const [showCardsLoader, setShowCardsLoader] = useState<boolean>(false); // New state for cards loader

  const dispatch = useDispatch();

  const { theme } = useTheme();

  const buttonImage = theme === "dark" ? send : send2;
  const penImage = theme === "dark" ? pen : pen2;
  const ideaImage = theme === "dark" ? bulb_icon : bulb_icon2;
  const stopImage = theme === "dark" ? stop : stop2;

  const cardData = [
    { text: "I am going to Dubai tomorrow.", image: penImage },
    { text: "Where are you going?", image: ideaImage },
    { text: "What is your name?", image: penImage },
    { text: "I want to play cricket today", image: ideaImage },
    { text: "I like to travel.", image: penImage },
    { text: "How old are you?", image: ideaImage },
    { text: "I want to eat Biryani.", image: penImage },
    { text: "Do you need any help?", image: ideaImage },
  ];

  const handleCardClick = (text: string) => {
    setInputText(text);
  };

  const handleStopClick = () => {
    setStopGeneration(true); // Set stop flag to true
    setLoading(false); // Stop loading immediately
    // Additional logic to handle stopping the generation process as needed
  };

  const handleGenerateClick = async () => {
    setInputText("");
    setLoading(true);
    setGreetAndCardsVisible(false);
    setShowCardsLoader(true); // Show loader for cards

    try {
      // Call the model API to generate gloss from input text
      const modelResponse = await axios.post(
        "http://119.63.132.178:5001/translate",
        { text: inputText } // Pass the inputText directly
      );

      // Extract gloss text from the model response
      const glossText = modelResponse.data.gloss;
      setGlossText(glossText);

      // Split gloss text into words
      const words = glossText.split(" ");

      // Call backend to merge words into corresponding videos
      const response = await axios.post(
        "http://localhost:3000/merge-videos",
        { words }, // Splitting the input text into words
        { responseType: "blob" }
      );

      if (response.data) {
        const videoBlobUrl = URL.createObjectURL(response.data);
        setVideoSource(videoBlobUrl);
        setShowResult(true);
        // setGreetAndCardsVisible(false);

        // Dispatch action to add history item to Redux store
        dispatch(
          addHistoryItems({
            input: inputText,
            output: words.join(" "),
            video: videoBlobUrl,
          })
        );
      } else {
        toast.error("No video found for this text.");
      }
    } catch (error) {
      console.error("Error generating video:", error);
      toast.error("Error generating video.");
    } finally {
      setLoading(false);
    }
  };

  const { user } = useUser(); // Now also getting the user object

  return (
    <div className="main">
      <Nav />

      {/* Main container */}

      <div className="main-container">
        {greetAndCardsVisible && (
          <div>
            <div className="greet">
              <p>
                <span>Hello, {user?.firstName || ""}</span>
              </p>
              <p>
                <span className="low">Ready to translate?</span>
              </p>
            </div>

            {showCardsLoader ? (
              // Loader for cards
              <div className="m-10">
                <div className="loaderp bg-slate-200 h-8 w-[600px]" />
                <div className="loaderDiv mt-4" />
              </div>
            ) : (
              <div className="cards flex flex-wrap justify-center">
                {cardData.map((card, index) => (
                  <Card
                    key={index}
                    text={card.text}
                    image={card.image}
                    onClick={() => handleCardClick(card.text)}
                  />
                ))}
              </div>
            )}
          </div>
        )}
        <div className="main-bottom">
          <div className="search-box bg-slate-200 dark:bg-[#1e1f20] focus-within:bg-slate-300 dark:focus-within:bg-white dark:focus-within:bg-opacity-20">
            <input
              type="text"
              placeholder="Enter a sentence here"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  handleGenerateClick();
                }
              }}
              className="text-[#1e1f20] dark:text-[#ffff] placeholder-slate-600 dark:placeholder-[#cacaca]"
            />
            <Button
              onClick={loading ? handleStopClick : handleGenerateClick}
              disabled={inputText || loading ? false : true}
              className="text-white rounded-xl p-2 bg-transparent transition duration-300 transform hover:scale-105 hover:bg-transparent"
            >
              {loading ? (
                <>
                  {/* Display stop button/icon when loading */}
                  <img src={stopImage} alt="" onClick={handleStopClick} />

                  {/* <Icons.spinner className="animate-spin h-6 w-6" /> */}
                </>
              ) : (
                <img src={buttonImage} alt="" />
              )}
            </Button>
          </div>
          <p className="bottom-info dark:text-[#cacaca]">
            SignToRead is a simple and easy way to convert English to Pakistani
            Sign Language Videos.
          </p>
        </div>

        {/* Show the video element only if showResult is true */}
        {showResult && (
          <>
            {/* <p className="gloss-text text-[#1e1f20] dark:text-[#ffffff]">
              <span className="gloss1">Gloss: </span>
              {glossText}
            </p> */}
            <div>
              {loading ? (
                // Loading indicator (e.g., spinner) while the server is processing the video merge
                <div className="m-10">
                  <div className="loaderp bg-slate-200 h-8 w-[600px]" />
                  
                  <div className="loaderDiv mt-4" />
                </div>
              ) : showResult && videoSource ? (
                // Render the video player with the merged video source
                <div className="video-container">
                  <div className="flex flex-col">
                    <p className="gloss-text text-[#1e1f20] dark:text-[#ffffff] ">
                      <span className="gloss1">Gloss: </span>
                      {glossText}
                    </p>
                    <video
                      src={videoSource}
                      autoPlay
                      controls
                      className="video-element"
                    ></video>
                  </div>
                </div>
              ) : (
                // Placeholder or message when no video is available
                <img src="/play.png" alt="Video will be displayed here" />
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Main;
