const URL = "https://script.google.com/macros/s/AKfycbwKIh4Q2VGhGspPBEQe6cfrwJLOlrY76MC3BDp9463MsIIBj1gPDLs7f3yR6vtGDwk_/exec";

async function loadProducts() {
    const list = document.getElementById('product-list');
    list.innerHTML = "Product Load ho rahe hain...";
    
    try {
        const response = await fetch(`${URL}?action=getProducts`);
        const data = await response.json();
        const products = data.slice(1); 
        
        list.innerHTML = "";
        products.forEach(row => {
            list.innerHTML += `
                <div class="product-card">
                    <img src="images/products/${row[0]}.jpg" onerror="this.src='welcome.jpg'">
                    <h4>${row[2]}</h4>
                    <p>Price: ₹${row[4]}</p>
                    <button class="btn" style="padding:5px;">Add</button>
                </div>
            `;
        });
    } catch (e) {
        list.innerHTML = "Sheet se data nahi aa raha!";
    }
}

// Admin Trigger (LUCKY Code)
document.getElementById('admin-trigger').onclick = () => {
    if(prompt("Code dalo:") === "LUCKY") {
        alert("Admin Panel Open!");
    }
};
