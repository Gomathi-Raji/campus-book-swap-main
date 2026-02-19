import book1 from "@/assets/book-1.jpg";
import book2 from "@/assets/book-2.jpg";
import book3 from "@/assets/book-3.jpg";
import book4 from "@/assets/book-4.jpg";
import book5 from "@/assets/book-5.jpg";
import book6 from "@/assets/book-6.jpg";

export interface Book {
  id: number;
  title: string;
  subject: string;
  semester: string;
  price: number;
  seller: string;
  image: string;
  description: string;
  condition: string;
  postedAt: string;
}

export const sampleBooks: Book[] = [
  {
    id: 1,
    title: "Engineering Mathematics Vol. 1",
    subject: "Mathematics",
    semester: "Semester 1",
    price: 320,
    seller: "Riya Sharma",
    image: book1,
    description: "Good condition, no highlights. Perfect for first-year students.",
    condition: "Good",
    postedAt: "2 days ago",
  },
  {
    id: 2,
    title: "Principles of Biology",
    subject: "Biology",
    semester: "Semester 2",
    price: 250,
    seller: "Arjun Mehta",
    image: book2,
    description: "Slightly used, all pages intact. Key concepts are color-coded.",
    condition: "Like New",
    postedAt: "1 day ago",
  },
  {
    id: 3,
    title: "Applied Physics for Engineers",
    subject: "Physics",
    semester: "Semester 1",
    price: 180,
    seller: "Priya Nair",
    image: book3,
    description: "Minor highlights in first 2 chapters. Very helpful for exams.",
    condition: "Fair",
    postedAt: "3 days ago",
  },
  {
    id: 4,
    title: "Data Structures & Algorithms",
    subject: "Computer Science",
    semester: "Semester 3",
    price: 450,
    seller: "Karan Verma",
    image: book4,
    description: "Brand new condition, barely used. Contains handwritten notes.",
    condition: "Like New",
    postedAt: "5 hours ago",
  },
  {
    id: 5,
    title: "Microeconomics: Theory & Practice",
    subject: "Economics",
    semester: "Semester 4",
    price: 290,
    seller: "Sneha Gupta",
    image: book5,
    description: "Well maintained, extra practice problems included inside.",
    condition: "Good",
    postedAt: "4 days ago",
  },
  {
    id: 6,
    title: "Literary Theory & Criticism",
    subject: "English Literature",
    semester: "Semester 5",
    price: 150,
    seller: "Amit Patel",
    image: book6,
    description: "Clean copy, no markings. Purchased last semester, no longer needed.",
    condition: "Like New",
    postedAt: "1 week ago",
  },
];
