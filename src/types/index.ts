// User types
export interface User {
  id: string;
  name: string;
  email: string;
  password: string;
  role: "user" | "admin";
  createdAt: string;
}

// Book types
export type BookStatus = "available" | "requested" | "sold";

export interface Book {
  id: string;
  title: string;
  subject: string;
  semester: string;
  price: number;
  seller: string;
  sellerId: string;
  image: string;
  description: string;
  condition: string;
  postedAt: string;
  status: BookStatus;
  requestedBy?: string;
  requestedByName?: string;
}

// Form types
export interface LoginForm {
  email: string;
  password: string;
}

export interface SignupForm {
  name: string;
  email: string;
  password: string;
}

export interface BookForm {
  title: string;
  subject: string;
  semester: string;
  price: string;
  condition: string;
  description: string;
  image?: string;
}

// Auth Context types
export interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isAdmin: boolean;
  loading: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  signup: (name: string, email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
  getAllUsers: () => Promise<User[]>;
  deleteUser: (userId: string) => Promise<void>;
}

// Books Context types
export interface BooksContextType {
  books: Book[];
  loading: boolean;
  addBook: (book: Omit<Book, "id" | "postedAt" | "status">) => Promise<void>;
  updateBook: (id: string, updates: Partial<Book>) => Promise<void>;
  deleteBook: (id: string) => Promise<void>;
  getUserBooks: (userId: string) => Promise<Book[]>;
  getAvailableBooks: () => Book[];
  requestBook: (bookId: string, userId: string, userName: string) => Promise<void>;
  markAsSold: (bookId: string) => Promise<void>;
  getRecommendedBooks: (subject?: string, semester?: string, currentBookId?: string) => Promise<Book[]>;
  searchBooks: (query: string, subject?: string, semester?: string) => Promise<Book[]>;
  refreshBooks: () => Promise<void>;
}
