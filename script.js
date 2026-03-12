const SHEET_URL = "https://script.google.com/macros/s/AKfycbwKIh4Q2VGhGspPBEQe6cfrwJLOlrY76MC3BDp9463MsIIBj1gPDLs7f3yR6vtGDwk_/exec";
let allProducts = [];
let cart = [];

// 1. Initial Load
window.onload = () => {
    console.log("App Started...");
    // Splash screen logic splash.js handle karega
};

// 2. Load Data from Sheet
async function loadProducts() {
    const list = document.getElementById('product-list');
    const catList = document.getElementById('category-list');
    
    try {
        const res = await fetch(`${SHEET_URL}?action=getProducts`);
        const data = await res.json();
        
        if(data && data.length > 1) {
            allProducts = data.slice(1);
            
            // Unique Categories banana
            const categories = ["All", ...new Set(allProducts.map(item => item[1]))];
            catList.innerHTML = categories.map(cat => 
                `<span class="cat-pill" onclick="filterData('${cat}')">${cat}</span>`
            ).join('');

            renderProducts(allProducts);
        }
    } catch (e) {
        list.innerHTML = "Sheet se connection fail!";
    }
}

// 3. Render Products
function renderProducts(items) {
    const list = document.getElementById('product-list');
    list.innerHTML = items.map(row => `
        <div class="product-card">
            <img src="images/products/${row[0]}.jpg" onerror="this.src='welcome.jpg'">
            <h4>${row[2]}</h4>
            <p>₹${row[4]} (${row[3]})</p>
            <button class="add-btn" onclick="addToCart('${row[0]}','${row[2]}',${row[4]})">Add to Cart</button>
        </div>
    `).join('');
}

// 4. Features (Clickable Functions)
function filterData(cat) {
    if(cat === "All") renderProducts(allProducts);
    else renderProducts(allProducts.filter(p => p[1] === cat));
}

function addToCart(id, name, price) {
    cart.push({id, name, price});
    document.getElementById('cart-count').innerText = cart.length;
    alert(name + " cart mein add ho gaya!");
}

function openMenu() {
    alert("Rana Ji, Menu Folder/Sidebar open ho raha hai...");
}

function showTab(tab) {
    if(tab === 'cart') alert("Aapki Basket mein " + cart.length + " item hain.");
    if(tab === 'track') alert("Tracking feature abhi chalu ho raha hai...");
    if(tab === 'home') location.reload();
}

// Admin Trigger (Rana Ji Aata Chakki Header click)
document.getElementById('admin-trigger').addEventListener('click', () => {
    let code = prompt("Admin Code Dalo:");
    if(code === "LUCKY") alert("Admin Panel Access Granted!");
});
