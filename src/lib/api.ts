const API_BASE_URL = import.meta.env.VITE_API_URL || "/api";

function getToken(): string | null {
  return localStorage.getItem("bookxchange_token");
}

function authHeaders(): HeadersInit {
  const token = getToken();
  const headers: HeadersInit = { "Content-Type": "application/json" };
  if (token) headers["Authorization"] = `Bearer ${token}`;
  return headers;
}

async function handleResponse(res: Response) {
  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.error || "Something went wrong");
  }
  return data;
}

// ---------- Auth API ----------

export async function apiLogin(email: string, password: string) {
  const res = await fetch(`${API_BASE_URL}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });
  return handleResponse(res);
}

export async function apiSignup(name: string, email: string, password: string) {
  const res = await fetch(`${API_BASE_URL}/auth/signup`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name, email, password }),
  });
  return handleResponse(res);
}

export async function apiGetMe() {
  const res = await fetch(`${API_BASE_URL}/auth/me`, {
    headers: authHeaders(),
  });
  return handleResponse(res);
}

export async function apiGetAllUsers() {
  const res = await fetch(`${API_BASE_URL}/auth/users`, {
    headers: authHeaders(),
  });
  return handleResponse(res);
}

export async function apiDeleteUser(userId: string) {
  const res = await fetch(`${API_BASE_URL}/auth/users/${userId}`, {
    method: "DELETE",
    headers: authHeaders(),
  });
  return handleResponse(res);
}

// ---------- Books API ----------

export async function apiGetBooks(params?: {
  query?: string;
  subject?: string;
  semester?: string;
  status?: string;
}) {
  const searchParams = new URLSearchParams();
  if (params?.query) searchParams.set("query", params.query);
  if (params?.subject) searchParams.set("subject", params.subject);
  if (params?.semester) searchParams.set("semester", params.semester);
  if (params?.status) searchParams.set("status", params.status);

  const url = `${API_BASE_URL}/books?${searchParams.toString()}`;
  const res = await fetch(url);
  return handleResponse(res);
}

export async function apiGetUserBooks(userId: string) {
  const res = await fetch(`${API_BASE_URL}/books/user/${userId}`, {
    headers: authHeaders(),
  });
  return handleResponse(res);
}

export async function apiGetRecommendations(subject?: string, semester?: string, excludeId?: string) {
  const searchParams = new URLSearchParams();
  if (subject) searchParams.set("subject", subject);
  if (semester) searchParams.set("semester", semester);
  if (excludeId) searchParams.set("excludeId", excludeId);

  const url = `${API_BASE_URL}/books/recommendations?${searchParams.toString()}`;
  const res = await fetch(url);
  return handleResponse(res);
}

export async function apiCreateBook(book: {
  title: string;
  subject: string;
  semester: string;
  price: number;
  condition: string;
  description: string;
  image?: string;
}) {
  const res = await fetch(`${API_BASE_URL}/books`, {
    method: "POST",
    headers: authHeaders(),
    body: JSON.stringify(book),
  });
  return handleResponse(res);
}

export async function apiUpdateBook(id: string, updates: Record<string, unknown>) {
  const res = await fetch(`${API_BASE_URL}/books/${id}`, {
    method: "PUT",
    headers: authHeaders(),
    body: JSON.stringify(updates),
  });
  return handleResponse(res);
}

export async function apiRequestBook(bookId: string) {
  const res = await fetch(`${API_BASE_URL}/books/${bookId}/request`, {
    method: "PUT",
    headers: authHeaders(),
  });
  return handleResponse(res);
}

export async function apiMarkAsSold(bookId: string) {
  const res = await fetch(`${API_BASE_URL}/books/${bookId}/sold`, {
    method: "PUT",
    headers: authHeaders(),
  });
  return handleResponse(res);
}

export async function apiDeleteBook(id: string) {
  const res = await fetch(`${API_BASE_URL}/books/${id}`, {
    method: "DELETE",
    headers: authHeaders(),
  });
  return handleResponse(res);
}
