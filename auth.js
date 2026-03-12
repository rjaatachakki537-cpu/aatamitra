const SCRIPT_URL = "https://script.google.com/macros/s/AKfycbwKIh4Q2VGhGspPBEQe6cfrwJLOlrY76MC3BDp9463MsIIBj1gPDLs7f3yR6vtGDwk_/exec";

async function sendOTP() {
    let mobile = document.getElementById('mobile-input').value;
    if(mobile.length === 10) {
        alert("OTP sent to " + mobile + " (Try 1234)"); // Fake OTP message
        document.getElementById('otp-section').style.display = 'block';
    } else {
        alert("Sahi mobile number daalo bhai!");
    }
}

async function verifyOTP() {
    let otp = document.getElementById('otp-input').value;
    let mobile = document.getElementById('mobile-input').value;
    let name = document.getElementById('name-input').value;

    if(otp === "1234") {
        // Local Storage mein save karna taaki Delivery Panel access mile
        localStorage.setItem('userMobile', mobile);
        localStorage.setItem('userName', name);

        // Google Sheet (Users Tab) mein data bhejna [cite: 15, 16, 17]
        await fetch(SCRIPT_URL, {
            method: 'POST',
            body: JSON.stringify({
                action: 'syncUser',
                name: name,
                mobile: mobile,
                address: "Not Set" // User baad mein update karega [cite: 18]
            })
        });

        alert("Login Successful!");
        window.location.href = "index.html";
    } else {
        alert("Galat OTP!");
    }
}
