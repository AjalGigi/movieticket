// ─── Seat Selector Component ──────────────────────────────────────────────────
class SeatSelector {
    constructor(containerId, showKey, onChange) {
        this.container = document.getElementById(containerId);
        this.showKey = showKey;
        this.onChange = onChange;
        this.selectedSeats = new Set();
        this.bookedSeats = getBookedSeats(showKey);
        this.render();
    }

    render() {
        this.container.innerHTML = "";

        // Screen
        const screen = document.createElement("div");
        screen.className = "seat-screen";
        screen.innerHTML = `<div class="screen-bar"></div><p>SCREEN</p>`;
        this.container.appendChild(screen);

        // Seat grid
        const grid = document.createElement("div");
        grid.className = "seat-grid";

        SEAT_CONFIG.rows.forEach(row => {
            const rowEl = document.createElement("div");
            rowEl.className = "seat-row";

            const rowLabel = document.createElement("span");
            rowLabel.className = "row-label";
            rowLabel.textContent = row.label;
            rowEl.appendChild(rowLabel);

            const seatsEl = document.createElement("div");
            seatsEl.className = "seats-group";

            for (let i = 1; i <= row.count; i++) {
                const seatId = `${row.label}${i}`;
                const seat = document.createElement("button");
                seat.className = `seat seat-${row.type}`;
                seat.dataset.id = seatId;
                seat.dataset.type = row.type;
                seat.dataset.price = row.price;
                seat.title = `${seatId} · ${row.type.charAt(0).toUpperCase() + row.type.slice(1)} · ₹${row.price}`;

                // Add aisle gap in middle
                if (i === Math.ceil(row.count / 2)) {
                    seatsEl.appendChild(document.createElement("div")).className = "aisle";
                }

                if (this.bookedSeats.has(seatId)) {
                    seat.classList.add("seat-booked");
                    seat.disabled = true;
                    seat.title += " (Booked)";
                } else {
                    seat.addEventListener("click", () => this.toggleSeat(seat, seatId, row.type, row.price));
                }

                seatsEl.appendChild(seat);
            }

            rowEl.appendChild(seatsEl);

            const priceTag = document.createElement("span");
            priceTag.className = "row-price";
            priceTag.textContent = `₹${row.price}`;
            rowEl.appendChild(priceTag);

            grid.appendChild(rowEl);
        });

        this.container.appendChild(grid);

        // Legend
        const legend = document.createElement("div");
        legend.className = "seat-legend";
        legend.innerHTML = `
      <div class="legend-item"><span class="legend-dot dot-available"></span>Available</div>
      <div class="legend-item"><span class="legend-dot dot-selected"></span>Selected</div>
      <div class="legend-item"><span class="legend-dot dot-booked"></span>Booked</div>
      <div class="legend-item"><span class="legend-dot dot-standard"></span>Standard ₹200</div>
      <div class="legend-item"><span class="legend-dot dot-premium"></span>Premium ₹350</div>
      <div class="legend-item"><span class="legend-dot dot-vip"></span>VIP ₹600</div>
    `;
        this.container.appendChild(legend);
    }

    toggleSeat(seatEl, seatId, type, price) {
        if (this.selectedSeats.has(seatId)) {
            this.selectedSeats.delete(seatId);
            seatEl.classList.remove("seat-selected");
        } else {
            if (this.selectedSeats.size >= 10) {
                showToast("Maximum 10 seats can be selected.", "warning");
                return;
            }
            this.selectedSeats.add(seatId);
            seatEl.classList.add("seat-selected");
        }
        this.onChange(this.getSelection());
    }

    getSelection() {
        const seats = [];
        let total = 0;
        this.selectedSeats.forEach(id => {
            const row = SEAT_CONFIG.rows.find(r => id.startsWith(r.label));
            if (row) {
                seats.push({ id, type: row.type, price: row.price });
                total += row.price;
            }
        });
        return { seats, total };
    }
}
