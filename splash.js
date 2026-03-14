document.addEventListener("DOMContentLoaded", () => {

    const splash = document.getElementById("splash-screen");
    const login = document.getElementById("login-screen");
    const mainApp = document.getElementById("main-app");

    setTimeout(() => {

        splash.style.display = "none";

        const user = localStorage.getItem("userMobile");

        if(user){

            mainApp.style.display = "block";

            if(typeof loadProducts === "function"){
                loadProducts();
            }

        } else {

            login.style.display = "block";

        }

    },3000);

});
