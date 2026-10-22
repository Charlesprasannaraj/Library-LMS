// Page Support: Shared Navigation and Session Actions

// Section: Three-Dot Navigation

function toggleMenu() {

    const menu =
        document.getElementById("menuBox");


    if (menu) {

        menu.classList.toggle("show");

    }
}



// Section: User Information

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
// Section: Logout

async function logoutUser() {
    const result = await Swal.fire({
        icon: "question",
        title: "Log out?",
        text: "Are you sure you want to log out?",
        showCancelButton: true,
        confirmButtonText: "Log out",
        cancelButtonText: "Cancel",
        reverseButtons: true
    });

    if (!result.isConfirmed) return;

    localStorage.removeItem("libraryLoggedIn");
    window.location.href = "/index.html";
}



