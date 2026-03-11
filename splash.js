// splash.js - Full Updated Code
function startSplash() {
    const splash = document.getElementById('splash-screen');
    
    // Photo ko turant load karne ke liye logic
    if (splash) {
        const img = splash.querySelector('img');
        if (img) {
            // "?v=" + Date.now() isliye lagaya hai taki browser 
            // purani file na dikhaye, hamesha fresh photo uthaye
            img.src = "https://rjaatachakki537-cpu.github.io/aatamitra/welcome.jpg?v=" + Date.now();
        }

        // 4 second baad splash screen ko hatane ka timer
        setTimeout(() => {
            splash.style.transition = "opacity 0.8s ease, transform 0.8s ease";
            splash.style.opacity = "0";
            splash.style.transform = "scale(1.1)"; // Thoda zoom out effect
            
            setTimeout(() => { 
                splash.style.display = 'none'; 
            }, 800);
        }, 4000); 
    }
}

// Jaise hi HTML load ho, splash function chalao
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', startSplash);
} else {
    startSplash();
}
