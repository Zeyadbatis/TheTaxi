import { useEffect } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import BookTaxi from "./pages/BookTaxi";
import AdminDashboard from "./pages/AdminDashboard";
import DriverDirectory from "./pages/DriverDirectory";
import TrackBooking from "./pages/TrackBooking";
import { initializeSampleData } from "./utils/storage";

function NotFound() {
  return (
    <div className="page">
      <div className="container">
        <div className="empty-state" style={{ paddingTop: "5rem" }}>
          <h2 style={{ fontSize: "1.5rem", marginBottom: "0.5rem" }}>Page Not Found</h2>
          <p>The page you are looking for does not exist.</p>
          <a href="/" className="btn btn-primary mt-4" style={{ display: "inline-flex" }}>
            Go Home
          </a>
        </div>
      </div>
    </div>
  );
}

export default function App() {
  useEffect(() => {
    initializeSampleData();
  }, []);

  return (
    <BrowserRouter basename={import.meta.env.BASE_URL}>
      <Navbar />
      <Routes>
        <Route path="/" element={<BookTaxi />} />
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/drivers" element={<DriverDirectory />} />
        <Route path="/track" element={<TrackBooking />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
}
