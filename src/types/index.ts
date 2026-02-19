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
  login: (email: string, password: string) => { success: boolean; error?: string };
  signup: (name: string, email: string, password: string) => { success: boolean; error?: string };
  logout: () => void;
  getAllUsers: () => User[];
  deleteUser: (userId: string) => void;
}

// Books Context types
export interface BooksContextType {
  books: Book[];
  addBook: (book: Omit<Book, "id" | "postedAt" | "status">) => void;
  updateBook: (id: string, updates: Partial<Book>) => void;
  deleteBook: (id: string) => void;
  getUserBooks: (userId: string) => Book[];
  getAvailableBooks: () => Book[];
  requestBook: (bookId: string, userId: string, userName: string) => void;
  markAsSold: (bookId: string) => void;
  getRecommendedBooks: (subject?: string, semester?: string, currentBookId?: string) => Book[];
  searchBooks: (query: string, subject?: string, semester?: string) => Book[];
}
