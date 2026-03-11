function getMyLocation() {
    if (navigator.geolocation) {
        showToast("Location dhoond rahe hain... 📍");
        navigator.geolocation.getCurrentPosition((position) => {
            const lat = position.coords.latitude;
            const lng = position.coords.longitude;
            
            // Google Maps ka link banana
            const mapLink = `https://www.google.com/maps?q=${lat},${lng}`;
            
            // Address box mein link daal dena
            document.getElementById('l-address').value = mapLink;
            user.location = mapLink; // User data mein save
            
            showToast("Location mil gayi! ✅");
        }, () => {
            alert("Location access nahi mili. Kripya permission dein.");
        });
    } else {
        alert("Aapka browser location support nahi karta.");
    }
}

// Delivery Boy ke liye tracking button
function trackOrder(orderId) {
    // Delivery boy ko message bhejna location ke saath
    const msg = `Order Tracking ID: ${orderId}\nCustomer Location: ${user.location}`;
    window.location.href = `https://wa.me/918923357537?text=${encodeURIComponent(msg)}`;
}
