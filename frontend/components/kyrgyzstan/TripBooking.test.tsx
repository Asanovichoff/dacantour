import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { TripBooking } from "./TripBooking";
import type { Trip } from "@/lib/data";
import { kgTrips } from "@/lib/data";

const baseTrip = kgTrips[0];

const tripWith = (departures: Trip["departures"]): Trip => ({ ...baseTrip, departures });

describe("TripBooking", () => {
  it("shows the price and difficulty", () => {
    render(<TripBooking trip={baseTrip} />);
    expect(screen.getByText(`$${baseTrip.priceFrom.toLocaleString()}`)).toBeInTheDocument();
    expect(screen.getByText(baseTrip.difficulty)).toBeInTheDocument();
  });

  it("lists open departures with remaining spots", () => {
    const trip = tripWith([
      { startDate: "2026-06-14", endDate: "2026-06-21", capacity: 12, spotsTaken: 5, status: "open" },
    ]);
    render(<TripBooking trip={trip} />);
    expect(screen.getByText("7 spots left")).toBeInTheDocument();
  });

  it("uses the singular for a single remaining spot", () => {
    const trip = tripWith([
      { startDate: "2026-06-14", endDate: "2026-06-21", capacity: 12, spotsTaken: 11, status: "open" },
    ]);
    render(<TripBooking trip={trip} />);
    expect(screen.getByText("1 spot left")).toBeInTheDocument();
  });

  it("disables a full departure", () => {
    const trip = tripWith([
      { startDate: "2026-08-09", endDate: "2026-08-16", capacity: 12, spotsTaken: 12, status: "full" },
    ]);
    render(<TripBooking trip={trip} />);
    expect(screen.getByText("Full")).toBeInTheDocument();
    const button = screen.getByText("Full").closest("button");
    expect(button).toBeDisabled();
  });

  it("hides closed departures entirely", () => {
    const trip = tripWith([
      { startDate: "2026-06-14", endDate: "2026-06-21", capacity: 12, spotsTaken: 5, status: "open" },
      { startDate: "2025-06-14", endDate: "2025-06-21", capacity: 12, spotsTaken: 12, status: "closed" },
    ]);
    render(<TripBooking trip={trip} />);
    expect(screen.queryByText(/2025/)).not.toBeInTheDocument();
  });

  it("works when departures have no id (CMS-authored rows)", () => {
    const trip = tripWith([
      { startDate: "2026-07-12", endDate: "2026-07-19", capacity: 10, spotsTaken: 2, status: "open" },
    ]);
    render(<TripBooking trip={trip} />);
    // Appears twice: the departure button, and the inquiry form's context line.
    // Also guards the timezone bug where "2026-07-12" rendered as "Jul 11".
    expect(screen.getAllByText(/Jul 12–19, 2026/).length).toBeGreaterThanOrEqual(2);
    expect(screen.getByRole("button", { name: /send inquiry/i })).toBeInTheDocument();
  });

  it("still renders the inquiry form with no departures", () => {
    render(<TripBooking trip={tripWith([])} />);
    expect(screen.getByRole("button", { name: /send inquiry/i })).toBeInTheDocument();
  });
});
