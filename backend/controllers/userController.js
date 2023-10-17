import asyncHandler from "express-async-handler";
import User from "../models/userModel.js";
import generateToken from "../utils/genToken.js";

// Function to Execute for "User Register" POST /api/users
const registerUser = asyncHandler(async (req, res) => {
  // const recievedData = req.body;
  // console.log(recievedData);

  const { name, email, password } = req.body;

  const UserExists = await User.findOne({ email });

  if (UserExists) {
    res.status(400); // Client Error
    throw new Error("User Already Exists : Sign-In instead");
  }

  const user = await User.create({
    name,
    email,
    password,
  });

  if (user) {
    generateToken(res, user._id);
    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
    });
  } else {
    res.status(400);
    throw new Error("Invalid User Data : Couldn't Register");
  }

  // res.status(200).json({
  //   message: "Hey, User Register from USER CONTROLLER ",
  // });
});

// Function to Execute for "User Auth" POST /api/users/auth
const authUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });
  // Compare plain text entered password with Salted Hash Password
  if (user && (await user.matchPasswords(password))) {
    generateToken(res, user._id);
    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
    });
  } else {
    res.status(401);
    throw new Error("Invalid Email or Password, You are unAuthorized");
  }

  // res.status(200).json({ message: "Hey, User Auth from USER CONTROLLER " });
});

// Function to Execute for "User Logout" POST /api/users/logout
const logoutUser = asyncHandler(async (req, res) => {
  // Simply destroy the Cookie named (jwt)

  res.cookie("jwt", "", {
    httpOnly: true,
    expires: new Date(0),
  });

  res.status(200).json({ message: "Success, User Logged Out " });
});
// Function to Execute for "User Profile Details" GET /api/users/profile :: PRIVATE
const getUserProfile = asyncHandler(async (req, res) => {
  // we have access to "user object" {The Created User in DB} through req.user
  // if we wonna show user orders to that logged in user, we can do it

  // this console.log is giving entire data of user object from Database
  const userData = req.user;
  // lets define for what we wonna provide,

  if (userData) {
    const user = {
      _id: userData._id,
      name: userData.name,
      email: userData.email,
    };

    res.status(200).json(user); // lets pass user data instead of that boring JSON Message
  } else {
    res.status(404);
    throw new Error("Read : User Doesn't Exist");
  }
});

// Function to Execute for "User Profile Update" PUT /api/users/profile :: PRIVATE
const updateUserProfile = asyncHandler(async (req, res) => {
  // This is only Allowed If User is already Logged in

  const user = await User.findById(req.user._id);
  const updatedPassword = req.body.password;
  if (user) {
    user.name = req.body.name || user.name;
    user.email = req.body.email || user.email;

    if (updatedPassword) {
      user.password = updatedPassword;
    }

    const updatedUser = await user.save();

    res.status(200).json({
      _id: updatedUser._id,
      name: updatedUser.name,
      email: updatedUser.email,
    });
  } else {
    res.status(404);
    throw new Error("User Not Found, Can't Update Info");
  }
});
const removeUserProfile = asyncHandler(async (req, res) => {
  // This is only Allowed If User is already Logged in

  const userID = req.user._id;

  const user = await User.findById(userID);

  if (user) {
    user.deleteOne({ _id: userID });

    res.status(204).json({
      message: "User Profile Deleted Successfully",
    });
  } else {
    res.status(404);
    throw new Error("User Doesn't Exist : Can't Delete");
  }
});

export {
  authUser,
  registerUser,
  logoutUser,
  getUserProfile,
  updateUserProfile,
  removeUserProfile,
};
