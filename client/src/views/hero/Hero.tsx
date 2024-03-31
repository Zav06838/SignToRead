import { motion, Variants } from "framer-motion";
// import PSL from "../../assets/PSL.png";
import PSL1 from "../../assets/deaf.png";
import "./hero.scss";
import { useNavigate } from "react-router-dom";

interface TextVariants extends Variants {
  scrollButton: {
    opacity: number;
    y: number;
    transition: {
      duration: number;
      repeat: number;
    };
  };
}

interface SliderVariants extends Variants {
  animate: {
    x: string;
    transition: {
      repeat: number;
      duration: number;
      repeatType: "loop" | "reverse" | "mirror" | undefined;
    };
  };
}

const textVariants: TextVariants = {
  initial: {
    x: -500,
    opacity: 0,
  },
  animate: {
    x: 0,
    opacity: 1,
    transition: {
      duration: 1,
      staggerChildren: 0.1,
    },
  },
  scrollButton: {
    opacity: 0,
    y: 10,
    transition: {
      duration: 2,
      repeat: Infinity,
    },
  },
};

const sliderVariants: SliderVariants = {
  initial: {
    x: 0,
  },
  animate: {
    x: "-560%",
    transition: {
      repeat: Infinity,
      duration: 25,
      repeatType: "mirror",
    },
  },
};

function Hero() {
  const navigate = useNavigate(); // Initialize useNavigate hook

  const homeClick = () => {
    navigate("/main");
  };
  return (
    <div className="hero">
      <div className="wrapper">
        <div className="content">
          <motion.div
            className="textContainer"
            variants={textVariants}
            initial="initial"
            animate="animate"
          >
            <motion.h2 variants={textVariants}>SignToRead</motion.h2>
            <motion.h1 variants={textVariants}>
              Translate Your Text to Sign Language Videos.
            </motion.h1>
            <motion.div variants={textVariants} className="buttons">
              <motion.button variants={textVariants} onClick={homeClick}>
                Get Started
              </motion.button>
            </motion.div>
          </motion.div>
          <div className="imageContainer">
            <img src={PSL1} alt="" />
          </div>
        </div>
      </div>
      <motion.div
        className="slidingTextContainer"
        variants={sliderVariants}
        initial="initial"
        animate="animate"
      >
        PSL . GLOSS . TRANSLATE . SIGN
      </motion.div>
    </div>
  );
}

export default Hero;
