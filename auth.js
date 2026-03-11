let generatedOTP = null;

function sendOTP() {
    const mobile = document.getElementById('l-mobile').value;
    if (mobile.length < 10) return alert("Sahi mobile number daalein!");

    // Fake OTP Generate karna (Demo ke liye)
    generatedOTP = Math.floor(1000 + Math.random() * 9000);
    
    // Asli app mein yahan SMS API lagti hai, par abhi hum alert dikhayenge
    alert(`Rana Ji VIP Verification\nTera OTP hai: ${generatedOTP}`);
    
    // UI badalna
    document.getElementById('otp-section').style.display = 'block';
    showToast("OTP bhej diya gaya hai!");
}

function verifyOTP() {
    const enteredOTP = document.getElementById('l-otp').value;
    if (enteredOTP == generatedOTP) {
        showToast("Verification Safal! ✅");
        handleLogin(); // Purana login function call hoga
    } else {
        alert("Galat OTP! Fir se koshish karein.");
    }
}
