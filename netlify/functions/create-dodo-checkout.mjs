const LIVE_DODO_API_BASE = "https://live.dodopayments.com";

function json(statusCode, body) {
  return {
    statusCode,
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  };
}

function parseCookies(cookieHeader = "") {
  return cookieHeader
    .split(";")
    .map((part) => part.trim())
    .filter(Boolean)
    .reduce((acc, part) => {
      const [rawName, ...rest] = part.split("=");
      if (!rawName) return acc;
      acc[decodeURIComponent(rawName)] = decodeURIComponent(rest.join("=") || "");
      return acc;
    }, {});
}

function normalizeCheckoutPayload(body = {}) {
  const productId = String(body.productId || "").trim();
  const quantity = Number(body.quantity || 1);

  if (!productId) {
    throw new Error("Missing productId");
  }

  return {
    product_cart: [
      {
        product_id: productId,
        quantity: Number.isFinite(quantity) && quantity > 0 ? quantity : 1,
      },
    ],
    billing: body.billing,
    customer: body.customer,
    success_url: body.successUrl,
    cancel_url: body.cancelUrl,
    discount_code: body.discountCode,
  };
}

export async function handler(event) {
  if (event.httpMethod !== "POST") {
    return json(405, { error: "Method not allowed" });
  }

  const apiKey = process.env.DODO_PAYMENTS_API_KEY;
  if (!apiKey) {
    return json(500, { error: "Missing DODO_PAYMENTS_API_KEY" });
  }

  let requestBody;
  try {
    requestBody = event.body ? JSON.parse(event.body) : {};
  } catch {
    return json(400, { error: "Invalid JSON body" });
  }

  let checkoutPayload;
  try {
    checkoutPayload = normalizeCheckoutPayload(requestBody);
  } catch (error) {
    return json(400, { error: error.message || "Invalid checkout payload" });
  }

  const cookies = parseCookies(event.headers.cookie || event.headers.Cookie || "");
  const visitorId = cookies.datafast_visitor_id || "";
  const dodoApiBase = String(process.env.DODO_PAYMENTS_BASE_URL || LIVE_DODO_API_BASE).replace(/\/+$/, "");

  const payload = {
    ...checkoutPayload,
    metadata: {
      ...(requestBody.metadata && typeof requestBody.metadata === "object" ? requestBody.metadata : {}),
      datafast_visitor_id: visitorId || undefined,
    },
  };

  try {
    const response = await fetch(`${dodoApiBase}/checkouts`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    const data = await response.json().catch(() => ({}));

    if (!response.ok) {
      return json(response.status, {
        error: data?.message || data?.error || "Dodo Payments checkout creation failed",
        details: data,
      });
    }

    return json(200, data);
  } catch (error) {
    return json(500, {
      error: error?.message || "Unexpected error creating Dodo checkout session",
    });
  }
}
