
// Page Support: Member Login

// Section: Auth Navigation

function toggleMenu() {

    const menu =
        document.getElementById("menuBox");


    if (menu) {

        menu.classList.toggle("show");

    }
}


// Section: Login Submission

const loginForm =
    document.getElementById("loginForm");


if (loginForm) {

    loginForm.addEventListener(
        "submit",
        function (event) {

            event.preventDefault();


            const email =
                document.getElementById("email").value.trim();


            const password =
                document.getElementById("password").value;


            // const savedUser =
            //     JSON.parse(
            //         localStorage.getItem("libraryUser")
            //     );


            // if (!savedUser) {

            //     alert(
            //         "No account found. Please create an account first."
            //     );

            //     return;
            // }


            // if (
            //     email === savedUser.email &&
            //     password === savedUser.password
            // ) {

            //     alert(
            //         "Login successful. Welcome " +
            //         savedUser.name +
            //         "!"
            //     );
            //     localStorage.setItem("libraryLoggedIn", "true");
            //     window.location.href = "index.html";

            // } else {

            //     alert(
            //         "Invalid email or password."
            //     );

            // }
            // Authenticate against the saved library member list.
            let valid =false;
            let data=JSON.parse(localStorage.getItem('libraryUser'));
            for(let d of data){
                if(email==d.email && password==d.password){
                    valid=true;

                }

            }
            let currentUser=data.find(user =>email==user.email && password==user.password)
            localStorage.setItem('Current',JSON.stringify(currentUser))

            if(valid){
                localStorage.setItem("libraryLoggedIn","true")
                Swal.fire({
                    icon: "success",
                    title: "Login successful. Welcome " + currentUser.name + "!",
                    timer: 2000,
                    showConfirmButton: false
                })
                window.location.href="../dashboard/dashboard.html"

            }else{
                Swal.fire({
                    icon: "error",
                    title: "Invalid email or password.",
                    timer: 2000,
                    showConfirmButton: false
                })
            }

}
    );
}
