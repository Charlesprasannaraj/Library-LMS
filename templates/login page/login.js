// Page Support: Member Login

// Section: Auth Navigation

function toggleMenu() {
    const menu = document.getElementById("menuBox");
    menu?.classList.toggle("show");
}

// Section: Login Submission

const loginForm = document.getElementById("loginForm");

function setFieldError(input, message, errorId) {
    document.getElementById(errorId).textContent = message;
    input.setAttribute("aria-invalid", String(Boolean(message)));
}

if (loginForm) {
    loginForm.addEventListener("submit", (event) => {
        event.preventDefault();

        const emailInput = document.getElementById("email");
        const passwordInput = document.getElementById("password");
        const email = emailInput.value.trim().toLowerCase();
        const password = passwordInput.value;
        let isValid = true;

        setFieldError(emailInput, "", "emailError");
        setFieldError(passwordInput, "", "passwordError");

        if (!email || !emailInput.validity.valid) {
            setFieldError(emailInput, "Enter a valid email address.", "emailError");
            isValid = false;
        }

        if (!password) {
            setFieldError(passwordInput, "Enter your password.", "passwordError");
            isValid = false;
        }

        if (!isValid) {
            loginForm.querySelector('[aria-invalid="true"]')?.focus();
            return;
        }

        let savedUsers;
        try {
            const storedUsers = JSON.parse(localStorage.getItem("libraryUser") || "[]");
            savedUsers = Array.isArray(storedUsers)
                ? storedUsers
                : storedUsers && typeof storedUsers === "object"
                    ? [storedUsers]
                    : [];
        } catch (error) {
            console.error("Unable to read saved library accounts.", error);
            Swal.fire({
                icon: "error",
                title: "Unable to sign in",
                text: "Saved account data could not be read. Please try again or contact the library."
            });
            return;
        }

        const currentUser = savedUsers.find((user) =>
            user &&
            typeof user.email === "string" &&
            user.email.trim().toLowerCase() === email &&
            user.password === password
        );

        if (!currentUser) {
            Swal.fire({
                icon: "error",
                title: "Sign-in unsuccessful",
                text: "The email address or password is incorrect."
            });
            return;
        }

        localStorage.setItem("Current", JSON.stringify(currentUser));
        localStorage.setItem("libraryLoggedIn", "true");
        Swal.fire({
            icon: "success",
            title: `Welcome, ${currentUser.name}!`,
            timer: 1500,
            showConfirmButton: false
        }).then(() => {
            window.location.href = "../dashboard/dashboard.html";
        });
    });
}

loginForm?.querySelectorAll("input").forEach((input) => {
    input.addEventListener("input", () => {
        if (input.getAttribute("aria-invalid") === "true") {
            setFieldError(input, "", `${input.id}Error`);
        }
    });
});

document.querySelectorAll("[data-password-toggle]").forEach((toggle) => {
    toggle.addEventListener("click", () => {
        const input = document.getElementById(toggle.dataset.passwordToggle);
        const shouldShow = input.type === "password";
        input.type = shouldShow ? "text" : "password";
        toggle.textContent = shouldShow ? "Hide" : "Show";
        toggle.setAttribute("aria-label", `${shouldShow ? "Hide" : "Show"} password`);
        toggle.setAttribute("aria-pressed", String(shouldShow));
    });
});
