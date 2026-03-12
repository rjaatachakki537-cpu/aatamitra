document.addEventListener('DOMContentLoaded', () => {
    // 3 second ka timer
    setTimeout(() => {
        const userMobile = localStorage.getItem('userMobile');
        
        // Agar user pehle se login hai toh seedha Home, nahi toh Login
        if (userMobile) {
            window.location.href = "index.html"; 
        } else {
            // Hum index.html mein hi ek hidden login div rakhenge 
            // ya use login.html par bhej denge
            document.getElementById('splash-screen').style.display = 'none';
            document.getElementById('login-screen').style.display = 'block';
        }
    }, 3000); 
});
