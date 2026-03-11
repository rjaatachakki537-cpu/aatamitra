// splash.js
function startSplash() {
    const splash = document.getElementById('splash-screen');
    if(splash) {
        setTimeout(() => {
            splash.style.transition = "opacity 0.8s ease";
            splash.style.opacity = "0";
            setTimeout(() => { 
                splash.style.display = 'none'; 
            }, 800);
        }, 4000); // 4 seconds tak photo dikhegi
    }
}

// Jaise hi page load ho splash shuru karo
window.addEventListener('DOMContentLoaded', startSplash);
