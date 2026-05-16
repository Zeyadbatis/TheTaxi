import { useState } from "react";
import { NavLink } from "react-router-dom";
import { Menu, X, Car } from "lucide-react";

export default function Navbar() {
  const [open, setOpen] = useState(false);

  return (
    <nav className="navbar">
      <div className="container navbar-inner" style={{ position: "relative" }}>
        <NavLink to="/" className="navbar-brand" data-testid="nav-brand">
          <span className="taxi-icon">🚕</span>
          CabsOnline
        </NavLink>

        <button
          className="hamburger"
          onClick={() => setOpen((o) => !o)}
          aria-label="Toggle menu"
          data-testid="btn-hamburger"
        >
          {open ? <X size={22} /> : <Menu size={22} />}
        </button>

        <ul className={`navbar-nav${open ? " open" : ""}`}>
          <li>
            <NavLink
              to="/"
              end
              className={({ isActive }) => (isActive ? "active" : "")}
              onClick={() => setOpen(false)}
              data-testid="nav-book"
            >
              Book Taxi
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/admin"
              className={({ isActive }) => (isActive ? "active" : "")}
              onClick={() => setOpen(false)}
              data-testid="nav-admin"
            >
              Admin Dashboard
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/drivers"
              className={({ isActive }) => (isActive ? "active" : "")}
              onClick={() => setOpen(false)}
              data-testid="nav-drivers"
            >
              Drivers
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/track"
              className={({ isActive }) => (isActive ? "active" : "")}
              onClick={() => setOpen(false)}
              data-testid="nav-track"
            >
              Track Booking
            </NavLink>
          </li>
        </ul>
      </div>
    </nav>
  );
}
