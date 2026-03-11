// admin.js
let superAdminClicks = 0;

function checkSuperAdmin() {
    superAdminClicks++;
    if (superAdminClicks === 5) {
        let pass = prompt("Namaste Rana Ji! Secret Password Daalein:");
        if (pass === "BOSS537") {
            showPage('view-admin');
            switchAdminTab('orders'); // Default pehle orders dikhao
        } else {
            alert("Galat Password!");
        }
        superAdminClicks = 0;
    }
    setTimeout(() => { superAdminClicks = 0; }, 3000);
}

// TAB SWITCHING LOGIC
function switchAdminTab(tab) {
    const orderSec = document.getElementById('admin-orders-section');
    const stockSec = document.getElementById('admin-stock-section');
    const btnOrder = document.getElementById('tab-btn-orders');
    const btnStock = document.getElementById('tab-btn-stock');

    if(tab === 'orders') {
        orderSec.style.display = 'block';
        stockSec.style.display = 'none';
        btnOrder.style.background = 'var(--main)';
        btnOrder.style.color = 'white';
        btnStock.style.background = '#eee';
        btnStock.style.color = '#333';
        loadAdminData(); // Sirf orders load karo
    } else {
        orderSec.style.display = 'none';
        stockSec.style.display = 'block';
        btnStock.style.background = 'var(--main)';
        btnStock.style.color = 'white';
        btnOrder.style.background = '#eee';
        btnOrder.style.color = '#333';
        loadInventoryAdmin(); // Sirf stock list load karo
    }
}

// 📦 ORDERS LOAD KARNA (Status Dropdown ke saath)
async function loadAdminData() {
    const adminOrdersDiv = document.getElementById('admin-all-orders');
    adminOrdersDiv.innerHTML = "<p style='text-align:center;'>Business report load ho rahi hai...</p>";
    
    try {
        const res = await fetch(SCRIPT_URL);
        const data = await res.json();
        
        let totalSale = 0;
        let html = '<h4 style="margin:10px 0;"><i class="fas fa-shopping-cart"></i> Recent Orders</h4>';
        
        if (Array.isArray(data)) {
            data.reverse().forEach(o => { // Naye order upar dikhenge
                if(o.status === 'DELIVERED') totalSale += parseFloat(o.total || 0);
                
                html += `
                <div class="order-card" style="border-left:4px solid ${o.status==='PENDING'?'#ff4d4d':'#2ecc71'}; font-size:12px; margin-bottom:12px; padding:12px; background:#f9f9f9; border-radius:8px;">
                    <div style="display:flex; justify-content:space-between; margin-bottom:5px;">
                        <b>${o.name || 'Unknown'}</b>
                        <span style="color:var(--main); font-weight:bold;">₹${o.total || 0}</span>
                    </div>
                    <div style="color:gray; margin-bottom:8px;">${o.details}</div>
                    <div style="display:flex; align-items:center; gap:10px;">
                        <span style="font-size:10px; font-weight:bold;">STATUS:</span>
                        <select onchange="updateOrderStatus('${o.id}', this.value)" style="flex:1; padding:5px; border-radius:5px; border:1px solid #ddd; font-size:11px; background:white;">
                            <option value="PENDING" ${o.status==='PENDING'?'selected':''}>PENDING</option>
                            <option value="CONFIRMED" ${o.status==='CONFIRMED'?'selected':''}>CONFIRMED</option>
                            <option value="ON THE WAY" ${o.status==='ON THE WAY'?'selected':''}>ON THE WAY</option>
                            <option value="DELIVERED" ${o.status==='DELIVERED'?'selected':''}>DELIVERED</option>
                        </select>
                    </div>
                </div>`;
            });
        }
        
        document.getElementById('total-sale-amt').innerText = "₹" + totalSale;
        document.getElementById('total-order-count').innerText = data.length;
        adminOrdersDiv.innerHTML = html;
    } catch(e) {
        adminOrdersDiv.innerHTML = "<p style='text-align:center; color:red;'>Order list load nahi hui.</p>";
    }
}

