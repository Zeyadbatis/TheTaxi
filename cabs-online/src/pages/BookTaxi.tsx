import { useState } from "react";
import { CheckCircle, AlertCircle, Calendar, Clock } from "lucide-react";
import {
  validateBookingForm,
  FormErrors,
  BookingFormData,
  NZ_SUBURBS,
} from "../utils/validation";
import {
  generateReferenceNumber,
  saveBookings,
  getBookings,
  Booking,
} from "../utils/storage";

const EMPTY_FORM: BookingFormData = {
  customerName: "",
  phone: "",
  unitNumber: "",
  streetNumber: "",
  streetName: "",
  pickupSuburb: "",
  destinationSuburb: "",
  pickupDate: "",
  pickupTime: "",
};

interface Confirmation {
  referenceNumber: string;
  pickupDate: string;
  pickupTime: string;
  customerName: string;
}

export default function BookTaxi() {
  const [form, setForm] = useState<BookingFormData>(EMPTY_FORM);
  const [errors, setErrors] = useState<FormErrors>({});
  const [confirmation, setConfirmation] = useState<Confirmation | null>(null);

  function handleChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => {
        const next = { ...prev };
        delete next[name];
        return next;
      });
    }
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const errs = validateBookingForm(form);
    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      return;
    }

    const refNum = generateReferenceNumber();
    const booking: Booking = {
      id: crypto.randomUUID(),
      referenceNumber: refNum,
      customerName: form.customerName.trim(),
      phone: form.phone.trim(),
      unitNumber: form.unitNumber?.trim() || undefined,
      streetNumber: form.streetNumber.trim(),
      streetName: form.streetName.trim(),
      pickupSuburb: form.pickupSuburb,
      destinationSuburb: form.destinationSuburb,
      pickupDate: form.pickupDate,
      pickupTime: form.pickupTime,
      status: "unassigned",
      createdAt: new Date().toISOString(),
    };

    const existing = getBookings();
    saveBookings([...existing, booking]);

    setConfirmation({
      referenceNumber: refNum,
      pickupDate: form.pickupDate,
      pickupTime: form.pickupTime,
      customerName: form.customerName.trim(),
    });
    setForm(EMPTY_FORM);
    setErrors({});
  }

  function handleNewBooking() {
    setConfirmation(null);
  }

  const today = new Date().toISOString().split("T")[0];

  return (
    <div className="page">
      <div className="container">
        <div style={{ maxWidth: 720, margin: "0 auto" }}>
          <h1 className="page-title">Book a Taxi</h1>
          <p className="page-subtitle">
            Fill in your details and we'll assign a driver to you.
          </p>

          {confirmation ? (
            <div className="card">
              <div className="card-body">
                <div className="confirmation-box">
                  <h3>
                    <CheckCircle size={20} />
                    Booking Confirmed!
                  </h3>
                  <p style={{ marginBottom: "1rem", color: "#166534" }}>
                    Thank you, <strong>{confirmation.customerName}</strong>. Your booking has been received.
                  </p>
                  <div style={{ marginBottom: "0.5rem" }}>
                    <span style={{ fontSize: "0.8rem", fontWeight: 600, color: "#166534", textTransform: "uppercase", letterSpacing: "0.04em" }}>
                      Booking Reference
                    </span>
                    <div className="ref-number" data-testid="text-reference-number">
                      {confirmation.referenceNumber}
                    </div>
                  </div>
                  <div className="divider" style={{ borderColor: "#86efac" }} />
                  <div style={{ display: "flex", gap: "2rem", flexWrap: "wrap" }}>
                    <div>
                      <span style={{ fontSize: "0.8rem", color: "#166534", fontWeight: 600 }}>
                        Pickup Date
                      </span>
                      <p style={{ color: "#15803d", fontWeight: 600 }}>{confirmation.pickupDate}</p>
                    </div>
                    <div>
                      <span style={{ fontSize: "0.8rem", color: "#166534", fontWeight: 600 }}>
                        Pickup Time
                      </span>
                      <p style={{ color: "#15803d", fontWeight: 600 }}>{confirmation.pickupTime}</p>
                    </div>
                  </div>
                  <p style={{ marginTop: "0.75rem", fontSize: "0.85rem", color: "#166534" }}>
                    Save your reference number to track your booking.
                  </p>
                </div>

                <div style={{ marginTop: "1.25rem", display: "flex", gap: "0.75rem", flexWrap: "wrap" }}>
                  <button
                    className="btn btn-primary"
                    onClick={handleNewBooking}
                    data-testid="btn-new-booking"
                  >
                    Make Another Booking
                  </button>
                  <a className="btn btn-secondary" href="/track" data-testid="link-track-booking">
                    Track This Booking
                  </a>
                </div>
              </div>
            </div>
          ) : (
            <div className="card">
              <div className="card-header">
                <p className="section-title" style={{ margin: 0 }}>Your Details</p>
              </div>
              <div className="card-body">
                <form onSubmit={handleSubmit} noValidate>
                  <div className="form-grid">
                    <div className="form-group">
                      <label className="form-label" htmlFor="customerName">
                        Full Name
                      </label>
                      <input
                        id="customerName"
                        name="customerName"
                        className={`form-control${errors.customerName ? " error" : ""}`}
                        placeholder="e.g. Jane Smith"
                        value={form.customerName}
                        onChange={handleChange}
                        data-testid="input-customer-name"
                      />
                      {errors.customerName && (
                        <span className="field-error" data-testid="error-customer-name">
                          <AlertCircle size={13} /> {errors.customerName}
                        </span>
                      )}
                    </div>

                    <div className="form-group">
                      <label className="form-label" htmlFor="phone">
                        Phone Number
                      </label>
                      <input
                        id="phone"
                        name="phone"
                        type="tel"
                        className={`form-control${errors.phone ? " error" : ""}`}
                        placeholder="e.g. 0211234567"
                        value={form.phone}
                        onChange={handleChange}
                        data-testid="input-phone"
                      />
                      {errors.phone && (
                        <span className="field-error" data-testid="error-phone">
                          <AlertCircle size={13} /> {errors.phone}
                        </span>
                      )}
                    </div>

                    <div className="form-group">
                      <label className="form-label" htmlFor="unitNumber">
                        Unit Number <span className="optional">(optional)</span>
                      </label>
                      <input
                        id="unitNumber"
                        name="unitNumber"
                        className="form-control"
                        placeholder="e.g. 4B"
                        value={form.unitNumber}
                        onChange={handleChange}
                        data-testid="input-unit-number"
                      />
                    </div>

                    <div className="form-group">
                      <label className="form-label" htmlFor="streetNumber">
                        Street Number
                      </label>
                      <input
                        id="streetNumber"
                        name="streetNumber"
                        className={`form-control${errors.streetNumber ? " error" : ""}`}
                        placeholder="e.g. 12"
                        value={form.streetNumber}
                        onChange={handleChange}
                        data-testid="input-street-number"
                      />
                      {errors.streetNumber && (
                        <span className="field-error" data-testid="error-street-number">
                          <AlertCircle size={13} /> {errors.streetNumber}
                        </span>
                      )}
                    </div>

                    <div className="form-group full-width">
                      <label className="form-label" htmlFor="streetName">
                        Street Name
                      </label>
                      <input
                        id="streetName"
                        name="streetName"
                        className={`form-control${errors.streetName ? " error" : ""}`}
                        placeholder="e.g. Queen Street"
                        value={form.streetName}
                        onChange={handleChange}
                        data-testid="input-street-name"
                      />
                      {errors.streetName && (
                        <span className="field-error" data-testid="error-street-name">
                          <AlertCircle size={13} /> {errors.streetName}
                        </span>
                      )}
                    </div>

                    <div className="form-group">
                      <label className="form-label" htmlFor="pickupSuburb">
                        Pickup Suburb
                      </label>
                      <select
                        id="pickupSuburb"
                        name="pickupSuburb"
                        className={`form-control${errors.pickupSuburb ? " error" : ""}`}
                        value={form.pickupSuburb}
                        onChange={handleChange}
                        data-testid="select-pickup-suburb"
                      >
                        <option value="">Select suburb...</option>
                        {NZ_SUBURBS.map((s) => (
                          <option key={s} value={s}>{s}</option>
                        ))}
                      </select>
                      {errors.pickupSuburb && (
                        <span className="field-error" data-testid="error-pickup-suburb">
                          <AlertCircle size={13} /> {errors.pickupSuburb}
                        </span>
                      )}
                    </div>

                    <div className="form-group">
                      <label className="form-label" htmlFor="destinationSuburb">
                        Destination Suburb
                      </label>
                      <select
                        id="destinationSuburb"
                        name="destinationSuburb"
                        className={`form-control${errors.destinationSuburb ? " error" : ""}`}
                        value={form.destinationSuburb}
                        onChange={handleChange}
                        data-testid="select-destination-suburb"
                      >
                        <option value="">Select suburb...</option>
                        {NZ_SUBURBS.map((s) => (
                          <option key={s} value={s}>{s}</option>
                        ))}
                      </select>
                      {errors.destinationSuburb && (
                        <span className="field-error" data-testid="error-destination-suburb">
                          <AlertCircle size={13} /> {errors.destinationSuburb}
                        </span>
                      )}
                    </div>

                    <div className="form-group">
                      <label className="form-label" htmlFor="pickupDate">
                        <Calendar size={14} style={{ display: "inline", marginRight: 4 }} />
                        Pickup Date
                      </label>
                      <input
                        id="pickupDate"
                        name="pickupDate"
                        type="date"
                        min={today}
                        className={`form-control${errors.pickupDate ? " error" : ""}`}
                        value={form.pickupDate}
                        onChange={handleChange}
                        data-testid="input-pickup-date"
                      />
                      {errors.pickupDate && (
                        <span className="field-error" data-testid="error-pickup-date">
                          <AlertCircle size={13} /> {errors.pickupDate}
                        </span>
                      )}
                    </div>

                    <div className="form-group">
                      <label className="form-label" htmlFor="pickupTime">
                        <Clock size={14} style={{ display: "inline", marginRight: 4 }} />
                        Pickup Time
                      </label>
                      <input
                        id="pickupTime"
                        name="pickupTime"
                        type="time"
                        className={`form-control${errors.pickupTime ? " error" : ""}`}
                        value={form.pickupTime}
                        onChange={handleChange}
                        data-testid="input-pickup-time"
                      />
                      {errors.pickupTime && (
                        <span className="field-error" data-testid="error-pickup-time">
                          <AlertCircle size={13} /> {errors.pickupTime}
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="divider" />

                  <button
                    type="submit"
                    className="btn btn-primary btn-lg"
                    data-testid="btn-submit-booking"
                  >
                    Confirm Booking
                  </button>
                </form>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
