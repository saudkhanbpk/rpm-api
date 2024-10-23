import User from "../models/User.js";
import {
  comparePassword,
  generateAccessToken,
  generateRefreshToken,
  hashPassword,
} from "../utils/authUtils.js";

export const registerController = async (req, res) => {
  const { username, email, phoneNumber, password } = req.body;
  console.log({ username, email, phoneNumber, password });

  try {
    // Check if the user already exists by email or username
    let user = await User.findOne({ $or: [{ email }, { username }] });
    if (user) {
      return res
        .status(400)
        .json({ message: "User already exists with this email or username" });
    }

    // Create new user instance
    user = new User({
      username,
      email,
      phoneNumber,
      password,
    });

    //   const salt = await bcrypt.genSalt(10);
    user.password = await hashPassword(password);

    // Save user to the database
    await user.save();

    return res.status(201).json({ message: "User registered successfully" });
  } catch (error) {
    console.error(error.message);
    return res.status(500).send("Server error");
  }
};

export const loginController = async (req, res) => {
  const { email, password } = req.body;

  try {
    // Check if user exists
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    // Check if password is correct
    const isMatch = await comparePassword(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    // Generate access token (expires in 15 minutes)
    const accessToken = generateAccessToken(user?.id);
    // Generate refresh token (expires in 7 days)
    const refreshToken = generateRefreshToken(user?.id);

    // Optional: Save refresh token to the user's record in the database if you want to track it
    user.refreshToken = refreshToken;
    const result = await user.save();
    console.log({ user });

    // Send access and refresh tokens to the client
    res.status(200).json({ accessToken, refreshToken });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};
