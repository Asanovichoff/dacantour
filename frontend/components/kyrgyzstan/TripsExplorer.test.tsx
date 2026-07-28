import { describe, it, expect } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { TripsExplorer } from "./TripsExplorer";
import { kgTrips, categories } from "@/lib/data";

describe("TripsExplorer", () => {
  it("shows every trip by default", () => {
    render(<TripsExplorer trips={kgTrips} categories={categories} />);
    expect(screen.getByText(new RegExp(`Showing`))).toBeInTheDocument();
    for (const trip of kgTrips) {
      expect(screen.getByText(trip.title)).toBeInTheDocument();
    }
  });

  it("filters trips when a category chip is clicked", async () => {
    const user = userEvent.setup();
    render(<TripsExplorer trips={kgTrips} categories={categories} />);

    await user.click(screen.getByRole("button", { name: /horse riding/i }));

    const expected = kgTrips.filter((t) => t.categories.includes("horse-riding"));
    const excluded = kgTrips.filter((t) => !t.categories.includes("horse-riding"));
    expect(expected.length).toBeGreaterThan(0);

    for (const trip of expected) expect(screen.getByText(trip.title)).toBeInTheDocument();
    // Filtered-out cards animate away (AnimatePresence), so wait for the exit.
    await waitFor(() => {
      for (const trip of excluded) expect(screen.queryByText(trip.title)).not.toBeInTheDocument();
    });
  });

  it("honours an initial category from the URL", () => {
    render(<TripsExplorer trips={kgTrips} categories={categories} initialCategory="trekking" />);
    const expected = kgTrips.filter((t) => t.categories.includes("trekking"));
    for (const trip of expected) expect(screen.getByText(trip.title)).toBeInTheDocument();
  });

  it("ignores an unknown category and shows everything", () => {
    render(<TripsExplorer trips={kgTrips} categories={categories} initialCategory="not-a-category" />);
    for (const trip of kgTrips) expect(screen.getByText(trip.title)).toBeInTheDocument();
  });

  it("returns to all trips", async () => {
    const user = userEvent.setup();
    render(<TripsExplorer trips={kgTrips} categories={categories} initialCategory="trekking" />);
    await user.click(screen.getByRole("button", { name: /all trips/i }));
    for (const trip of kgTrips) expect(screen.getByText(trip.title)).toBeInTheDocument();
  });

  it("shows a helpful empty state with no matches", async () => {
    const user = userEvent.setup();
    // A trip set that has nothing in the "ski" category.
    const noSki = kgTrips.filter((t) => !t.categories.includes("ski"));
    render(<TripsExplorer trips={noSki} categories={categories} />);

    await user.click(screen.getByRole("button", { name: /ski & snow/i }));
    expect(screen.getByText(/no trips in this category/i)).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /build your own/i })).toBeInTheDocument();
  });
});
