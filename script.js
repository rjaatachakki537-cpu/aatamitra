const SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbyTj8qSzdH2u2oKmY7hfqJU59LfX8TWo88cRtUugkJP78iXOs55WsA3kv7T-cjhZqIq/exec';
const DATA_URL = `https://docs.google.com/spreadsheets/d/15PzF3vRmqbrak8_9c4D9hqQ20jxUjWpx/gviz/tq?tqx=out:json&sheet=Products`;

let masterData = [], cart = [], user = JSON.parse(localStorage.getItem('ranaUser')), activeModificationId = null;
let historyData = JSON.parse(localStorage.getItem('ranaHistory')) || [];
let adminClicks = 0;

async function init() {
    if(user) {
        document.getElementById('login-screen').style.display = 'none';
        document.getElementById('p-name').innerText = user.name;
        if(document.getElementById('p-phone')) document.getElementById('p-phone').innerText = user.mobile;
        if(user.profilePic && document.getElementById('user-img-display')) {
            document.getElementById('user-img-display').src = user.profilePic;
        }
        syncStatuses();
    }
    const res = await fetch(DATA_URL);
    const text = await res.text();
    masterData = JSON.parse(text.substring(47, text.length-2)).table.rows;
    renderHistory();
}

// NAVIGATION
function showPage(id) {
    document.querySelectorAll('.view').forEach(v => v.classList.remove('active'));
    document.getElementById(id).classList.add('active');
    if(id==='view-cart') renderCart();
    if(id==='view-delivery') loadDeliveryOrders();
}

// ADMIN ACCESS LOGIC (TAP 5 TIMES)
function checkAdminAccess() {
    adminClicks++;
    if (adminClicks === 5) {
        let pass = prompt("Enter Secret Admin Password:");
        if (pass === "RANA537") {
            document.getElementById('delivery-admin-btn').style.display = 'block';
            showToast("Admin Mode On! 🚚");
        } else {
            alert("Galat Password!");
        }
        adminClicks = 0;
    }
    setTimeout(() => { adminClicks = 0; }, 3000);
}

// DELIVERY DASHBOARD LOGIC
async function loadDeliveryOrders() {
    const listDiv = document.getElementById('delivery-list');
    listDiv.innerHTML = "Fetching pending orders...";
    try {
        const res = await fetch(SCRIPT_URL);
        const allOrders = await res.json();
        const pending = allOrders.filter(o => o.status === 'PENDING');
        
        let html = '';
        pending.forEach(o => {
            html += `
            <div class="order-card" style="border-left:5px solid var(--main);">
                <div style="display:flex; justify-content:space-between;">
                    <b>ID: #${o.id.toString().slice(-5)}</b>
                    <b style="color:green;">₹${o.total}</b>
                </div>
                <div style="margin:10px 0; font-size:13px;">
                    <i class="fas fa-user"></i> ${o.name} <br>
                    <i class="fas fa-box"></i> ${o.details}
                </div>
                <div style="margin-bottom:10px; background:#f0f0f0; padding:10px; border-radius:10px;">
                    <small>Delivery Proof (Photo):</small>
                    <input type="file" id="proof-${o.id}" accept="image/*" capture="camera" style="width:100%; font-size:12px;">
                </div>
                <div class="btn-grid">
                    <a href="https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(o.address)}" target="_blank" class="action-btn" style="background:#e3f2fd; color:#1976d2;">
                        <i class="fas fa-map-marked-alt"></i> MAPS
                    </a>
                    <button class="action-btn" style="background:var(--main); color:white;" onclick="verifyAndDeliver('${o.id}')">
                        <i class="fas fa-check"></i> DONE
                    </button>
                </div>
            </div>`;
        });
        listDiv.innerHTML = html || "No pending deliveries! 😎";
    } catch(e) { listDiv.innerHTML = "Error loading orders."; }
}

async function verifyAndDeliver(id) {
    const photoInput = document.getElementById(`proof-${id}`);
    if(!photoInput.files.length) return alert("Pehle saaman ki photo kheencho! 📸");

    if(!confirm("Kya order deliver ho gaya?")) return;
    
    showToast("Processing... ⏳");
    try {
        await fetch(SCRIPT_URL, { 
            method: 'POST', 
            body: JSON.stringify({ action: "updateStatus", id: id, newStatus: "DELIVERED" }) 
        });
        showToast("Order Delivered! ✅");
        loadDeliveryOrders();
    } catch(e) { showToast("Error updating status"); }
}

// EXISTING FUNCTIONS (PRODS, CART, ETC.)
function loadSubs(main) {
    let subs = {}; let lastM = "";
    masterData.forEach(r => {
        let m = r.c[2]?.v || lastM; lastM = m;
        if(m.toLowerCase().includes(main.toLowerCase().substring(0,3))) {
            let s = (main === 'Masale') ? r.c[1]?.v : r.c[3]?.v;
            if(s && !subs[s]) subs[s] = r.c[6]?.v || "";
        }
    });
    let html = '';
    for(let s in subs) html += `<div style="background:white; padding:15px; border-radius:15px; text-align:center;" onclick="loadProds('${main}','${s}')"><img src="${subs[s]}" style="width:100%; height:60px; object-fit:cover; border-radius:10px;"><br><b>${s}</b></div>`;
    document.getElementById('sub-list').innerHTML = html;
    showPage('view-sub');
}

