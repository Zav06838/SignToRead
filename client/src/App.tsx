import "./App.css";
import { Routes, Route } from "react-router-dom";

import Login from "./pages/login";
import Navbar from "./components/navbar";
import Validate from "./pages/validate";
import Register from "./pages/register";
import Gloss from "./pages/Gloss";
import TextToGloss from "./pages/TextToGloss";

function App() {
  return (
    <>
      <Navbar />

      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/gloss" element={<Gloss />} />
        <Route path="/validate" element={<Validate />} />
        <Route path="/" element={<TextToGloss />} />
      </Routes>
    </>
  );
}

export default App;
