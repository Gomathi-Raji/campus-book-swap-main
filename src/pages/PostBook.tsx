import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Upload, BookOpen, CheckCircle2, X, AlertCircle } from "lucide-react";
import Header from "@/components/Header";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/context/AuthContext";
import { useBooks } from "@/context/BooksContext";
import placeholderBook from "@/assets/book-1.jpg";

const SUBJECTS = [
  "Mathematics", "Physics", "Chemistry", "Biology", "Computer Science",
  "Economics", "English Literature", "History", "Engineering", "Other",
];

const SEMESTERS = [
  "Semester 1", "Semester 2", "Semester 3", "Semester 4",
  "Semester 5", "Semester 6", "Semester 7", "Semester 8",
];

const CONDITIONS = ["Like New", "Good", "Fair", "Acceptable"];

export default function PostBook() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user, isAuthenticated } = useAuth();
  const { addBook } = useBooks();
  const [submitted, setSubmitted] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [form, setForm] = useState({
    title: "",
    subject: "",
    semester: "",
    price: "",
    condition: "",
    description: "",
  });

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!isAuthenticated) {
      toast({
        title: "Authentication Required",
        description: "Please login to post a book.",
        variant: "destructive",
      });
      navigate("/login");
    }
  }, [isAuthenticated, navigate, toast]);

  const handleImage = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setImagePreview(url);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) {
      navigate("/login");
      return;
    }

    try {
      // Add book to database via API
      await addBook({
        title: form.title,
        subject: form.subject,
        semester: form.semester,
        price: Number(form.price),
        condition: form.condition,
        description: form.description || "No description provided.",
        seller: user.name,
        sellerId: user.id,
        image: imagePreview || "",
      });

      setSubmitted(true);
      setTimeout(() => {
        toast({
          title: "Book Listed! 🎉",
          description: "Your book has been posted and is now visible to other students.",
        });
        navigate("/my-books");
      }, 1500);
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : "Failed to post book.";
      toast({
        title: "Error",
        description: message,
        variant: "destructive",
      });
    }
  };

  if (submitted) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="flex items-center justify-center min-h-[80vh]">
          <div className="text-center animate-scale-in">
            <div className="w-20 h-20 gradient-green rounded-full flex items-center justify-center mx-auto mb-4 shadow-button-green">
              <CheckCircle2 className="w-10 h-10 text-white" />
            </div>
            <h2 className="text-2xl font-bold text-foreground mb-2">Book Posted!</h2>
            <p className="text-muted-foreground">Redirecting to My Books...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <div className="max-w-2xl mx-auto px-4 py-10">
        <div className="mb-8 animate-fade-in-up">
          <div className="flex items-center gap-2 mb-2">
            <BookOpen className="w-5 h-5 text-primary" />
            <span className="text-sm font-medium text-primary">Sell Your Book</span>
          </div>
          <h1 className="text-2xl font-bold text-foreground">Post a Book for Sale</h1>
          <p className="text-muted-foreground text-sm mt-1">Fill in the details below and reach hundreds of students</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6 animate-fade-in-up" style={{ animationDelay: "100ms" }}>
          {/* Image Upload */}
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">Book Cover Image</label>
            <div className="relative">
              {imagePreview ? (
                <div className="relative rounded-2xl overflow-hidden border-2 border-primary h-48">
                  <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
                  <button
                    type="button"
                    onClick={() => setImagePreview(null)}
                    className="absolute top-2 right-2 w-7 h-7 bg-destructive text-white rounded-full flex items-center justify-center hover:opacity-80 transition"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <label className="flex flex-col items-center justify-center h-48 border-2 border-dashed border-border rounded-2xl cursor-pointer hover:border-primary hover:bg-primary-light transition-all bg-muted">
                  <Upload className="w-8 h-8 text-muted-foreground mb-2" />
                  <p className="text-sm font-medium text-muted-foreground">Click to upload image</p>
                  <p className="text-xs text-muted-foreground mt-1">PNG, JPG up to 5MB</p>
                  <input type="file" accept="image/*" className="hidden" onChange={handleImage} />
                </label>
              )}
            </div>
          </div>

          {/* Book Title */}
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">Book Title *</label>
            <input
              type="text"
              required
              placeholder="e.g. Engineering Mathematics Vol. 1"
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              className="w-full px-4 py-3 border border-border rounded-xl bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all placeholder:text-muted-foreground"
            />
          </div>

          {/* Subject + Semester */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">Subject *</label>
              <select
                required
                value={form.subject}
                onChange={(e) => setForm({ ...form, subject: e.target.value })}
                className="w-full px-4 py-3 border border-border rounded-xl bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all text-foreground"
              >
                <option value="">Select subject</option>
                {SUBJECTS.map((s) => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">Semester *</label>
              <select
                required
                value={form.semester}
                onChange={(e) => setForm({ ...form, semester: e.target.value })}
                className="w-full px-4 py-3 border border-border rounded-xl bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all text-foreground"
              >
                <option value="">Select semester</option>
                {SEMESTERS.map((s) => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
          </div>

          {/* Price + Condition */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">Price (₹) *</label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-sm font-medium text-muted-foreground">₹</span>
                <input
                  type="number"
                  required
                  min="1"
                  placeholder="299"
                  value={form.price}
                  onChange={(e) => setForm({ ...form, price: e.target.value })}
                  className="w-full pl-8 pr-4 py-3 border border-border rounded-xl bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all placeholder:text-muted-foreground"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">Condition *</label>
              <select
                required
                value={form.condition}
                onChange={(e) => setForm({ ...form, condition: e.target.value })}
                className="w-full px-4 py-3 border border-border rounded-xl bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all text-foreground"
              >
                <option value="">Select condition</option>
                {CONDITIONS.map((c) => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">Description</label>
            <textarea
              placeholder="Describe the book's condition, any highlights, notes, etc."
              rows={4}
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              className="w-full px-4 py-3 border border-border rounded-xl bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all placeholder:text-muted-foreground resize-none"
            />
          </div>

          {/* Submit */}
          <button
            type="submit"
            className="w-full py-4 gradient-hero text-primary-foreground font-semibold rounded-xl shadow-button hover:opacity-90 active:scale-[0.98] transition-all text-sm"
          >
            Post Book for Sale
          </button>
        </form>
      </div>
    </div>
  );
}
