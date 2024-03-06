import "./App.css";
import { Routes, Route } from "react-router-dom";

// import Login from "./pages/login";
import Navbar from "./components/navbar";
import Validate from "./pages/validate";
import Gloss from "./pages/Gloss";
import TextToGloss from "./pages/TextToGloss";
import TextToGloss2 from "./pages/textToGloss2";
import TextToGloss3 from "./pages/text2gloss3";
import Login1 from "./pages/Login";
import Signup from "./pages/Signup";
import HistoryDisplay from "./pages/History";
import Video from "./views/Video";
import VideoModel from "./views/VideoModel";
import Hero from "./views/hero/Hero";
// import Navbar from "./views/navbar/Navbar";

function App() {
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<Hero />} />

        <Route path="/2" element={<TextToGloss3 />} />
        <Route path="/1" element={<TextToGloss2 />} />
        <Route path="/login" element={<Login1 />} />
        <Route path="/register" element={<Signup />} />
        <Route path="/gloss" element={<Gloss />} />
        <Route path="/validate" element={<Validate />} />
        <Route path="/history" element={<HistoryDisplay />} />
        {/* below is the main code file */}
        <Route path="/v" element={<Video />} />
        {/*  */}
        <Route path="/vid" element={<VideoModel />} />
        <Route path="/video" element={<TextToGloss />} />
      </Routes>
    </>
  );
}

export default App;
