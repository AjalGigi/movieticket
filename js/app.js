// ─── App.js — Main Application Logic ─────────────────────────────────────────

// ─── Navbar Scroll Effect ─────────────────────────────────────────────────────
document.addEventListener("DOMContentLoaded", () => {
    const navbar = document.querySelector(".navbar");
    if (navbar) {
        const onScroll = () => {
            navbar.classList.toggle("scrolled", window.scrollY > 10);
        };
        window.addEventListener("scroll", onScroll, { passive: true });
        onScroll();
    }

    // Set active nav link
    const current = window.location.pathname.split("/").pop() || "index.html";
    document.querySelectorAll(".nav-links a").forEach(link => {
        const href = link.getAttribute("href");
        if (href === current || (current === "" && href === "index.html")) {
            link.classList.add("active");
        }
    });

    // Page-specific init
    const page = document.body.dataset.page;
    if (page === "home") initHome();
    else if (page === "movies") initMovies();
    else if (page === "movie-detail") initMovieDetail();
    else if (page === "booking") initBooking();
    else if (page === "confirmation") initConfirmation();
    else if (page === "my-bookings") initMyBookings();
});

// ─── Movie Card Factory ───────────────────────────────────────────────────────
function createMovieCard(movie, size = "normal") {
    const genres = movie.genre.slice(0, 2).map(g => `<span class="genre-chip">${g}</span>`).join("");
    const certClass = { U: "cert-u", UA: "cert-ua", A: "cert-a" }[movie.certificate] || "cert-ua";
    const statusBadge = movie.status === "now_showing"
        ? `<span class="movie-card-badge badge-now">Now Showing</span>`
        : `<span class="movie-card-badge badge-soon">Coming Soon</span>`;
    const bookBtn = movie.status === "now_showing"
        ? `<a href="movie-detail.html?id=${movie.id}" class="btn btn-primary btn-sm">Book Now</a>`
        : `<span style="color:var(--text-muted);font-size:0.8rem">Coming Soon</span>`;

    const card = document.createElement("div");
    card.className = "movie-card fade-in";
    card.innerHTML = `
    <div class="movie-card-poster">
      <img src="${movie.poster}" alt="${movie.title}" loading="lazy" onerror="this.src='https://via.placeholder.com/400x600/141824/9aa0b8?text=${encodeURIComponent(movie.title)}'">
      ${statusBadge}
      <div class="movie-card-rating">⭐ ${movie.rating}</div>
      <div class="movie-card-overlay">${bookBtn}</div>
    </div>
    <div class="movie-card-body">
      <div class="movie-card-title">${movie.title}</div>
      <div class="movie-card-meta">
        ${genres}
        <span class="cert-chip ${certClass}">${movie.certificate}</span>
        <span class="movie-duration">🕐 ${movie.duration}</span>
      </div>
    </div>
  `;
    if (movie.status === "now_showing") {
        card.addEventListener("click", (e) => {
            if (!e.target.closest("a")) window.location.href = `movie-detail.html?id=${movie.id}`;
        });
        card.style.cursor = "pointer";
    }
    return card;
}

// ─── HOME PAGE ────────────────────────────────────────────────────────────────
function initHome() {
    // Hero search
    const heroSearchInput = document.getElementById("heroSearch");
    const heroSearchBtn = document.getElementById("heroSearchBtn");
    if (heroSearchBtn) {
        const doSearch = () => {
            const q = heroSearchInput?.value.trim();
            window.location.href = q ? `movies.html?q=${encodeURIComponent(q)}` : "movies.html";
        };
        heroSearchBtn.addEventListener("click", doSearch);
        heroSearchInput?.addEventListener("keydown", e => e.key === "Enter" && doSearch());
    }

    // Now Showing
    const nowGrid = document.getElementById("nowShowingGrid");
    if (nowGrid) {
        const nowMovies = MOVIES.filter(m => m.status === "now_showing");
        nowMovies.forEach(m => nowGrid.appendChild(createMovieCard(m)));
        nowGrid.classList.add("stagger");
    }

    // Coming Soon
    const soonScroll = document.getElementById("comingSoonScroll");
    if (soonScroll) {
        const soonMovies = MOVIES.filter(m => m.status === "coming_soon");
        soonMovies.forEach(m => soonScroll.appendChild(createMovieCard(m)));
    }
}

