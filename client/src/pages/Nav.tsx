import { useState } from "react";
import { ModeToggle } from "@/components/mode-toggle";
import { UserButton, useUser } from "@clerk/clerk-react";
import { Link, NavLink } from "react-router-dom";

const Nav = () => {
  const { isSignedIn } = useUser();
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className="nav ">
      {!isOpen && (
        <NavLink to="/home" className="home">
          <p className="ml-8 ">SignToRead</p>
        </NavLink>
      )}

      <div className="md:hidden flex items-center">
        <button
          onClick={toggleMenu}
          className="text-gray-500 ml-auto mr-4 focus:outline-none focus:text-gray-900"
        >
          <svg
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            {isOpen ? (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            ) : (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6h16M4 12h16m-7 6h7"
              />
            )}
          </svg>
        </button>
      </div>

      <ul
        className={`${
          isOpen ? "flex flex-col items-center justify-center" : "hidden"
        } md:flex flex-col md:flex-row gap-10 mr-8 mt-2 md:mt-0 w-full md:w-auto`}
      >
        <li>
          <NavLink to="/">Home</NavLink>
        </li>
        <li>
          <NavLink to="/history">History</NavLink>
        </li>
        <li className="mt-[-4px]">
          <ModeToggle />
        </li>
        {isSignedIn ? (
          <li className="text-slate-100">
            <UserButton afterSignOutUrl="/" />
          </li>
        ) : (
          <li>
            <Link to="/sign-in">Login</Link>
          </li>
        )}
      </ul>
    </div>
  );
};

export default Nav;
