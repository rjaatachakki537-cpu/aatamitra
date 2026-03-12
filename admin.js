const ADMIN_CODE = "LUCKY";

async function loadAdminOrders() {
    const response = await fetch(`${SCRIPT_URL}?action=getOrders`); // Humne Apps Script mein getOrders banaya tha
    const data = await response.json();
    const orders = data.slice(1); // Header [cite: 5] hata kar

    let html = '<h2>Admin Dashboard (Rana Ji Aata Chakki)</h2>';
    orders.reverse().forEach(row => {
        html += `
            <div class="admin-order-card">
                <p><b>Order ID:</b> ${row[0]}</p> <p><b>Customer:</b> ${row[2]}</p> <p><b>Items:</b> ${row[5]}</p> <p><b>Total:</b> ₹${row[6]}</p> <p><b>Status:</b> ${row[7]}</p> <button onclick="updateStatus('${row[0]}', 'Out for Delivery')">Mark Out for Delivery</button>
                <button onclick="updateStatus('${row[0]}', 'Delivered')">Mark Delivered</button>
            </div>
        `;
    });
    document.getElementById('admin-content').innerHTML = html;
}
