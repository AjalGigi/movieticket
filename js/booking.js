// ─── Booking Logic ─────────────────────────────────────────────────────────────

const STORAGE_KEY = "movieBookings";

function getBookings() {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
}

function saveBooking(booking) {
    const bookings = getBookings();
    bookings.unshift(booking);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(bookings));
}

function cancelBooking(bookingId) {
    const bookings = getBookings().filter(b => b.id !== bookingId);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(bookings));
}

function generateBookingId() {
    return "BK" + Date.now().toString(36).toUpperCase() + Math.random().toString(36).substr(2, 4).toUpperCase();
}

// ─── Session state (passed between pages via sessionStorage) ──────────────────
function setBookingSession(data) {
    sessionStorage.setItem("bookingSession", JSON.stringify(data));
}

function getBookingSession() {
    const raw = sessionStorage.getItem("bookingSession");
    return raw ? JSON.parse(raw) : null;
}

function clearBookingSession() {
    sessionStorage.removeItem("bookingSession");
}

// ─── Toast Notification ───────────────────────────────────────────────────────
function showToast(message, type = "info") {
    const existing = document.querySelector(".toast");
    if (existing) existing.remove();

    const toast = document.createElement("div");
    toast.className = `toast toast-${type}`;
    toast.innerHTML = `
    <span class="toast-icon">${type === "success" ? "✓" : type === "warning" ? "⚠" : "ℹ"}</span>
    <span>${message}</span>
  `;
    document.body.appendChild(toast);
    requestAnimationFrame(() => toast.classList.add("toast-show"));
    setTimeout(() => {
        toast.classList.remove("toast-show");
        setTimeout(() => toast.remove(), 400);
    }, 3000);
}

// ─── URL Params Helper ────────────────────────────────────────────────────────
function getParam(key) {
    return new URLSearchParams(window.location.search).get(key);
}

// ─── Format currency ──────────────────────────────────────────────────────────
function formatCurrency(amount) {
    return "₹" + amount.toLocaleString("en-IN");
}

// ─── Format date ──────────────────────────────────────────────────────────────
function formatDate(dateStr) {
    return new Date(dateStr).toLocaleDateString("en-IN", { weekday: "long", year: "numeric", month: "long", day: "numeric" });
}

// ─── Render Star Rating ───────────────────────────────────────────────────────
function renderStars(rating) {
    const full = Math.floor(rating / 2);
    const half = rating % 2 >= 1 ? 1 : 0;
    const empty = 5 - full - half;
    return "★".repeat(full) + (half ? "½" : "") + "☆".repeat(empty);
}
