import "./App.css";
import { Routes, Route } from "react-router-dom";

import Login from "./pages/login";
import Navbar from "./components/navbar";
import Validate from "./pages/validate";
import Register from "./pages/register";
import Gloss from "./pages/Gloss";
import TextToGloss from "./pages/TextToGloss";
import TextToGloss2 from "./pages/textToGloss2";

function App() {
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/1" element={<TextToGloss />} />
        <Route path="/" element={<TextToGloss2 />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/gloss" element={<Gloss />} />
        <Route path="/validate" element={<Validate />} />
      </Routes>
    </>
  );
}

export default App;
