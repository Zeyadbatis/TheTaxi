import { useState } from "react";
import { Search, AlertCircle, CheckCircle, Clock, MapPin, User, Car } from "lucide-react";
import { getBookings, Booking } from "../utils/storage";
import { validateReferenceNumber } from "../utils/validation";

export default function TrackBooking() {
  const [input, setInput] = useState("");
  const [inputError, setInputError] = useState("");
  const [booking, setBooking] = useState<Booking | null | undefined>(undefined);
  const [searched, setSearched] = useState(false);

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const val = e.target.value;
    setInput(val);
    setInputError("");
    setBooking(undefined);
    setSearched(false);
  }

  function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    const trimmed = input.trim().toUpperCase();

    if (!trimmed) {
      setInputError("Please enter a booking reference number.");
      return;
    }

    const err = validateReferenceNumber(trimmed);
    if (err) {
      setInputError(err);
      return;
    }

    const bookings = getBookings();
    const found = bookings.find((b) => b.referenceNumber.toUpperCase() === trimmed);
    setBooking(found || null);
    setSearched(true);
  }

  function getEstimatedArrival(booking: Booking): string {
    if (booking.status !== "assigned") return "Pending driver assignment";
    const pickup = new Date(`${booking.pickupDate}T${booking.pickupTime}`);
    const now = new Date();
    if (pickup > now) {
      const diffMins = Math.round((pickup.getTime() - now.getTime()) / 60000);
      if (diffMins < 1) return "Driver arriving shortly";
      if (diffMins < 60) return `In about ${diffMins} minutes`;
      const hrs = Math.floor(diffMins / 60);
      const mins = diffMins % 60;
      return mins > 0 ? `In about ${hrs}h ${mins}m` : `In about ${hrs} hour${hrs > 1 ? "s" : ""}`;
    }
    return "Driver arrived / Pickup time passed";
  }

  return (
    <div className="page">
      <div className="container">
        <div style={{ maxWidth: 600, margin: "0 auto" }}>
          <h1 className="page-title">Track Your Booking</h1>
          <p className="page-subtitle">
            Enter your booking reference number to see the current status.
          </p>

          <div className="card mb-6">
            <div className="card-body">
              <form onSubmit={handleSearch}>
                <div className="form-group" style={{ marginBottom: "0.75rem" }}>
                  <label className="form-label" htmlFor="refInput">
                    Booking Reference Number
                  </label>
                  <input
                    id="refInput"
                    type="text"
                    className={`form-control${inputError ? " error" : ""}`}
                    placeholder="e.g. BRN00001"
                    value={input}
                    onChange={handleChange}
                    style={{ textTransform: "uppercase" }}
                    data-testid="input-reference"
                  />
                  {inputError && (
                    <span className="field-error" data-testid="error-reference">
                      <AlertCircle size={13} /> {inputError}
                    </span>
                  )}
                </div>
                <button
                  type="submit"
                  className="btn btn-primary"
                  data-testid="btn-track"
                >
                  <Search size={15} />
                  Track Booking
                </button>
              </form>
            </div>
          </div>

          {searched && booking === null && (
            <div className="alert alert-error" data-testid="alert-not-found">
              <AlertCircle size={16} />
              <span>
                No booking found for <strong>{input.trim().toUpperCase()}</strong>. Please check the reference number and try again.
              </span>
            </div>
          )}

          {searched && booking !== null && booking !== undefined && (
            <div className="card" data-testid="card-booking-details">
              <div className="card-header">
                <div className="flex-between">
                  <div>
                    <div style={{ fontSize: "0.78rem", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.05em", color: "var(--text-muted)" }}>
                      Booking Reference
                    </div>
                    <div style={{ fontFamily: "monospace", fontWeight: 700, fontSize: "1.3rem", color: "var(--text)" }} data-testid="text-booking-reference">
                      {booking.referenceNumber}
                    </div>
                  </div>
                  <span
                    className={`badge ${booking.status === "assigned" ? "badge-success" : "badge-warning"}`}
                    style={{ fontSize: "0.88rem", padding: "0.3rem 0.85rem" }}
                    data-testid="badge-booking-status"
                  >
                    {booking.status}
                  </span>
                </div>
              </div>
              <div className="card-body">
                {booking.status === "unassigned" ? (
                  <div className="alert alert-warning" style={{ marginBottom: "1.25rem" }} data-testid="alert-unassigned">
                    <Clock size={16} />
                    <span>Your booking has been received and is waiting for driver assignment.</span>
                  </div>
                ) : (
                  <div className="alert alert-success" style={{ marginBottom: "1.25rem" }} data-testid="alert-assigned">
                    <CheckCircle size={16} />
                    <span>Your taxi has been assigned. Your driver is on their way!</span>
                  </div>
                )}

                <div className="track-detail">
                  <div className="track-row">
                    <span className="label">Customer Name</span>
                    <span className="value" data-testid="text-track-customer">{booking.customerName}</span>
                  </div>
                  <div className="track-row">
                    <span className="label">Phone</span>
                    <span className="value" data-testid="text-track-phone">{booking.phone}</span>
                  </div>
                  <div className="track-row">
                    <span className="label">
                      <MapPin size={12} style={{ display: "inline", marginRight: 2 }} />
                      Pickup Suburb
                    </span>
                    <span className="value" data-testid="text-track-pickup">{booking.pickupSuburb}</span>
                  </div>
                  <div className="track-row">
                    <span className="label">
                      <MapPin size={12} style={{ display: "inline", marginRight: 2 }} />
                      Destination
                    </span>
                    <span className="value" data-testid="text-track-destination">{booking.destinationSuburb}</span>
                  </div>
                  <div className="track-row">
                    <span className="label">Pickup Date</span>
                    <span className="value" data-testid="text-track-date">{booking.pickupDate}</span>
                  </div>
                  <div className="track-row">
                    <span className="label">Pickup Time</span>
                    <span className="value" data-testid="text-track-time">{booking.pickupTime}</span>
                  </div>
                  <div className="track-row">
                    <span className="label">
                      <User size={12} style={{ display: "inline", marginRight: 2 }} />
                      Assigned Driver
                    </span>
                    <span className="value" data-testid="text-track-driver">
                      {booking.assignedDriver || "Not yet assigned"}
                    </span>
                  </div>
                  <div className="track-row">
                    <span className="label">
                      <Car size={12} style={{ display: "inline", marginRight: 2 }} />
                      Estimated Arrival
                    </span>
                    <span className="value" data-testid="text-track-eta">
                      {getEstimatedArrival(booking)}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
