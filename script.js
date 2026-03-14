const API = "https://script.google.com/macros/s/AKfycbwKIh4Q2VGhGspPBEQe6cfrwJLOlrY76MC3BDp9463MsIIBj1gPDLs7f3yR6vtGDwk_/exec";

let allProducts = [];

let cart = [];

async function loadProducts(){

    const res = await fetch(`${API}?action=getProducts`);

    const data = await res.json();

    allProducts = data.slice(1);

    renderProducts(allProducts);

}

function renderProducts(products){

    const list = document.getElementById("product-list");

    list.innerHTML = products.map(p=>`

    <div class="product-card">

    <img src="images/products/${p[0]}.jpg">

    <h4>${p[1]}</h4>

    <p>₹${p[5]}</p>

    <button onclick="addToCart('${p[0]}','${p[1]}',${p[5]})">

    Add

    </button>

    </div>

    `).join("");

}

function addToCart(id,name,price){

    cart.push({id,name,price});

    document.getElementById("cart-count").innerText = cart.length;

}

function showTab(tab){

    if(tab==="cart"){

        alert("Cart Items: "+cart.length);

    }

    if(tab==="track"){

        let id = prompt("Order ID dalo");

        if(id) trackMyOrder(id);

    }

}
