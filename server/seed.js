import mongoose from "mongoose";
import dotenv from "dotenv";
import User from "./models/User.js";
import Book from "./models/Book.js";

dotenv.config();

const seedData = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("Connected to MongoDB");

    // Clear existing data
    await User.deleteMany({});
    await Book.deleteMany({});
    console.log("Cleared existing data");

    // Create users
    const admin = await User.create({
      name: "Admin User",
      email: "admin@campus.edu",
      password: "admin123",
      role: "admin",
    });

    const riya = await User.create({
      name: "Riya Sharma",
      email: "riya@campus.edu",
      password: "password123",
      role: "user",
    });

    const arjun = await User.create({
      name: "Arjun Mehta",
      email: "arjun@campus.edu",
      password: "password123",
      role: "user",
    });

    const priya = await User.create({
      name: "Priya Nair",
      email: "priya@campus.edu",
      password: "password123",
      role: "user",
    });

    console.log("Created users:", [admin.name, riya.name, arjun.name, priya.name]);

    // Create books
    const books = await Book.insertMany([
      {
        title: "Engineering Mathematics Vol. 1",
        subject: "Mathematics",
        semester: "Semester 1",
        price: 320,
        seller: riya.name,
        sellerId: riya._id,
        image: "",
        description: "Good condition, no highlights. Perfect for first-year students.",
        condition: "Good",
        status: "available",
      },
      {
        title: "Principles of Biology",
        subject: "Biology",
        semester: "Semester 2",
        price: 250,
        seller: arjun.name,
        sellerId: arjun._id,
        image: "",
        description: "Slightly used, all pages intact. Key concepts are color-coded.",
        condition: "Like New",
        status: "available",
      },
      {
        title: "Applied Physics for Engineers",
        subject: "Physics",
        semester: "Semester 1",
        price: 180,
        seller: priya.name,
        sellerId: priya._id,
        image: "",
        description: "Minor highlights in first 2 chapters. Very helpful for exams.",
        condition: "Fair",
        status: "available",
      },
      {
        title: "Data Structures & Algorithms",
        subject: "Computer Science",
        semester: "Semester 3",
        price: 450,
        seller: riya.name,
        sellerId: riya._id,
        image: "",
        description: "Brand new condition, barely used. Contains handwritten notes.",
        condition: "Like New",
        status: "available",
      },
      {
        title: "Microeconomics: Theory & Practice",
        subject: "Economics",
        semester: "Semester 4",
        price: 290,
        seller: arjun.name,
        sellerId: arjun._id,
        image: "",
        description: "Well maintained, extra practice problems included inside.",
        condition: "Good",
        status: "available",
      },
      {
        title: "Literary Theory & Criticism",
        subject: "English Literature",
        semester: "Semester 5",
        price: 150,
        seller: priya.name,
        sellerId: priya._id,
        image: "",
        description: "Clean copy, no markings. Purchased last semester, no longer needed.",
        condition: "Like New",
        status: "available",
      },
    ]);

    console.log(`Created ${books.length} books`);
    console.log("\n--- Seed completed ---");
    console.log("Admin login: admin@campus.edu / admin123");
    console.log("User login:  riya@campus.edu / password123");

    await mongoose.connection.close();
    process.exit(0);
  } catch (error) {
    console.error("Seed error:", error);
    process.exit(1);
  }
};

seedData();
