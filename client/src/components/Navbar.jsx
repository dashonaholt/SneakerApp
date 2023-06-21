import React, { useState } from "react";
import { Link } from "react-router-dom";

export default function Navbar(props) {
  const { token, logout } = props;
  const [menuOpen, setMenuOpen] = useState(false);

  const handleMenuToggle = () => {
    setMenuOpen(!menuOpen); 
  };

  return (
    <div className="navbar">
      <div className={`menu-toggle ${menuOpen ? "open" : ""}`} onClick={handleMenuToggle}>
        <div className="bar"></div>
        <div className="bar"></div>
        <div className="bar"></div>
      </div>
      {menuOpen && ( 
        <div className="menu">
          {token && <Link to="/profile">Profile</Link>} 
          <Link to="/public">Sneakers</Link>
          {!token && <Link to="/">Login</Link>}
          {token && <button onClick={logout}>Logout</button>}
        </div>
      )}
    </div>
  );
}
