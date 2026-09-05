import "dotenv/config";
import bcrypt from "bcryptjs";
import { connectDB } from "../config/db.js";
import User from "../models/User.js";

await connectDB();

const email = String(
  process.env.ADMIN_EMAIL ||
    "admin@shopsphere.com"
)
  .trim()
  .toLowerCase();

const password = String(
  process.env.ADMIN_PASSWORD ||
    "ChangeMe123!"
);

if (password.length < 8) {
  throw new Error(
    "ADMIN_PASSWORD must be at least 8 characters."
  );
}

const hash = await bcrypt.hash(
  password,
  12
);

const admin =
  await User.findOneAndUpdate(
    { email },

    {
      name: "ShopSphere Admin",
      email,
      password: hash,
      role: "admin",
    },

    {
      upsert: true,
      new: true,
      setDefaultsOnInsert: true,
    }
  );

console.log(
  `Admin ready: ${admin.email}`
);

process.exit(0);