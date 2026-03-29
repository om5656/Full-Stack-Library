import React from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { addToCart } from "../../services/api";
import toast from "react-hot-toast";

const BookCard = ({ book, onDelete }) => {
  const navigate = useNavigate();
  const { isAuthenticated, isAdmin } = useAuth();

  const handleAddToCart = async (e) => {
    e.stopPropagation();

    if (!isAuthenticated) {
      toast.error("Please login first");
      navigate("/login");
      return;
    }

    try {
      await addToCart(book._id);
      toast.success("Book added to cart!");
    } catch (error) {
      toast.error(error.response?.data?.msg || "Failed to add to cart");
    }
  };

  const handleDelete = async (e) => {
    e.stopPropagation();
    if (window.confirm("Are you sure you want to delete this book?")) {
      onDelete(book._id);
    }
  };

  const handleEdit = (e) => {
    e.stopPropagation();
    navigate(`/admin/edit-book/${book._id}`);
  };

  return (
    <div
      onClick={() => navigate(`/books/${book._id}`)}
      className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition cursor-pointer"
    >
      <div className="p-6">
        <h3 className="text-xl font-semibold mb-2">{book.title}</h3>
        <p className="text-gray-600 mb-4 line-clamp-3">
          {book.description || "No description available"}
        </p>

        <div className="flex justify-between items-center">
          <span className="text-2xl font-bold text-blue-600">${book.price}</span>

          <div className="space-x-2">
            {!isAdmin && (
              <button
                onClick={handleAddToCart}
                className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition"
              >
                Add to Cart
              </button>
            )}

            {isAdmin && (
              <>
                <button
                  onClick={handleEdit}
                  className="px-4 py-2 bg-yellow-600 text-white rounded hover:bg-yellow-700 transition"
                >
                  Edit
                </button>
                <button
                  onClick={handleDelete}
                  className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition"
                >
                  Delete
                </button>
              </>
            )}
          </div>
        </div>

        <div className="mt-2">
          <span
            className={`inline-block px-2 py-1 text-xs rounded ${
              book.available
                ? "bg-green-100 text-green-800"
                : "bg-red-100 text-red-800"
            }`}
          >
            {book.available ? "Available" : "Borrowed"}
          </span>
        </div>
      </div>
    </div>
  );
};

export default BookCard;