async function trackMyOrder(orderID) {
    const response = await fetch(`${SCRIPT_URL}?action=getOrders`);
    const data = await response.json();
    const order = data.find(row => row[0] == orderID);

    if(order) {
        let status = order[7]; // Status Column 
        // Tracking logic yahan dikhayenge
        document.getElementById('track-status').innerText = "Current Status: " + status;
    }
}
