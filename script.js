// =============================== 
// AATA MITRA MAIN SCRIPT
// ===============================

const API_URL = "https://script.google.com/macros/s/AKfycbwKIh4Q2VGhGspPBEQe6cfrwJLOlrY76MC3BDp9463MsIIBj1gPDLs7f3yR6vtGDwk_/exec";

// DATA
let products = [];
let categories = [];
let cart = [];

// ===============================
// LOAD APP DATA
// ===============================

async function loadAppData(){

try{

let res = await fetch(API_URL+"?action=getData");

let data = await res.json();

products = data.products;
categories = data.categories;

renderCategories();
renderProducts();

}catch(e){

console.log("Data load error",e);

}

}

// ===============================
// RENDER CATEGORIES
// ===============================

function renderCategories(){

let box = document.getElementById("category-list");

box.innerHTML = "";

categories.forEach(cat=>{

let div = document.createElement("div");

div.className="category";

div.innerText = cat.name;

div.onclick=()=>filterProducts(cat.name);

box.appendChild(div);

});

}

// ===============================
// FILTER PRODUCTS
// ===============================

function filterProducts(category){

let filtered = products.filter(p=>p.category==category);

renderProducts(filtered);

}

// ===============================
// RENDER PRODUCTS
// ===============================

function renderProducts(list=products){

let box = document.getElementById("product-list");

box.innerHTML="";

list.forEach(p=>{

let html = `

<div class="product">

<img src="${p.image}">

<h3>${p.name}</h3>

<p>₹${p.price}</p>

<button onclick="addToCart('${p.id}')">
Add To Cart
</button>

</div>

`;

box.innerHTML += html;

});

}

// ===============================
// CART SYSTEM
// ===============================

function addToCart(id){

let item = products.find(p=>p.id==id);

let exist = cart.find(c=>c.id==id);

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
// CART COUNT
// ===============================

function updateCartCount(){

let total = cart.reduce((sum,i)=>sum+i.qty,0);

document.getElementById("cart-count").innerText = total;

}

// ===============================
// SHOW CART PAGE
// ===============================

function showCart(){

let box = document.getElementById("main-app");

let html = `<h2 style="padding:10px">Cart</h2>`;

let total=0;

cart.forEach(item=>{

let price = item.price*item.qty;

total += price;

html+=`

<div class="cart-item">

<b>${item.name}</b>

<p>₹${item.price} x ${item.qty}</p>

</div>

`;

});

html+=`

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

openPayment(total);

}

// ===============================
// ORDER SEND TO BACKEND
// ===============================

async function sendOrder(paymentType){

let order = {

mobile:localStorage.getItem("userMobile"),

cart:cart,

payment:paymentType,

status:"Order Received"

};

await fetch(API_URL,{

method:"POST",

body:JSON.stringify(order)

});

alert("Order Placed Successfully");

cart=[];

updateCartCount();

showTab("track");

}

// ===============================
// TAB NAVIGATION
// ===============================

function showTab(tab){

if(tab=="home"){

loadAppData();

}

if(tab=="cart"){

showCart();

}

if(tab=="track"){

loadTracking();

}

}

// ===============================
// ADMIN PANEL TRIGGER
// ===============================

let tapCount=0;

document.getElementById("admin-trigger").addEventListener("click",()=>{

tapCount++;

if(tapCount>=5){

let code = prompt("Enter Admin Code");

if(code=="LUCKY"){

openAdminPanel();

}

tapCount=0;

}

});

// ===============================
// START APP
// ===============================

window.onload = ()=>{

loadAppData();

};
