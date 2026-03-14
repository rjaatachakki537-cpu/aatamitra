const API_URL = "https://script.google.com/macros/s/AKfycbwKIh4Q2VGhGspPBEQe6cfrwJLOlrY76MC3BDp9463MsIIBj1gPDLs7f3yR6vtGDwk_/exec";

async function loadAdminOrders(){

    const res = await fetch(`${API_URL}?action=getOrders`);

    const data = await res.json();

    const orders = data.slice(1);

    let html = "<h2>Admin Dashboard</h2>";

    orders.reverse().forEach(row => {

        html += `
        <div style="background:#fff;padding:10px;margin:10px;border-radius:10px">
        <b>Order ID:</b> ${row[0]} <br>
        <b>Name:</b> ${row[2]} <br>
        <b>Items:</b> ${row[5]} <br>
        <b>Total:</b> ₹${row[6]} <br>
        <b>Status:</b> ${row[7]} <br>

        <button onclick="updateStatus('${row[0]}','Processing')">Processing</button>

        <button onclick="updateStatus('${row[0]}','Out for Delivery')">Out for Delivery</button>

        <button onclick="updateStatus('${row[0]}','Delivered')">Delivered</button>

        </div>
        `;

    });

    document.getElementById("admin-content").innerHTML = html;

}

async function updateStatus(orderId,status){

    await fetch(API_URL+"?action=updateStatus",{

        method:"POST",

        body: JSON.stringify({

            orderId:orderId,
            status:status

        })

    });

    alert("Status Updated");

    loadAdminOrders();

}
