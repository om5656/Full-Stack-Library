import React, { useState, useEffect } from "react";
import { getCart, removeFromCart, borrowBook } from "../../services/api";
import toast from "react-hot-toast";
import { Trash2 } from "lucide-react";

const Cart = () => {
  const [cart, setCart] = useState({ books: [], totalPrice: 0 });
  const [loading, setLoading] = useState(true);
  const [borrowing, setBorrowing] = useState(false);

  useEffect(() => {
    fetchCart();
  }, []);

  const fetchCart = async () => {
    try {
      const response = await getCart();
      setCart(response.data);
    } catch (error) {
      toast.error("Failed to fetch cart");
    } finally {
      setLoading(false);
    }
  };

  const handleRemove = async (bookId) => {
    try {
      await removeFromCart(bookId);
      toast.success("Book removed from cart");
      fetchCart();
    } catch (error) {
      toast.error("Failed to remove book");
    }
  };

  const handleBorrowAll = async () => {
    if (cart.books.length === 0) {
      toast.error("Cart is empty");
      return;
    }

    setBorrowing(true);
    let successCount = 0;

    for (const book of cart.books) {
      try {
        await borrowBook(book._id);
        successCount++;
        await removeFromCart(book._id);
      } catch (error) {
        toast.error(`Failed to borrow "${book.title}"`);
      }
    }

    if (successCount > 0) {
      toast.success(`Successfully borrowed ${successCount} books`);
    }

    setBorrowing(false);
    fetchCart();
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-xl text-gray-600">Loading...</div>
      </div>
    );
  }

  if (cart.books.length === 0) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl text-gray-600">Your cart is empty</h2>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold mb-6">Shopping Cart</h2>

      <div className="bg-white rounded-lg shadow-md">
        {cart.books.map((book) => (
          <div
            key={book._id}
            className="flex justify-between items-center p-4 border-b last:border-b-0"
          >
            <div className="flex-1">
              <h3 className="text-lg font-semibold">{book.title}</h3>
              <p className="text-gray-600 text-sm">
                {book.description?.substring(0, 100)}...
              </p>
              <p className="text-blue-600 font-bold mt-1">${book.price}</p>
            </div>

            <button
              onClick={() => handleRemove(book._id)}
              className="p-2 text-red-600 hover:bg-red-50 rounded transition"
            >
              <Trash2 size={20} />
            </button>
          </div>
        ))}

        <div className="p-4 bg-gray-50 rounded-b-lg">
          <div className="flex justify-between items-center">
            <span className="text-xl font-bold">Total:</span>
            <span className="text-2xl font-bold text-blue-600">
              ${cart.totalPrice}
            </span>
          </div>

          <button
            onClick={handleBorrowAll}
            disabled={borrowing}
            className="w-full mt-4 bg-green-600 text-white py-3 rounded-lg hover:bg-green-700 transition disabled:opacity-50"
          >
            {borrowing ? "Processing..." : "Borrow All Books"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Cart;