// ─── MOVIES PAGE ─────────────────────────────────────────────────────────────
function initMovies() {
    const grid = document.getElementById("moviesGrid");
    const searchInput = document.getElementById("searchInput");
    const genreFilter = document.getElementById("genreFilter");
    const langFilter = document.getElementById("langFilter");
    const sortFilter = document.getElementById("sortFilter");
    const chips = document.querySelectorAll(".filter-chip");
    const resultsCount = document.getElementById("resultsCount");

    let activeGenre = "all";

    // Preset query from URL
    const urlQ = getParam("q");
    if (urlQ && searchInput) searchInput.value = urlQ;

    // Genre chips
    chips.forEach(chip => {
        chip.addEventListener("click", () => {
            chips.forEach(c => c.classList.remove("active"));
            chip.classList.add("active");
            activeGenre = chip.dataset.genre;
            renderGrid();
        });
    });

    [searchInput, genreFilter, langFilter, sortFilter].forEach(el => {
        el?.addEventListener("input", renderGrid);
        el?.addEventListener("change", renderGrid);
    });

    function renderGrid() {
        if (!grid) return;
        grid.innerHTML = "";
        const q = searchInput?.value.toLowerCase() || "";
        const lang = langFilter?.value || "all";
        const sort = sortFilter?.value || "rating";

        let filtered = MOVIES.filter(m => {
            const matchQ = !q || m.title.toLowerCase().includes(q) || m.genre.some(g => g.toLowerCase().includes(q));
            const matchGenre = activeGenre === "all" || m.genre.some(g => g.toLowerCase().includes(activeGenre.toLowerCase()));
            const matchLang = lang === "all" || m.language.toLowerCase() === lang.toLowerCase();
            return matchQ && matchGenre && matchLang;
        });

        filtered.sort((a, b) => {
            if (sort === "rating") return b.rating - a.rating;
            if (sort === "title") return a.title.localeCompare(b.title);
            if (sort === "duration") return parseInt(a.duration) - parseInt(b.duration);
            return 0;
        });

        if (resultsCount) resultsCount.textContent = `${filtered.length} movie${filtered.length !== 1 ? "s" : ""} found`;

        if (!filtered.length) {
            const noRes = document.createElement("div");
            noRes.className = "no-results";
            noRes.innerHTML = `<div style="font-size:3rem;margin-bottom:1rem">🎬</div><p>No movies found. Try a different search.</p>`;
            grid.appendChild(noRes);
            return;
        }

        filtered.forEach((m, i) => {
            const card = createMovieCard(m);
            card.style.animationDelay = `${i * 0.05}s`;
            grid.appendChild(card);
        });
    }

    renderGrid();
}

