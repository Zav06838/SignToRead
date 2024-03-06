import { useState } from "react";
import { Link } from "react-router-dom";
import { FaBars } from "react-icons/fa";
import { ImCross } from "react-icons/im";

import "./navbar.css";

const Navbar = () => {
  const [mobile, setMobile] = useState(false);

  return (
    <>
      <nav className="navbar ">
        <h3 className="logo sm: m-4">SignToRead</h3>

        <ul
          className={mobile ? "nav-links-mobile" : "nav-links"}
          onClick={() => setMobile(false)}
        >
          <Link to="/" className="home">
            <li>Home</li>
          </Link>
          {/* <Link to="/gloss" className="about">
            <li>Gloss</li>
          </Link> */}
          <Link to="/history" className="about">
            <li>History</li>
          </Link>
          <Link to="/login" className="home">
            <li>Login</li>
          </Link>
        </ul>
          <button
            className="mobile-menu-icon"
            onClick={() => setMobile(!mobile)}
          >
            {mobile ? <ImCross /> : <FaBars />}
          </button>
      </nav>
    </>
  );
};

export default Navbar;
