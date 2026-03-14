// ---------------------
// Aata Mitra - auth.js
// ---------------------

function sendOTP() {

    let mobile = document.getElementById('mobile-input').value;

    if(mobile.length !== 10){
        alert("Sahi 10 digit mobile number dalo");
        return;
    }

    // Demo OTP
    let otp = "1234";

    localStorage.setItem("demoOTP", otp);

    document.getElementById('otp-section').style.display = "block";

    alert("OTP bhej diya! Demo OTP: 1234");

}

// OTP Verify
function verifyOTP(){

    let userOTP = document.getElementById('otp-input').value;

    let realOTP = localStorage.getItem("demoOTP");

    if(userOTP === realOTP){

        let mobile = document.getElementById('mobile-input').value;

        // Save user
        localStorage.setItem("userMobile", mobile);

        // Hide login
        document.getElementById('login-screen').style.display = "none";

        // Show app
        document.getElementById('main-app').style.display = "block";

        // Load products
        if(typeof loadProducts === "function"){
            loadProducts();
        }

        alert("Login Success!");

    }
    else{

        alert("OTP galat hai!");

    }

}

// Auto login check
document.addEventListener("DOMContentLoaded", () => {

    let user = localStorage.getItem("userMobile");

    if(user){

        document.getElementById('login-screen').style.display = "none";

        document.getElementById('main-app').style.display = "block";

        if(typeof loadProducts === "function"){
            loadProducts();
        }

    }

});
