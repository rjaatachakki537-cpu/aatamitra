// ===============================
// SPLASH SCREEN SYSTEM
// ===============================

window.addEventListener("load", ()=>{

let splash = document.getElementById("splash-screen");
let login = document.getElementById("login-screen");
let main = document.getElementById("main-app");

// 3 seconds splash

setTimeout(()=>{

splash.style.display="none";

// check login

let mobile = localStorage.getItem("userMobile");

if(mobile){

// already logged in

main.style.display="block";

loadAppData();

}else{

// show login

login.style.display="block";

}

},3000);

});
