import "./App.css";
import { Routes, Route, useNavigate } from "react-router-dom";
import Login1 from "./pages/Login";
import Signup from "./pages/Signup";
import Video from "./views/Video";
import Hero from "./views/hero/Hero";
import Main from "./views/Main/Main";
import { ClerkProvider, RedirectToSignIn, useUser } from "@clerk/clerk-react";
import SignInPage from "./pages/sign-in";
import HistoryPage from "./views/history/HistoryPage";
import Main2 from "./views/Main2/Main2";
// import Nav from "./pages/Nav";
// import HistoryDisplay from "./pages/History";
// import Navbar from "./components/navbar";
// import Validate from "./pages/validate";
// import Gloss from "./pages/Gloss";
// import TextToGloss from "./pages/TextToGloss";
// import TextToGloss2 from "./pages/textToGloss2";
// import TextToGloss3 from "./pages/text2gloss3";
// import VideoModel from "./views/VideoModel";

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
        {/* Main routes */}
        <Route path="/" element={<Hero />} />
        <Route path="/main" element={<Main />} />
        <Route path="/main2" element={<Main2 />} />
        <Route path="/v" element={<Video />} />

        {/* Login & Signup */}
        <Route path="/sign-in" element={<SignInPage />} />
        <Route path="/login" element={<Login1 />} />
        <Route path="/register" element={<Signup />} />

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
