// AATA MITRA - Main Logic
const SCRIPT_URL = "https://script.google.com/macros/s/AKfycbwKIh4Q2VGhGspPBEQe6cfrwJLOlrY76MC3BDp9463MsIIBj1gPDLs7f3yR6vtGDwk_/exec";
const ADMIN_CODE = "LUCKY";

// 1. Secret Panel Logic (Admin & Delivery)
document.querySelector('.header-title').addEventListener('click', () => {
    let code = prompt("Enter Admin Secret Code:");
    if (code === ADMIN_CODE) {
        window.location.href = "admin.html"; // Ya admin panel show karein
    } else {
        alert("Wrong Code!");
    }
});

document.querySelector('.profile-name').addEventListener('click', () => {
    let userMobile = localStorage.getItem('userMobile'); // Login ke waqt save kiya gaya
    let code = prompt("Enter Delivery Access Code (Last 5 digits of your mobile):");
    if (userMobile && code === userMobile.slice(-5)) {
        alert("Delivery Panel Access Granted!");
        // Yahan delivery panel khulne ka logic aayega
    } else {
        alert("Unauthorized!");
    }
});

// 2. Load Products (Weight Selection Logic)
async function loadProducts() {
    const response = await fetch(`${SCRIPT_URL}?action=getProducts`);
    const data = await response.json();
    const products = data.slice(1); // Header row hata kar

    let html = '';
    products.forEach(row => {
        // row[3] = Net Weight (jaise '5kg, 10kg, 25kg') 
        let weights = row[3].split(','); 
        html += `
            <div class="product-card">
                <img src="https://yourusername.github.io/app/images/products/${row[5]}" alt="${row[2]}">
                <h3>${row[2]}</h3>
                <p>Price: ₹${row[4]}</p>
                <select id="weight-${row[0]}">
                    ${weights.map(w => `<option value="${w}">${w}</option>`).join('')}
                </select>
                <button onclick="addToCart('${row[0]}', '${row[2]}', ${row[4]})">Add to Cart</button>
            </div>
        `;
    });
    document.getElementById('product-list').innerHTML = html;
}

// 3. UPI Intent Payment (Flipkart Style)
function payOnline(amount) {
    const upiId = "your-upi-id@bank"; // Yahan apni UPI ID dalein
    const name = "Rana Ji Aata Chakki";
    const upiUrl = `upi://pay?pa=${upiId}&pn=${encodeURIComponent(name)}&am=${amount}&cu=INR`;
    
    // Mobile par direct Apps kholne ke liye
    window.location.href = upiUrl;
}

// 4. PWA Install App Feature
let deferredPrompt;
window.addEventListener('beforeinstallprompt', (e) => {
    e.preventDefault();
    deferredPrompt = e;
    document.getElementById('install-btn').style.display = 'block';
});

async function installApp() {
    if (deferredPrompt) {
        deferredPrompt.prompt();
        const { outcome } = await deferredPrompt.userChoice;
        if (outcome === 'accepted') {
            document.getElementById('install-btn').style.display = 'none';
        }
        deferredPrompt = null;
    }
}
