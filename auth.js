// ===============================
// OTP LOGIN SYSTEM
// ===============================

let generatedOTP = "";

// ===============================
// SEND OTP
// ===============================

function sendOTP(){

let mobile = document.getElementById("mobile-input").value;

if(mobile.length != 10){

alert("Enter valid mobile number");

return;

}

// RANDOM OTP

generatedOTP = Math.floor(1000 + Math.random() * 9000);

console.log("OTP:",generatedOTP); 
// demo ke liye console me show hoga

alert("Demo OTP: "+generatedOTP);

// OTP section show

document.getElementById("otp-section").style.display="block";

}

// ===============================
// VERIFY OTP
// ===============================

function verifyOTP(){

let userOTP = document.getElementById("otp-input").value;

if(userOTP == generatedOTP){

let mobile = document.getElementById("mobile-input").value;

localStorage.setItem("userMobile",mobile);

// LOGIN SUCCESS

document.getElementById("login-screen").style.display="none";

document.getElementById("main-app").style.display="block";

loadAppData();

}else{

alert("Wrong OTP");

}

}

// ===============================
// AUTO LOGIN
// ===============================

window.addEventListener("load",()=>{

let mobile = localStorage.getItem("userMobile");

if(mobile){

document.getElementById("login-screen").style.display="none";

document.getElementById("main-app").style.display="block";

loadAppData();

}

});
