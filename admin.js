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

// --- STOCK CONTROL WITH WEIGHT DISPLAY ---

async function loadInventoryAdmin() {
    const invDiv = document.getElementById('admin-all-orders'); 
    let invHtml = `<div style="margin-top:25px; padding:15px; background:#fff; border:1px dashed var(--main); border-radius:12px;">
                    <h4 style="margin-bottom:10px;"><i class="fas fa-boxes-stacked"></i> Stock Control (ON/OFF)</h4>
                    <p style="font-size:11px; color:gray; margin-bottom:10px;">Yahan se item band ya chalu karein:</p>`;

    try {
        const res = await fetch(SCRIPT_URL + "?action=getProducts"); 
        const products = await res.json();

        products.forEach(item => {
            let isLive = (item.Status === 'Live');
            let btnColor = isLive ? '#2ecc71' : '#e74c3c';
            let btnText = isLive ? 'LIVE' : 'OUT';
            
            // Weight/Unit dikhane ke liye (Maan lo sheet mein column ka naam 'Unit' hai)
            let weightInfo = item.Unit ? `<span style="color:#d35400; font-weight:bold;"> - ${item.Unit}</span>` : '';

            invHtml += `
            <div style="display:flex; justify-content:space-between; align-items:center; padding:10px 0; border-bottom:1px solid #eee;">
                <div style="flex:1; padding-right:10px;">
                    <span style="font-size:13px; font-weight:600;">${item.Name}</span>${weightInfo}
                </div>
                <button onclick="toggleStockStatus('${item.ID}', '${item.Status}')" 
                        style="background:${btnColor}; color:white; border:none; padding:6px 12px; border-radius:20px; font-size:10px; font-weight:bold; cursor:pointer; min-width:65px;">
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
    let confirmCheck = confirm(`Kya aap ID: ${id} ko ${newStatus} karna chahte hain?`);
    
    if (confirmCheck) {
        try {
            // DHYAN DEIN: Yahan humne POST request ka use kiya hai jo Apps Script ke doPost mein updateProductStock ko trigger karega
            const response = await fetch(SCRIPT_URL, {
                method: 'POST',
                mode: 'no-cors', // Kyunki hum redirection handles nahi kar rahe
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    action: "updateProductStock",
                    id: id,
                    newStatus: newStatus
                })
            });
            
            alert("Request bhej di gayi hai! Update hone mein 2-3 second lag sakte hain.");
            setTimeout(() => { location.reload(); }, 1000); // Page refresh taaki naya status dikhe

        } catch (error) {
            alert("Error: Connection mein dikkat hai.");
        }
    }
}
