const TRACK_API = "https://script.google.com/macros/s/AKfycbwKIh4Q2VGhGspPBEQe6cfrwJLOlrY76MC3BDp9463MsIIBj1gPDLs7f3yR6vtGDwk_/exec";

async function trackMyOrder(orderID){

    const res = await fetch(`${TRACK_API}?action=trackOrder&orderId=${orderID}`);

    const order = await res.json();

    if(order){

        alert(
        "Order ID: "+order[0]+"\n"+
        "Status: "+order[7]
        );

    }else{

        alert("Order nahi mila");

    }

}
