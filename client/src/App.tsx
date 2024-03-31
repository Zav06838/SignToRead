import "./App.css";

// @ts-ignore: Ignore TypeScript warnings for unused imports or variables
import { Routes, Route, useNavigate } from "react-router-dom";
import { ClerkProvider, RedirectToSignIn, useUser } from "@clerk/clerk-react";

import Login from "./pages/LoginPage";
import Signup from "./pages/Signup";
import Video from "./views/Video";
import Hero from "./views/hero/Hero";
import Main from "./views/Main/Main";
import SignInPage from "./pages/sign-in";
import HistoryPage from "./views/history/HistoryPage";
import Main2 from "./views/Main2/Main2";
// import Nav from "./pages/Nav";
// import Navbar from "./components/navbar";

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
        <Route path="/login" element={<Login />} />
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
