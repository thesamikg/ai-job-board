# DataFast revenue attribution with Dodo Payments

This project now includes a serverless checkout endpoint at:

`/.netlify/functions/create-dodo-checkout`

It reads the `datafast_visitor_id` cookie from the incoming request and forwards it to Dodo Payments in the checkout session metadata, which is what DataFast requires for revenue attribution.

## What was added

- Serverless function: [netlify/functions/create-dodo-checkout.mjs](/Users/samik/Desktop/AI%20Jobboard/netlify/functions/create-dodo-checkout.mjs)
- Environment variables in [.env.example](/Users/samik/Desktop/AI%20Jobboard/.env.example)

## Required environment variables

Add these to your deployment environment:

```bash
DODO_PAYMENTS_API_KEY=your-dodo-payments-api-key
DODO_PAYMENTS_BASE_URL=https://test.dodopayments.com
```

Use `https://live.dodopayments.com` in production.

## Example frontend request

Call the Netlify function from your app instead of creating checkout sessions in the browser:

```js
const response = await fetch("/.netlify/functions/create-dodo-checkout", {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
  },
  body: JSON.stringify({
    productId: "your_dodo_product_id",
    quantity: 1,
    successUrl: window.location.origin + "/success",
    cancelUrl: window.location.origin + "/pricing",
  }),
});

const data = await response.json();
if (!response.ok) {
  throw new Error(data.error || "Checkout creation failed");
}

window.location.href = data.checkout_url;
```

## Manual dashboard steps still required

DataFast and Dodo webhook setup is not something this repo can automate. Complete these in the dashboards:

1. In DataFast, create an API key:
   - Website Settings → API → Create API Key
2. In Dodo Payments, create a webhook:
   - Developer → Webhooks → Add endpoint
   - Select `DataFast`
   - Paste the DataFast API key
   - Click `Create`

## Sources

- [DataFast Dodo Payments guide](https://datafa.st/docs/dodopayments)
- [Dodo Payments Create Checkout Session API](https://docs.dodopayments.com/api-reference/checkout-sessions/create)
