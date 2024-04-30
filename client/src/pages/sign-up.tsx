import { SignUp } from "@clerk/clerk-react";
import Nav from "./Nav";

export default function SignUpPage() {
  return (
    <div className="main">
      <Nav />
      <div className="flex justify-center items-center w-full">
        {/* <SignIn afterSignInUrl="/" /> */}
        <div className="w-full max-w-md">
          <SignUp
            path="/sign-up"
            routing="path"
            signInUrl="/sign-in"
            afterSignUpUrl="/sign-in"
          />
        </div>
      </div>
    </div>
  );
}