// 🛒 STOCK LIST LOAD KARNA
async function loadInventoryAdmin() {
    const invDiv = document.getElementById('admin-inventory-list'); 
    invDiv.innerHTML = "<p style='text-align:center;'>Maal ki list load ho rahi hai...</p>";

    try {
        const res = await fetch(SCRIPT_URL + "?action=getProducts"); 
        const products = await res.json();

        let invHtml = '<h4 style="margin-bottom:15px;"><i class="fas fa-boxes-stacked"></i> Stock Control</h4>';

        if (products && products.length > 0) {
            products.forEach(item => {
                let isLive = (String(item.Status).toLowerCase() === 'live');
                let btnColor = isLive ? '#2ecc71' : '#e74c3c';
                let btnText = isLive ? 'LIVE' : 'OUT';
                let weight = item.Unit || item.Weight || '';

                invHtml += `
                <div style="display:flex; justify-content:space-between; align-items:center; padding:12px 0; border-bottom:1px solid #eee;">
                    <div style="flex:1;">
                        <span style="font-size:14px; font-weight:600;">${item.Name}</span> 
                        <br><small style="color:var(--main); font-weight:bold;">${weight}</small>
                    </div>
                    <button onclick="toggleStockStatus('${item.ID}', '${item.Status}')" 
                            style="background:${btnColor}; color:white; border:none; padding:8px 15px; border-radius:20px; font-size:10px; font-weight:bold; cursor:pointer;">
                        ${btnText}
                    </button>
                </div>`;
            });
            invDiv.innerHTML = invHtml;
        } else {
            invDiv.innerHTML = "<p>Products nahi mile.</p>";
        }
    } catch(e) {
        invDiv.innerHTML = "<p style='color:red;'>Stock panel load nahi ho saka.</p>";
    }
}

// ACTION: Order Status Update
async function updateOrderStatus(orderId, newStatus) {
    try {
        await fetch(SCRIPT_URL, {
            method: 'POST',
            body: JSON.stringify({ action: "updateStatus", id: orderId, newStatus: newStatus })
        });
        alert("Order Status badal diya gaya: " + newStatus);
    } catch(e) { alert("Status update fail!"); }
}

// ACTION: Stock Status Toggle
async function toggleStockStatus(id, currentStatus) {
    let newStatus = (String(currentStatus).toLowerCase() === 'live') ? 'Out' : 'Live';
    if (confirm(`Kya aap ID: ${id} ko ${newStatus} karna chahte hain?`)) {
        try {
            await fetch(SCRIPT_URL, {
                method: 'POST',
                body: JSON.stringify({ action: "updateProductStock", id: id, newStatus: newStatus })
            });
            alert("Stock Update bhej diya gaya!");
            setTimeout(() => { loadInventoryAdmin(); }, 1500);
        } catch (error) { alert("Network error!"); }
    }
}
// admin.js ke sabse niche ye jodd dein
async function loadInventoryAdmin() {
    const invDiv = document.getElementById('admin-inventory-list'); 
    if(!invDiv) return; // Agar div na mile toh error na aaye
    
    invDiv.innerHTML = "<p style='text-align:center;'>Maal ki list load ho rahi hai...</p>";

    try {
        const res = await fetch(SCRIPT_URL + "?action=getProducts"); 
        const products = await res.json();

        let invHtml = '<h4 style="margin-bottom:15px;"><i class="fas fa-boxes-stacked"></i> Stock Control</h4>';

        if (products && products.length > 0) {
            products.forEach(item => {
                let isLive = (String(item.Status).toLowerCase() === 'live');
                let btnColor = isLive ? '#2ecc71' : '#e74c3c';
                let btnText = isLive ? 'LIVE' : 'OUT';
                
                // "Net weight" dhyan se likha hai, jo teri sheet mein hai
                let weight = item["Net weight"] || item.Unit || "No Data";

                invHtml += `
                <div style="display:flex; justify-content:space-between; align-items:center; padding:12px 0; border-bottom:1px solid #eee;">
                    <div style="flex:1;">
                        <span style="font-size:14px; font-weight:600;">${item.Name}</span> 
                        <br><small style="color:var(--main); font-weight:bold; background:#fff3e0; padding:2px 8px; border-radius:4px; display:inline-block; margin-top:4px;">
                            <i class="fas fa-weight-hanging" style="font-size:10px;"></i> ${weight}
                        </small>
                    </div>
                    <button onclick="toggleStockStatus('${item.ID}', '${item.Status}')" 
                            style="background:${btnColor}; color:white; border:none; padding:8px 15px; border-radius:20px; font-size:10px; font-weight:bold; cursor:pointer;">
                        ${btnText}
                    </button>
                </div>`;
            });
            invDiv.innerHTML = invHtml;
        } else {
            invDiv.innerHTML = "<p>Products nahi mile. Sheet check karein.</p>";
        }
    } catch(e) {
        invDiv.innerHTML = "<p style='color:red;'>Technical error: Stock load nahi hua.</p>";
    }
}
