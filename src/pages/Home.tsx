import { useState, useMemo, useEffect } from "react";
import { Search, SlidersHorizontal, Sparkles, TrendingUp, Brain } from "lucide-react";
import { useNavigate } from "react-router-dom";
import Header from "@/components/Header";
import BookCard from "@/components/BookCard";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/context/AuthContext";
import { useBooks } from "@/context/BooksContext";
import { Book } from "@/types";

const SUBJECTS = ["All", "Mathematics", "Biology", "Physics", "Computer Science", "Economics", "English Literature", "Chemistry", "History", "Engineering"];
const SEMESTERS = ["All", "Semester 1", "Semester 2", "Semester 3", "Semester 4", "Semester 5", "Semester 6", "Semester 7", "Semester 8"];

export default function Home() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user, isAuthenticated } = useAuth();
  const { books, searchBooks, getRecommendedBooks, requestBook, getAvailableBooks, loading } = useBooks();
  const [search, setSearch] = useState("");
  const [selectedSubject, setSelectedSubject] = useState("All");
  const [selectedSemester, setSelectedSemester] = useState("All");
  const [filtered, setFiltered] = useState<Book[]>([]);
  const [recommended, setRecommended] = useState<Book[]>([]);

  // Get available books only
  const availableBooks = useMemo(() => getAvailableBooks(), [books]);

  // Filter books (async)
  useEffect(() => {
    const fetchFiltered = async () => {
      const results = await searchBooks(search, selectedSubject, selectedSemester);
      setFiltered(results.filter((b: Book) => b.status === "available"));
    };
    fetchFiltered();
  }, [search, selectedSubject, selectedSemester, books]);

  // AI-powered recommendations based on user's selected filters (async)
  useEffect(() => {
    const fetchRecommended = async () => {
      const subject = selectedSubject !== "All" ? selectedSubject : undefined;
      const semester = selectedSemester !== "All" ? selectedSemester : undefined;
      const results = await getRecommendedBooks(subject, semester);
      setRecommended(results);
    };
    fetchRecommended();
  }, [selectedSubject, selectedSemester, books]);

  const handleRequest = async (book: Book) => {
    if (!isAuthenticated || !user) {
      toast({
        title: "Login Required",
        description: "Please login to request a book.",
        variant: "destructive",
      });
      navigate("/login");
      return;
    }

    // Don't allow requesting own books
    if (book.sellerId === user.id) {
      toast({
        title: "Cannot Request",
        description: "You cannot request your own book.",
        variant: "destructive",
      });
      return;
    }

    await requestBook(book.id, user.id, user.name);
    toast({
      title: "Request Sent! 🎉",
      description: `Your request for "${book.title}" has been sent to ${book.seller}.`,
    });
  };

  // Calculate stats
  const stats = useMemo(() => ({
    booksAvailable: availableBooks.length,
    totalBooks: books.length,
  }), [books, availableBooks]);

  return (
    <div className="min-h-screen bg-background">
      <Header />

      {/* Hero / Search Banner */}
      <section className="gradient-hero px-4 py-12 sm:py-16">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 bg-white/20 text-white text-xs font-medium px-3 py-1.5 rounded-full mb-4">
            <Sparkles className="w-3.5 h-3.5" />
            Smart Campus Book Exchange
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold text-white mb-3 leading-tight">
            Find Your Next Textbook<br className="hidden sm:block" /> At The Best Price
          </h1>
          <p className="text-white/80 text-sm sm:text-base mb-8 max-w-xl mx-auto">
            Buy and sell used academic books within your campus community. Save up to 70% on textbooks.
          </p>

          {/* Search */}
          <div className="relative max-w-xl mx-auto">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search by book title, subject..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-12 pr-4 py-4 bg-card rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-white/30 shadow-xl placeholder:text-muted-foreground"
            />
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats bar */}
        <div className="grid grid-cols-3 gap-4 mb-8">
          {[
            { label: "Books Available", value: stats.booksAvailable.toString() },
            { label: "Total Listed", value: stats.totalBooks.toString() },
            { label: "Avg. Savings", value: "68%" },
          ].map((s) => (
            <div key={s.label} className="bg-card rounded-2xl p-4 text-center shadow-card border border-border">
              <p className="text-xl font-bold text-primary">{s.value}</p>
              <p className="text-xs text-muted-foreground mt-0.5">{s.label}</p>
            </div>
          ))}
        </div>

        {/* AI Recommended */}
        <section className="mb-10">
          <div className="flex items-center gap-2 mb-5">
            <Brain className="w-5 h-5 text-primary" />
            <h2 className="text-lg font-bold text-foreground">AI Recommended for You</h2>
            <span className="bg-primary-light text-primary text-xs font-medium px-2 py-0.5 rounded-full flex items-center gap-1">
              <Sparkles className="w-3 h-3" />
              Smart
            </span>
          </div>
          {recommended.length > 0 ? (
            <div className="flex gap-4 overflow-x-auto pb-2 snap-x snap-mandatory -mx-4 px-4 sm:mx-0 sm:px-0 sm:grid sm:grid-cols-4">
              {recommended.map((book, idx) => (
                <div key={book.id} className="min-w-[220px] sm:min-w-0 snap-start" style={{ animationDelay: `${idx * 60}ms` }}>
                  <BookCard book={book} onBuy={handleRequest} />
                </div>
              ))}
            </div>
          ) : (
            <p className="text-muted-foreground text-sm">No recommendations available. Try adjusting filters.</p>
          )}
        </section>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-3 mb-6 items-start sm:items-center">
          <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
            <SlidersHorizontal className="w-4 h-4" />
            Filters:
          </div>
          <div className="flex flex-wrap gap-2">
            {SUBJECTS.map((s) => (
              <button
                key={s}
                onClick={() => setSelectedSubject(s)}
                className={`px-3 py-1.5 rounded-xl text-xs font-medium transition-all ${
                  selectedSubject === s
                    ? "bg-primary text-primary-foreground shadow-button"
                    : "bg-card border border-border text-muted-foreground hover:bg-muted"
                }`}
              >
                {s}
              </button>
            ))}
          </div>
        </div>

        <div className="flex flex-wrap gap-2 mb-6">
          {SEMESTERS.map((s) => (
            <button
              key={s}
              onClick={() => setSelectedSemester(s)}
              className={`px-3 py-1.5 rounded-xl text-xs font-medium transition-all ${
                selectedSemester === s
                  ? "gradient-green text-primary-foreground shadow-button-green"
                  : "bg-card border border-border text-muted-foreground hover:bg-muted"
              }`}
            >
              {s}
            </button>
          ))}
        </div>

        {/* All Books Grid */}
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-lg font-bold text-foreground">
            All Books
            <span className="ml-2 text-sm font-normal text-muted-foreground">({filtered.length} found)</span>
          </h2>
        </div>

        {filtered.length === 0 ? (
          <div className="text-center py-20">
            <Search className="w-12 h-12 text-muted-foreground mx-auto mb-4 opacity-40" />
            <p className="text-muted-foreground">No books found matching your search.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-4 gap-5">
            {filtered.map((book, idx) => (
              <div key={book.id} className="animate-fade-in-up" style={{ animationDelay: `${idx * 50}ms` }}>
                <BookCard book={book} onBuy={handleRequest} />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
