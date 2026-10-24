// Page Support: Member Registration

// Section: Auth Navigation

function toggleMenu() {
    const menu = document.getElementById("menuBox");
    menu?.classList.toggle("show");
}

// Section: Registration Submission

const registerForm = document.getElementById("registerForm");

function setFieldError(input, message, errorId) {
    document.getElementById(errorId).textContent = message;
    input.setAttribute("aria-invalid", String(Boolean(message)));
}

function isValidMobile(value) {
    const digits = value.replace(/\D/g, "");
    return /^\+?[\d\s()-]+$/.test(value) && digits.length >= 7 && digits.length <= 15;
}

function isValidPassword(value) {
    return value.length >= 8 &&
        /[a-z]/.test(value) &&
        /[A-Z]/.test(value) &&
        /\d/.test(value);
}

function updatePasswordStrength(value) {
    const fill = document.getElementById("strengthFill");
    const label = document.getElementById("strengthLabel");
    const meter = document.querySelector(".password-strength");
    const checks = [
        value.length >= 8,
        /[a-z]/.test(value) && /[A-Z]/.test(value),
        /\d/.test(value),
        /[^A-Za-z0-9]/.test(value)
    ];
    const score = value ? Math.max(1, checks.filter(Boolean).length) : 0;
    const labels = ["Password strength", "Very weak password", "Weak password", "Fair password", "Strong password"];
    const colors = ["transparent", "var(--color-danger)", "var(--color-warning)", "var(--color-accent)", "var(--color-success)"];

    fill.style.width = `${score * 25}%`;
    fill.style.backgroundColor = colors[score];
    meter.setAttribute("aria-valuenow", String(score));
    label.textContent = labels[score];
}

if (registerForm) {
    registerForm.addEventListener("submit", (event) => {
        event.preventDefault();

        const nameInput = document.getElementById("name");
        const mobileInput = document.getElementById("mobileNumber");
        const addressInput = document.getElementById("address");
        const emailInput = document.getElementById("registerEmail");
        const passwordInput = document.getElementById("registerPassword");
        const confirmInput = document.getElementById("confirmPassword");
        const name = nameInput.value.trim();
        const mobileNumber = mobileInput.value.trim();
        const address = addressInput.value.trim();
        const email = emailInput.value.trim().toLowerCase();
        const password = passwordInput.value;
        const confirmPassword = confirmInput.value;
        const nameHasLetters = (name.match(/\p{L}/gu) || []).length >= 2;
        const errors = [
            [nameInput, "nameError", name.length >= 2 && name.length <= 80 && nameHasLetters && !/\d/.test(name) ? "" : "Enter a valid name between 2 and 80 characters."],
            [mobileInput, "mobileNumberError", isValidMobile(mobileNumber) ? "" : "Enter a valid mobile number with 7 to 15 digits."],
            [addressInput, "addressError", address.length >= 5 && address.length <= 250 ? "" : "Enter an address between 5 and 250 characters."],
            [emailInput, "registerEmailError", emailInput.validity.valid && email ? "" : "Enter a valid email address."],
            [passwordInput, "passwordError", isValidPassword(password) ? "" : "Use at least 8 characters with uppercase, lowercase, and a number."],
            [confirmInput, "confirmPasswordError", !confirmPassword ? "Confirm your password." : password === confirmPassword ? "" : "Passwords do not match."]
        ];

        let firstInvalidInput = null;
        errors.forEach(([input, errorId, message]) => {
            setFieldError(input, message, errorId);
            if (message && !firstInvalidInput) firstInvalidInput = input;
        });

        if (firstInvalidInput) {
            firstInvalidInput.focus();
            return;
        }

        const user = { name, email, password, mobileNumber, address };
        let members;

        try {
            const storedMembers = JSON.parse(localStorage.getItem("libraryUser") || "[]");
            if (Array.isArray(storedMembers)) {
                members = storedMembers;
            } else if (storedMembers && typeof storedMembers === "object") {
                members = [storedMembers];
            } else {
                throw new Error("Saved member data is not a list.");
            }
        } catch (error) {
            console.error("Unable to read saved library accounts.", error);
            Swal.fire({
                icon: "error",
                title: "Unable to create account",
                text: "Saved account data could not be read. Please try again or contact the library."
            });
            return;
        }

        if (members.some((member) =>
            member &&
            typeof member.email === "string" &&
            member.email.trim().toLowerCase() === email
        )) {
            setFieldError(emailInput, "An account with this email already exists.", "registerEmailError");
            emailInput.focus();
            return;
        }

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

            try {
                members.push(user);
                localStorage.setItem("libraryUser", JSON.stringify(members));
            } catch (error) {
                console.error("Unable to save the new library account.", error);
                Swal.fire({
                    icon: "error",
                    title: "Unable to create account",
                    text: "Your account could not be saved. Check your browser storage and try again."
                });
                return;
            }

            Swal.fire({
                icon: "success",
                title: "Account created successfully",
                confirmButtonText: "Continue to login"
            }).then(() => {
                window.location.href = "../login page/login.html";
            });
        });
    });
}

registerForm?.querySelectorAll("input").forEach((input) => {
    input.addEventListener("input", () => {
        if (input.id === "registerPassword") {
            updatePasswordStrength(input.value);
            const confirmInput = document.getElementById("confirmPassword");
            if (confirmInput.value) {
                setFieldError(
                    confirmInput,
                    confirmInput.value === input.value ? "" : "Passwords do not match.",
                    "confirmPasswordError"
                );
            }
        }

        if (input.id === "confirmPassword") {
            const password = document.getElementById("registerPassword").value;
            setFieldError(
                input,
                !input.value ? "Confirm your password." : input.value === password ? "" : "Passwords do not match.",
                "confirmPasswordError"
            );
        } else if (input.getAttribute("aria-invalid") === "true") {
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
