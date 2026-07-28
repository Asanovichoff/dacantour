import { Injectable, Logger } from "@nestjs/common";

export interface TeamEmail {
  subject: string;
  text: string;
}

/**
 * Sends team notifications via Resend. If RESEND_API_KEY is not set (local dev,
 * tests), it logs the email instead of sending — so nothing is required to run.
 */
@Injectable()
export class NotificationsService {
  private readonly logger = new Logger(NotificationsService.name);
  private readonly apiKey = process.env.RESEND_API_KEY;
  private readonly to = process.env.TEAM_INBOX || "hello@dacantour.com";
  private readonly from = process.env.MAIL_FROM || "Dacan Tour <no-reply@dacantour.com>";

  async notifyTeam(email: TeamEmail): Promise<{ delivered: boolean }> {
    if (!this.apiKey) {
      this.logger.log(`[email disabled] Would send "${email.subject}" to ${this.to}\n${email.text}`);
      return { delivered: false };
    }
    try {
      // Resend's REST API directly — deliberately no SDK: it pulls in
      // @react-email/render (and React) which a Node API has no need for, and
      // which conflicts with the frontend's React version in this workspace.
      const res = await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${this.apiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          from: this.from,
          to: [this.to],
          subject: email.subject,
          text: email.text,
        }),
      });

      if (!res.ok) {
        const detail = await res.text().catch(() => "");
        this.logger.error(`Resend responded ${res.status}: ${detail.slice(0, 200)}`);
        return { delivered: false };
      }
      return { delivered: true };
    } catch (err) {
      this.logger.error(`Failed to send email: ${(err as Error).message}`);
      return { delivered: false };
    }
  }
}
