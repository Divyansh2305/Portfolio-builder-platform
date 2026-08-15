const form = document.getElementById("loginForm");


// ============================================
// TOAST
// ============================================

function showToast(message, type) {

    const toast =
        document.getElementById("toast");

    if (!toast) {
        alert(message);
        return;
    }

    toast.innerHTML = message;

    toast.className =
        "toast show " + type;

    setTimeout(() => {

        toast.className =
            "toast";

    }, 3000);
}


// ============================================
// LOGIN
// ============================================

if (form) {

    form.addEventListener(
        "submit",
        async function (e) {

            e.preventDefault();


            const email =
                document
                    .getElementById("email")
                    .value
                    .trim()
                    .toLowerCase();


            const password =
                document
                    .getElementById("password")
                    .value;


            // ========================================
            // VALIDATION
            // ========================================

            if (!email || !password) {

                showToast(
                    "Email and password required",
                    "error"
                );

                return;
            }


            try {

                // ====================================
                // LOGIN API
                // ====================================

                const response =
                    await fetch(
                        "/api/auth/login",
                        {
                            method: "POST",

                            headers: {
                                "Content-Type":
                                    "application/json"
                            },

                            body: JSON.stringify({
                                email,
                                password
                            })
                        }
                    );


                // ====================================
                // RESPONSE
                // ====================================

                const result =
                    await response.json();


                console.log(
                    "Login Response:",
                    result
                );


                // ====================================
                // LOGIN FAILED
                // ====================================

                if (!response.ok) {

                    showToast(
                        result.message ||
                        "Login failed",
                        "error"
                    );

                    return;
                }


                // ====================================
                // TOKEN CHECK
                // ====================================

                if (!result.token) {

                    showToast(
                        "Token nahi mila. Backend check karo.",
                        "error"
                    );

                    return;
                }


                // ====================================
                // CLEAR OLD LOGIN
                // ====================================

                sessionStorage.removeItem(
                    "token"
                );

                sessionStorage.removeItem(
                    "user"
                );


                // ====================================
                // SAVE LOGIN SESSION
                // ====================================

                sessionStorage.setItem(
                    "token",
                    result.token
                );


                sessionStorage.setItem(
                    "user",
                    JSON.stringify(
                        result.user
                    )
                );


                // Also clear old localStorage
                // so old/wrong token doesn't interfere
                localStorage.removeItem(
                    "token"
                );

                localStorage.removeItem(
                    "user"
                );


                console.log(
                    "Token saved:",
                    sessionStorage.getItem("token")
                );

                console.log(
                    "Logged User:",
                    result.user
                );


                // ====================================
                // SUCCESS
                // ====================================

                showToast(
                    "Login Successful ✔",
                    "success"
                );


                // ====================================
                // GO TO BUILDER
                // ====================================

                setTimeout(() => {

                    window.location.href =
                        "builder.html";

                }, 800);


            } catch (error) {

                console.error(
                    "Login Error:",
                    error
                );


                showToast(
                    "Backend server se connection nahi hua",
                    "error"
                );

            }

        }
    );

}