// ─── MOVIE DETAIL PAGE ────────────────────────────────────────────────────────
function initMovieDetail() {
    const movieId = parseInt(getParam("id"));
    const movie = MOVIES.find(m => m.id === movieId);

    if (!movie) {
        document.body.innerHTML = `<div style="text-align:center;padding:5rem;">
      <div style="font-size:3rem">🎬</div>
      <h2 style="margin:1rem 0">Movie not found</h2>
      <a href="index.html" class="btn btn-primary">Go Home</a>
    </div>`;
        return;
    }

    // Fill in hero
    document.getElementById("heroImg").src = movie.backdrop || movie.poster;
    document.getElementById("heroPosterImg").src = movie.poster;
    document.getElementById("movieTitle").textContent = movie.title;
    document.getElementById("movieTitleBc").textContent = movie.title;
    document.getElementById("movieRating").textContent = movie.rating;
    document.getElementById("movieDuration").textContent = movie.duration;
    document.getElementById("movieCert").textContent = movie.certificate;
    document.getElementById("movieLang").textContent = movie.language;
    document.getElementById("movieDirector").textContent = movie.director;
    document.getElementById("movieSynopsis").textContent = movie.synopsis;
    document.title = `${movie.title} — CinéBook`;

    // Genres
    const genresEl = document.getElementById("heroGenres");
    movie.genre.forEach(g => {
        const chip = document.createElement("span");
        chip.className = "genre-chip";
        chip.textContent = g;
        genresEl.appendChild(chip);
    });

    // Cast
    const castEl = document.getElementById("castList");
    movie.cast.forEach(name => {
        const initials = name.split(" ").map(n => n[0]).join("").slice(0, 2);
        const colors = ["#7b2ff7,#3a86ff", "#e63946,#7b2ff7", "#00b4d8,#22c55e", "#f5c518,#e63946"];
        const grad = colors[Math.floor(Math.random() * colors.length)];
        castEl.innerHTML += `<div class="cast-item">
      <div class="cast-avatar" style="background:linear-gradient(135deg,${grad})">${initials}</div>
      <span class="cast-name">${name}</span>
    </div>`;
    });

    // Showtimes
    const allShowtimes = getShowtimes(movie.id);
    const uniqueDates = [...new Map(allShowtimes.map(s => [s.date, s])).values()];

    const datesContainer = document.getElementById("dateTabs");
    const showtimesContainer = document.getElementById("showtimesContainer");
    let selectedDate = uniqueDates[0]?.date;
    let selectedShow = null;

    function renderDates() {
        datesContainer.innerHTML = "";
        uniqueDates.forEach(d => {
            const btn = document.createElement("button");
            btn.className = `date-tab ${d.date === selectedDate ? "active" : ""}`;
            btn.innerHTML = `<span>${d.label}</span>`;
            btn.addEventListener("click", () => {
                selectedDate = d.date;
                selectedShow = null;
                renderDates();
                renderShowtimes();
                updateProceedBtn();
            });
            datesContainer.appendChild(btn);
        });
    }

    function renderShowtimes() {
        showtimesContainer.innerHTML = "";
        const dayShows = allShowtimes.filter(s => s.date === selectedDate);
        dayShows.forEach(block => {
            const div = document.createElement("div");
            div.className = "cinema-block";
            div.innerHTML = `
        <div class="cinema-name">${block.cinema.name}</div>
        <div class="cinema-location">📍 ${block.cinema.location}</div>
        <div class="time-slots"></div>
      `;
            const slotsEl = div.querySelector(".time-slots");
            block.times.forEach(ts => {
                const slot = document.createElement("button");
                slot.className = "time-slot";
                const showKey = `${movie.id}-${block.date}-${block.cinema.id}-${ts.time}`;
                slot.innerHTML = `<span class="time">${ts.time}</span><span class="format">${ts.format}</span>`;
                if (selectedShow?.key === showKey) slot.classList.add("active");
                slot.addEventListener("click", () => {
                    document.querySelectorAll(".time-slot").forEach(s => s.classList.remove("active"));
                    slot.classList.add("active");
                    selectedShow = { key: showKey, time: ts.time, format: ts.format, cinema: block.cinema, date: block.date, dateLabel: block.label };
                    updateSeatMap();
                    updateProceedBtn();
                });
                slotsEl.appendChild(slot);
            });
            showtimesContainer.appendChild(div);
        });
    }

    // Seat Map
    let seatSelector = null;
    let currentSelection = { seats: [], total: 0 };

    function updateSeatMap() {
        if (!selectedShow) return;
        const mapSection = document.getElementById("seatMapSection");
        mapSection.style.display = "block";
        mapSection.scrollIntoView({ behavior: "smooth", block: "start" });
        seatSelector = new SeatSelector("seatMapContainer", selectedShow.key, (sel) => {
            currentSelection = sel;
            renderPriceSummary();
            updateProceedBtn();
        });
        currentSelection = { seats: [], total: 0 };
        renderPriceSummary();
    }

    function renderPriceSummary() {
        const seats = currentSelection.seats;
        const subtotal = currentSelection.total;
        const fee = seats.length > 0 ? BOOKING_FEE * seats.length : 0;
        const total = subtotal + fee;

        const seatsDisplay = document.getElementById("selectedSeatsDisplay");
        seatsDisplay.innerHTML = seats.length
            ? seats.map(s => `<span class="seat-tag">${s.id}</span>`).join("")
            : `<span style="color:var(--text-muted);font-size:0.85rem">No seats selected</span>`;

        document.getElementById("priceSubtotal").textContent = formatCurrency(subtotal);
        document.getElementById("priceFee").textContent = formatCurrency(fee);
        document.getElementById("priceTotal").textContent = formatCurrency(total);
    }

    function updateProceedBtn() {
        const btn = document.getElementById("proceedBtn");
        if (!btn) return;
        const canProceed = selectedShow && currentSelection.seats.length > 0;
        btn.disabled = !canProceed;
        btn.textContent = canProceed
            ? `Book ${currentSelection.seats.length} Seat${currentSelection.seats.length > 1 ? "s" : ""} — ${formatCurrency(currentSelection.total + BOOKING_FEE * currentSelection.seats.length)}`
            : "Select Showtime & Seats";
    }

    document.getElementById("proceedBtn")?.addEventListener("click", () => {
        if (!selectedShow || !currentSelection.seats.length) return;
        setBookingSession({
            movie,
            show: selectedShow,
            seats: currentSelection.seats,
            subtotal: currentSelection.total,
            fee: BOOKING_FEE * currentSelection.seats.length,
            total: currentSelection.total + BOOKING_FEE * currentSelection.seats.length
        });
        window.location.href = "booking.html";
    });

    renderDates();
    renderShowtimes();
    renderPriceSummary();
    updateProceedBtn();
}

