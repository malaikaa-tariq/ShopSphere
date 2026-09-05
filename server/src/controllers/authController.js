import bcrypt from "bcryptjs";
import User from "../models/User.js";
import { signToken } from "../utils/token.js";

const emailRegex =
  /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function register(req, res) {
  try {
    const {
      name,
      email,
      password,
      role = "buyer",
    } = req.body;

    if (!name || name.trim().length < 2) {
      return res.status(400).json({
        message:
          "Name must contain at least 2 characters.",
      });
    }

    if (!emailRegex.test(String(email))) {
      return res.status(400).json({
        message: "Please enter a valid email.",
      });
    }

    if (!password || password.length < 8) {
      return res.status(400).json({
        message:
          "Password must contain at least 8 characters.",
      });
    }

    if (!["buyer", "seller"].includes(role)) {
      return res.status(400).json({
        message:
          "Public registration supports buyer or seller only.",
      });
    }

    const normalizedEmail =
      String(email).trim().toLowerCase();

    const exists = await User.findOne({
      email: normalizedEmail,
    });

    if (exists) {
      return res.status(409).json({
        message:
          "An account with this email already exists.",
      });
    }

    const hashedPassword =
      await bcrypt.hash(password, 12);

    const user = await User.create({
      name: name.trim(),
      email: normalizedEmail,
      password: hashedPassword,
      role,
    });

    return res.status(201).json({
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },

      token: signToken(user),
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      message: "Registration failed.",
    });
  }
}

export async function login(req, res) {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        message: "Email and password are required.",
      });
    }

    const user = await User.findOne({
      email: String(email)
        .trim()
        .toLowerCase(),
    }).select("+password");

    if (!user) {
      return res.status(401).json({
        message: "Invalid email or password.",
      });
    }

    const valid = await bcrypt.compare(
      password,
      user.password
    );

    if (!valid) {
      return res.status(401).json({
        message: "Invalid email or password.",
      });
    }

    return res.json({
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },

      token: signToken(user),
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      message: "Login failed.",
    });
  }
}

export async function me(req, res) {
  return res.json({
    user: req.user,
  });
}