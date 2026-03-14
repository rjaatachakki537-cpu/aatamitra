// ===============================
// ADMIN + DELIVERY PANEL
// ===============================

const ADMIN_CODE = "LUCKY";

// ===============================
// OPEN ADMIN PANEL
// ===============================

function openAdminPanel(){

let box = document.getElementById("main-app");

box.innerHTML = `

<h2 style="padding:10px">Admin Panel</h2>

<button onclick="loadOrders()">View Orders</button>

<button onclick="openAddProduct()">Add Product</button>

<button onclick="openBanner()">Change Banner</button>

<div id="admin-content"></div>

`;

}

// ===============================
// LOAD ORDERS
// ===============================

async function loadOrders(){

let res = await fetch(API_URL+"?action=orders");

let orders = await res.json();

let box = document.getElementById("admin-content");

box.innerHTML="";

orders.forEach(o=>{

box.innerHTML += `

<div class="order">

<h3>Order ${o.id}</h3>

<p>${o.mobile}</p>

<p>Total ₹${o.amount}</p>

<select onchange="updateStatus('${o.id}',this.value)">

<option>Order Received</option>

<option>Preparing</option>

<option>Out For Delivery</option>

<option>Delivered</option>

</select>

</div>

`;

});

}

// ===============================
// UPDATE ORDER STATUS
// ===============================

async function updateStatus(id,status){

await fetch(API_URL,{

method:"POST",

body:JSON.stringify({

action:"updateStatus",

id:id,

status:status

})

});

alert("Status Updated");

}

// ===============================
// ADD PRODUCT
// ===============================

function openAddProduct(){

let box = document.getElementById("admin-content");

box.innerHTML = `

<h3>Add Product</h3>

<input id="pname" placeholder="Product Name">

<input id="pprice" placeholder="Price">

<input id="pimage" placeholder="Image URL">

<button onclick="saveProduct()">Save</button>

`;

}

async function saveProduct(){

let name = document.getElementById("pname").value;

let price = document.getElementById("pprice").value;

let image = document.getElementById("pimage").value;

await fetch(API_URL,{

method:"POST",

body:JSON.stringify({

action:"addProduct",

name:name,

price:price,

image:image

})

});

alert("Product Added");

}

// ===============================
// CHANGE BANNER
// ===============================

function openBanner(){

let box = document.getElementById("admin-content");

box.innerHTML = `

<h3>Change Banner</h3>

<input id="bannerURL" placeholder="Banner Image URL">

<button onclick="saveBanner()">Save Banner</button>

`;

}

async function saveBanner(){

let url = document.getElementById("bannerURL").value;

await fetch(API_URL,{

method:"POST",

body:JSON.stringify({

action:"banner",

url:url

})

});

alert("Banner Updated");

}

// ===============================
// DELIVERY PANEL
// ===============================

function openDeliveryPanel(){

let box = document.getElementById("main-app");

box.innerHTML = `

<h2 style="padding:10px">Delivery Panel</h2>

<div id="delivery-orders"></div>

`;

loadDeliveryOrders();

}

async function loadDeliveryOrders(){

let res = await fetch(API_URL+"?action=deliveryOrders");

let orders = await res.json();

let box = document.getElementById("delivery-orders");

box.innerHTML="";

orders.forEach(o=>{

box.innerHTML += `

<div class="order">

<h3>Order ${o.id}</h3>

<p>${o.mobile}</p>

<p>${o.address}</p>

<button onclick="updateStatus('${o.id}','Delivered')">
Mark Delivered
</button>

</div>

`;

});

}