// ─── BOOKING PAGE ─────────────────────────────────────────────────────────────
function initBooking() {
    const session = getBookingSession();
    if (!session) { window.location.href = "index.html"; return; }

    const { movie, show, seats, subtotal, fee, total } = session;

    // Fill summary
    document.getElementById("summaryPoster").src = movie.backdrop || movie.poster;
    document.getElementById("summaryMovie").textContent = movie.title;
    document.getElementById("summaryDate").textContent = `${formatDate(show.date)}`;
    document.getElementById("summaryTime").textContent = `${show.time} · ${show.format}`;
    document.getElementById("summaryCinema").textContent = show.cinema.name;
    document.getElementById("summarySeats").textContent = seats.map(s => s.id).join(", ");
    document.getElementById("summarySubtotal").textContent = formatCurrency(subtotal);
    document.getElementById("summaryFee").textContent = formatCurrency(fee);
    document.getElementById("summaryTotal").textContent = formatCurrency(total);
    document.getElementById("movieTitleBc").textContent = movie.title;

    // ── Payment Tab Switching ──────────────────────────────────────────────────
    const cardFields = document.getElementById("cardFields");
    const upiFields = document.getElementById("upiFields");
    let activeMethod = "card";

    document.querySelectorAll(".pay-tab").forEach(tab => {
        tab.addEventListener("click", () => {
            const method = tab.dataset.method;
            if (method === "netbanking") return; // handled by onclick toast

            activeMethod = method;
            // Style tabs
            document.querySelectorAll(".pay-tab").forEach(t => {
                const isActive = t === tab;
                t.style.borderColor = isActive ? "var(--border-gold)" : "var(--border)";
                t.style.background = isActive ? "rgba(245,197,24,0.10)" : "transparent";
                t.style.color = isActive ? "var(--gold)" : "var(--text-secondary)";
                t.style.fontWeight = isActive ? "700" : "600";
                if (isActive) t.classList.add("active");
                else t.classList.remove("active");
            });
            // Show/hide panels
            if (cardFields) cardFields.style.display = method === "card" ? "" : "none";
            if (upiFields) upiFields.style.display = method === "upi" ? "" : "none";
        });
    });

    // Card number formatting
    document.getElementById("cardNumber")?.addEventListener("input", function () {
        let val = this.value.replace(/\D/g, "").slice(0, 16);
        this.value = val.replace(/(.{4})/g, "$1 ").trim();
    });

    document.getElementById("cardExpiry")?.addEventListener("input", function () {
        let val = this.value.replace(/\D/g, "").slice(0, 4);
        if (val.length >= 3) val = val.slice(0, 2) + "/" + val.slice(2);
        this.value = val;
    });

    document.getElementById("cardCvv")?.addEventListener("input", function () {
        this.value = this.value.replace(/\D/g, "").slice(0, 3);
    });

    // Form submission
    document.getElementById("bookingForm")?.addEventListener("submit", function (e) {
        e.preventDefault();

        // Validate payment fields
        if (activeMethod === "card") {
            const num = document.getElementById("cardNumber")?.value.replace(/\s/g, "");
            const exp = document.getElementById("cardExpiry")?.value;
            const cvv = document.getElementById("cardCvv")?.value;
            const name = document.getElementById("cardName")?.value.trim();
            if (!num || num.length < 16) { showToast("Enter a valid 16-digit card number.", "error"); return; }
            if (!exp || exp.length < 5) { showToast("Enter a valid expiry date (MM/YY).", "error"); return; }
            if (!cvv || cvv.length < 3) { showToast("Enter a valid 3-digit CVV.", "error"); return; }
            if (!name) { showToast("Enter the name on your card.", "error"); return; }
        } else if (activeMethod === "upi") {
            const upiId = document.getElementById("upiId")?.value.trim();
            if (!upiId || !upiId.includes("@")) { showToast("Enter a valid UPI ID (e.g. ajal@okaxis).", "error"); return; }
        }

        const btn = document.getElementById("confirmBtn");
        btn.disabled = true;
        btn.innerHTML = `<span class="spinner" style="width:20px;height:20px;border-width:2px;margin:0"></span> Processing...`;

        setTimeout(() => {
            const bookingId = generateBookingId();
            const booking = {
                id: bookingId,
                movie,
                show,
                seats,
                subtotal,
                fee,
                total,
                name: document.getElementById("guestName").value,
                email: document.getElementById("guestEmail").value,
                phone: document.getElementById("guestPhone").value,
                paymentMethod: activeMethod,
                bookedAt: new Date().toISOString(),
                status: "confirmed"
            };
            saveBooking(booking);
            sessionStorage.setItem("confirmedBookingId", bookingId);
            clearBookingSession();
            window.location.href = "confirmation.html";
        }, 1800);
    });
}

