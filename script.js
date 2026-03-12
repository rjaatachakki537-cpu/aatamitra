// script.js - Final Integrated Version
const SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbyTj8qSzdH2u2oKmY7hfqJU59LfX8TWo88cRtUugkJP78iXOs55WsA3kv7T-cjhZqIq/exec';
const DATA_URL = `https://docs.google.com/spreadsheets/d/15PzF3vRmqbrak8_9c4D9hqQ20jxUjWpx/gviz/tq?tqx=out:json&sheet=Products`;

let masterData = [], cart = [], user = JSON.parse(localStorage.getItem('ranaUser')), activeModificationId = null;
let historyData = JSON.parse(localStorage.getItem('ranaHistory')) || [];
let adminClicks = 0;

// 1. INITIALIZATION
async function init() {
    if(user) {
        const loginScreen = document.getElementById('login-screen');
        if(loginScreen) loginScreen.style.display = 'none';
        
        if(document.getElementById('p-name')) document.getElementById('p-name').innerText = user.name;
        if(document.getElementById('p-phone')) document.getElementById('p-phone').innerText = user.mobile;
        
        if(user.profilePic && document.getElementById('user-img-display')) {
            document.getElementById('user-img-display').src = user.profilePic;
        }
        syncStatuses();
    }
    try {
        const res = await fetch(DATA_URL);
        const text = await res.text();
        masterData = JSON.parse(text.substring(47, text.length-2)).table.rows;
    } catch(e) { 
        console.log("Data Load Error"); 
        showToast("Network Error! Reload karein.");
    }
    renderHistory();
}

// 2. NAVIGATION LOGIC
function showPage(pageId) {
    document.querySelectorAll('.view').forEach(v => v.classList.remove('active'));
    const target = document.getElementById(pageId);
    if(target) target.classList.add('active');

    // Nav Bar Icons Update
    document.querySelectorAll('.nav-item').forEach(item => item.classList.remove('active'));
    if(pageId === 'view-home') document.getElementById('nav-home')?.classList.add('active');
    if(pageId === 'view-cart') {
        document.getElementById('nav-bag')?.classList.add('active');
        renderCart();
    }
    if(pageId === 'view-profile') document.getElementById('nav-profile')?.classList.add('active');
    
    // Smooth Scroll to Top
    window.scrollTo(0,0);
}

function handleNavBag() {
    showPage('view-cart');
}

// 3. PRODUCTS & CATEGORIES
function loadSubs(main) {
    let subs = {}; let lastM = "";
    masterData.forEach(r => {
        let m = r.c[2]?.v || lastM; lastM = m;
        if(m && m.toLowerCase().includes(main.toLowerCase().substring(0,3))) {
            let s = (main === 'Masale') ? r.c[1]?.v : r.c[3]?.v;
            if(s && !subs[s]) subs[s] = r.c[6]?.v || "";
        }
    });
    
    let html = '';
    for(let s in subs) {
        html += `
        <div class="item-card" style="flex-direction:column; padding:15px; text-align:center;" onclick="loadProds('${main}','${s}')">
            <img src="${subs[s] || 'https://via.placeholder.com/80'}" style="width:100%; height:80px; object-fit:contain; border-radius:10px;">
            <br><b>${s}</b>
        </div>`;
    }
    
    const subList = document.getElementById('sub-list');
    if(subList) {
        subList.innerHTML = html || "<p>Data nahi mila</p>";
        showPage('view-sub');
    }
}

