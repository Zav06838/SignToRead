const People = require("../models/userModel");
const jwt = require("jsonwebtoken");

const createToken = (_id) => {
  return jwt.sign({ _id }, process.env.JWT_SECRET, { expiresIn: "1d" });
};

// login a user
// const loginUser = async (req, res) => {
//   const { email, password } = req.body;

//   try {
//     const user = await People.login(email, password);

//     // create a token
//     const token = createToken(user._id);

//     res.status(200).json({ email, token });
//   } catch (error) {
//     res.status(400).json({ error: error.message });
//   }
// };

const LoginUser = async (req, res) => {
  try {
    let token;
    const { email, password } = req.body;

    console.log(email);
    console.log(password);

    if (!email || !password) {
      return res.status(400).json({ error: "Please fill the data" });
    }

    const userLogin = await User.findOne({ email });
    if (userLogin) {
      const isMatch = await bcrypt.compare(password, userLogin.password);

      token = await userLogin.generateAuthToken();
      console.log(token);

      res.cookie("jwtoken", token, {
        expires: new Date(Date.now() + 25892000000),
        httpOnly: true,
      });

      if (!isMatch) {
        res.status(400).json({ error: "Invalid credentials pass" });
      } else {
        res.json({ message: "Login success" });
        res.set("Access-Control-Allow-Origin", "http://127.0.0.1:5173");
        res.set("Access-Control-Allow-Credentials", "true");
      }
    } else {
      res.status(400).json({ error: "Inavalid Credentials" });
    }
  } catch (err) {
    console.log(err);
  }
};

const RegisterUser = async (req, res) => {
  const { email, password } = req.body;
  //   console.log(name);
  //   console.log(email);

  if (!email || !password) {
    return res.status(422).json({ error: "Please fill the field properly" });
  }
  try {
    const userExist = await User.findOne({ email: email });
    if (userExist) {
      return res.status(422).json({ error: "Email already exist" });
    } else {
      const user = new User({ email, password });
      await user.save();
      res.status(201).json({ message: "User registered successfully" });
    }
  } catch (err) {
    console.log(err);
  }
};

// signup a user
// const signupUser = async (req, res) => {
//   const { email, password } = req.body;

//   try {
//     const user = await People.signup(email, password);

//     // create a token
//     const token = createToken(user._id);

//     res.status(200).json({ email, token });
//   } catch (error) {
//     res.status(400).json({ error: error.message });
//   }
// };

module.exports = { RegisterUser, LoginUser };
// module.exports = { signupUser, loginUser };
