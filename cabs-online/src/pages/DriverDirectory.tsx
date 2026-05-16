import { useState, useEffect } from "react";
import { Search, Phone, Car, MapPin, User } from "lucide-react";
import { getDrivers, Driver } from "../utils/storage";

export default function DriverDirectory() {
  const [drivers, setDrivers] = useState<Driver[]>([]);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<"All" | "Available" | "Busy">("All");

  useEffect(() => {
    setDrivers(getDrivers());
  }, []);

  const filtered = drivers.filter((d) => {
    const q = search.toLowerCase();
    const matchesSearch =
      !q ||
      d.id.toLowerCase().includes(q) ||
      d.name.toLowerCase().includes(q) ||
      d.suburb.toLowerCase().includes(q);
    const matchesStatus = statusFilter === "All" || d.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const availableCount = drivers.filter((d) => d.status === "Available").length;
  const busyCount = drivers.filter((d) => d.status === "Busy").length;

  function getInitials(name: string) {
    return name
      .split(" ")
      .map((p) => p[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  }

  return (
    <div className="page">
      <div className="container">
        <h1 className="page-title">Driver Directory</h1>
        <p className="page-subtitle">
          Browse available drivers across Auckland.
        </p>

        <div className="stats-row" style={{ gridTemplateColumns: "repeat(3, 1fr)", maxWidth: 480, marginBottom: "1.5rem" }}>
          <div className="stat-card">
            <div className="stat-value" data-testid="stat-total-drivers">{drivers.length}</div>
            <div className="stat-label">Total Drivers</div>
          </div>
          <div className="stat-card">
            <div className="stat-value" style={{ color: "var(--success)" }} data-testid="stat-available">{availableCount}</div>
            <div className="stat-label">Available</div>
          </div>
          <div className="stat-card">
            <div className="stat-value" style={{ color: "var(--warning)" }} data-testid="stat-busy">{busyCount}</div>
            <div className="stat-label">Busy</div>
          </div>
        </div>

        <div className="filters-row">
          <div className="search-bar">
            <Search size={16} style={{ color: "var(--text-muted)", flexShrink: 0 }} />
            <input
              type="search"
              placeholder="Search by ID, name or suburb..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              data-testid="input-search-driver"
            />
          </div>

          <div style={{ display: "flex", gap: "0.4rem" }}>
            {(["All", "Available", "Busy"] as const).map((s) => (
              <button
                key={s}
                className={`btn btn-sm ${statusFilter === s ? "btn-primary" : "btn-secondary"}`}
                onClick={() => setStatusFilter(s)}
                data-testid={`btn-filter-${s.toLowerCase()}`}
              >
                {s}
              </button>
            ))}
          </div>
        </div>

        {filtered.length === 0 ? (
          <div className="empty-state">
            <User size={32} />
            <p>No drivers found matching your search.</p>
          </div>
        ) : (
          <div className="driver-grid">
            {filtered.map((driver) => (
              <div className="driver-card" key={driver.id} data-testid={`card-driver-${driver.id}`}>
                <div className="driver-card-header">
                  <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
                    <div className="driver-avatar" data-testid={`avatar-driver-${driver.id}`}>
                      {getInitials(driver.name)}
                    </div>
                    <div>
                      <div style={{ fontWeight: 600 }} data-testid={`text-driver-name-${driver.id}`}>
                        {driver.name}
                      </div>
                      <div style={{ fontSize: "0.8rem", color: "var(--text-muted)", fontFamily: "monospace" }}>
                        {driver.id}
                      </div>
                    </div>
                  </div>
                  <span
                    className={`badge ${driver.status === "Available" ? "badge-success" : "badge-warning"}`}
                    data-testid={`badge-driver-status-${driver.id}`}
                  >
                    {driver.status}
                  </span>
                </div>

                <div className="driver-info">
                  <p>
                    <Phone size={13} />
                    <span data-testid={`text-driver-phone-${driver.id}`}>{driver.phone}</span>
                  </p>
                  <p>
                    <Car size={13} />
                    <span data-testid={`text-driver-car-${driver.id}`}>{driver.carModel}</span>
                  </p>
                  <p>
                    <MapPin size={13} />
                    <span data-testid={`text-driver-suburb-${driver.id}`}>{driver.suburb}</span>
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
