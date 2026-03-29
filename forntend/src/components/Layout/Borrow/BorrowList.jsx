import React, { useState, useEffect } from "react";
import { getMyBorrows, returnBook } from "../../services/api";
import toast from "react-hot-toast";
import { Calendar, CheckCircle, AlertCircle } from "lucide-react";

const BorrowList = () => {
  const [borrows, setBorrows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [returning, setReturning] = useState(null);

  useEffect(() => {
    fetchBorrows();
  }, []);

  const fetchBorrows = async () => {
    try {
      const response = await getMyBorrows();
      setBorrows(response.data);
    } catch (error) {
      toast.error("Failed to fetch borrows");
    } finally {
      setLoading(false);
    }
  };

  const handleReturn = async (borrowId) => {
    setReturning(borrowId);
    try {
      await returnBook(borrowId);
      toast.success("Book returned successfully");
      fetchBorrows();
    } catch (error) {
      toast.error("Failed to return book");
    } finally {
      setReturning(null);
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case "borrowed":
        return (
          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
            <AlertCircle size={12} className="mr-1" />
            Borrowed
          </span>
        );
      case "returned":
        return (
          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
            <CheckCircle size={12} className="mr-1" />
            Returned
          </span>
        );
      case "overdue":
        return (
          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">
            <AlertCircle size={12} className="mr-1" />
            Overdue
          </span>
        );
      default:
        return null;
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-xl text-gray-600">Loading...</div>
      </div>
    );
  }

  if (borrows.length === 0) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl text-gray-600">No borrowed books</h2>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold mb-6">My Borrowed Books</h2>

      <div className="space-y-4">
        {borrows.map((borrow) => (
          <div key={borrow._id} className="bg-white rounded-lg shadow-md p-6">
            <div className="flex justify-between items-start">
              <div className="flex-1">
                <h3 className="text-xl font-semibold mb-2">
                  {borrow.book?.title}
                </h3>
                <p className="text-gray-600 mb-2">{borrow.book?.description}</p>

                <div className="flex items-center space-x-4 text-sm text-gray-500">
                  <div className="flex items-center space-x-1">
                    <Calendar size={16} />
                    <span>
                      Borrowed: {new Date(borrow.borrowDate).toLocaleDateString()}
                    </span>
                  </div>

                  {borrow.returnDate && (
                    <div className="flex items-center space-x-1">
                      <CheckCircle size={16} />
                      <span>
                        Returned: {new Date(borrow.returnDate).toLocaleDateString()}
                      </span>
                    </div>
                  )}
                </div>
              </div>

              <div className="flex flex-col items-end space-y-2">
                {getStatusBadge(borrow.status)}

                {borrow.status === "borrowed" && (
                  <button
                    onClick={() => handleReturn(borrow._id)}
                    disabled={returning === borrow._id}
                    className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition disabled:opacity-50"
                  >
                    {returning === borrow._id ? "Returning..." : "Return Book"}
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default BorrowList;