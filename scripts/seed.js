import { config } from "dotenv";
config({ path: ".env.local" });

import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import dns from "node:dns";

dns.setServers(["1.1.1.1", "8.8.8.8"]);

const uri = process.env.MONGODB_URI;
if (!uri) throw new Error("MONGODB_URI missing in .env.local");

async function main() {
  await mongoose.connect(uri);
  console.log("Connected to MongoDB");

  const { default: User } = await import("../src/models/User.js");
  const { default: Settings } = await import("../src/models/Settings.js");

  const email = process.env.ADMIN_EMAIL;
  const password = process.env.ADMIN_PASSWORD;

  if (!email || !password) {
    throw new Error("ADMIN_EMAIL and ADMIN_PASSWORD must be set in .env.local");
  }

  let admin = await User.findOne({ email });
  if (admin) {
    console.log("Admin already exists:", email);
  } else {
    admin = await User.create({
      name: process.env.ADMIN_NAME || "Admin",
      email,
      phone: process.env.ADMIN_PHONE || "0000000000",
      passwordHash: await bcrypt.hash(password, 10),
      role: "admin",
    });
    console.log("Admin created:", email);
  }

  let settings = await Settings.findOne({ key: "site" });
  if (!settings) {
    settings = await Settings.create({
      key: "site",
      tourDate: "2026-12-24",
      returnDate: "2026-12-28",
      fee: 0,
      participantLimit: 0,
      contactNumber: process.env.ADMIN_PHONE || "",
      homeTitle: "Rihla'26",
      homeBody: "Dhaka → Char Kukri Mukri, Bhola",
      aboutTitle: "About SOROB",
      aboutBody: "SOROB is a volunteer organization.",
    });
    console.log("Settings initialized.");
  } else {
    console.log("Settings already exist.");
  }

  await mongoose.disconnect();
  console.log("Seed complete.");
}

main().catch((e) => {
  console.error("SEED ERROR:", e);
  process.exit(1);
});