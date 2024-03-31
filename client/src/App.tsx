import "./App.css";
import { Routes, Route, useNavigate } from "react-router-dom";
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
import Main from "./views/Main/Main";
import { ClerkProvider, RedirectToSignIn, useUser } from "@clerk/clerk-react";
import SignInPage from "./pages/sign-in";
import Nav from "./pages/Nav";
import HistoryPage from "./views/HistoryPage";
import Main2 from "./views/Main2";

const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;

if (!PUBLISHABLE_KEY) {
  throw new Error("Missing Publishable Key");
}

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { isSignedIn } = useUser();
  return isSignedIn ? children : <RedirectToSignIn />;
}

function App() {
  const navigate = useNavigate();

  return (
    <ClerkProvider
      publishableKey={PUBLISHABLE_KEY}
      navigate={(to) => navigate(to)}
    >
      {/* <Navbar /> */}

      <Routes>
        {/* Other routes */}
        <Route path="/2" element={<TextToGloss3 />} />
        <Route path="/1" element={<TextToGloss2 />} />
        <Route path="/login" element={<Login1 />} />
        <Route path="/register" element={<Signup />} />
        <Route path="/gloss" element={<Gloss />} />
        <Route path="/validate" element={<Validate />} />
        <Route path="/vid" element={<VideoModel />} />
        <Route path="/video" element={<TextToGloss />} />

        <Route path="/" element={<Hero />} />
        <Route path="/v" element={<Video />} />
        <Route path="/main" element={<Main />} />
        <Route path="/main2" element={<Main2 />} />
        <Route path="/sign-in" element={<SignInPage />} />
        <Route path="/h" element={<HistoryDisplay />} />
        {/* Protected route */}
        <Route
          path="/history"
          element={
            <ProtectedRoute>
              <HistoryPage />
            </ProtectedRoute>
          }
        />
      </Routes>
    </ClerkProvider>
  );
}

export default App;