function loadProds(cat, sub) {
    let html = ''; let lM="", lN="", lS="", lI="";
    masterData.forEach(r => {
        let n=r.c[1]?.v||lN; lN=n; 
        let m=r.c[2]?.v||lM; lM=m; 
        let s=r.c[3]?.v||lS; lS=s; 
        let i=r.c[6]?.v||lI; lI=i;
        let match = (cat==='Masale') ? (lN===sub) : (lM.includes(cat.substring(0,3)) && lS===sub);
        
        if(match && r.c[4]?.v) {
            let status = r.c[7]?.v || 'Live';
            let isOut = (status.toLowerCase().includes('out'));
            
            html += `
            <div class="item-card" style="opacity: ${isOut ? '0.6' : '1'}">
                <img src="${lI}">
                <div style="flex:1;">
                    <b>${lN}</b><br><small>${r.c[4].v}</small><br>
                    <b>₹${r.c[5].v}</b>
                    ${isOut ? '<br><b style="color:red; font-size:10px;">STOCK KHATAM</b>' : ''}
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

// 4. CART & ORDERING
function addToBag(n, w, p) { 
    cart.push({n, w, p}); 
    showToast(`${n} Bag mein hai! 🛒`); 
}

function renderCart() {
    let html = '', total = 0;
    cart.forEach((item, i) => {
        total += item.p;
        html += `
        <div class="item-card" style="justify-content:space-between; padding: 10px 15px;">
            <div><b>${item.n}</b><br><small>${item.w}</small> - ₹${item.p}</div>
            <button onclick="cart.splice(${i},1);renderCart()" style="border:none; background:none; color:red; font-size:18px;">🗑️</button>
        </div>`;
    });
    document.getElementById('cart-items-display').innerHTML = html || "<p style='text-align:center; width:100%; padding:20px;'>Bag Khali hai!</p>";
    document.getElementById('cart-total-display').innerText = "Total: ₹" + total;
}

async function confirmOrder() {
    if(!cart.length) return alert("Bag Khali hai!");
    if(!user) return alert("Pehle Login karein!");

    let id = activeModificationId || Date.now().toString().slice(-6);
    let details = cart.map(i => `${i.n}(${i.w})`).join(", ");
    let note = document.getElementById('order-custom-note').value;
    let total = cart.reduce((a,b)=>a+b.p,0);
    
    showToast("Rana Ji ko bhej rahe hain... 🚀");
    try {
        const response = await fetch(SCRIPT_URL, {
            method: 'POST',
            mode: 'no-cors', // Basic integration safety
            body: JSON.stringify({ 
                action: "create", 
                id: id, 
                name: user.name, 
                mobile: user.mobile, 
                address: user.address + (note ? " | Note: " + note : ""), 
                details: details, 
                total: total 
            })
        });
        
        // WhatsApp Redirect
        let waMsg = `*Naya Order!*%0AID: #${id}%0ANaam: ${user.name}%0ADetails: ${details}%0ATotal: ₹${total}`;
        window.location.href = `https://wa.me/918923357537?text=${waMsg}`;
        
        cart = []; renderCart();
        showToast("Order Successful! ✅");
    } catch(e) { 
        showToast("WhatsApp manually karein."); 
    }
}

// 5. PROFILE & UTILS
function toggleMenu() {
    const sidebar = document.getElementById('sidebar');
    const overlay = document.getElementById('sidebar-overlay');
    if(sidebar.style.left === '0px') {
        sidebar.style.left = '-280px';
        overlay.style.display = 'none';
    } else {
        sidebar.style.left = '0px';
        overlay.style.display = 'block';
    }
}

function showToast(msg) { 
    let t = document.getElementById("toast"); 
    if(!t) return;
    t.innerText = msg; 
    t.classList.add("show"); 
    setTimeout(() => t.classList.remove("show"), 3000); 
}

function checkSuperAdmin() {
    adminClicks++;
    if(adminClicks >= 7) {
        adminClicks = 0;
        showPage('view-admin');
        showToast("Welcome Malak! 👑");
    }
}

// Search Logic
function searchProducts() {
    let input = document.getElementById('searchInput').value.toLowerCase();
    let cards = document.querySelectorAll('#prod-list .item-card, #view-home .item-card');
    cards.forEach(card => {
        let text = card.innerText.toLowerCase();
        card.style.display = text.includes(input) ? "" : "none";
    });
}

// Browser Back Support
window.onpopstate = (e) => showPage(e.state?.viewId || 'view-home');

window.onload = () => {
    init();
    history.replaceState({viewId: 'view-home'}, "", "#view-home");
};
