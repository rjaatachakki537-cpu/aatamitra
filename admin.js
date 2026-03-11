// admin.js
let superAdminClicks = 0;

function checkSuperAdmin() {
    superAdminClicks++;
    if (superAdminClicks === 5) {
        let pass = prompt("Namaste Rana Ji! Secret Password Daalein:");
        if (pass === "BOSS537") {
            showPage('view-admin');
            loadAdminData();
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
        let html = '';
        
        data.forEach(o => {
            // Sirf Delivered orders ke paise jodo
            if(o.status === 'DELIVERED') {
                totalSale += parseFloat(o.total || 0);
            }
            
            html += `
            <div class="order-card" style="border-left:4px solid ${o.status==='PENDING'?'#ff4d4d':'#2ecc71'}; font-size:12px; margin-bottom:8px;">
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
        adminOrdersDiv.innerHTML = "<p style='text-align:center; color:red;'>Data fetch error!</p>";
    }
}
