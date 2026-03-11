// admin.js
let superAdminClicks = 0;

function checkSuperAdmin() {
    superAdminClicks++;
    if (superAdminClicks === 5) {
        let pass = prompt("Namaste Rana Ji! Secret Password Daalein:");
        if (pass === "BOSS537") {
            showPage('view-admin');
            loadAdminData(); 
            loadInventoryAdmin(); 
        } else {
            alert("Galat Password!");
        }
        superAdminClicks = 0;
    }
    setTimeout(() => { superAdminClicks = 0; }, 3000);
}

async function loadAdminData() {
    const adminOrdersDiv = document.getElementById('admin-all-orders');
    adminOrdersDiv.innerHTML = "<p style='text-align:center;'>Business report load ho rahi hai...</p>";
    
    try {
        const res = await fetch(SCRIPT_URL);
        const data = await res.json();
        
        let totalSale = 0;
        let html = '<h4 style="margin:15px 0 10px 0;"><i class="fas fa-shopping-cart"></i> Recent Orders</h4>';
        
        // Agar data orders wala hai toh hi chalega
        if (Array.isArray(data)) {
            data.forEach(o => {
                if(o.status === 'DELIVERED') totalSale += parseFloat(o.total || 0);
                html += `
                <div class="order-card" style="border-left:4px solid ${o.status==='PENDING'?'#ff4d4d':'#2ecc71'}; font-size:12px; margin-bottom:8px; padding:10px; background:#f9f9f9; border-radius:8px;">
                    <div style="display:flex; justify-content:space-between;">
                        <b>${o.name || 'Unknown'}</b>
                        <span style="color:var(--main);">₹${o.total || 0}</span>
                    </div>
                    <small>Status: ${o.status}</small>
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

async function loadInventoryAdmin() {
    const invDiv = document.getElementById('admin-all-orders'); 
    let invHtml = `<div id="stock-ctrl" style="margin-top:25px; padding:15px; background:#fff; border:1px dashed var(--main); border-radius:12px;">
                    <h4 style="margin-bottom:10px;"><i class="fas fa-boxes-stacked"></i> Stock Control</h4>`;

    try {
        // Yahan dhyan de: Hum wahi URL use kar rahe hain jo products ke liye tha
        const res = await fetch(SCRIPT_URL + "?action=getProducts"); 
        const products = await res.json();

        if (products && products.length > 0) {
            products.forEach(item => {
                let isLive = (String(item.Status).toLowerCase() === 'live');
                let btnColor = isLive ? '#2ecc71' : '#e74c3c';
                let btnText = isLive ? 'LIVE' : 'OUT';
                let weight = item.Unit || item.Weight || ''; // Dono check kar raha hai

                invHtml += `
                <div style="display:flex; justify-content:space-between; align-items:center; padding:10px 0; border-bottom:1px solid #eee;">
                    <div style="flex:1;">
                        <span style="font-size:13px; font-weight:600;">${item.Name}</span> 
                        <small style="color:var(--main);">${weight}</small>
                    </div>
                    <button onclick="toggleStockStatus('${item.ID}', '${item.Status}')" 
                            style="background:${btnColor}; color:white; border:none; padding:6px 12px; border-radius:20px; font-size:10px; font-weight:bold;">
                        ${btnText}
                    </button>
                </div>`;
            });
        } else {
            invHtml += "<p>Products nahi mile. Sheet check karein.</p>";
        }

        invHtml += `</div>`;
        invDiv.innerHTML += invHtml;

    } catch(e) {
        invDiv.innerHTML += "<p style='color:red;'>Stock panel load nahi ho saka.</p>";
    }
}

async function toggleStockStatus(id, currentStatus) {
    let newStatus = (String(currentStatus).toLowerCase() === 'live') ? 'Out' : 'Live';
    if (confirm(`Kya aap ${id} ko ${newStatus} karna chahte hain?`)) {
        try {
            // Seedha Apps Script ko trigger karega
            const response = await fetch(SCRIPT_URL, {
                method: 'POST',
                body: JSON.stringify({
                    action: "updateProductStock",
                    id: id,
                    newStatus: newStatus
                })
            });
            alert("Request bhej di gayi hai! Refresh ho raha hai...");
            setTimeout(() => { location.reload(); }, 1500);
        } catch (error) {
            alert("Network error!");
        }
    }
}
