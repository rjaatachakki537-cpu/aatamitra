function sendOTP() {
    let mobile = document.getElementById('mobile-input').value;
    if(mobile.length === 10) {
        document.getElementById('otp-section').style.display = 'block';
        alert("Bhai OTP bhej diya! (1234 dalo)");
    } else {
        alert("Sahi Number dalo!");
    }
}

function verifyOTP() {
    let otp = document.getElementById('otp-input').value;
    if(otp === "1234") {
        let mobile = document.getElementById('mobile-input').value;
        let name = document.getElementById('name-input').value;
        localStorage.setItem('userMobile', mobile);
        localStorage.setItem('userName', name);
        
        document.getElementById('login-screen').style.display = 'none';
        document.getElementById('main-app').style.display = 'block';
        loadProducts();
    } else {
        alert("Galat OTP hai!");
    }
}
