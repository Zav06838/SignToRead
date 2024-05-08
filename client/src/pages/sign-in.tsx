import { SignIn } from "@clerk/clerk-react";
import Nav from "./Nav";
import "../views/Main/Main.css";

export default function SignInPage() {
  return (
    <div className="main">
      <Nav />
      <div className="flex justify-center items-center mt-10">
        <div className="w-full max-w-md">
          <SignIn redirectUrl="/" signUpUrl="/sign-up" />
        </div>
      </div>
    </div>
  );
}
