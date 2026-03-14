// ===============================
// ORDER TRACKING SYSTEM
// ===============================

async function loadTracking(){

let mobile = localStorage.getItem("userMobile");

let box = document.getElementById("main-app");

box.innerHTML = "<h2 style='padding:10px'>Track Order</h2>";

try{

let res = await fetch(API_URL + "?action=track&mobile=" + mobile);

let data = await res.json();

if(!data || data.length==0){

box.innerHTML += "<p style='padding:10px'>No orders found</p>";
return;

}

data.forEach(order=>{

let status = order.status;

box.innerHTML += renderTracking(status,order);

});

}catch(e){

console.log(e);

box.innerHTML += "<p style='padding:10px'>Tracking error</p>";

}

}

// ===============================
// TRACKING UI
// ===============================

function renderTracking(status,order){

let steps = [
"Order Received",
"Preparing",
"Out For Delivery",
"Delivered"
];

let html = `
<div class="track-box">

<h3>Order ID: ${order.id}</h3>

<p>Total ₹${order.amount}</p>

<div class="track-steps">
`;

steps.forEach(step=>{

let active = steps.indexOf(step) <= steps.indexOf(status)
? "active"
: "";

html += `
<div class="step ${active}">
${step}
</div>
`;

});

html += `
</div>
</div>
`;

return html;

}
