// =========================================
// 3 DOT MENU
// =========================================

function toggleMenu() {

    const menu =
        document.getElementById("menuBox");


    if (menu) {

        menu.classList.toggle("show");

    }
}



// =========================================
// SHOW USER INFORMATION
// =========================================

function showUserInformation() {

    const userMenuItem =
        document.getElementById("userMenuItem");

    const loginMenuLink =
        document.getElementById("loginMenuLink");

    const savedUser =
        JSON.parse(
            localStorage.getItem("Current")
        );

    const loggedIn =
        localStorage.getItem("libraryLoggedIn");

    if (
        userMenuItem &&
        loginMenuLink &&
        savedUser &&
        loggedIn === "true"
    ) {

        const firstName =
            savedUser.name.split(" ")[0];
            console.log(firstName);
            

        loginMenuLink.href = "#";

        loginMenuLink.innerHTML =firstName;
    }
}

showUserInformation();
// =========================================
// LOGOUT
// =========================================

function logoutUser() {

    localStorage.removeItem("libraryLoggedIn");

    window.location.href = "/index.html";
}



