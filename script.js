// -----------------------
// Aata Mitra - Script.js
// -----------------------
const API_URL = "https://script.google.com/macros/s/AKfycbwKIh4Q2VGhGspPBEQe6cfrwJLOlrY76MC3BDp9463MsIIBj1gPDLs7f3yR6vtGDwk_/exec";

let allProducts = [];
let cart = [];

// 1. Load Splash + App
window.onload = () => {
    console.log("Aata Mitra App Started...");
};

// 2. Load Products + Categories + Banners
async function loadProducts() {
    const productList = document.getElementById("product-list");
    const categoryList = document.getElementById("category-list");
    const bannerArea = document.getElementById("banner-area");

    try {
        const res = await fetch(`${API_URL}?action=getProducts`);
        const data = await res.json();

        if(data && data.length > 1){
            allProducts = data.slice(1);

            // Categories
            const categories = ["All", ...new Set(allProducts.map(item => item[2]))]; // Column 2 = Category
            categoryList.innerHTML = categories.map(cat => 
                `<span class="cat-pill" onclick="filterData('${cat}')">${cat}</span>`
            ).join('');

            renderProducts(allProducts);
        }

        // Load Banners
        const bannerRes = await fetch(`${API_URL}?action=getBanners`);
        const banners = await bannerRes.json();
        if(banners && banners.length > 1){
            bannerArea.innerHTML = banners.slice(1).map(b => 
                `<img src="${b[3]}" style="width:100%; border-radius:12px; margin-bottom:10px;">`
            ).join('');
        }

    } catch(e) {
        productList.innerHTML = "Connection Failed!";
        console.error(e);
    }
}

// 3. Render Products
function renderProducts(items){
    const list = document.getElementById('product-list');
    list.innerHTML = items.map(row => `
        <div class="product-card">
            <img src="images/products/${row[0]}.jpg" onerror="this.src='welcome.jpg'">
            <h4>${row[1]}</h4>
            <p>${row[4]} (${row[3]})</p>
            <b>₹${row[5]}</b>
            <button class="add-btn" onclick="addToCart('${row[0]}','${row[1]}',${row[5]})">Add to Cart</button>
        </div>
    `).join('');
}

// 4. Filter Category
function filterData(cat){
    if(cat === "All") renderProducts(allProducts);
    else renderProducts(allProducts.filter(p => p[2] === cat));
}

// 5. Add to Cart
function addToCart(id,name,price){
    cart.push({id,name,price});
    document.getElementById('cart-count').innerText = cart.length;
    alert(`${name} cart mein add ho gaya!`);
}

// 6. Show Tabs
function showTab(tab){
    if(tab==='cart'){
        alert("Basket mein "+cart.length+" item hain.");
    }
    if(tab==='track'){
        const orderID = prompt("Order ID Dalo:");
        if(orderID) trackMyOrder(orderID);
    }
    if(tab==='home') location.reload();
}

// 7. Admin Panel Trigger
document.getElementById('admin-trigger').addEventListener('click', async () => {
    let code = prompt("Admin Code Dalo:");
    if(code === "LUCKY"){
        alert("Admin Panel Access Granted!");
        loadAdminOrders();
    }
});

// 8. Admin Load Orders
async function loadAdminOrders(){
    const res = await fetch(`${API_URL}?action=getOrders`);
    const data = await res.json();
    const orders = data.slice(1);
    let html = '<h2>Admin Dashboard (Rana Ji Aata Chakki)</h2>';
    orders.reverse().forEach(row => {
        html += `
        <div class="admin-order-card">
            <p><b>Order ID:</b> ${row[0]}</p>
            <p><b>Customer:</b> ${row[2]}</p>
            <p><b>Items:</b> ${row[5]}</p>
            <p><b>Total:</b> ₹${row[6]}</p>
            <p><b>Status:</b> ${row[7]}</p>
            <button onclick="updateStatus('${row[0]}','Out for Delivery')">Mark Out for Delivery</button>
            <button onclick="updateStatus('${row[0]}','Delivered')">Mark Delivered</button>
        </div>
        `;
    });
    document.getElementById('admin-content').innerHTML = html;
}

// 9. Admin Update Status
async function updateStatus(orderID,status){
    await fetch(API_URL+"?action=updateStatus", {
        method:'POST',
        body: JSON.stringify({orderId:orderID,status:status})
    });
    alert(`Order ${orderID} status updated to ${status}`);
    loadAdminOrders();
}

// 10. Track My Order
async function trackMyOrder(orderID){
    const res = await fetch(`${API_URL}?action=trackOrder&orderId=${orderID}`);
    const order = await res.json();
    if(order){
        alert(`Order ID: ${order[0]}\nCurrent Status: ${order[7]}`);
    } else alert("Order ID galat hai!");
}
