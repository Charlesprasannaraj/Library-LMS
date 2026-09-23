
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
// REGISTER
// =========================================

const registerForm =
    document.getElementById("registerForm");


if (registerForm) {

    registerForm.addEventListener(
        "submit",
        function (event) {

            event.preventDefault();


            const name =
                document.getElementById("name")
                .value
                .trim();


            const email =
                document.getElementById("registerEmail")
                .value
                .trim();


            const password =
                document.getElementById("registerPassword")
                .value;


            const confirmPassword =
                document.getElementById("confirmPassword")
                .value;


            const mobileNumber =
                document.getElementById("mobileNumber")
                .value;


            const address =
                document.getElementById("address")
                .value;


            if (password !== confirmPassword) {

                alert("Passwords do not match.");

                return;
            }


            const user = {

                name: name,

                email: email,

                password: password,

                mobileNumber: mobileNumber,

                address: address

            };
            


            // localStorage.setItem(
            //     "libraryUser",
            //     JSON.stringify(user)
            // );


            // alert(
            //     "Account created successfully."
            // );


            // window.location.href =
            //     "login.html";

            //My Code
            let retrivedData=JSON.parse(localStorage.getItem("libraryUser")) || [];
            retrivedData.push(user)

            localStorage.setItem("libraryUser",JSON.stringify(retrivedData))
            alert("Account Created Successfully")
            window.location.href="../login page/login.html"


        }
    );
}
