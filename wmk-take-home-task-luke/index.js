const http = require("http");
const fs = require("fs");
const path = require("path");
const { readBody, sendJson } = require("./helpers");

const Port = 8080;
const DATA_FILE = path.join(__dirname, "orders.json");

function readOrders() {
    try {
        const fileData = fs.readFileSync(DATA_FILE, "utf8");
        return JSON.parse(fileData);
    } catch (error) {

        // If the file doesn't exist or is empty, return an empty array
        console.error("Fehler beim Lesen der orders.json:", error.message);
        return [];
    }
}

function writeOrders(orders) {
    fs.writeFileSync(DATA_FILE, JSON.stringify(orders, null, 2), "utf8");
}

function calculateTotal(order) {
    let total = 0;

    if (!order) {
        return 0;
    }

    if (Array.isArray(order.items)) {
        order.items.forEach((item) => {

            // Check if price and quantity are defined
            if (item.price == null || item.quantity == null) {
                return;
            }

            total += item.price * item.quantity;
        });
    }

    // Round to 2 decimal
    return Number(total.toFixed(2));
}

const server = http.createServer(async (req, res) => {
    const { method, url } = req;

    // Get all orders
    if (method === "GET" && url === "/orders") {
        const orders = readOrders();

        // Add total to each order
        const ordersWithTotal = orders.map((order) => ({
            ...order,
            total: calculateTotal(order),
        }));

        return sendJson(res, 200, ordersWithTotal);
    }

    // Get a single order by ID
    if (method === "GET" && url.startsWith("/orders/") && url !== "/orders/") {
        const id = url.split("/")[2];
        const orders = readOrders();
        const order = orders.find((o) => o.id === Number(id));

        if (!order) {
            return sendJson(res, 404, { error: `Bestellung mit ID '${id}' wurde nicht gefunden.` });
        }

        const orderWithTotal = { 
            ...order, 
            total: calculateTotal(order)
        };

        return sendJson(res, 200, orderWithTotal);
    }

    // Create a new order
    if (method === "POST" && url === "/orders") {
        const body = await readBody(req);

        if (!body || !body.items || !Array.isArray(body.items)) {
            return sendJson(res, 400, { error: "Ungültige Anfrage. 'items' muss ein Array sein." });
        }

        const orders = readOrders();
        const maxId = orders.reduce((max, order) => Math.max(max, Number(order.id) || 0), 0);

        const newOrder = {
            id: (maxId + 1),
            customerName: body.customerName || "Unbekannt",
            status: "pending",
            items: body.items,
        };

        orders.push(newOrder);
        writeOrders(orders);

        const newOrderWithTotal = { 
            ...newOrder, 
            total: calculateTotal(newOrder) 
        };

        return sendJson(res, 201, newOrderWithTotal);
    }

    // Update an existing order
    if (method === "PUT" && url.startsWith("/orders/") && url !== "/orders/") {
        const id = url.split("/")[2];
        const body = await readBody(req);
        const orders = readOrders();
        const orderIndex = orders.findIndex((o) => o.id === Number(id));

        if (orderIndex === -1) {
            return sendJson(res, 404, { error: `Bestellung mit ID '${id}' wurde nicht gefunden.` });
        }
        
        const updatedOrder = {
            ...orders[orderIndex],
            status: body.status || orders[orderIndex].status
        };

        orders[orderIndex] = updatedOrder;
        writeOrders(orders);

        const updatedOrderWithTotal = {
            ...updatedOrder,
            total: calculateTotal(updatedOrder),
        };

        return sendJson(res, 200, updatedOrderWithTotal);
    }

    // Delete an existing order
    if (method === "DELETE" && url.startsWith("/orders/") && url !== "/orders/") {
        const id = url.split("/")[2];
        const orders = readOrders();
        const orderIndex = orders.findIndex((o) => o.id === Number(id));
        
        if (orderIndex === -1) {
            return sendJson(res, 404, { error: `Bestellung mit ID '${id}' wurde nicht gefunden.` });
        }

        // Remove the order from the array and write back to the file
        const deletedOrder = orders.splice(orderIndex, 1)[0];
        writeOrders(orders);

        return sendJson(res, 200, { message: `Bestellung mit ID '${id}' wurde gelöscht.`, deletedOrder });
    }

    return sendJson(res, 404, { error: "Route nicht gefunden" });
});

server.listen(Port, () => {
  console.log(`Server läuft auf http://localhost:${Port}`);
});
