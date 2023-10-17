// Lets do something more useful than just destroying Cookie XD
// Implement Extra Checks/Policies according to Role of User
// Role Based Access Control defined here

import jwt from "jsonwebtoken"; // we need Payload (userID) from this cookie
import asyncHandler from "express-async-handler";
import User from "../models/userModel.js";

// next is used for Middleware (it sends request to Middleware)
const protect = asyncHandler(async (req, res, next) => {
  let token;

  token = req.cookies.jwt;

  if (token) {
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      req.user = await User.findById(decoded.userId).select("-password");

      next(); // sab set he, ab jaane do aagay XD
    } catch (error) {
      res.status(401);
      throw new Error("Not Authorized : Invalid Token");
    }
  } else {
    res.status(401);
    throw new Error("Not Authorized : No Token Found");
  }
});

export { protect };
