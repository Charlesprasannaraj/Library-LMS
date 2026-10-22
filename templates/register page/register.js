
// Page Support: Member Registration

// Section: Auth Navigation

function toggleMenu() {

    const menu =
        document.getElementById("menuBox");


    if (menu) {

        menu.classList.toggle("show");

    }
}

// Section: Registration Submission

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


            // Validate required fields before checking credentials.
            if (!registerForm.checkValidity()) {
                Swal.fire({
                    icon: "warning",
                    title: "Check the registration details",
                    text: "Enter a valid value in each required field.",
                    showCancelButton: true,
                    confirmButtonText: "OK",
                    cancelButtonText: "Cancel"
                });
                return;
            }


            if (password !== confirmPassword) {

               Swal.fire({
                    icon: "error",
                    title: "Password and Confirm Password do not match",
                    showCancelButton: true,
                    confirmButtonText: "OK",
                    cancelButtonText: "Cancel"
                })

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
            // Confirm account creation before saving the member record.
            Swal.fire({
                icon: "question",
                title: "Create this account?",
                text: "Check your details before continuing.",
                showCancelButton: true,
                confirmButtonText: "Create account",
                cancelButtonText: "Cancel",
                reverseButtons: true
            }).then((result) => {
                if (!result.isConfirmed) return;

                const members = JSON.parse(localStorage.getItem("libraryUser") || "[]");
                members.push(user);
                localStorage.setItem("libraryUser", JSON.stringify(members));

                Swal.fire({
                    icon: "success",
                    title: "Account created successfully",
                    confirmButtonText: "OK"
                }).then(() => {
                    window.location.href = "../login page/login.html";
                });
            });


        }
    );
}
