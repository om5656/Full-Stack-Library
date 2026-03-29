import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { BookOpen, ShoppingCart, LogOut, User } from "lucide-react";

const Navbar = () => {
  const { user, logout, isAuthenticated, isAdmin } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <nav className="bg-blue-600 text-white shadow-lg">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2 text-xl font-bold">
            <BookOpen size={24} />
            <span>Library App</span>
          </Link>

          {/* Navigation Links */}
          <div className="flex items-center space-x-6">
            {isAuthenticated ? (
              <>
                <Link to="/books" className="hover:text-blue-200 transition">
                  Books
                </Link>

                {!isAdmin && (
                  <>
                    <Link
                      to="/cart"
                      className="flex items-center space-x-1 hover:text-blue-200 transition"
                    >
                      <ShoppingCart size={20} />
                      <span>Cart</span>
                    </Link>
                    <Link to="/borrows" className="hover:text-blue-200 transition">
                      My Borrows
                    </Link>
                  </>
                )}

                {isAdmin && (
                  <Link to="/admin/add-book" className="hover:text-blue-200 transition">
                    Add Book
                  </Link>
                )}

                <div className="flex items-center space-x-3">
                  <div className="flex items-center space-x-1">
                    <User size={20} />
                    <span>{user?.username}</span>
                  </div>
                  <button
                    onClick={handleLogout}
                    className="flex items-center space-x-1 hover:text-blue-200 transition"
                  >
                    <LogOut size={20} />
                    <span>Logout</span>
                  </button>
                </div>
              </>
            ) : (
              <>
                <Link to="/login" className="hover:text-blue-200 transition">
                  Login
                </Link>
                <Link to="/register" className="hover:text-blue-200 transition">
                  Register
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;