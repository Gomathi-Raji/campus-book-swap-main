import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Shield, Users, BookOpen, Trash2, AlertTriangle, CheckCircle2, Clock, Tag } from "lucide-react";
import Header from "@/components/Header";
import { useAuth } from "@/context/AuthContext";
import { useBooks } from "@/context/BooksContext";
import { useToast } from "@/hooks/use-toast";
import { User } from "@/types";

export default function Admin() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { isAdmin, isAuthenticated, getAllUsers, deleteUser } = useAuth();
  const { books, deleteBook, refreshBooks } = useBooks();
  const [users, setUsers] = useState<User[]>([]);

  // Redirect if not admin
  useEffect(() => {
    if (!isAuthenticated) {
      toast({
        title: "Authentication Required",
        description: "Please login to access this page.",
        variant: "destructive",
      });
      navigate("/login");
      return;
    }

    if (!isAdmin) {
      toast({
        title: "Access Denied",
        description: "You don't have permission to access the admin panel.",
        variant: "destructive",
      });
      navigate("/");
    }
  }, [isAuthenticated, isAdmin, navigate, toast]);

  // Fetch users
  useEffect(() => {
    const fetchUsers = async () => {
      const allUsers = await getAllUsers();
      setUsers(allUsers);
    };
    if (isAdmin) fetchUsers();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAdmin]);

  const handleDeleteUser = async (userId: string, userName: string) => {
    if (window.confirm(`Are you sure you want to delete user "${userName}"?`)) {
      await deleteUser(userId);
      setUsers((prev) => prev.filter((u) => u.id !== userId));
      toast({
        title: "User Deleted",
        description: `User "${userName}" has been removed from the system.`,
      });
    }
  };

  const handleDeleteBook = async (bookId: string, bookTitle: string) => {
    if (window.confirm(`Are you sure you want to delete book "${bookTitle}"?`)) {
      await deleteBook(bookId);
      await refreshBooks();
      toast({
        title: "Book Deleted",
        description: `Book "${bookTitle}" has been removed from the system.`,
      });
    }
  };

  // Statistics
  const stats = {
    totalUsers: users.length,
    totalBooks: books.length,
    availableBooks: books.filter((b) => b.status === "available").length,
    requestedBooks: books.filter((b) => b.status === "requested").length,
    soldBooks: books.filter((b) => b.status === "sold").length,
  };

  if (!isAdmin) {
    return null;
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Page Header */}
        <div className="mb-8 animate-fade-in-up">
          <div className="flex items-center gap-2 mb-2">
            <Shield className="w-5 h-5 text-primary" />
            <span className="text-sm font-medium text-primary">Admin Panel</span>
          </div>
          <h1 className="text-2xl font-bold text-foreground">System Monitoring</h1>
          <p className="text-muted-foreground text-sm mt-1">
            Manage users and monitor book listings across the platform
          </p>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8 animate-fade-in-up" style={{ animationDelay: "80ms" }}>
          <div className="bg-card rounded-2xl p-4 border border-border">
            <div className="flex items-center gap-2 mb-1">
              <Users className="w-4 h-4 text-primary" />
            </div>
            <p className="text-2xl font-bold text-primary">{stats.totalUsers}</p>
            <p className="text-xs text-muted-foreground">Total Users</p>
          </div>
          <div className="bg-card rounded-2xl p-4 border border-border">
            <div className="flex items-center gap-2 mb-1">
              <BookOpen className="w-4 h-4 text-secondary" />
            </div>
            <p className="text-2xl font-bold text-secondary">{stats.totalBooks}</p>
            <p className="text-xs text-muted-foreground">Total Books</p>
          </div>
          <div className="bg-card rounded-2xl p-4 border border-border">
            <div className="flex items-center gap-2 mb-1">
              <CheckCircle2 className="w-4 h-4 text-green-600" />
            </div>
            <p className="text-2xl font-bold text-green-600">{stats.availableBooks}</p>
            <p className="text-xs text-muted-foreground">Available</p>
          </div>
          <div className="bg-card rounded-2xl p-4 border border-border">
            <div className="flex items-center gap-2 mb-1">
              <Clock className="w-4 h-4 text-amber-600" />
            </div>
            <p className="text-2xl font-bold text-amber-600">{stats.requestedBooks}</p>
            <p className="text-xs text-muted-foreground">Requested</p>
          </div>
          <div className="bg-card rounded-2xl p-4 border border-border">
            <div className="flex items-center gap-2 mb-1">
              <Tag className="w-4 h-4 text-gray-600" />
            </div>
            <p className="text-2xl font-bold text-gray-600">{stats.soldBooks}</p>
            <p className="text-xs text-muted-foreground">Sold</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Users Section */}
          <div className="animate-fade-in-up" style={{ animationDelay: "120ms" }}>
            <div className="flex items-center gap-2 mb-4">
              <Users className="w-5 h-5 text-primary" />
              <h2 className="text-lg font-bold text-foreground">Registered Users</h2>
              <span className="bg-primary-light text-primary text-xs font-medium px-2 py-0.5 rounded-full">
                {users.length}
              </span>
            </div>
            <div className="bg-card rounded-2xl border border-border overflow-hidden">
              {users.length === 0 ? (
                <div className="p-8 text-center">
                  <Users className="w-12 h-12 text-muted-foreground mx-auto mb-2 opacity-40" />
                  <p className="text-muted-foreground text-sm">No users registered yet</p>
                </div>
              ) : (
                <div className="divide-y divide-border">
                  {users.map((user) => (
                    <div key={user.id} className="p-4 flex items-center justify-between hover:bg-muted/50 transition-colors">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 gradient-hero rounded-full flex items-center justify-center">
                          <span className="text-xs font-bold text-primary-foreground">
                            {user.name.split(" ").map((n) => n[0]).join("").substring(0, 2).toUpperCase()}
                          </span>
                        </div>
                        <div>
                          <p className="font-medium text-foreground text-sm">{user.name}</p>
                          <p className="text-xs text-muted-foreground">{user.email}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-muted-foreground">
                          {new Date(user.createdAt).toLocaleDateString()}
                        </span>
                        <button
                          onClick={() => handleDeleteUser(user.id, user.name)}
                          className="p-2 text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-lg transition-colors"
                          title="Delete User"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Books Section */}
          <div className="animate-fade-in-up" style={{ animationDelay: "160ms" }}>
            <div className="flex items-center gap-2 mb-4">
              <BookOpen className="w-5 h-5 text-secondary" />
              <h2 className="text-lg font-bold text-foreground">All Book Listings</h2>
              <span className="bg-secondary-light text-secondary text-xs font-medium px-2 py-0.5 rounded-full">
                {books.length}
              </span>
            </div>
            <div className="bg-card rounded-2xl border border-border overflow-hidden max-h-[600px] overflow-y-auto">
              {books.length === 0 ? (
                <div className="p-8 text-center">
                  <BookOpen className="w-12 h-12 text-muted-foreground mx-auto mb-2 opacity-40" />
                  <p className="text-muted-foreground text-sm">No books listed yet</p>
                </div>
              ) : (
                <div className="divide-y divide-border">
                  {books.map((book) => (
                    <div key={book.id} className="p-4 hover:bg-muted/50 transition-colors">
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex items-start gap-3 flex-1">
                          <img
                            src={book.image}
                            alt={book.title}
                            className="w-12 h-16 object-cover rounded-lg border border-border"
                          />
                          <div className="flex-1 min-w-0">
                            <p className="font-medium text-foreground text-sm line-clamp-1">{book.title}</p>
                            <p className="text-xs text-muted-foreground mt-0.5">
                              {book.subject} • {book.semester}
                            </p>
                            <p className="text-xs text-muted-foreground mt-0.5">
                              Seller: {book.seller}
                            </p>
                            <div className="flex items-center gap-2 mt-1">
                              <span className="text-sm font-bold text-primary">₹{book.price}</span>
                              <span
                                className={`text-[10px] font-medium px-1.5 py-0.5 rounded-full ${
                                  book.status === "available"
                                    ? "bg-green-100 text-green-700"
                                    : book.status === "requested"
                                    ? "bg-amber-100 text-amber-700"
                                    : "bg-gray-100 text-gray-700"
                                }`}
                              >
                                {book.status}
                              </span>
                            </div>
                          </div>
                        </div>
                        <button
                          onClick={() => handleDeleteBook(book.id, book.title)}
                          className="p-2 text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-lg transition-colors shrink-0"
                          title="Delete Book"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Warning Notice */}
        <div className="mt-8 p-4 bg-amber-50 border border-amber-200 rounded-2xl flex items-start gap-3 animate-fade-in-up" style={{ animationDelay: "200ms" }}>
          <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
          <div>
            <p className="font-medium text-amber-800 text-sm">Admin Actions are Permanent</p>
            <p className="text-xs text-amber-700 mt-1">
              Deleting users or books will permanently remove them from the system. This action cannot be undone.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
