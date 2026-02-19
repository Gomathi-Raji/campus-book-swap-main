import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Plus, BookOpen, Package, CheckCircle2, Clock, ShoppingBag } from "lucide-react";
import Header from "@/components/Header";
import BookCard from "@/components/BookCard";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/context/AuthContext";
import { useBooks } from "@/context/BooksContext";
import { Book } from "@/types";

export default function MyBooks() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user, isAuthenticated } = useAuth();
  const { getUserBooks, updateBook, deleteBook, markAsSold } = useBooks();
  const [editingBook, setEditingBook] = useState<Book | null>(null);

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!isAuthenticated) {
      toast({
        title: "Authentication Required",
        description: "Please login to view your books.",
        variant: "destructive",
      });
      navigate("/login");
    }
  }, [isAuthenticated, navigate, toast]);

  // Get user's books
  const books = user ? getUserBooks(user.id) : [];

  const handleDelete = (book: Book) => {
    deleteBook(book.id);
    toast({
      title: "Book Removed",
      description: `"${book.title}" has been removed from your listings.`,
    });
  };

  const handleEdit = (book: Book) => {
    setEditingBook(book);
  };

  const handleMarkAsSold = (book: Book) => {
    markAsSold(book.id);
    toast({
      title: "Marked as Sold",
      description: `"${book.title}" has been marked as sold.`,
    });
  };

  const handleSaveEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingBook) return;
    updateBook(editingBook.id, {
      title: editingBook.title,
      subject: editingBook.subject,
      price: editingBook.price,
      description: editingBook.description,
    });
    setEditingBook(null);
    toast({ title: "Book Updated", description: "Your listing has been updated." });
  };

  // Calculate stats
  const availableBooks = books.filter((b) => b.status === "available");
  const requestedBooks = books.filter((b) => b.status === "requested");
  const soldBooks = books.filter((b) => b.status === "sold");

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Page Header */}
        <div className="flex items-center justify-between mb-8 animate-fade-in-up">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <BookOpen className="w-5 h-5 text-primary" />
              <span className="text-sm font-medium text-primary">Dashboard</span>
            </div>
            <h1 className="text-2xl font-bold text-foreground">My Books</h1>
            <p className="text-muted-foreground text-sm mt-0.5">{books.length} active listing{books.length !== 1 ? "s" : ""}</p>
          </div>
          <Link
            to="/post-book"
            className="flex items-center gap-2 px-4 py-2.5 gradient-hero text-primary-foreground font-semibold rounded-xl shadow-button hover:opacity-90 transition-all text-sm"
          >
            <Plus className="w-4 h-4" />
            Post New Book
          </Link>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-4 gap-4 mb-8 animate-fade-in-up" style={{ animationDelay: "80ms" }}>
          {[
            { label: "Listed Books", value: books.length, color: "text-primary", bg: "bg-primary-light", icon: <BookOpen className="w-4 h-4" /> },
            { label: "Available", value: availableBooks.length, color: "text-secondary", bg: "bg-secondary-light", icon: <CheckCircle2 className="w-4 h-4" /> },
            { label: "Requested", value: requestedBooks.length, color: "text-amber-600", bg: "bg-amber-50", icon: <Clock className="w-4 h-4" /> },
            { label: "Sold", value: soldBooks.length, color: "text-green-600", bg: "bg-green-50", icon: <ShoppingBag className="w-4 h-4" /> },
          ].map((s) => (
            <div key={s.label} className={`${s.bg} rounded-2xl p-4 border border-border`}>
              <div className="flex items-center gap-2 mb-1">
                <span className={s.color}>{s.icon}</span>
              </div>
              <p className={`text-xl font-bold ${s.color}`}>{s.value}</p>
              <p className="text-xs text-muted-foreground mt-0.5">{s.label}</p>
            </div>
          ))}
        </div>

        {/* Books Grid */}
        {books.length === 0 ? (
          <div className="text-center py-24 animate-fade-in-up" style={{ animationDelay: "120ms" }}>
            <div className="w-16 h-16 bg-muted rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Package className="w-8 h-8 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-semibold text-foreground mb-2">No books listed yet</h3>
            <p className="text-muted-foreground text-sm mb-6">Start selling your used textbooks to other students</p>
            <Link
              to="/post-book"
              className="inline-flex items-center gap-2 px-6 py-3 gradient-hero text-primary-foreground font-semibold rounded-xl shadow-button hover:opacity-90 transition-all text-sm"
            >
              <Plus className="w-4 h-4" />
              Post Your First Book
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5">
            {books.map((book, idx) => (
              <div key={book.id} className="animate-fade-in-up" style={{ animationDelay: `${idx * 60}ms` }}>
                <BookCard
                  book={book}
                  showActions
                  onEdit={handleEdit}
                  onDelete={handleDelete}
                  onMarkAsSold={handleMarkAsSold}
                />
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Edit Modal */}
      {editingBook && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-foreground/40 backdrop-blur-sm px-4">
          <div className="bg-card rounded-3xl shadow-2xl p-6 w-full max-w-md animate-scale-in">
            <h2 className="text-lg font-bold text-foreground mb-4">Edit Book Listing</h2>
            <form onSubmit={handleSaveEdit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-foreground mb-1.5">Title</label>
                <input
                  type="text"
                  value={editingBook.title}
                  onChange={(e) => setEditingBook({ ...editingBook, title: e.target.value })}
                  className="w-full px-4 py-2.5 border border-border rounded-xl bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-1.5">Subject</label>
                  <input
                    type="text"
                    value={editingBook.subject}
                    onChange={(e) => setEditingBook({ ...editingBook, subject: e.target.value })}
                    className="w-full px-4 py-2.5 border border-border rounded-xl bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground mb-1.5">Price (₹)</label>
                  <input
                    type="number"
                    value={editingBook.price}
                    onChange={(e) => setEditingBook({ ...editingBook, price: Number(e.target.value) })}
                    className="w-full px-4 py-2.5 border border-border rounded-xl bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-1.5">Description</label>
                <textarea
                  rows={3}
                  value={editingBook.description}
                  onChange={(e) => setEditingBook({ ...editingBook, description: e.target.value })}
                  className="w-full px-4 py-2.5 border border-border rounded-xl bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary resize-none"
                />
              </div>
              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setEditingBook(null)}
                  className="flex-1 py-2.5 border border-border text-muted-foreground font-medium rounded-xl hover:bg-muted transition-colors text-sm"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 gradient-hero text-primary-foreground font-semibold rounded-xl shadow-button hover:opacity-90 transition-all text-sm"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
