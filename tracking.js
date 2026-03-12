// tracking.js
function getMyLocation() {
    if (navigator.geolocation) {
        showToast("Location dhoond rahe hain... 📍");
        navigator.geolocation.getCurrentPosition((position) => {
            const lat = position.coords.latitude;
            const lng = position.coords.longitude;
            
            // Sahi Google Maps link (Ye delivery boy ke liye perfect hai)
            const mapLink = `https://www.google.com/maps?q=${lat},${lng}`;
            
            // Address box mein link daal dena
            const addressInput = document.getElementById('l-address');
            if(addressInput) {
                addressInput.value = mapLink;
            }
            
            // Local storage wale user object mein location save karna
            if(typeof user !== 'undefined') {
                user.location = mapLink;
                localStorage.setItem('ranaUser', JSON.stringify(user));
            }
            
            showToast("Location mil gayi! ✅");
        }, (error) => {
            alert("Location access nahi mili. Setting se permission on karein.");
        }, { enableHighAccuracy: true });
    } else {
        alert("Aapka browser location support nahi karta.");
    }
}

// Delivery Boy/Admin ke liye tracking
function trackOrder(orderId) {
    if(!user || !user.location) {
        alert("Pehle location link generate karein!");
        return;
    }
    const msg = `Namaste! Mera Order Track karein:\nOrder ID: ${orderId}\nLocation: ${user.location}`;
    window.location.href = `https://wa.me/918923357537?text=${encodeURIComponent(msg)}`;
}
