import { useState } from "react";
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
import { useUser } from "@clerk/clerk-react";
import Nav from "@/pages/Nav";
import { useTheme } from "@/components/theme-provider";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

const Main = () => {
  const [inputText, setInputText] = useState("");
  const [showResult, setShowResult] = useState(false);
  const [greetAndCardsVisible, setGreetAndCardsVisible] = useState(true);
  const [videoSource, setVideoSource] = useState("");
  const [loading, setLoading] = useState(false);
  const [glossText, setGlossText] = useState("");
  const [showCardsLoader, setShowCardsLoader] = useState(false);
  const [stopGeneration, setStopGeneration] = useState(false);

  const dispatch = useDispatch();

  const { theme } = useTheme();

  const buttonImage = theme === "dark" ? send : send2;
  const penImage = theme === "dark" ? pen : pen2;
  const ideaImage = theme === "dark" ? bulb_icon : bulb_icon2;
  const stopImage = theme === "dark" ? stop : stop2;
  const loaderColor = theme === "dark" ? "bg-[#1e1f20]" : "bg-slate-300";

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

  const handleCardClick = (text) => {
    setInputText(text);
  };

  const handleStopClick = () => {
    setStopGeneration(true);
    setLoading(false);
  };

  const handleGenerateClick = async () => {
    setInputText("");
    setLoading(true);
    setShowCardsLoader(true);
    setGreetAndCardsVisible(false);
    setStopGeneration(false); // Reset stopGeneration flag

    console.log("showCardsLoader before API request:", showCardsLoader);

    try {
      const modelResponse = await axios.post(
        // "http://119.63.132.178:5001/translate",
        "/translate",
        { text: inputText }
      );

      // Check stopGeneration flag before continuing
      if (stopGeneration) {
        setLoading(false);
        return;
      }

      const glossText = modelResponse.data.gloss;
      setGlossText(glossText);

      let words = glossText.split(" ");
      words = words.filter((word) => word.trim()); // Remove empty strings

      const wordPromises = words.map(async (word) => {
        try {
          const signResponse = await axios.post(
            // "http://119.63.132.178:5000/get_sign",
            "/get_sign",
            { word: word, sentence: inputText }
          );

          if (signResponse.data && signResponse.data.sign) {
            return signResponse.data.sign;
          } else {
            return word; // Use the original word if no update is found
          }
        } catch (error) {
          console.error("Error fetching sign for word:", error);
          return word; // Use the original word in case of error
        }
      });

      const updatedWords = await Promise.all(wordPromises);

      console.log("updatedWords:", updatedWords);

      const response = await axios.post(
        "http://localhost:3000/merge-videos",
        { words: updatedWords },
        { responseType: "blob" }
      );

      if (response.data) {
        const videoBlobUrl = URL.createObjectURL(response.data);
        setVideoSource(videoBlobUrl);
        setShowResult(true);
        setShowCardsLoader(false);

        dispatch(
          addHistoryItems({
            input: inputText,
            output: updatedWords.join(" "),
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
      console.log("showCardsLoader after API request:", showCardsLoader);
    }
  };

  // const handleGenerateClick = async () => {
  //   setInputText("");
  //   setLoading(true);
  //   setShowCardsLoader(true);
  //   setGreetAndCardsVisible(false);
  //   setStopGeneration(false); // Reset stopGeneration flag

  //   console.log("showCardsLoader before API request:", showCardsLoader);

  //   try {
  //     const modelResponse = await axios.post(
  //       "http://119.63.132.178:5001/translate",
  //       { text: inputText }
  //     );

  //     // Check stopGeneration flag before continuing
  //     if (stopGeneration) {
  //       setLoading(false);
  //       return;
  //     }

  //     const glossText = modelResponse.data.gloss;
  //     setGlossText(glossText);

  //     const words = glossText.split(" ");

  //     const response = await axios.post(
  //       "http://localhost:3000/merge-videos",
  //       { words },
  //       { responseType: "blob" }
  //     );

  //     // Check stopGeneration flag before continuing
  //     if (stopGeneration) {
  //       setLoading(false);
  //       return;
  //     }

  //     if (response.data) {
  //       const videoBlobUrl = URL.createObjectURL(response.data);
  //       setVideoSource(videoBlobUrl);
  //       setShowResult(true);
  //       setShowCardsLoader(false);

  //       dispatch(
  //         addHistoryItems({
  //           input: inputText,
  //           output: words.join(" "),
  //           video: videoBlobUrl,
  //         })
  //       );
  //     } else {
  //       toast.error("No video found for this text.");
  //     }
  //   } catch (error) {
  //     console.error("Error generating video:", error);
  //     toast.error("Error generating video.");
  //   } finally {
  //     setLoading(false);
  //     console.log("showCardsLoader after API request:", showCardsLoader);
  //   }
  // };

  const { user } = useUser();

  return (
    <div className="main">
      <Nav />
      <div className="main-container">
        {greetAndCardsVisible && (
          <div>
            <div className="greet">
              <p>
                <span>
                  Hello,{" "}
                  {user?.firstName ||
                    (user?.username
                      ? user.username[0].toUpperCase() + user.username.slice(1)
                      : "")}
                </span>
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
        )}

        <div className="main-bottom">
          <div className="search-box bg-slate-200 dark:bg-[#1e1f20] focus-within:bg-slate-300 dark:focus-within:bg-white dark:focus-within:bg-opacity-20 p-2 rounded-xl">
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
              className="text-[#1e1f20] dark:text-[#ffff] placeholder-slate-600 dark:placeholder-[#cacaca] w-full"
            />
            <Button
              onClick={loading ? handleStopClick : handleGenerateClick}
              disabled={inputText || loading ? false : true}
              className="text-white rounded-xl p-2 bg-transparent transition duration-300 transform hover:scale-105 hover:bg-transparent ml-2"
            >
              {loading ? (
                <>
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
            Sign Language Videos.
          </p>
        </div>

        {loading && showCardsLoader && (
          <div className="video-container">
            <div className="flex flex-col justify-center items-center">
              <div className="w-full lg:w-[600px]">
                <div className="flex flex-col space-y-3">
                  <Skeleton className={`h-8 w-[300px] ${loaderColor}`} />
                  <Skeleton className={`h-[330px] rounded-xl ${loaderColor}`} />
                </div>
              </div>
            </div>
          </div>
        )}

        {!loading && showResult && (
          <div className="video-container">
            <div className="flex flex-col justify-center items-center">
              <div className="w-full lg:w-[600px]">
                <p className="gloss-text text-[#1e1f20] dark:text-[#ffffff] text-xl mb-2">
                  <span className="gloss1">Gloss: </span>
                  {glossText}
                </p>
                <video src={videoSource} autoPlay controls></video>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Main;
