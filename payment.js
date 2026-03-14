// PAYMENT SYSTEM

let paymentAmount = 0;
let upiID = "luckyrana7886-1@okaxis";
let shopName = "RANA JI AATA CHAKKI";

function openPayment(totalAmount){

paymentAmount = totalAmount;

let upiLink =
"upi://pay?pa="+upiID+
"&pn="+encodeURIComponent(shopName)+
"&am="+paymentAmount+
"&cu=INR";

document.getElementById("main-app").innerHTML = `
<div style="padding:20px;text-align:center">

<h2>Complete Payment</h2>

<p>Total Amount</p>

<h1>₹ ${paymentAmount}</h1>

<button onclick="payNow()" 
style="padding:12px 25px;background:#27ae60;color:white;border:none;border-radius:8px;font-size:16px">
Pay Now
</button>

<p style="margin-top:15px">अगर UPI app open ना हो तो QR scan करें</p>

<img src="qr.png" style="width:220px;margin-top:10px">

<br><br>

<button onclick="codOrder()" 
style="padding:12px 25px;background:#e67e22;color:white;border:none;border-radius:8px;font-size:16px">
Cash On Delivery
</button>

</div>
`;

window.upiLink = upiLink;

}

function payNow(){

window.location.href = window.upiLink;

}

function codOrder(){

alert("Order placed successfully (Cash on Delivery)");

sendOrder("COD");

}

function paymentDone(){

sendOrder("ONLINE");

}
