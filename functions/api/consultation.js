/**
 * Cloudflare Pages Function — /api/consultation
 * Handles form submissions from both:
 *  - consultation.html (Strategy Call form)
 *  - index.html (Home page form)
 */

export async function onRequestPost(context) {
  const { request, env } = context;

  const headers = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
    "Content-Type": "application/json",
  };

  try {
    const body = await request.json();

    const name = String(body.name || "").trim().slice(0, 120);
    const email = String(body.email || "").trim().slice(0, 200);
    const phone = String(body.phone || "").trim().slice(0, 40);
    const website = String(body.website || "").trim().slice(0, 300);
    const session = String(body.session || "").trim().slice(0, 120);
    const preferred_date = String(body.preferred_date || "").trim().slice(0, 40);
    const preferred_time = String(body.preferred_time || "").trim().slice(0, 40);
    const challenge = String(body.challenge || "").trim().slice(0, 2000);
    const monthly_budget = String(body.monthly_budget || "").trim().slice(0, 60);
    const source = String(body.source || "Consultation Page").trim().slice(0, 60);

    if (!name || !email) {
      return jsonResponse({ success: false, error: "Missing required fields" }, 400, headers);
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return jsonResponse({ success: false, error: "Invalid email" }, 400, headers);
    }

    if (!env.RESEND_API_KEY) {
      return jsonResponse({ success: false, error: "Server not configured" }, 500, headers);
    }

    const safe = (s) =>
      String(s)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");

    const html = `
      <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;">
        <h2 style="color:#10b981;">New Strategy Call Request</h2>
        <p style="background:#f0fdf4;border:1px solid #10b981;padding:10px;border-radius:8px;color:#065f46;">
          <strong>Source:</strong> ${safe(source)}
        </p>
        <table style="width:100%;border-collapse:collapse;">
          <tr><td style="padding:6px 0;"><strong>Name:</strong></td><td>${safe(name)}</td></tr>
          <tr><td style="padding:6px 0;"><strong>Email:</strong></td><td>${safe(email)}</td></tr>
          ${phone ? `<tr><td style="padding:6px 0;"><strong>Phone:</strong></td><td>${safe(phone)}</td></tr>` : ''}
          <tr><td style="padding:6px 0;"><strong>Website:</strong></td><td>${safe(website) || "—"}</td></tr>
          <tr><td style="padding:6px 0;"><strong>Session:</strong></td><td>${safe(session) || "—"}</td></tr>
          ${monthly_budget ? `<tr><td style="padding:6px 0;"><strong>Monthly Budget:</strong></td><td>${safe(monthly_budget)}</td></tr>` : ''}
          <tr><td style="padding:6px 0;"><strong>Date:</strong></td><td>${safe(preferred_date) || "—"}</td></tr>
          <tr><td style="padding:6px 0;"><strong>Time (GMT+6):</strong></td><td>${safe(preferred_time) || "—"}</td></tr>
        </table>
        <hr style="margin:20px 0;border:none;border-top:1px solid #eee;">
        <p><strong>Challenge / Goal:</strong></p>
        <p style="white-space:pre-wrap;">${safe(challenge)}</p>
      </div>
    `;

    const resendRes = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: "Bearer " + env.RESEND_API_KEY,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: "Mizanul Islam <hello@mizanulislam.com>",
        to: ["mail.mizanulislam@gmail.com"],
        reply_to: email,
        subject: `Strategy Call: ${name} — ${source}`,
        html: html,
      }),
    });

    const resendData = await resendRes.json().catch(() => ({}));

    if (!resendRes.ok) {
      console.error("[Resend Error]:", resendData);
      return jsonResponse({ success: false, error: "Email delivery failed" }, 500, headers);
    }

    return jsonResponse({ success: true }, 200, headers);
  } catch (err) {
    console.error("[Consultation Function Error]:", err);
    return jsonResponse({ success: false, error: "Server error" }, 500, headers);
  }
}

export async function onRequestOptions() {
  return new Response(null, {
    status: 204,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type",
    },
  });
}

function jsonResponse(payload, status, headers) {
  return new Response(JSON.stringify(payload), { status, headers });
}
