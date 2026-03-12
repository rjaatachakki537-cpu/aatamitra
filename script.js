const SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbyTj8qSzdH2u2oKmY7hfqJU59LfX8TWo88cRtUugkJP78iXOs55WsA3kv7T-cjhZqIq/exec';
const DATA_URL = `https://docs.google.com/spreadsheets/d/15PzF3vRmqbrak8_9c4D9hqQ20jxUjWpx/gviz/tq?tqx=out:json&sheet=Products`;

let masterData = [], cart = [], user = JSON.parse(localStorage.getItem('ranaUser')), activeModificationId = null;
let historyData = JSON.parse(localStorage.getItem('ranaHistory')) || [];

// Secret Tap Counters
let headerTapCount = 0;
let profileTapCount = 0;
let deferredPrompt; // For Install Feature

// 1. INITIALIZATION & REFRESH PROTECTION
async function initAppSession() {
    // Check if user was in a secret panel before refresh
    const lastSession = localStorage.getItem('ranaSession');
    
    if (user) {
        document.getElementById('login-screen').style.display = 'none';
        document.getElementById('p-name').innerText = user.name;
        if (document.getElementById('p-phone')) document.getElementById('p-phone').innerText = user.mobile;
        if (user.profilePic && document.getElementById('user-img-display')) {
            document.getElementById('user-img-display').src = user.profilePic;
        }
        
        // Refresh Fix Logic: Stay in panel if session exists
        if (lastSession === 'admin') {
            showPage('view-admin');
        } else if (lastSession === 'delivery') {
            showPage('view-delivery');
        } else {
            showPage('view-home');
        }
        syncStatuses();
    }

    try {
        const res = await fetch(DATA_URL);
        const text = await res.text();
        masterData = JSON.parse(text.substring(47, text.length - 2)).table.rows;
    } catch (e) { console.log("Data Load Error"); }
    renderHistory();
}

// 2. SECRET ACCESS LOGIC (Taps & Passwords)

// Admin Access: Header 5 Taps
function handleHeaderTap() {
    headerTapCount++;
    if (headerTapCount === 5) {
        headerTapCount = 0;
        let pass = prompt("Enter Admin Code:");
        if (pass === "BOSS 537") {
            localStorage.setItem('ranaSession', 'admin');
            showPage('view-admin');
            showToast("Malak Swagat Hai! 👑");
        } else {
            showToast("Galat Code! ❌");
        }
    }
    setTimeout(() => { headerTapCount = 0; }, 3000);
}

// Delivery Access: Profile Name 4 Taps
function handleProfileNameTap() {
    profileTapCount++;
    if (profileTapCount === 4) {
        profileTapCount = 0;
        let pin = prompt("Enter Last 5 Digits of Mobile:");
        let lastFive = user.mobile.toString().slice(-5);
        if (pin === lastFive) {
            localStorage.setItem('ranaSession', 'delivery');
            showPage('view-delivery');
            showToast("Delivery Mode ON 🚚");
        } else {
            showToast("Invalid PIN! ❌");
        }
    }
    setTimeout(() => { profileTapCount = 0; }, 3000);
}

// Exit Secret Mode (Clears persistence)
function exitSecretView() {
    localStorage.removeItem('ranaSession');
    showPage('view-home');
    showToast("Wapas Normal App Pe");
}

// 3. INSTALL APP FEATURE
window.addEventListener('beforeinstallprompt', (e) => {
    e.preventDefault();
    deferredPrompt = e;
    const installBtn = document.getElementById('menu-install-btn');
    if (installBtn) installBtn.style.display = 'block';
});

async function installApp() {
    if (deferredPrompt) {
        deferredPrompt.prompt();
        const { outcome } = await deferredPrompt.userChoice;
        if (outcome === 'accepted') {
            document.getElementById('menu-install-btn').style.display = 'none';
        }
        deferredPrompt = null;
    } else {
        showToast("App install option abhi available nahi hai.");
    }
}

// 4. NAVIGATION LOGIC
function showPage(pageId) {
    document.querySelectorAll('.view').forEach(v => v.classList.remove('active'));
    const target = document.getElementById(pageId);
    if (target) target.classList.add('active');

    document.querySelectorAll('.nav-item').forEach(item => item.classList.remove('active'));
    if (pageId === 'view-home') document.getElementById('nav-home')?.classList.add('active');
    if (pageId === 'view-cart') {
        document.getElementById('nav-bag')?.classList.add('active');
        renderCart();
    }
    if (pageId === 'view-profile') document.getElementById('nav-profile')?.classList.add('active');
    
    if (pageId === 'view-delivery') {
        // Here you would call your delivery order loading function from admin.js or auth.js
        if(typeof loadDeliveryOrders === 'function') loadDeliveryOrders();
    }

    if (!window.location.hash.includes(pageId)) {
        history.pushState({ viewId: pageId }, "", "#" + pageId);
    }
}

function handleNavBag() { showPage('view-cart'); }

// 5. PRODUCTS & CATEGORIES
function loadSubs(main) {
    let subs = {}; let lastM = "";
    masterData.forEach(r => {
        let m = r.c[2]?.v || lastM; lastM = m;
        if (m && m.toLowerCase().includes(main.toLowerCase().substring(0, 3))) {
            let s = (main === 'Masale') ? r.c[1]?.v : r.c[3]?.v;
            if (s && !subs[s]) subs[s] = r.c[6]?.v || "";
        }
    });
    let html = '';
    for (let s in subs) html += `<div class="item-card" style="flex-direction:column; padding:15px; text-align:center;" onclick="loadProds('${main}','${s}')"><img src="${subs[s]}" style="width:100%; height:80px; object-fit:contain; border-radius:10px;"><br><b>${s}</b></div>`;
    document.getElementById('sub-list').innerHTML = html;
    showPage('view-sub');
}

