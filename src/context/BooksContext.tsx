import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { Book, BooksContextType } from "@/types";
import book1 from "@/assets/book-1.jpg";
import book2 from "@/assets/book-2.jpg";
import book3 from "@/assets/book-3.jpg";
import book4 from "@/assets/book-4.jpg";
import book5 from "@/assets/book-5.jpg";
import book6 from "@/assets/book-6.jpg";

const BooksContext = createContext<BooksContextType | undefined>(undefined);

const BOOKS_STORAGE_KEY = "bookxchange_books";

// Default sample books
const DEFAULT_BOOKS: Book[] = [
  {
    id: "book-001",
    title: "Engineering Mathematics Vol. 1",
    subject: "Mathematics",
    semester: "Semester 1",
    price: 320,
    seller: "Riya Sharma",
    sellerId: "user-001",
    image: book1,
    description: "Good condition, no highlights. Perfect for first-year students.",
    condition: "Good",
    postedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    status: "available",
  },
  {
    id: "book-002",
    title: "Principles of Biology",
    subject: "Biology",
    semester: "Semester 2",
    price: 250,
    seller: "Arjun Mehta",
    sellerId: "user-002",
    image: book2,
    description: "Slightly used, all pages intact. Key concepts are color-coded.",
    condition: "Like New",
    postedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
    status: "available",
  },
  {
    id: "book-003",
    title: "Applied Physics for Engineers",
    subject: "Physics",
    semester: "Semester 1",
    price: 180,
    seller: "Priya Nair",
    sellerId: "user-003",
    image: book3,
    description: "Minor highlights in first 2 chapters. Very helpful for exams.",
    condition: "Fair",
    postedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    status: "available",
  },
  {
    id: "book-004",
    title: "Data Structures & Algorithms",
    subject: "Computer Science",
    semester: "Semester 3",
    price: 450,
    seller: "Riya Sharma",
    sellerId: "user-001",
    image: book4,
    description: "Brand new condition, barely used. Contains handwritten notes.",
    condition: "Like New",
    postedAt: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(),
    status: "available",
  },
  {
    id: "book-005",
    title: "Microeconomics: Theory & Practice",
    subject: "Economics",
    semester: "Semester 4",
    price: 290,
    seller: "Arjun Mehta",
    sellerId: "user-002",
    image: book5,
    description: "Well maintained, extra practice problems included inside.",
    condition: "Good",
    postedAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(),
    status: "available",
  },
  {
    id: "book-006",
    title: "Literary Theory & Criticism",
    subject: "English Literature",
    semester: "Semester 5",
    price: 150,
    seller: "Priya Nair",
    sellerId: "user-003",
    image: book6,
    description: "Clean copy, no markings. Purchased last semester, no longer needed.",
    condition: "Like New",
    postedAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
    status: "available",
  },
];

