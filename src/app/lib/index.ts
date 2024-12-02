import generateToken from "./generateToken";
import pick from "./pick";
import prisma from "./prisma";
import verifyToken from "./verifyToken";

// JWT configuration
const options = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: process.env.NODE_ENV === "production" ? "none" : "strict",
  maxAge: 365 * 24 * 60 * 60 * 1000,
};

export { generateToken, options, pick, prisma, verifyToken };