function loadProds(cat, sub) {
    let html = ''; let lM = "", lN = "", lS = "", lI = "";
    masterData.forEach(r => {
        let n = r.c[1]?.v || lN; lN = n;
        let m = r.c[2]?.v || lM; lM = m;
        let s = r.c[3]?.v || lS; lS = s;
        let i = r.c[6]?.v || lI; lI = i;
        let match = (cat === 'Masale') ? (lN === sub) : (lM.includes(cat.substring(0, 3)) && lS === sub);

        if (match && r.c[4]?.v) {
            let status = r.c[7]?.v || 'Live';
            let isOut = (status.toLowerCase().includes('out'));

            html += `
            <div class="item-card" style="opacity: ${isOut ? '0.6' : '1'}">
                <img src="${lI}">
                <div style="flex:1;">
                    <b>${lN}</b><br><small>${r.c[4].v}</small><br>
                    <b>₹${r.c[5].v}</b>
                    ${isOut ? '<br><b style="color:red; font-size:10px;">OUT OF STOCK</b>' : ''}
                </div>
                <button class="add-btn" ${isOut ? 'disabled style="background:gray"' : `onclick="addToBag('${lN}','${r.c[4].v}',${r.c[5].v})"`}>
                    ${isOut ? 'N/A' : 'ADD'}
                </button>
            </div>`;
        }
    });
    document.getElementById('prod-list').innerHTML = html;
    showPage('view-prod');
}

// 6. CART & LOGIN
function addToBag(n, w, p) {
    cart.push({ n, w, p });
    showToast(`${n} Bag mein dala gaya! 🛒`);
}

function renderCart() {
    let html = '', total = 0;
    cart.forEach((item, i) => {
        total += item.p;
        html += `<div class="item-card" style="justify-content:space-between;">
            <div><b>${item.n}</b><br><small>${item.w}</small> - ₹${item.p}</div>
            <button onclick="cart.splice(${i},1);renderCart()" style="border:none; background:none; color:red; font-size:18px;">🗑️</button>
        </div>`;
    });
    document.getElementById('cart-items-display').innerHTML = html || "<p style='text-align:center; width:100%; padding:20px;'>Aapka Bag khali hai!</p>";
    document.getElementById('cart-total-display').innerText = "Total: ₹" + total;
}

async function handleLogin() {
    let name = document.getElementById('l-name').value;
    let mobile = document.getElementById('l-mobile').value;
    let email = document.getElementById('l-email').value;
    let address = document.getElementById('l-address').value;

    if (!name || mobile.length < 10 || !address) return alert("Puri details sahi se bharein!");

    user = { name, mobile, email, address };
    localStorage.setItem('ranaUser', JSON.stringify(user));
    location.reload();
}

async function confirmOrder() {
    if (!cart.length) return alert("Pehle Bag mein kuch add karein!");
    let id = activeModificationId || Date.now().toString().slice(-6);
    let details = cart.map(i => `${i.n}(${i.w})`).join(", ");
    let note = document.getElementById('order-custom-note').value;
    let total = cart.reduce((a, b) => a + b.p, 0);

    showToast("Order Confirm ho raha hai... 🚀");
    try {
        const response = await fetch(SCRIPT_URL, {
            method: 'POST',
            body: JSON.stringify({
                action: "create",
                id: id,
                name: user.name,
                mobile: user.mobile,
                email: user.email || "",
                address: user.address + (note ? " | Note: " + note : ""),
                details: details,
                total: total
            })
        });
        const result = await response.json();
        if (result.status === "success") {
            cart = []; renderCart();
            showToast("Order Successful! ✅");
            setTimeout(() => { window.location.href = result.whatsapp_url; }, 1000);
        }
    } catch (e) { showToast("Order Error! WhatsApp manually karein."); }
}

// 7. UTILITIES
function showToast(msg) {
    let t = document.getElementById("toast");
    t.innerText = msg;
    t.classList.add("show");
    setTimeout(() => t.classList.remove("show"), 3000);
}

function toggleMenu() {
    const sidebar = document.getElementById('sidebar');
    const overlay = document.getElementById('sidebar-overlay');
    const isOpen = sidebar.style.left === '0px';
    sidebar.style.left = isOpen ? '-280px' : '0px';
    overlay.style.display = isOpen ? 'none' : 'block';
}

function renderHistory() {
    let html = '';
    historyData.slice().reverse().forEach(o => {
        let s = o.status || 'PENDING';
        html += `<div class="order-card" style="border-left: 4px solid var(--main)">
            <span class="status-badge s-${s}">${s}</span>
            <b>ID: #${o.id}</b><br><small>${o.details}</small><br><b>Total: ₹${o.total}</b>
        </div>`;
    });
    document.getElementById('order-history').innerHTML = html || "Abhi tak koi order nahi hai.";
}

async function syncStatuses() {
    if (!user) return;
    try {
        const res = await fetch(`${SCRIPT_URL}?mobile=${user.mobile}`);
        historyData = await res.json();
        localStorage.setItem('ranaHistory', JSON.stringify(historyData));
        renderHistory();
    } catch (e) { console.log("Sync Error"); }
}

function searchProducts() {
    let input = document.getElementById('searchInput').value.toLowerCase();
    let cards = document.querySelectorAll('#prod-list .item-card, #view-home .item-card');
    cards.forEach(card => {
        let text = card.innerText.toLowerCase();
        card.style.display = text.includes(input) ? "" : "none";
    });
}

window.onpopstate = (e) => {
    if (e.state && e.state.viewId) showPage(e.state.viewId);
};

window.onload = initAppSession;
