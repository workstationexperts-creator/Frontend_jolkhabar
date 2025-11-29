import React, { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import "./Header.css";

const Header = ({ token, setToken, categories = [], isAdmin }) => {
  const navigate = useNavigate();
  const location = useLocation();

  const [menuOpen, setMenuOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [username, setUsername] = useState("User");

  // Read active tab from URL for admin
  const params = new URLSearchParams(location.search);
  const currentTab = params.get("tab");

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user"));
    if (storedUser?.firstname) {
      setUsername(`${storedUser.firstname} ${storedUser.lastname || ""}`.trim());
    }
  }, [token]);

  const handleLogout = () => {
    localStorage.clear();
    setToken(null);
    navigate("/login");
  };

  // ================================
  // ADMIN HEADER
  // ================================
const isOnAdminPage = location.pathname.startsWith("/admin-dashboard");

if (isOnAdminPage) {
    return (
      <header className="header">
        <nav className="nav">

          {/* LEFT — Home */}
          <div className="nav-left">
            <button className="menu-toggle" onClick={() => setMenuOpen(!menuOpen)}>☰</button>
            <Link to="/admin-dashboard?tab=orders" className="nav-link home-link">
              Home
            </Link>
          </div>

          {/* CENTER — search + admin menu */}
          <div className="nav-center">

            <div className="search-bar">
              <input type="text" className="search-input" placeholder="Search..." />
            </div>

            <Link
              to="/admin-dashboard?tab=orders"
              className={`nav-link ${currentTab === "orders" ? "active" : ""}`}
            >
              Manage Orders
            </Link>

            <Link
              to="/admin-dashboard?tab=products"
              className={`nav-link ${currentTab === "products" ? "active" : ""}`}
            >
              Manage Products
            </Link>

            <Link
              to="/admin-dashboard?tab=categories"
              className={`nav-link ${currentTab === "categories" ? "active" : ""}`}
            >
              Manage Categories
            </Link>
          </div>

          {/* RIGHT — user */}
          <div className="nav-right">
            <div className="user-dropdown" onClick={() => setDropdownOpen(!dropdownOpen)}>
              👤 {username} ▼
              <div className={`dropdown-menu ${dropdownOpen ? "show" : ""}`}>
                <button onClick={handleLogout} className="dropdown-link">
                  Logout
                </button>
              </div>
            </div>
          </div>

          {/* MOBILE DRAWER */}
          <div className={`nav-links ${menuOpen ? "open" : ""}`}>
            <button className="close-btn" onClick={() => setMenuOpen(false)}>✕</button>

            <Link
              to="/admin-dashboard?tab=orders"
              onClick={() => setMenuOpen(false)}
            >
              Home
            </Link>

            <div className="search-bar mobile-only">
              <input type="text" className="search-input mobile" placeholder="Search..." />
            </div>

            <Link
              to="/admin-dashboard?tab=orders"
              onClick={() => setMenuOpen(false)}
            >
              Manage Orders
            </Link>

            <Link
              to="/admin-dashboard?tab=products"
              onClick={() => setMenuOpen(false)}
            >
              Manage Products
            </Link>

            <Link
              to="/admin-dashboard?tab=categories"
              onClick={() => setMenuOpen(false)}
            >
              Manage Categories
            </Link>

            <button className="nav-link" onClick={handleLogout}>Logout</button>
          </div>

          {menuOpen && <div className="overlay" onClick={() => setMenuOpen(false)} />}
        </nav>
      </header>
    );
  }

  // ================================
  // USER HEADER
  // ================================
  return (
    <header className="header">
      <nav className="nav">

        {/* LEFT — burger + home */}
        <div className="nav-left">
          <button className="menu-toggle" onClick={() => setMenuOpen(!menuOpen)}>☰</button>
          <Link to="/" className="nav-link home-link">Home</Link>
        </div>

        {/* CENTER — search + categories */}
        <div className="nav-center">

          <div className="search-bar">
            <input type="text" className="search-input" placeholder="Search products..." />
          </div>

          {categories.map((c) => (
            <Link key={c.id} to={`/category/${c.id}`} className="nav-link">
              {c.name}
            </Link>
          ))}

          <Link to="/about" className="nav-link">About Us</Link>
          <Link to="/cart" className="nav-link">Cart</Link>
        </div>

        {/* RIGHT — user */}
        <div className="nav-right">
          {!token ? (
            <>
              <Link to="/login" className="nav-link">Login</Link>
              <Link to="/register" className="button">Sign Up</Link>
            </>
          ) : (
            <div className="user-dropdown" onClick={() => setDropdownOpen(!dropdownOpen)}>
              👤 {username} ▼
              <div className={`dropdown-menu ${dropdownOpen ? "show" : ""}`}>
                <Link to="/orders" className="dropdown-link">My Orders</Link>
                <button onClick={handleLogout} className="dropdown-link">Logout</button>
              </div>
            </div>
          )}
        </div>

        {/* MOBILE DRAWER */}
        <div className={`nav-links ${menuOpen ? "open" : ""}`}>
          <button className="close-btn" onClick={() => setMenuOpen(false)}>✕</button>

          <Link to="/" onClick={() => setMenuOpen(false)}>Home</Link>

          <div className="search-bar mobile-only">
            <input type="text" className="search-input mobile" placeholder="Search products..." />
          </div>

          {categories.map((c) => (
            <Link key={c.id} to={`/category/${c.id}`} onClick={() => setMenuOpen(false)}>
              {c.name}
            </Link>
          ))}

          <Link to="/about" onClick={() => setMenuOpen(false)}>About Us</Link>
          <Link to="/cart" onClick={() => setMenuOpen(false)}>Cart</Link>

          {!token ? (
            <>
              <Link to="/login" className="nav-link">Login</Link>
              <Link to="/register" className="button">Sign Up</Link>
            </>
          ) : (
            <>
              <Link to="/orders" className="nav-link">My Orders</Link>
              <button className="nav-link" onClick={handleLogout}>Logout</button>
            </>
          )}
        </div>

        {menuOpen && <div className="overlay" onClick={() => setMenuOpen(false)} />}
      </nav>
    </header>
  );
};

export default Header;
