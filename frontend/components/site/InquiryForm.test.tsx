import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { InquiryForm } from "./InquiryForm";

const fillRequired = async (user: ReturnType<typeof userEvent.setup>) => {
  await user.type(screen.getByLabelText(/full name/i), "Sofia R.");
  await user.type(screen.getByLabelText(/^email/i), "sofia@example.com");
  // The custom-trip variant labels this field "Tell us about your dream trip".
  await user.type(
    screen.getByLabelText(/message|dream trip/i),
    "Is the June departure still open?",
  );
};

describe("InquiryForm", () => {
  beforeEach(() => {
    vi.unstubAllGlobals();
  });

  it("posts an inquiry to the API and shows the success state", async () => {
    const fetchMock = vi.fn().mockResolvedValue({ ok: true, status: 201, json: async () => ({ ok: true }) });
    vi.stubGlobal("fetch", fetchMock);
    const user = userEvent.setup();

    render(<InquiryForm variant="inquiry" tripTitle="Song-Köl Silk Road Horse Trek" departureLabel="Jun 14–21, 2026" />);
    await fillRequired(user);
    await user.click(screen.getByRole("button", { name: /send inquiry/i }));

    await waitFor(() => expect(screen.getByText(/message received/i)).toBeInTheDocument());

    expect(fetchMock).toHaveBeenCalledTimes(1);
    const [url, init] = fetchMock.mock.calls[0];
    expect(url).toMatch(/\/api\/inquiries$/);
    expect(init.method).toBe("POST");

    const body = JSON.parse(init.body);
    expect(body).toMatchObject({
      name: "Sofia R.",
      email: "sofia@example.com",
      type: "fixed-trip",
      tripTitle: "Song-Köl Silk Road Horse Trek",
      departureLabel: "Jun 14–21, 2026",
    });
  });

  it("posts to the custom-trips endpoint for the build-your-own variant", async () => {
    const fetchMock = vi.fn().mockResolvedValue({ ok: true, status: 201, json: async () => ({ ok: true }) });
    vi.stubGlobal("fetch", fetchMock);
    const user = userEvent.setup();

    render(<InquiryForm variant="custom" />);
    await fillRequired(user);
    await user.type(screen.getByLabelText(/regions or experiences/i), "Kel-Suu, horses");
    await user.click(screen.getByRole("button", { name: /send my trip idea/i }));

    await waitFor(() => expect(screen.getByText(/message received/i)).toBeInTheDocument());
    const [url, init] = fetchMock.mock.calls[0];
    expect(url).toMatch(/\/api\/custom-trips$/);
    expect(JSON.parse(init.body).interests).toBe("Kel-Suu, horses");
  });

  it("shows the WhatsApp fallback when the API fails", async () => {
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue({ ok: false, status: 500 }));
    const user = userEvent.setup();

    render(<InquiryForm />);
    await fillRequired(user);
    await user.click(screen.getByRole("button", { name: /send inquiry/i }));

    await waitFor(() => expect(screen.getByText(/something went wrong/i)).toBeInTheDocument());
    expect(screen.getByRole("link", { name: /whatsapp/i })).toBeInTheDocument();
    // Never show success when the submission didn't go through.
    expect(screen.queryByText(/message received/i)).not.toBeInTheDocument();
  });

  it("handles a network error the same way", async () => {
    vi.stubGlobal("fetch", vi.fn().mockRejectedValue(new Error("network down")));
    const user = userEvent.setup();

    render(<InquiryForm />);
    await fillRequired(user);
    await user.click(screen.getByRole("button", { name: /send inquiry/i }));

    await waitFor(() => expect(screen.getByText(/something went wrong/i)).toBeInTheDocument());
  });

  it("does not submit when the honeypot is filled (spam bot)", async () => {
    const fetchMock = vi.fn();
    vi.stubGlobal("fetch", fetchMock);
    const user = userEvent.setup();

    const { container } = render(<InquiryForm />);
    await fillRequired(user);

    const honeypot = container.querySelector('input[name="company"]') as HTMLInputElement;
    expect(honeypot).toBeTruthy();
    // Bots fill hidden fields; simulate that directly since it isn't user-visible.
    honeypot.value = "spam corp";
    await user.click(screen.getByRole("button", { name: /send inquiry/i }));

    expect(fetchMock).not.toHaveBeenCalled();
  });

  it("keeps required fields required (browser validation)", () => {
    render(<InquiryForm />);
    expect(screen.getByLabelText(/full name/i)).toBeRequired();
    expect(screen.getByLabelText(/^email/i)).toBeRequired();
    expect(screen.getByLabelText(/message/i)).toBeRequired();
  });
});
