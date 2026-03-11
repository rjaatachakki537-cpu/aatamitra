// admin.js
let superAdminClicks = 0;

function checkSuperAdmin() {
    superAdminClicks++;
    if (superAdminClicks === 5) {
        let pass = prompt("Namaste Rana Ji! Secret Password Daalein:");
        if (pass === "BOSS537") {
            showPage('view-admin');
            loadAdminData(); // Orders load karne ke liye
            loadInventoryAdmin(); // Stock control load karne ke liye (Naya)
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
        
        data.forEach(o => {
            if(o.status === 'DELIVERED') {
                totalSale += parseFloat(o.total || 0);
            }
            
            html += `
            <div class="order-card" style="border-left:4px solid ${o.status==='PENDING'?'#ff4d4d':'#2ecc71'}; font-size:12px; margin-bottom:8px; padding:10px; background:#f9f9f9; border-radius:8px;">
                <div style="display:flex; justify-content:space-between;">
                    <b>${o.name}</b>
                    <span style="color:var(--main);">₹${o.total}</span>
                </div>
                <small>ID: #${o.id.toString().slice(-5)} | Status: ${o.status}</small>
            </div>`;
        });
        
        document.getElementById('total-sale-amt').innerText = "₹" + totalSale;
        document.getElementById('total-order-count').innerText = data.length;
        adminOrdersDiv.innerHTML = html || "<p style='text-align:center;'>Abhi koi order nahi mila.</p>";
    } catch(e) {
        adminOrdersDiv.innerHTML = "<p style='text-align:center; color:red;'>Order data error!</p>";
    }
}

// --- NAYA DHUANDHAAR FEATURE: STOCK CONTROL ---

async function loadInventoryAdmin() {
    // Ye tab dikhega jab hum index.html mein ye div banayenge (jo maine pehle bataya tha)
    const invDiv = document.getElementById('admin-all-orders'); // Hum orders ke niche hi list jodd rahe hain
    let invHtml = `<div style="margin-top:25px; padding:15px; background:#fff; border:1px dashed var(--main); border-radius:12px;">
                    <h4 style="margin-bottom:10px;"><i class="fas fa-boxes-stacked"></i> Stock Control (ON/OFF)</h4>
                    <p style="font-size:11px; color:gray; margin-bottom:10px;">Yahan se item band ya chalu karein:</p>`;

    try {
        // Maan lo 'productsData' aapke global script mein save hai jo sheet se aata hai
        // Agar nahi hai, toh hum fetch kar lenge
        const res = await fetch(SCRIPT_URL + "?action=getProducts"); 
        const products = await res.json();

        products.forEach(item => {
            let isLive = (item.Status === 'Live');
            let btnColor = isLive ? '#2ecc71' : '#e74c3c';
            let btnText = isLive ? 'LIVE (ON)' : 'OUT (OFF)';

            invHtml += `
            <div style="display:flex; justify-content:space-between; align-items:center; padding:10px 0; border-bottom:1px solid #eee;">
                <span style="font-size:13px;">${item.Name}</span>
                <button onclick="toggleStockStatus('${item.ID}', '${item.Status}')" 
                        style="background:${btnColor}; color:white; border:none; padding:5px 10px; border-radius:20px; font-size:11px; font-weight:bold; cursor:pointer;">
                    ${btnText}
                </button>
            </div>`;
        });

        invHtml += `</div>`;
        invDiv.innerHTML += invHtml;

    } catch(e) {
        console.log("Stock list load nahi ho saki.");
    }
}

async function toggleStockStatus(id, currentStatus) {
    let newStatus = (currentStatus === 'Live') ? 'Out' : 'Live';
    let confirmCheck = confirm(`Kya aap ${id} ko ${newStatus} karna chahte hain?`);
    
    if (confirmCheck) {
        try {
            // Google Script ko message bhejo update karne ke liye
            const response = await fetch(SCRIPT_URL + `?action=updateStatus&id=${id}&status=${newStatus}`);
            const result = await response.json();
            if (result.success) {
                alert("Status update ho gaya!");
                loadAdminData(); // Refresh list
            }
        } catch (error) {
            alert("Error: Sheet update nahi ho payi.");
        }
    }
}
