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
    const name = String(body.name || "").trim();
    const email = String(body.email || "").trim();
    const website = String(body.website || "").trim();
    const session = String(body.session || "").trim();
    const preferred_date = String(body.preferred_date || "").trim();
    const preferred_time = String(body.preferred_time || "").trim();
    const challenge = String(body.challenge || "").trim();

    if (!name || !email || !website) {
      return new Response(JSON.stringify({ success: false, error: "Missing fields" }), {
        status: 400,
        headers,
      });
    }

    if (!env.RESEND_API_KEY) {
      return new Response(JSON.stringify({ success: false, error: "Server not configured" }), {
        status: 500,
        headers,
      });
    }

    const safe = (s) =>
      String(s)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;");

    const html =
      "<h2>New Strategy Call Request</h2>" +
      "<p><strong>Name:</strong> " + safe(name) + "</p>" +
      "<p><strong>Email:</strong> " + safe(email) + "</p>" +
      "<p><strong>Website:</strong> " + safe(website) + "</p>" +
      "<p><strong>Session:</strong> " + safe(session) + "</p>" +
      "<p><strong>Date:</strong> " + safe(preferred_date) + "</p>" +
      "<p><strong>Time:</strong> " + safe(preferred_time) + "</p>" +
      "<p><strong>Challenge:</strong><br>" + safe(challenge).replace(/\n/g, "<br>") + "</p>";

    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: "Bearer " + env.RESEND_API_KEY,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: "Mizanul Islam <hello@mizanulislam.com>",
        to: ["mail.mizanulislam@gmail.com"],
        reply_to: email,
        subject: "Strategy Call: " + name,
        html: html,
      }),
    });

    const data = await res.json();

    if (!res.ok) {
      return new Response(JSON.stringify({ success: false, error: "Email failed" }), {
        status: 500,
        headers,
      });
    }

    return new Response(JSON.stringify({ success: true }), { status: 200, headers });
  } catch (e) {
    return new Response(JSON.stringify({ success: false, error: "Server error" }), {
      status: 500,
      headers,
    });
  }
}

export async function onRequestOptions() {
  return new Response(null, {
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type",
    },
  });
                 }
