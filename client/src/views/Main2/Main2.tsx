import { useState } from "react";
import "./Main2.css";
import Card from "../Main/Card";
import bulb_icon from "../../assets/idea.png";
import bulb_icon2 from "../../assets/idea2.png";
import pen from "../../assets/pen.png";
import pen2 from "../../assets/pen2.png";
import send from "../../assets/send2.png";
import send2 from "../../assets/send-bgwhite.png";
import stop from "../../assets/stop3.png";
import stop2 from "../../assets/stop2.png";
import axios from "axios";
// import { useDispatch } from "react-redux";
// import { toast } from "sonner";
// import { addHistoryItems } from "@/store/historyModelSlice";
import { Button } from "@/components/ui/button";
// import { Icons } from "@/components/icons";
import { useUser } from "@clerk/clerk-react";
import Nav from "@/pages/Nav";
import { useTheme } from "@/components/theme-provider"; // Adjust the import based on your actual theme provider hook
// import Loader from "../Main/Loader";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

const Main2 = () => {
  const [inputText, setInputText] = useState<string>("");
  const [showResult, setShowResult] = useState<boolean>(false);
  // const [greetAndCardsVisible, setGreetAndCardsVisible] =
  //   useState<boolean>(true);
  const [videoSource, setVideoSource] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  // const [glossText, setGlossText] = useState<string>("");
  const [, setStopGeneration] = useState<boolean>(false); 

  // const dispatch = useDispatch();

  const { theme } = useTheme();

  const buttonImage = theme === "dark" ? send : send2;
  const penImage = theme === "dark" ? pen : pen2;
  const ideaImage = theme === "dark" ? bulb_icon : bulb_icon2;
  const stopImage = theme === "dark" ? stop : stop2;

  const handleCardClick = (text: string) => {
    setInputText(text);
  };

  const handleGenerateClick = async () => {
    setLoading(true);
    try {
      const response = await axios.post("http://localhost:3000/process-words", {
        words: inputText.split(" "),
      });
      const videoUrl = URL.createObjectURL(
        new Blob([response.data], { type: "video/mp4" })
      );
      setVideoSource(videoUrl);
      setShowResult(true); // Set showResult to true after successfully fetching the data
    } catch (error) {
      console.error("Error generating video:", error);
    } finally {
      setLoading(false);
    }
  };

  //   const handleGenerateClick = () => {
  //     setInputText("");
  //     setLoading(true);
  //     setGreetAndCardsVisible(false);

  //     // Simulate an asynchronous operation (like fetching data) using setTimeout
  //     setTimeout(() => {
  //       setLoading(false);
  //       setGreetAndCardsVisible(true);
  //     }, 3000); // Replace 2000 with your desired loading duration
  //   };

  const handleStopClick = () => {
    setStopGeneration(true); // Set stop flag to true
    setLoading(false); // Stop loading immediately
    // Additional logic to handle stopping the generation process as needed
  };

  const { user } = useUser(); // Now also getting the user object

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

  return (
    <div className="main">
      <Nav />

      {/* Main container */}

      <div className="main-container">
        <div>
          <div className="greet">
            <p>
              <span>Hello, {user?.firstName || ""}</span>
            </p>
            <p>
              <span className="low">Ready to translate?</span>
            </p>
          </div>
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
        </div>
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
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger>
                        <img src={stopImage} alt="" onClick={handleStopClick} />
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Stop</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>

                  {/* <Icons.spinner className="animate-spin h-6 w-6" /> */}
                </>
              ) : (
                <>
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger>
                        <img src={buttonImage} alt="" />
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Send Message</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </>
              )}
            </Button>
          </div>
          <p className="bottom-info dark:text-[#cacaca]">
            SignToRead is a simple and easy way to convert English to Pakistani
            Sign Language Videos
          </p>
        </div>
      </div>
      {showResult && (
        <div className="">
          <div className="video-container">
            {loading ? (
              // Loading indicator (e.g., spinner) while the server is processing the video merge

              <img src="/play-bg.gif" alt="Loading" className="loader mt-20" />
            ) : showResult && videoSource ? (
              // Render the video player with the merged video source
              <video
                src={videoSource}
                autoPlay
                controls
                className="video-element"
              ></video>
            ) : (
              // Placeholder or message when no video is available
              <img
                src="/play.png"
                alt="Video will be displayed here"
                className="w-32 h-32"
              />
            )}
          </div>
        </div>
      )}
      {/* {loading && (
        <div className="loader-container">
          <Loader />
        </div>
      )} */}
    </div>
  );
};

export default Main2;
