const URL = "https://script.google.com/macros/s/AKfycbwKIh4Q2VGhGspPBEQe6cfrwJLOlrY76MC3BDp9463MsIIBj1gPDLs7f3yR6vtGDwk_/exec";
let allProducts = []; // Saara saaman yahan save rahega

async function loadProducts() {
    const list = document.getElementById('product-list');
    const catBar = document.querySelector('.category-bar'); // index.html mein ye class honi chahiye
    
    try {
        const response = await fetch(`${URL}?action=getProducts`);
        const data = await response.json();
        
        if (data && data.length > 1) {
            allProducts = data.slice(1); // Header chhod kar data save kiya
            
            // 1. Categories Filter Banana (Sheet ke Column B se)
            const categories = [...new Set(allProducts.map(item => item[1]))]; // Unique Categories
            
            let catHtml = `<span onclick="filterByCategory('All')" class="cat-pill active">All</span>`;
            categories.forEach(cat => {
                catHtml += `<span onclick="filterByCategory('${cat}')" class="cat-pill">${cat}</span>`;
            });
            if(catBar) catBar.innerHTML = catHtml;

            // 2. Pehli baar saare products dikhana
            displayProducts(allProducts);
        }
    } catch (e) {
        list.innerHTML = "Sheet se connection nahi bana!";
    }
}

// Category Filter Logic
function filterByCategory(category) {
    // Active class change karne ka style
    document.querySelectorAll('.cat-pill').forEach(el => el.classList.remove('active'));
    event.target.classList.add('active');

    if (category === 'All') {
        displayProducts(allProducts);
    } else {
        const filtered = allProducts.filter(item => item[1] === category);
        displayProducts(filtered);
    }
}

// Saman Dikhaane ka Function
function displayProducts(products) {
    const list = document.getElementById('product-list');
    list.innerHTML = ""; 
    
    products.forEach(row => {
        list.innerHTML += `
            <div class="product-card">
                <img src="images/products/${row[0]}.jpg" onerror="this.src='welcome.jpg'">
                <h4>${row[2]}</h4>
                <p style="font-size:11px; color:#666;">Pack: ${row[3]}</p>
                <div style="display:flex; justify-content:space-between; align-items:center; margin-top:10px;">
                    <b style="color:#27ae60;">₹${row[4]}</b>
                    <button onclick="addToCart('${row[0]}', '${row[2]}', ${row[4]})" style="background:#f1c40f; border:none; padding:5px 10px; border-radius:4px; font-size:12px; cursor:pointer;">Add</button>
                </div>
            </div>
        `;
    });
}
