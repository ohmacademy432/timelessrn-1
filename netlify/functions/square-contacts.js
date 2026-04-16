const SQUARE_ACCESS_TOKEN = process.env.SQUARE_ACCESS_TOKEN;

exports.handler = async (event) => {
  const headers = { "Access-Control-Allow-Origin": "*", "Access-Control-Allow-Headers": "Content-Type", "Access-Control-Allow-Methods": "POST" };
  if (event.httpMethod === "OPTIONS") return { statusCode: 200, headers, body: "" };
  if (event.httpMethod !== "POST") return { statusCode: 405, body: "Method not allowed" };
  if (!SQUARE_ACCESS_TOKEN) return { statusCode: 500, headers, body: JSON.stringify({ error: "Square token not configured" }) };

  try {
    const contacts = [];
    let cursor = undefined;

    // Paginate through all Square customers
    do {
      const body = { limit: 100 };
      if (cursor) body.cursor = cursor;

      const res = await fetch("https://connect.squareup.com/v2/customers/search", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${SQUARE_ACCESS_TOKEN}`,
          "Square-Version": "2024-12-18",
        },
        body: JSON.stringify(body),
      });

      if (!res.ok) {
        const err = await res.text();
        console.error("[square] Error:", err);
        return { statusCode: 502, headers, body: JSON.stringify({ error: "Square API error" }) };
      }

      const data = await res.json();
      const customers = data.customers || [];

      for (const c of customers) {
        const name = [c.given_name, c.family_name].filter(Boolean).join(" ").trim();
        const email = c.email_address || "";
        const phone = c.phone_number || "";
        if (email || phone) {
          contacts.push({ name: name || "Unknown", email, phone, source: "square" });
        }
      }

      cursor = data.cursor;
    } while (cursor);

    return {
      statusCode: 200,
      headers: { ...headers, "Content-Type": "application/json" },
      body: JSON.stringify({ contacts, count: contacts.length }),
    };
  } catch (e) {
    console.error("[square] Error:", e);
    return { statusCode: 500, headers, body: JSON.stringify({ error: "Internal error" }) };
  }
};
