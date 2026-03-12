// AATA MITRA - Main Logic
const URL = "https://script.google.com/macros/s/AKfycbwKIh4Q2VGhGspPBEQe6cfrwJLOlrY76MC3BDp9463MsIIBj1gPDLs7f3yR6vtGDwk_/exec";

async function loadProducts() {
    const list = document.getElementById('product-list');
    if(!list) return;

    list.innerHTML = "<p style='grid-column: 1/-1;'>Saman load ho raha hai, rukiye...</p>";
    
    try {
        const response = await fetch(`${URL}?action=getProducts`);
        const data = await response.json();
        
        // Agar data mil gaya
        if (data && data.length > 1) {
            const products = data.slice(1); // Pehli row (headers) ko chhod kar
            list.innerHTML = ""; // Loader hatao

            products.forEach(row => {
                // row[0]=ID, row[2]=Name, row[3]=Weight, row[4]=Price
                list.innerHTML += `
                    <div class="product-card">
                        <img src="images/products/${row[0]}.jpg" onerror="this.src='welcome.jpg'">
                        <h4 style="margin:5px 0;">${row[2]}</h4>
                        <p style="font-size:12px; color:gray;">Pack: ${row[3]}</p>
                        <p style="font-weight:bold; color:#27ae60;">₹${row[4]}</p>
                        <button class="btn" onclick="addToCart('${row[0]}', '${row[2]}', ${row[4]})" style="padding:5px; font-size:12px;">Add to Cart</button>
                    </div>
                `;
            });
        } else {
            list.innerHTML = "<p style='grid-column: 1/-1;'>Abhi koi saman available nahi hai.</p>";
        }
    } catch (e) {
        console.error("Error loading products:", e);
        list.innerHTML = "<p style='grid-column: 1/-1;'>Google Sheet se connection nahi ban paya. Ek baar Refresh karein.</p>";
    }
}

// Banners Load Karne ka Function
async function loadBanners() {
    const bannerArea = document.getElementById('banner-area');
    if(!bannerArea) return;

    try {
        const response = await fetch(`${URL}?action=getBanners`);
        const data = await response.json();
        if(data && data.length > 1) {
            const banner = data[1]; // Pehla banner uthao
            bannerArea.innerHTML = `
                <div style="margin:10px; border-radius:10px; overflow:hidden; background:#fff3cd; padding:15px; border:1px dashed #f1c40f;">
                    <h3 style="color:#856404;">${banner[1]}</h3>
                    <p>${banner[2]}</p>
                </div>
            `;
        }
    } catch (e) {
        console.log("Banners nahi mile");
    }
}

// Global Variables
let cart = [];

function addToCart(id, name, price) {
    cart.push({id, name, price});
    alert(`${name} cart mein add ho gaya!`);
    document.getElementById('cart-count').innerText = cart.length;
}

function toggleSidebar() {
    alert("Menu feature jald aa raha hai!");
}

// Admin Trigger
document.addEventListener('click', (e) => {
    if(e.target.id === 'admin-trigger') {
        if(prompt("Enter Admin Code:") === "LUCKY") {
            alert("Welcome Rana Ji! Admin Panel Loading...");
        }
    }
});