function loadProds(cat, sub) {
    let html = ''; let lM="", lN="", lS="", lI="";
    masterData.forEach(r => {
        let n=r.c[1]?.v||lN; lN=n; let m=r.c[2]?.v||lM; lM=m; let s=r.c[3]?.v||lS; lS=s; let i=r.c[6]?.v||lI; lI=i;
        let match = (cat==='Masale') ? (lN===sub) : (lM.includes(cat.substring(0,3)) && lS===sub);
        if(match && r.c[4]?.v) {
            html += `<div class="item-card"><img src="${lI}"><div><b>${lN}</b><br><small>${r.c[4].v}</small><br><b>₹${r.c[5].v}</b></div><button class="add-btn" onclick="addToBag('${lN}','${r.c[4].v}',${r.c[5].v})">ADD</button></div>`;
        }
    });
    document.getElementById('prod-list').innerHTML = html;
    showPage('view-prod');
}

function addToBag(n, w, p) { cart.push({n, w, p}); showToast(`${n} Bag mein!`); }

function renderCart() {
    let html = '', total = 0;
    cart.forEach((item, i) => {
        total += item.p;
        html += `<div class="item-card"><b>${item.n}</b> (${item.w})<br>₹${item.p}<button onclick="cart.splice(${i},1);renderCart()" style="margin-left:auto; border:none; background:none; color:red;">🗑️</button></div>`;
    });
    document.getElementById('cart-items-display').innerHTML = html || "Bag khali hai!";
    document.getElementById('cart-total-display').innerText = "Total: ₹" + total;
}

async function confirmOrder() {
    if(!cart.length && !activeModificationId) return alert("Bag khali hai!");
    let id = activeModificationId || Date.now().toString().slice(-6);
    let details = cart.map(i => `${i.n}(${i.w})`).join(", ");
    let note = document.getElementById('order-custom-note').value;
    let total = cart.reduce((a,b)=>a+b.p,0);
    showToast("Processing Order... 🚀");
    try {
        const response = await fetch(SCRIPT_URL, {
            method: 'POST',
            body: JSON.stringify({ action: activeModificationId ? "update" : "create", id: id, name: user.name, mobile: user.mobile, email: user.email || "", address: user.address + (note ? " | " + note : ""), details: details, total: total })
        });
        const result = await response.json();
        if(result.status === "success") {
            showToast("Order Success! ✅");
            cart = []; activeModificationId = null; renderCart();
            setTimeout(() => { window.location.href = result.whatsapp_url; }, 1200);
        }
    } catch(e) { showToast("Order ho gaya, WhatsApp manually karein."); }
}

function renderHistory() {
    let html = '';
    historyData.slice().reverse().forEach(o => {
        let s = o.status || 'PENDING';
        html += `<div class="order-card">
            <span class="status-badge s-${s}">${s}</span>
            <b>ID: #${o.id.toString().slice(-6)}</b><br><small>${o.details}</small><br><b>Total: ₹${o.total}</b>
            <div class="btn-grid">
                ${s==='PENDING' ? `<button class="action-btn btn-modify" onclick="startCustomization('${o.id}','${o.details}')">Modify</button>` : ''}
                <button class="action-btn btn-repeat" onclick="alert('Added to cart!')">Repeat</button>
                <a href="https://wa.me/918923357537" class="action-btn btn-chat">WhatsApp</a>
            </div>
        </div>`;
    });
    document.getElementById('order-history').innerHTML = html || "No orders.";
}

async function syncStatuses() {
    if(!user) return;
    try {
        const res = await fetch(`${SCRIPT_URL}?mobile=${user.mobile}`);
        historyData = await res.json();
        localStorage.setItem('ranaHistory', JSON.stringify(historyData));
        renderHistory();
    } catch(e) { console.log("Sync Error"); }
}

function showToast(msg) { let t = document.getElementById("toast"); t.innerText = msg; t.className = "show"; setTimeout(() => t.className = "", 2500); }
function handleLogin() { 
    const n = document.getElementById('l-name').value, m = document.getElementById('l-mobile').value, e = document.getElementById('l-email').value, a = document.getElementById('l-address').value;
    if(n && m) { user = {name:n, mobile:m, email:e, address:a}; localStorage.setItem('ranaUser', JSON.stringify(user)); location.reload(); }
}
function updateProfilePic(input) {
    if (input.files && input.files[0]) {
        let reader = new FileReader();
        reader.onload = function(e) {
            document.getElementById('user-img-display').src = e.target.result;
            user.profilePic = e.target.result;
            localStorage.setItem('ranaUser', JSON.stringify(user));
            showToast("Photo Updated! 📸");
        };
        reader.readAsDataURL(input.files[0]);
    }
}
function toggleEditMode() {
    let form = document.getElementById('edit-form');
    form.style.display = form.style.display === 'none' ? 'block' : 'none';
    if(form.style.display === 'block') {
        document.getElementById('e-name').value = user.name;
        document.getElementById('e-mobile').value = user.mobile;
        document.getElementById('e-address').value = user.address;
    }
}
function saveProfileChanges() {
    user.name = document.getElementById('e-name').value;
    user.mobile = document.getElementById('e-mobile').value;
    user.address = document.getElementById('e-address').value;
    localStorage.setItem('ranaUser', JSON.stringify(user));
    document.getElementById('p-name').innerText = user.name;
    if(document.getElementById('p-phone')) document.getElementById('p-phone').innerText = user.mobile;
    toggleEditMode();
    showToast("Saved! ✅");
}

window.onload = init;
