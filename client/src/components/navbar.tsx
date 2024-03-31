import { useState } from "react";
import { Link } from "react-router-dom";
import { FaBars } from "react-icons/fa";
import { ImCross } from "react-icons/im";
import { UserButton, useUser, useClerk } from "@clerk/clerk-react";

import "./navbar.css";

const Navbar = () => {
  const [mobile, setMobile] = useState(false);
  const { isSignedIn } = useUser();
  // const navigate = useNavigate();
  const { openSignIn } = useClerk(); // Use useClerk to access Clerk's API

  const handleLoginClick = () => {
    // Use Clerk's API to navigate to the sign-in page
    openSignIn({
      // After successful sign-in, stay on the current page or navigate as needed
      // For redirecting to a specific path after sign-in, you can use the following:
      afterSignInUrl: '/main'
    });
  };

  return (
    <>
      <nav className="navbar">
        <h3 className="logo sm: m-4">
          <Link to="/" className="home">
            SignToRead
          </Link>
        </h3>

        <ul
          className={mobile ? "nav-links-mobile" : "nav-links"}
          onClick={() => setMobile(false)}
        >
          <Link to="/main" className="home">
            <li>Home</li>
          </Link>
          <Link to="/history" className="about">
            <li>History</li>
          </Link>
          {isSignedIn ? (
            <li>
              <UserButton afterSignOutUrl="/main" />
            </li>
          ) : (
            // Adjust this part for handling login redirection
            <li onClick={handleLoginClick} className="home">
              Login
            </li>
          )}
        </ul>
        <button className="mobile-menu-icon" onClick={() => setMobile(!mobile)}>
          {mobile ? <ImCross /> : <FaBars />}
        </button>
      </nav>
    </>
  );
};

export default Navbar;
