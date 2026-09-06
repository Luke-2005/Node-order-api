Subject: WMK Trading — Take-home task

Hi Mr. Essing,

Thanks for the conversation today. As a next step, we'd like you to complete a short task. It should take about 3-4 hours — please don't over-engineer it.

**Task: Small Orders REST API**

Attached are two files:
- `orders.json` — 12 sample orders, each with a customer name, status, and a list of items (sku, quantity, price)
- `helpers.js` — two small helper functions (`readBody`, `sendJson`) so you don't have to deal with raw Node request streams. Please don't modify this file.

Using plain Node.js (no framework needed — no npm install required), build a small server that serves the following endpoints:

- `GET /orders` — return all orders as JSON. Each order should include a computed `total` field (sum of price × quantity across its items).
- `GET /orders/{id}` — return a single order with its computed total. Return a 404 with a JSON error if the id doesn't exist.
- `POST /orders` — create a new order from a JSON request body (`customerName`, `items`). Assign it a new unique id and a default status of `"pending"`, save it, and return the created order (with its computed total).
- `PUT /orders/{id}` — update an existing order's `status` field only. Return a 404 if the order doesn't exist.

Data should persist to `orders.json` so it survives across requests.

You can run it locally with:
```
node your-file.js
```

**What to send back:**
- Your code
- A short README: how to run it, what assumptions you made, and how you'd approach input validation or moving from a JSON file to a real database if this had to handle real traffic.

Please send it back as a zip or a repo link within 4 days.

**One more thing:** after we've looked at it, we'll set up a short 15-minute call where you walk us through your solution and make a small live change to it. That's standard for us.

If anything is unclear, just ask.

Best,
Lazar
