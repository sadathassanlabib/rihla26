import { Resend } from "resend";

const resend = process.env.RESEND_API_KEY
  ? new Resend(process.env.RESEND_API_KEY)
  : null;

const FROM = process.env.RESEND_FROM_EMAIL || "onboarding@resend.dev";
const BASE_URL = process.env.NEXTAUTH_URL || "http://localhost:3000";

export async function sendEmail({ to, subject, html }) {
  if (!resend) {
    console.warn("RESEND_API_KEY not set — skipping email to", to);
    return { ok: false, skipped: true };
  }
  try {
    const result = await resend.emails.send({ from: FROM, to, subject, html });
    if (result.error) {
      console.error("Resend error:", result.error);
      return { ok: false, error: result.error.message };
    }
    return { ok: true, id: result.data?.id };
  } catch (e) {
    console.error("Email send failed:", e);
    return { ok: false, error: e.message };
  }
}

function shell(inner) {
  return `
<!DOCTYPE html>
<html>
  <body style="margin:0;padding:0;background:#f7f4ec;font-family:system-ui,sans-serif;color:#1f2d24;">
    <div style="max-width:560px;margin:0 auto;padding:32px 24px;">
      <div style="background:#059669;color:#fff;border-radius:12px 12px 0 0;padding:20px 24px;">
        <h1 style="margin:0;font-size:20px;">Rihla'26 · SOROB</h1>
      </div>
      <div style="background:#fff;border-radius:0 0 12px 12px;padding:24px;border:1px solid #e5e7eb;border-top:none;">
        ${inner}
        <p style="margin:24px 0 0;font-size:12px;color:#9ca3af;">
          This is an automated message from Rihla'26 management.
        </p>
      </div>
    </div>
  </body>
</html>`;
}

export function announcementEmailHtml({ title, body, userName }) {
  return shell(`
    <p style="margin:0 0 8px;font-size:14px;color:#6b7280;">Hi ${userName || "there"},</p>
    <h2 style="margin:0 0 16px;font-size:22px;color:#111827;">${title}</h2>
    <p style="margin:0 0 16px;font-size:15px;line-height:1.6;color:#374151;white-space:pre-line;">${body}</p>
    <a href="${BASE_URL}/announcements" style="display:inline-block;background:#059669;color:#fff;padding:10px 20px;border-radius:8px;text-decoration:none;font-weight:600;font-size:14px;">View announcements →</a>
  `);
}

export function paymentRecordedEmailHtml({ userName, amount, method, transactionId, date, totalPaid, fee, due }) {
  const dateStr = new Date(date || Date.now()).toLocaleDateString("en-GB", {
    day: "2-digit", month: "short", year: "numeric",
  });
  return shell(`
    <p style="margin:0 0 8px;font-size:14px;color:#6b7280;">Hi ${userName || "there"},</p>
    <h2 style="margin:0 0 16px;font-size:22px;color:#111827;">Payment recorded ✓</h2>
    <p style="margin:0 0 16px;font-size:15px;line-height:1.6;color:#374151;">
      A payment has been recorded to your Rihla'26 account.
    </p>
    <table style="width:100%;border-collapse:collapse;margin:16px 0;">
      <tr><td style="padding:8px 0;color:#6b7280;font-size:13px;">Amount</td>
          <td style="padding:8px 0;text-align:right;font-weight:700;color:#059669;font-size:15px;">৳ ${Number(amount).toLocaleString()}</td></tr>
      <tr><td style="padding:8px 0;color:#6b7280;font-size:13px;">Method</td>
          <td style="padding:8px 0;text-align:right;font-weight:600;color:#111827;text-transform:capitalize;">${method}</td></tr>
      ${transactionId ? `<tr><td style="padding:8px 0;color:#6b7280;font-size:13px;">Transaction ID</td>
          <td style="padding:8px 0;text-align:right;font-family:monospace;color:#111827;font-size:12px;">${transactionId}</td></tr>` : ""}
      <tr><td style="padding:8px 0;color:#6b7280;font-size:13px;">Date</td>
          <td style="padding:8px 0;text-align:right;color:#111827;">${dateStr}</td></tr>
    </table>
    <div style="background:#f0fdf4;border:1px solid #bbf7d0;border-radius:8px;padding:12px 16px;margin:16px 0;">
      <table style="width:100%;border-collapse:collapse;">
        <tr><td style="font-size:12px;color:#15803d;">Total paid</td>
            <td style="text-align:right;font-weight:700;color:#15803d;">৳ ${Number(totalPaid || 0).toLocaleString()}</td></tr>
        <tr><td style="font-size:12px;color:#15803d;">Package fee</td>
            <td style="text-align:right;color:#15803d;">৳ ${Number(fee || 0).toLocaleString()}</td></tr>
        <tr><td style="font-size:12px;color:${due > 0 ? "#b91c1c" : "#15803d"};font-weight:600;">${due > 0 ? "Due" : "Advance"}</td>
            <td style="text-align:right;font-weight:700;color:${due > 0 ? "#b91c1c" : "#15803d"};">৳ ${Number(due > 0 ? due : totalPaid - fee).toLocaleString()}</td></tr>
      </table>
    </div>
    <a href="${BASE_URL}/me/money" style="display:inline-block;background:#059669;color:#fff;padding:10px 20px;border-radius:8px;text-decoration:none;font-weight:600;font-size:14px;">View money records →</a>
  `);
}

export function transactionRecordedEmailHtml({ kind, title, amount, date, note }) {
  const dateStr = new Date(date || Date.now()).toLocaleDateString("en-GB", {
    day: "2-digit", month: "short", year: "numeric",
  });
  const colors = {
    donation: { bg: "#eff6ff", border: "#bfdbfe", text: "#1d4ed8", icon: "💝" },
    expense: { bg: "#fef2f2", border: "#fecaca", text: "#b91c1c", icon: "🧾" },
  };
  const c = colors[kind] || colors.donation;
  return shell(`
    <h2 style="margin:0 0 16px;font-size:22px;color:#111827;">
      ${c.icon} New ${kind} recorded
    </h2>
    <table style="width:100%;border-collapse:collapse;margin:16px 0;">
      <tr><td style="padding:8px 0;color:#6b7280;font-size:13px;">${kind === "donation" ? "Donor" : "Title"}</td>
          <td style="padding:8px 0;text-align:right;font-weight:600;color:#111827;">${title}</td></tr>
      <tr><td style="padding:8px 0;color:#6b7280;font-size:13px;">Amount</td>
          <td style="padding:8px 0;text-align:right;font-weight:700;color:${c.text};font-size:15px;">৳ ${Number(amount).toLocaleString()}</td></tr>
      <tr><td style="padding:8px 0;color:#6b7280;font-size:13px;">Date</td>
          <td style="padding:8px 0;text-align:right;color:#111827;">${dateStr}</td></tr>
      ${note ? `<tr><td style="padding:8px 0;color:#6b7280;font-size:13px;vertical-align:top;">Note</td>
          <td style="padding:8px 0;text-align:right;color:#111827;font-size:13px;">${note}</td></tr>` : ""}
    </table>
    <div style="background:${c.bg};border:1px solid ${c.border};border-radius:8px;padding:12px;text-align:center;">
      <p style="margin:0;font-size:13px;color:${c.text};">
        A new ${kind} entry has been added to the Rihla'26 ledger.
      </p>
    </div>
  `);
}