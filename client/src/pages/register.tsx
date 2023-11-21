import { useState } from "react";
import { useNavigate } from "react-router-dom";
// import { useLogin } from "../components/useLogin";
import Psl from "../../public/psl.png";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const Register = () => {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  //   const { login, isLoading, error } = useLogin();

  const handleSubmit = async () => {
    // e.preventDefault();
    // console.log(userType);
    // await login(email, password, userType);
  };

  const handleClick = () => {
    navigate("/");
  };

  return (
    <>
      <section className=" min-h-screen flex items-center justify-center">
        {/* <!-- login container --> */}
        <div className="bg-white flex rounded-2xl shadow-lg max-w-3xl p-5 items-center">
          {/* <!-- form --> */}
          <div className="md:w-1/2 px-8 md:px-16">
            <h2 className="font-bold text-3xl mt-2 text-primary">
              SignToRead.
            </h2>
            {/* <p className="text-xs mt-1 text-[#002D74]">
              Cheap. Reliable. Efficient.
            </p> */}

            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              <Input
                className="p-2 mt-8 rounded-xl border"
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

              <Button className=" rounded-xl py-2 hover:scale-105 duration-300">
                Register
              </Button>
              {/* {error && <div className="error">{error}</div>} */}
            </form>

            <div className="mt-6 grid grid-cols-3 items-center text-gray-400">
              <hr className="border-gray-400" />
              <p className="text-center text-sm">OR</p>
              <hr className="border-gray-400" />
            </div>

            <div className="mt-3 text-xs flex justify-between items-center text-primary space-x-1">
              <p>Already have an account?</p>
              <button
                onClick={handleClick}
                className="py-2 px-5 bg-white border shadow-md rounded-xl hover:scale-110 duration-300"
              >
                Login
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

export default Register;
