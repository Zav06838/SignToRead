import { ModeToggle } from '@/components/mode-toggle';
import { UserButton, useUser } from '@clerk/clerk-react';
import { Link, NavLink } from 'react-router-dom';

const Nav = () => {
  const { isSignedIn } = useUser(); // Now also getting the user object
  // const { openSignIn } = useClerk(); // Use useClerk hook to access Clerk functions

  // const handleLoginClick = () => {
  //   openSignIn(); // Directly opens Clerk's sign-in modal
  // };

  return (
    <div className="nav ">
      <NavLink to="/home" className="home">
        <p className="ml-8 ">SignToRead</p>
      </NavLink>

      <ul className="flex gap-10 mr-8 mt-2">
        <li>
          <NavLink
            to="/"
            className={({ isActive }) => (isActive ? "underline" : "")}
          >
            Home
          </NavLink>
        </li>
        <li>
          <NavLink
            to="/history"
            className={({ isActive }) => (isActive ? "underline" : "")}
          >
            History
          </NavLink>
        </li>
        <li className="mt-[-4px]">
          <ModeToggle />
        </li>

        {!isSignedIn ? (
          <li>
            {/* Clerk handles login redirection, no need for onClick handler here */}
            <Link to="/sign-in" className="">
              Login
            </Link>
          </li>
        ) : (
          <li className="text-slate-100">
            <UserButton afterSignOutUrl="/" />
          </li>
        )}
      </ul>
    </div>
  );
};

export default Nav;
