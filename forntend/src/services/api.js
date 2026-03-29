import axios from "axios";

const API_URL = process.env.REACT_APP_API_URL;

const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json"
  }
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

export const register = (userData) => api.post("/user/register", userData);
export const login = (userData) => api.post("/user/login", userData);

export const getAllBooks = () => api.get("/user/books");
export const getBookById = (id) => api.get(`/user/books/${id}`);

export const addBook = (formData) =>
  api.post("/admin/book", formData, {
    headers: { "Content-Type": "multipart/form-data" }
  });

export const updateBook = (id, formData) =>
  api.put(`/admin/book/${id}`, formData, {
    headers: { "Content-Type": "multipart/form-data" }
  });

export const deleteBook = (id) => api.delete(`/admin/book/${id}`);

export const addToCart = (bookId) => api.post("/user/cart", { bookId });
export const getCart = () => api.get("/user/cart");
export const removeFromCart = (bookId) => api.delete(`/user/cart/${bookId}`);

export const borrowBook = (bookId) => api.post(`/user/borrow/${bookId}`);
export const returnBook = (borrowId) => api.put(`/user/borrow/${borrowId}/return`);
export const getMyBorrows = () => api.get("/user/borrows");

export default api;