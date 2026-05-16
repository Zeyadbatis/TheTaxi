import { useState, useEffect } from "react";
import { Search, AlertCircle, CheckCircle, Clock, Users } from "lucide-react";
import {
  getBookings,
  getDrivers,
  saveBookings,
  saveDrivers,
  Booking,
  Driver,
} from "../utils/storage";
import { validateReferenceNumber } from "../utils/validation";

function isUrgent(booking: Booking): boolean {
  if (booking.status !== "unassigned") return false;
  const pickupDateTime = new Date(`${booking.pickupDate}T${booking.pickupTime}`);
  const now = new Date();
  const diffMs = pickupDateTime.getTime() - now.getTime();
  return diffMs >= 0 && diffMs <= 2 * 60 * 60 * 1000;
}

function formatDateTime(date: string, time: string) {
  return `${date}  ${time}`;
}

export default function AdminDashboard() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [drivers, setDrivers] = useState<Driver[]>([]);
  const [search, setSearch] = useState("");
  const [searchError, setSearchError] = useState("");
  const [assigningId, setAssigningId] = useState<string | null>(null);
  const [selectedDriver, setSelectedDriver] = useState<string>("");
  const [confirmation, setConfirmation] = useState<string | null>(null);

  function reload() {
    setBookings(getBookings());
    setDrivers(getDrivers());
  }

  useEffect(() => {
    reload();
  }, []);

  function handleSearchChange(e: React.ChangeEvent<HTMLInputElement>) {
    const val = e.target.value;
    setSearch(val);
    setSearchError("");
    setConfirmation(null);

    if (val.trim()) {
      const err = validateReferenceNumber(val.trim());
      if (err) setSearchError(err);
    }
  }

  function getDisplayedBookings(): Booking[] {
    const trimmed = search.trim().toUpperCase();
    if (!trimmed) {
      return bookings.filter(isUrgent);
    }
    if (searchError) return [];
    return bookings.filter(
      (b) => b.referenceNumber.toUpperCase() === trimmed
    );
  }

  function handleStartAssign(bookingId: string) {
    setAssigningId(bookingId);
    setSelectedDriver("");
    setConfirmation(null);
  }

  function handleConfirmAssign(booking: Booking) {
    if (!selectedDriver) return;
    const driver = drivers.find((d) => d.id === selectedDriver);
    if (!driver) return;

    const updatedBookings = bookings.map((b) =>
      b.id === booking.id
        ? { ...b, status: "assigned" as const, assignedDriver: driver.name, assignedDriverId: driver.id }
        : b
    );
    const updatedDrivers = drivers.map((d) =>
      d.id === driver.id ? { ...d, status: "Busy" as const } : d
    );

    saveBookings(updatedBookings);
    saveDrivers(updatedDrivers);
    setBookings(updatedBookings);
    setDrivers(updatedDrivers);
    setAssigningId(null);
    setSelectedDriver("");
    setConfirmation(
      `Driver ${driver.name} has been assigned to booking ${booking.referenceNumber}.`
    );
  }

  const displayed = getDisplayedBookings();
  const availableDrivers = drivers.filter((d) => d.status === "Available");

  const totalBookings = bookings.length;
  const unassignedCount = bookings.filter((b) => b.status === "unassigned").length;
  const assignedCount = bookings.filter((b) => b.status === "assigned").length;
  const availableCount = availableDrivers.length;

  const showingUrgent = !search.trim();

  return (
    <div className="page">
      <div className="container">
        <h1 className="page-title">Admin Dashboard</h1>
        <p className="page-subtitle">
          Manage bookings and assign drivers.
        </p>

        <div className="stats-row">
          <div className="stat-card">
            <div className="stat-value" data-testid="stat-total">{totalBookings}</div>
            <div className="stat-label">Total Bookings</div>
          </div>
          <div className="stat-card">
            <div className="stat-value" style={{ color: "var(--warning)" }} data-testid="stat-unassigned">
              {unassignedCount}
            </div>
            <div className="stat-label">Unassigned</div>
          </div>
          <div className="stat-card">
            <div className="stat-value" style={{ color: "var(--success)" }} data-testid="stat-assigned">
              {assignedCount}
            </div>
            <div className="stat-label">Assigned</div>
          </div>
          <div className="stat-card">
            <div className="stat-value" style={{ color: "var(--info)" }} data-testid="stat-available-drivers">
              {availableCount}
            </div>
            <div className="stat-label">Available Drivers</div>
          </div>
        </div>

        {confirmation && (
          <div className="alert alert-success mb-4" data-testid="alert-assignment-success">
            <CheckCircle size={16} />
            <span>{confirmation}</span>
          </div>
        )}

        <div className="card">
          <div className="card-header">
            <div className="flex-between">
              <div>
                <p className="section-title" style={{ margin: 0 }}>
                  {showingUrgent ? (
                    <>
                      <Clock size={16} style={{ display: "inline", marginRight: 6, color: "var(--warning)" }} />
                      Urgent Bookings (pickup within 2 hours)
                    </>
                  ) : (
                    "Search Results"
                  )}
                </p>
                <p style={{ fontSize: "0.82rem", color: "var(--text-muted)", marginTop: "0.2rem" }}>
                  {showingUrgent
                    ? "Showing unassigned bookings with pickup within 2 hours. Search for a reference to see all bookings."
                    : "Showing results for the entered reference number."}
                </p>
              </div>
              <div className="search-bar" data-testid="search-bar">
                <Search size={16} style={{ color: "var(--text-muted)", flexShrink: 0 }} />
                <input
                  type="search"
                  placeholder="Search BRN00001..."
                  value={search}
                  onChange={handleSearchChange}
                  data-testid="input-search"
                />
              </div>
            </div>

            {searchError && (
              <div className="alert alert-error" style={{ marginTop: "0.75rem" }} data-testid="error-search">
                <AlertCircle size={15} />
                {searchError}
              </div>
            )}
          </div>

          <div className="table-wrapper" style={{ borderRadius: 0, border: "none" }}>
            {displayed.length === 0 ? (
              <div className="empty-state">
                {search.trim() && !searchError ? (
                  <>
                    <Search size={32} />
                    <p data-testid="text-not-found">No booking found for <strong>{search.trim().toUpperCase()}</strong>.</p>
                  </>
                ) : (
                  <>
                    <Clock size={32} />
                    <p>No urgent bookings at this time.</p>
                    <p style={{ fontSize: "0.82rem", marginTop: "0.3rem" }}>
                      Search for a reference number to find any booking.
                    </p>
                  </>
                )}
              </div>
            ) : (
              <table>
                <thead>
                  <tr>
                    <th>Reference</th>
                    <th>Customer</th>
                    <th>Phone</th>
                    <th>Pickup</th>
                    <th>Destination</th>
                    <th>Date &amp; Time</th>
                    <th>Status</th>
                    <th>Driver</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {displayed.map((booking) => (
                    <tr key={booking.id} data-testid={`row-booking-${booking.referenceNumber}`}>
                      <td>
                        <span style={{ fontWeight: 600, fontFamily: "monospace" }}>
                          {booking.referenceNumber}
                        </span>
                      </td>
                      <td>{booking.customerName}</td>
                      <td>{booking.phone}</td>
                      <td>{booking.pickupSuburb}</td>
                      <td>{booking.destinationSuburb}</td>
                      <td style={{ whiteSpace: "nowrap" }}>
                        {formatDateTime(booking.pickupDate, booking.pickupTime)}
                      </td>
                      <td>
                        <span
                          className={`badge ${
                            booking.status === "assigned" ? "badge-success" : "badge-warning"
                          }`}
                          data-testid={`badge-status-${booking.referenceNumber}`}
                        >
                          {booking.status}
                        </span>
                      </td>
                      <td>{booking.assignedDriver || <span style={{ color: "var(--text-muted)" }}>—</span>}</td>
                      <td>
                        {booking.status === "unassigned" ? (
                          assigningId === booking.id ? (
                            <div style={{ display: "flex", gap: "0.4rem", alignItems: "center", flexWrap: "wrap" }}>
                              <select
                                className="form-control"
                                style={{ padding: "0.3rem 2rem 0.3rem 0.5rem", fontSize: "0.82rem", minWidth: 130 }}
                                value={selectedDriver}
                                onChange={(e) => setSelectedDriver(e.target.value)}
                                data-testid={`select-driver-${booking.referenceNumber}`}
                              >
                                <option value="">Pick driver...</option>
                                {availableDrivers.map((d) => (
                                  <option key={d.id} value={d.id}>
                                    {d.name} ({d.suburb})
                                  </option>
                                ))}
                              </select>
                              <button
                                className="btn btn-success btn-sm"
                                onClick={() => handleConfirmAssign(booking)}
                                disabled={!selectedDriver}
                                data-testid={`btn-confirm-assign-${booking.referenceNumber}`}
                              >
                                Assign
                              </button>
                              <button
                                className="btn btn-secondary btn-sm"
                                onClick={() => setAssigningId(null)}
                                data-testid={`btn-cancel-assign-${booking.referenceNumber}`}
                              >
                                Cancel
                              </button>
                            </div>
                          ) : (
                            <button
                              className="btn btn-primary btn-sm"
                              onClick={() => handleStartAssign(booking.id)}
                              data-testid={`btn-assign-${booking.referenceNumber}`}
                            >
                              <Users size={13} /> Assign Driver
                            </button>
                          )
                        ) : (
                          <span style={{ color: "var(--success)", fontSize: "0.82rem", fontWeight: 600 }}>
                            ✓ Assigned
                          </span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
