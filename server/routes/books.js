import { Router } from "express";
import Book from "../models/Book.js";
import { authenticate, adminOnly } from "../middleware/auth.js";

const router = Router();

// GET /api/books — list all books (public)
router.get("/", async (req, res) => {
  try {
    const { query, subject, semester, status } = req.query;
    const filter = {};

    if (status) filter.status = status;
    if (subject && subject !== "All") filter.subject = subject;
    if (semester && semester !== "All") filter.semester = semester;
    if (query) {
      filter.$or = [
        { title: { $regex: query, $options: "i" } },
        { subject: { $regex: query, $options: "i" } },
        { description: { $regex: query, $options: "i" } },
      ];
    }

    const books = await Book.find(filter).sort({ createdAt: -1 });
    res.json(books.map((b) => b.toJSON()));
  } catch (error) {
    console.error("Get books error:", error);
    res.status(500).json({ error: "Server error" });
  }
});

// GET /api/books/user/:userId — get books by a specific user
router.get("/user/:userId", authenticate, async (req, res) => {
  try {
    const books = await Book.find({ sellerId: req.params.userId }).sort({ createdAt: -1 });
    res.json(books.map((b) => b.toJSON()));
  } catch (error) {
    console.error("Get user books error:", error);
    res.status(500).json({ error: "Server error" });
  }
});

// GET /api/books/recommendations — AI-like recommendations
router.get("/recommendations", async (req, res) => {
  try {
    const { subject, semester, excludeId } = req.query;
    const filter = { status: "available" };

    if (excludeId) filter._id = { $ne: excludeId };

    let books;

    if (subject || semester) {
      // Prioritize same subject, then same semester
      const subjectBooks = subject
        ? await Book.find({ ...filter, subject }).limit(4)
        : [];
      const semesterBooks = semester
        ? await Book.find({ ...filter, semester, _id: { $nin: subjectBooks.map((b) => b._id) } }).limit(4 - subjectBooks.length)
        : [];
      books = [...subjectBooks, ...semesterBooks].slice(0, 4);
    } else {
      books = await Book.find(filter).sort({ createdAt: -1 }).limit(4);
    }

    res.json(books.map((b) => b.toJSON()));
  } catch (error) {
    console.error("Recommendations error:", error);
    res.status(500).json({ error: "Server error" });
  }
});

// POST /api/books — create a new book (authenticated)
router.post("/", authenticate, async (req, res) => {
  try {
    const { title, subject, semester, price, condition, description, image } = req.body;

    if (!title || !subject || !semester || price == null || !condition) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    const book = await Book.create({
      title,
      subject,
      semester,
      price: Number(price),
      condition,
      description: description || "No description provided.",
      seller: req.user.name,
      sellerId: req.user._id,
      image: image || "",
      status: "available",
    });

    res.status(201).json(book.toJSON());
  } catch (error) {
    console.error("Create book error:", error);
    res.status(500).json({ error: "Server error" });
  }
});

// PUT /api/books/:id — update a book (owner or admin)
router.put("/:id", authenticate, async (req, res) => {
  try {
    const book = await Book.findById(req.params.id);
    if (!book) return res.status(404).json({ error: "Book not found" });

    // Only owner or admin can update
    if (book.sellerId.toString() !== req.user._id.toString() && req.user.role !== "admin") {
      return res.status(403).json({ error: "Not authorized" });
    }

    const updates = req.body;
    Object.assign(book, updates);
    await book.save();

    res.json(book.toJSON());
  } catch (error) {
    console.error("Update book error:", error);
    res.status(500).json({ error: "Server error" });
  }
});

// PUT /api/books/:id/request — request to buy a book
router.put("/:id/request", authenticate, async (req, res) => {
  try {
    const book = await Book.findById(req.params.id);
    if (!book) return res.status(404).json({ error: "Book not found" });
    if (book.status !== "available") {
      return res.status(400).json({ error: "Book is not available" });
    }

    book.status = "requested";
    book.requestedBy = req.user._id;
    book.requestedByName = req.user.name;
    await book.save();

    res.json(book.toJSON());
  } catch (error) {
    console.error("Request book error:", error);
    res.status(500).json({ error: "Server error" });
  }
});

// PUT /api/books/:id/sold — mark a book as sold (owner or admin)
router.put("/:id/sold", authenticate, async (req, res) => {
  try {
    const book = await Book.findById(req.params.id);
    if (!book) return res.status(404).json({ error: "Book not found" });

    if (book.sellerId.toString() !== req.user._id.toString() && req.user.role !== "admin") {
      return res.status(403).json({ error: "Not authorized" });
    }

    book.status = "sold";
    await book.save();

    res.json(book.toJSON());
  } catch (error) {
    console.error("Mark sold error:", error);
    res.status(500).json({ error: "Server error" });
  }
});

// DELETE /api/books/:id — delete a book (owner or admin)
router.delete("/:id", authenticate, async (req, res) => {
  try {
    const book = await Book.findById(req.params.id);
    if (!book) return res.status(404).json({ error: "Book not found" });

    if (book.sellerId.toString() !== req.user._id.toString() && req.user.role !== "admin") {
      return res.status(403).json({ error: "Not authorized" });
    }

    await book.deleteOne();
    res.json({ message: "Book deleted" });
  } catch (error) {
    console.error("Delete book error:", error);
    res.status(500).json({ error: "Server error" });
  }
});

export default router;
