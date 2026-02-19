import { Book } from "@/types";
import { ShoppingCart, User, BookOpen, Calendar, Clock, CheckCircle2, Tag } from "lucide-react";

interface BookCardProps {
  book: Book;
  onBuy?: (book: Book) => void;
  showActions?: boolean;
  onEdit?: (book: Book) => void;
  onDelete?: (book: Book) => void;
  onMarkAsSold?: (book: Book) => void;
}

const conditionColors: Record<string, string> = {
  "Like New": "bg-secondary-light text-secondary",
  Good: "bg-primary-light text-primary",
  Fair: "bg-amber-50 text-amber-600",
  Acceptable: "bg-gray-100 text-gray-600",
};

const statusColors: Record<string, { bg: string; text: string; icon: React.ReactNode }> = {
  available: { bg: "bg-green-100", text: "text-green-700", icon: <CheckCircle2 className="w-3 h-3" /> },
  requested: { bg: "bg-amber-100", text: "text-amber-700", icon: <Clock className="w-3 h-3" /> },
  sold: { bg: "bg-gray-100", text: "text-gray-700", icon: <Tag className="w-3 h-3" /> },
};

export default function BookCard({ book, onBuy, showActions, onEdit, onDelete, onMarkAsSold }: BookCardProps) {
  const statusStyle = statusColors[book.status] || statusColors.available;
  const isAvailable = book.status === "available";
  const isRequested = book.status === "requested";
  const isSold = book.status === "sold";

  return (
    <div className={`bg-card rounded-2xl overflow-hidden shadow-card card-hover border border-border group ${isSold ? "opacity-75" : ""}`}>
      {/* Book Image */}
      <div className="relative h-44 overflow-hidden bg-muted">
        <img
          src={book.image}
          alt={book.title}
          className={`w-full h-full object-cover transition-transform duration-300 ${!isSold ? "group-hover:scale-105" : ""}`}
        />
        <div className="absolute top-3 right-3 flex flex-col gap-1">
          <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${conditionColors[book.condition] || "bg-muted text-muted-foreground"}`}>
            {book.condition}
          </span>
        </div>
        {/* Status badge */}
        {!isAvailable && (
          <div className={`absolute top-3 left-3 flex items-center gap-1 px-2 py-1 rounded-full text-xs font-semibold ${statusStyle.bg} ${statusStyle.text}`}>
            {statusStyle.icon}
            {book.status === "requested" ? "Requested" : "Sold"}
          </div>
        )}
      </div>

      {/* Card Body */}
      <div className="p-4">
        <h3 className="font-semibold text-foreground text-sm leading-tight line-clamp-2 mb-2">
          {book.title}
        </h3>

        <div className="flex flex-col gap-1 mb-3">
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <BookOpen className="w-3.5 h-3.5 text-primary" />
            <span>{book.subject}</span>
          </div>
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <Calendar className="w-3.5 h-3.5 text-primary" />
            <span>{book.semester}</span>
          </div>
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <User className="w-3.5 h-3.5 text-primary" />
            <span>{book.seller}</span>
          </div>
        </div>

        {/* Show requester info */}
        {isRequested && book.requestedByName && showActions && (
          <div className="mb-3 p-2 bg-amber-50 rounded-lg border border-amber-200">
            <p className="text-xs text-amber-700">
              <span className="font-semibold">Requested by:</span> {book.requestedByName}
            </p>
          </div>
        )}

        <div className="flex items-center justify-between">
          <div>
            <span className={`text-xl font-bold ${isSold ? "text-muted-foreground line-through" : "text-primary"}`}>
              ₹{book.price}
            </span>
          </div>
          {!showActions && isAvailable && (
            <button
              onClick={() => onBuy?.(book)}
              className="flex items-center gap-1.5 px-3 py-2 gradient-green text-primary-foreground text-xs font-semibold rounded-lg shadow-button-green hover:opacity-90 transition-opacity"
            >
              <ShoppingCart className="w-3.5 h-3.5" />
              Request
            </button>
          )}
          {!showActions && !isAvailable && (
            <span className={`px-3 py-2 text-xs font-semibold rounded-lg ${statusStyle.bg} ${statusStyle.text}`}>
              {isSold ? "Sold" : "Requested"}
            </span>
          )}
        </div>

        {showActions && (
          <div className="mt-3 pt-3 border-t border-border space-y-2">
            {/* Edit/Delete buttons */}
            <div className="flex gap-2">
              <button
                onClick={() => onEdit?.(book)}
                disabled={isSold}
                className="flex-1 py-2 px-3 bg-primary-light text-primary text-xs font-semibold rounded-lg hover:bg-primary hover:text-primary-foreground transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Edit
              </button>
              <button
                onClick={() => onDelete?.(book)}
                className="flex-1 py-2 px-3 bg-destructive/10 text-destructive text-xs font-semibold rounded-lg hover:bg-destructive hover:text-destructive-foreground transition-colors"
              >
                Delete
              </button>
            </div>
            {/* Mark as Sold button for requested books */}
            {isRequested && (
              <button
                onClick={() => onMarkAsSold?.(book)}
                className="w-full py-2 px-3 gradient-green text-primary-foreground text-xs font-semibold rounded-lg hover:opacity-90 transition-opacity"
              >
                Mark as Sold
              </button>
            )}
          </div>
        )}

        <p className="text-[11px] text-muted-foreground mt-2">
          {typeof book.postedAt === "string" && book.postedAt.includes("T") 
            ? new Date(book.postedAt).toLocaleDateString()
            : book.postedAt}
        </p>
      </div>
    </div>
  );
}
