import { createContext, useContext, useState, useEffect, useCallback, ReactNode } from "react";
import { Book, BooksContextType } from "@/types";
import {
  apiGetBooks,
  apiGetUserBooks,
  apiCreateBook,
  apiUpdateBook,
  apiDeleteBook,
  apiRequestBook,
  apiMarkAsSold,
  apiGetRecommendations,
} from "@/lib/api";

const BooksContext = createContext<BooksContextType | undefined>(undefined);

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

export function BooksProvider({ children }: { children: ReactNode }) {
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);

  const refreshBooks = useCallback(async () => {
    try {
      setLoading(true);
      const data = await apiGetBooks();
      setBooks(data);
    } catch (error) {
      console.error("Failed to fetch books:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  // Fetch books on mount
  useEffect(() => {
    refreshBooks();
  }, [refreshBooks]);

  const addBook = async (book: Omit<Book, "id" | "postedAt" | "status">) => {
    const newBook = await apiCreateBook({
      title: book.title,
      subject: book.subject,
      semester: book.semester,
      price: book.price,
      condition: book.condition,
      description: book.description,
      image: book.image,
    });
    setBooks((prev) => [newBook, ...prev]);
  };

  const updateBook = async (id: string, updates: Partial<Book>) => {
    const updated = await apiUpdateBook(id, updates);
    setBooks((prev) => prev.map((b) => (b.id === id ? updated : b)));
  };

  const deleteBook = async (id: string) => {
    await apiDeleteBook(id);
    setBooks((prev) => prev.filter((b) => b.id !== id));
  };

  const getUserBooks = async (userId: string): Promise<Book[]> => {
    return apiGetUserBooks(userId);
  };

  const getAvailableBooks = (): Book[] => {
    return books.filter((book) => book.status === "available");
  };

  const requestBook = async (bookId: string, _userId: string, _userName: string) => {
    const updated = await apiRequestBook(bookId);
    setBooks((prev) => prev.map((b) => (b.id === bookId ? updated : b)));
  };

  const markAsSold = async (bookId: string) => {
    const updated = await apiMarkAsSold(bookId);
    setBooks((prev) => prev.map((b) => (b.id === bookId ? updated : b)));
  };

  const getRecommendedBooks = async (
    subject?: string,
    semester?: string,
    currentBookId?: string
  ): Promise<Book[]> => {
    return apiGetRecommendations(subject, semester, currentBookId);
  };

  const searchBooks = async (
    query: string,
    subject?: string,
    semester?: string
  ): Promise<Book[]> => {
    return apiGetBooks({ query, subject, semester });
  };

  // Add formatted time ago to books for display
  const booksWithTimeAgo = books.map((book) => ({
    ...book,
    postedAtDisplay: formatTimeAgo(book.postedAt),
  }));

  const value: BooksContextType = {
    books: booksWithTimeAgo,
    loading,
    addBook,
    updateBook,
    deleteBook,
    getUserBooks,
    getAvailableBooks,
    requestBook,
    markAsSold,
    getRecommendedBooks,
    searchBooks,
    refreshBooks,
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