// ─── CONFIRMATION PAGE ────────────────────────────────────────────────────────
function initConfirmation() {
    const bookingId = sessionStorage.getItem("confirmedBookingId");
    if (!bookingId) { window.location.href = "index.html"; return; }

    const bookings = getBookings();
    const booking = bookings.find(b => b.id === bookingId);
    if (!booking) { window.location.href = "index.html"; return; }

    document.getElementById("confirmBookingId").textContent = booking.id;
    document.getElementById("confirmMovie").textContent = booking.movie.title;
    document.getElementById("confirmName").textContent = booking.name;
    document.getElementById("confirmDate").textContent = formatDate(booking.show.date);
    document.getElementById("confirmTime").textContent = `${booking.show.time} · ${booking.show.format}`;
    document.getElementById("confirmCinema").textContent = booking.show.cinema.name;
    document.getElementById("confirmSeats").textContent = booking.seats.map(s => s.id).join(", ");
    document.getElementById("confirmTotal").textContent = formatCurrency(booking.total);
    document.getElementById("bookingIdDisplay").textContent = booking.id;

    document.getElementById("printBtn")?.addEventListener("click", () => window.print());
}

// ─── MY BOOKINGS PAGE ─────────────────────────────────────────────────────────
function initMyBookings() {
    const list = document.getElementById("bookingsList");
    const emptyState = document.getElementById("emptyState");

    function render() {
        const bookings = getBookings();
        list.innerHTML = "";

        if (!bookings.length) {
            emptyState.style.display = "block";
            return;
        }
        emptyState.style.display = "none";

        bookings.forEach(b => {
            const card = document.createElement("div");
            card.className = "booking-item-card fade-in";
            const isCancelled = b.status === "cancelled" || b.status === "refunded";
            const isRefunded = b.status === "refunded";
            const methodIcon = b.paymentMethod === "upi" ? "📱 UPI" : "💳 Card";
            card.innerHTML = `
        <div class="booking-item-inner">
          <div class="booking-item-poster">
            <img src="${b.movie.poster}" alt="${b.movie.title}" onerror="this.src='https://via.placeholder.com/120x180/141824/9aa0b8?text=🎬'">
          </div>
          <div class="booking-item-body">
            <div class="booking-item-title ${isCancelled ? "text-muted" : ""}">${b.movie.title}
            </div>
            <div class="booking-item-detail">📅 ${formatDate(b.show.date)}</div>
            <div class="booking-item-detail">🕐 ${b.show.time} · ${b.show.format}</div>
            <div class="booking-item-detail">📍 ${b.show.cinema.name}</div>
            <div class="booking-item-detail">🎫 ${b.seats.map(s => s.id).join(", ")}</div>
            ${b.paymentMethod ? `<div class="booking-item-detail">💰 Paid via ${methodIcon}</div>` : ""}
            ${isRefunded ? `<div class="booking-item-detail" style="color:#22c55e;font-weight:600">↩ Refund of ${formatCurrency(b.total)} initiated · 5–7 business days</div>` : ""}
            <div class="booking-item-actions">
              <div>
                <div style="font-size:0.78rem;color:var(--text-muted);margin-bottom:4px">Booking ID</div>
                <div style="font-family:monospace;font-size:0.85rem;color:var(--gold)">${b.id}</div>
              </div>
              <div style="display:flex;align-items:center;gap:0.75rem;flex-wrap:wrap">
                <span class="booking-status-badge ${isRefunded ? "status-refunded" : isCancelled ? "status-cancelled" : "status-confirmed"}">
                  ${isRefunded ? "↩ Refunded" : isCancelled ? "Cancelled" : "✓ Confirmed"}
                </span>
                <span style="font-weight:700;color:${isCancelled ? 'var(--text-muted)' : 'var(--gold)'}">${formatCurrency(b.total)}</span>
                ${!isCancelled ? `<button class="btn btn-danger btn-sm cancel-btn" data-id="${b.id}">Cancel</button>` : ""}
              </div>
            </div>
          </div>
        </div>
      `;
            list.appendChild(card);
        });

        // Cancel buttons
        list.querySelectorAll(".cancel-btn").forEach(btn => {
            btn.addEventListener("click", () => openCancelModal(btn.dataset.id));
        });
    }

    // Modal
    const modal = document.getElementById("cancelModal");
    let cancelTargetId = null;

    function openCancelModal(bookingId) {
        cancelTargetId = bookingId;
        modal.classList.add("active");
    }

    document.getElementById("modalCancelBtn")?.addEventListener("click", () => {
        modal.classList.remove("active");
        cancelTargetId = null;
    });

    document.getElementById("modalConfirmBtn")?.addEventListener("click", () => {
        if (!cancelTargetId) return;
        // Mark as refunded with timestamp
        const bookings = getBookings().map(b =>
            b.id === cancelTargetId
                ? { ...b, status: "refunded", refundAt: new Date().toISOString() }
                : b
        );
        localStorage.setItem("movieBookings", JSON.stringify(bookings));
        modal.classList.remove("active");
        cancelTargetId = null;
        showToast("Booking cancelled. Refund will be credited in 5–7 business days.", "success");
        render();
    });

    modal.addEventListener("click", e => {
        if (e.target === modal) modal.classList.remove("active");
    });

    render();
}
