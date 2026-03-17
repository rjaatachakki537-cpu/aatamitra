// ===============================
// AATA MITRA MAIN SCRIPT
// ===============================

const API_URL = "https://script.google.com/macros/s/AKfycbwbFViOx7sj46WHyqhV_p516n366LvdsslI07MvEFVSCxzFCDwvuMCMIAe4l6PuGsga/exec";

let products = [];
let categories = [];
let cart = [];

// ===============================
// LOAD DATA FROM GOOGLE SHEET
// ===============================

async function loadAppData(){

try{

let res = await fetch(API_URL + "?action=getData");
let data = await res.json();

products = data.products;
categories = data.categories;

renderCategories();
renderProducts();

}catch(err){

console.log("Load Error:",err);

}

}

// ===============================
// SHOW CATEGORY BUTTONS
// ===============================

function renderCategories(){

let box = document.getElementById("category-list");

if(!box) return;

box.innerHTML="";

categories.forEach(cat=>{

let btn = document.createElement("button");

btn.className="category-btn";

btn.innerText = cat;

btn.onclick = ()=>filterProducts(cat);

box.appendChild(btn);

});

}

// ===============================
// FILTER PRODUCTS
// ===============================

function filterProducts(category){

let filtered = products.filter(p=>p.category == category);

renderProducts(filtered);

}

// ===============================
// SHOW PRODUCTS
// ===============================

function renderProducts(list = products){

let box = document.getElementById("product-list");

if(!box) return;

box.innerHTML="";

list.forEach(p=>{

let html = `

<div class="product">

<img src="${p.image}" alt="${p.name}">

<h3>${p.name}</h3>

<p>${p.sub_category}</p>

<p>${p.weight}</p>

<h4>₹${p.price}</h4>

<button onclick="addToCart('${p.id}')">
Add To Cart
</button>

</div>

`;

box.innerHTML += html;

});

}

// ===============================
// ADD TO CART
// ===============================

function addToCart(id){

let item = products.find(p=>p.id == id);

let exist = cart.find(c=>c.id == id);

if(exist){

exist.qty++;

}else{

cart.push({
id:item.id,
name:item.name,
price:item.price,
qty:1
});

}

updateCartCount();

}

// ===============================
// CART COUNT UPDATE
// ===============================

function updateCartCount(){

let total = cart.reduce((sum,i)=>sum + i.qty ,0);

let el = document.getElementById("cart-count");

if(el) el.innerText = total;

}

// ===============================
// SHOW CART PAGE
// ===============================

function showCart(){

let box = document.getElementById("main-app");

let html = `<h2>Cart</h2>`;

let total = 0;

cart.forEach(item=>{

let price = item.price * item.qty;

total += price;

html += `

<div class="cart-item">

<b>${item.name}</b>

<p>₹${item.price} x ${item.qty}</p>

</div>

`;

});

html += `

<h3>Total ₹${total}</h3>

<button onclick="placeOrder(${total})">
Place Order
</button>

`;

box.innerHTML = html;

}

// ===============================
// PLACE ORDER
// ===============================

function placeOrder(total){

alert("Proceed to payment ₹" + total);

}

// ===============================
// TAB NAVIGATION
// ===============================

function showTab(tab){

if(tab=="home") loadAppData();

if(tab=="cart") showCart();

}

// ===============================
// START APP
// ===============================

window.onload = ()=>{

loadAppData();

};
