const SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbwwXpnLfxex5KKlWaAGcuElpBN3eHVfXtia_ninNKmgCRg4eCkUoZ98f1xsqB7HfQb_/exec';
const DATA_URL = `https://docs.google.com/spreadsheets/d/15PzF3vRmqbrak8_9c4D9hqQ20jxUjWpx/gviz/tq?tqx=out:json&sheet=Products`;

let masterData = [], cart = [], user = JSON.parse(localStorage.getItem('ranaUser')), activeModificationId = null;
let historyData = JSON.parse(localStorage.getItem('ranaHistory')) || [];

async function init() {
    if(user) {
        document.getElementById('login-screen').style.display = 'none';
        document.getElementById('p-name').innerText = user.name;
        syncStatuses();
    }
    const res = await fetch(DATA_URL);
    const text = await res.text();
    masterData = JSON.parse(text.substring(47, text.length-2)).table.rows;
    renderHistory();
}

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

function showPage(id) {
    document.querySelectorAll('.view').forEach(v => v.classList.remove('active'));
    document.getElementById(id).classList.add('active');
    if(id==='view-cart') renderCart();
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
    
    showToast("Processing... 🚀");
    await fetch(SCRIPT_URL, {
        method: 'POST',
        body: JSON.stringify({ action: activeModificationId ? "update" : "create", id: id, name: user.name, mobile: user.mobile, email: user.email || "", address: user.address + (note ? " | " + note : ""), details: details, total: total })
    });
    activeModificationId = null; cart = [];
    showToast("Order Success! ✅");
    setTimeout(() => { showPage('view-profile'); syncStatuses(); }, 1000);
}

function startCustomization(orderId, oldDetails) {
    activeModificationId = orderId;
    document.getElementById('cart-header').innerText = "Modifying Order #" + orderId.slice(-5);
    document.getElementById('order-custom-note').value = "ADDITION TO: " + oldDetails;
    showPage('view-home');
    showToast("Ab saman jodein!");
}

async function cancelOrder(id) {
    if(!confirm("Order cancel karein?")) return;
    showToast("Cancelling... ⏳");
    await fetch(SCRIPT_URL, { method: 'POST', body: JSON.stringify({ action: "updateStatus", id: id, newStatus: "CANCELLED" }) });
    syncStatuses();
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
                ${s==='PENDING' ? `<button class="action-btn btn-cancel" onclick="cancelOrder('${o.id}')">Cancel</button>` : ''}
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
window.onload = init;
