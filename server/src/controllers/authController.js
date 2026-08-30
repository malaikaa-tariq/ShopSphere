import bcrypt from "bcryptjs";
import User from "../models/User.js";
import { signToken } from "../utils/token.js";

export async function register(req, res) {
  const { name, email, password, role = "buyer" } = req.body;
  if (!name || !email || !password) return res.status(400).json({ message: "Name, email and password are required" });
  if (!["buyer", "seller"].includes(role)) return res.status(400).json({ message: "Invalid public role" });

  const exists = await User.findOne({ email });
  if (exists) return res.status(409).json({ message: "Email already registered" });

  const user = await User.create({
    name, email, role,
    password: await bcrypt.hash(password, 12)
  });
  res.status(201).json({ user: { id: user._id, name: user.name, email: user.email, role: user.role }, token: signToken(user) });
}

export async function login(req, res) {
  const { email, password } = req.body;
  const user = await User.findOne({ email }).select("+password");
  if (!user || !(await bcrypt.compare(password, user.password))) {
    return res.status(401).json({ message: "Invalid credentials" });
  }
  res.json({ user: { id: user._id, name: user.name, email: user.email, role: user.role }, token: signToken(user) });
}

export async function me(req, res) {
  res.json({ user: req.user });
}