function generateId(): string {
  return `book-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

function formatTimeAgo(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / (1000 * 60));
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
  const diffWeeks = Math.floor(diffDays / 7);

  if (diffMins < 60) return `${diffMins} minutes ago`;
  if (diffHours < 24) return `${diffHours} hours ago`;
  if (diffDays < 7) return `${diffDays} day${diffDays > 1 ? "s" : ""} ago`;
  return `${diffWeeks} week${diffWeeks > 1 ? "s" : ""} ago`;
}

// Simple similarity score calculation for AI recommendations
function calculateSimilarity(book1: Book, book2: Book): number {
  let score = 0;

  // Subject match (highest weight)
  if (book1.subject === book2.subject) score += 40;

  // Semester match
  if (book1.semester === book2.semester) score += 30;

  // Title word similarity
  const words1 = book1.title.toLowerCase().split(/\s+/);
  const words2 = book2.title.toLowerCase().split(/\s+/);
  const commonWords = words1.filter((w) => words2.includes(w) && w.length > 3);
  score += commonWords.length * 10;

  // Price range similarity (within 30%)
  const priceDiff = Math.abs(book1.price - book2.price) / Math.max(book1.price, book2.price);
  if (priceDiff < 0.3) score += 10;

  return score;
}

export function BooksProvider({ children }: { children: ReactNode }) {
  const [books, setBooks] = useState<Book[]>([]);

  // Initialize from localStorage
  useEffect(() => {
    const storedBooks = localStorage.getItem(BOOKS_STORAGE_KEY);

    if (storedBooks) {
      setBooks(JSON.parse(storedBooks));
    } else {
      // Initialize with default books
      setBooks(DEFAULT_BOOKS);
      localStorage.setItem(BOOKS_STORAGE_KEY, JSON.stringify(DEFAULT_BOOKS));
    }
  }, []);

  // Persist books to localStorage
  useEffect(() => {
    if (books.length > 0) {
      localStorage.setItem(BOOKS_STORAGE_KEY, JSON.stringify(books));
    }
  }, [books]);

  const addBook = (book: Omit<Book, "id" | "postedAt" | "status">) => {
    const newBook: Book = {
      ...book,
      id: generateId(),
      postedAt: new Date().toISOString(),
      status: "available",
    };
    setBooks((prev) => [newBook, ...prev]);
  };

  const updateBook = (id: string, updates: Partial<Book>) => {
    setBooks((prev) =>
      prev.map((book) => (book.id === id ? { ...book, ...updates } : book))
    );
  };

  const deleteBook = (id: string) => {
    setBooks((prev) => prev.filter((book) => book.id !== id));
  };

  const getUserBooks = (userId: string): Book[] => {
    return books.filter((book) => book.sellerId === userId);
  };

  const getAvailableBooks = (): Book[] => {
    return books.filter((book) => book.status === "available");
  };

  const requestBook = (bookId: string, userId: string, userName: string) => {
    setBooks((prev) =>
      prev.map((book) =>
        book.id === bookId
          ? { ...book, status: "requested" as const, requestedBy: userId, requestedByName: userName }
          : book
      )
    );
  };

  const markAsSold = (bookId: string) => {
    setBooks((prev) =>
      prev.map((book) =>
        book.id === bookId ? { ...book, status: "sold" as const } : book
      )
    );
  };

  // AI-powered book recommendation based on similarity
  const getRecommendedBooks = (
    subject?: string,
    semester?: string,
    currentBookId?: string
  ): Book[] => {
    const availableBooks = books.filter(
      (b) => b.status === "available" && b.id !== currentBookId
    );

    if (!subject && !semester) {
      // If no preferences, return most recent books
      return availableBooks.slice(0, 4);
    }

    // Create a reference book for similarity calculation
    const referenceBook: Partial<Book> = {
      subject: subject || "",
      semester: semester || "",
      title: "",
      price: 0,
    };

    // Calculate similarity scores and sort
    const scoredBooks = availableBooks.map((book) => ({
      book,
      score: calculateSimilarity(referenceBook as Book, book),
    }));

    scoredBooks.sort((a, b) => b.score - a.score);

    return scoredBooks.slice(0, 4).map((sb) => sb.book);
  };

  const searchBooks = (
    query: string,
    subject?: string,
    semester?: string
  ): Book[] => {
    return books.filter((book) => {
      const matchSearch =
        !query ||
        book.title.toLowerCase().includes(query.toLowerCase()) ||
        book.subject.toLowerCase().includes(query.toLowerCase()) ||
        book.description.toLowerCase().includes(query.toLowerCase());

      const matchSubject = !subject || subject === "All" || book.subject === subject;
      const matchSemester = !semester || semester === "All" || book.semester === semester;

      return matchSearch && matchSubject && matchSemester;
    });
  };

  // Add formatted time ago to books for display
  const booksWithTimeAgo = books.map((book) => ({
    ...book,
    postedAtDisplay: formatTimeAgo(book.postedAt),
  }));

  const value: BooksContextType = {
    books: booksWithTimeAgo,
    addBook,
    updateBook,
    deleteBook,
    getUserBooks,
    getAvailableBooks,
    requestBook,
    markAsSold,
    getRecommendedBooks,
    searchBooks,
  };

  return <BooksContext.Provider value={value}>{children}</BooksContext.Provider>;
}

export function useBooks(): BooksContextType {
  const context = useContext(BooksContext);
  if (context === undefined) {
    throw new Error("useBooks must be used within a BooksProvider");
  }
  return context;
}
