// splash.js
function startSplash() {
    const splash = document.getElementById('splash-screen');
    if (splash) {
        const img = splash.querySelector('img');
        if (img) {
            // Fresh image fetch logic
            img.src = "https://rjaatachakki537-cpu.github.io/aatamitra/welcome.jpg?v=" + new Date().getTime();
        }

        // 4 second ka wait aur smooth transition
        setTimeout(() => {
            splash.style.transition = "opacity 0.8s ease, transform 0.8s ease";
            splash.style.opacity = "0";
            splash.style.transform = "scale(1.1)";
            
            setTimeout(() => { 
                splash.style.display = 'none'; 
            }, 800);
        }, 4000); 
    }
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', startSplash);
} else {
    startSplash();
}
