import { useState } from "react";
import { useNavigate } from "react-router-dom";
// import { useLogin } from "../components/useLogin";
import Psl from "../../public/psl.png";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
// import axios from "axios";

const LoginPage = () => {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  //   const { login, isLoading, error } = useLogin();
  const [isLoading, setIsLoading] = useState(false);

  const [error, setError] = useState("");

  const handleSubmit = async (e: { preventDefault: () => void }) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      // Replace with your actual login API endpoint
      // const response = await axios.post(
      //   "http://localhost:3000/api/users/login",
      //   {
      //     email,
      //     password,
      //   }
      // );

      // Handle response here. For example, save the token and redirect.
      // console.log(response.data);
      navigate("/"); // Redirect to home on successful login
    } catch (err) {
      setError("Failed to log in. Please check your credentials.");
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleClick = () => {
    navigate("/register");
  };

  return (
    <>
      <section className=" min-h-screen flex items-center justify-center">
        {/* <!-- login container --> */}
        <div className="bg-white flex rounded-2xl shadow-lg max-w-4xl p-5 items-center">
          {/* <!-- form --> */}
          <div className="md:w-1/2 px-8 md:px-16">
            <h2 className="font-bold text-3xl mt-2 text-[#002D74]">
              SignToRead.
            </h2>

            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              <Input
                className="p-2 mt-8 rounded-xl border "
                type="email"
                onChange={(e) => setEmail(e.target.value)}
                value={email}
                placeholder="Email"
              />
              <Input
                className="p-2 rounded-xl border w-full"
                type="password"
                onChange={(e) => setPassword(e.target.value)}
                value={password}
                placeholder="Password"
              />

              <Button
                type="submit"
                className=" rounded-xl py-2 hover:scale-105 duration-300 bg-[#6074BC] hover:bg-[#3f62c4]"
              >
                Login
              </Button>
              {/* {error && <div className="error">{error}</div>} */}
            </form>
            {isLoading && <p>Loading...</p>}
            {error && <p className="text-red-500 text-sm mt-2">{error}</p>}

            <div className="mt-6 grid grid-cols-3 items-center text-gray-400">
              <hr className="border-gray-400" />
              <p className="text-center text-sm">OR</p>
              <hr className="border-gray-400" />
            </div>

            <div className="mt-3 text-sm flex justify-between items-center text-[#002D74] space-x-1">
              <p>Don't have an account?</p>
              <button
                onClick={handleClick}
                className="py-2 px-5 bg-white border shadow-md rounded-xl hover:scale-110 duration-300"
              >
                Register
              </button>
            </div>
          </div>

          {/* <!-- image --> */}
          <div className="md:block hidden w-1/2 ">
            <img className="rounded-2xl" src={Psl} />
          </div>
        </div>
      </section>
    </>
  );
};

export default LoginPage;
