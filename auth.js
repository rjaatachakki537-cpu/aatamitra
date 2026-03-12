// auth.js
let generatedOTP = null;

function sendOTP() {
    const mobile = document.getElementById('l-mobile').value;
    if (mobile.length < 10) return alert("Sahi mobile number daalein!");

    // Fake OTP Generate karna (Demo ke liye)
    generatedOTP = Math.floor(1000 + Math.random() * 9000);
    
    // Rana Ji, abhi demo ke liye alert hai, baad mein API lag sakti hai
    alert(`Rana Ji VIP Verification\nAapka OTP hai: ${generatedOTP}`);
    
    // UI badalna
    document.getElementById('otp-section').style.display = 'block';
    if(typeof showToast === 'function') showToast("OTP bhej diya gaya hai!");
}

function verifyOTP() {
    const enteredOTP = document.getElementById('l-otp').value;
    const name = document.getElementById('l-name').value;
    const address = document.getElementById('l-address').value;

    // Pehle check karo ki naam aur address bhara hai ya nahi
    if (!name || !address) {
        return alert("Pehle apna Naam aur Address bhariye!");
    }

    if (enteredOTP == generatedOTP) {
        if(typeof showToast === 'function') showToast("Verification Safal! ✅");
        
        // Yahan handleLogin call ho raha hai jo script.js mein hoga
        if(typeof handleLogin === 'function') {
            handleLogin(); 
        } else {
            // Agar handleLogin nahi mila toh fallback (backup)
            alert("Login ho gaya! Welcome " + name);
            document.getElementById('login-screen').classList.remove('active');
            showPage('view-home');
        }
    } else {
        alert("Galat OTP! Fir se koshish karein.");
    }
}
