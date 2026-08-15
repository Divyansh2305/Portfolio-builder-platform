const form = document.getElementById("loginForm");

const API_BASE = "https://portfolio-builder-platform-3.onrender.com";

function showToast(message, type) {
    const toast = document.getElementById("toast");

    if (!toast) {
        alert(message);
        return;
    }

    toast.innerHTML = message;
    toast.className = "toast show " + type;

    setTimeout(() => {
        toast.className = "toast";
    }, 3000);
}

if (form) {
    form.addEventListener("submit", async function (e) {
        e.preventDefault();

        const email = document
            .getElementById("email")
            .value
            .trim()
            .toLowerCase();

        const password = document
            .getElementById("password")
            .value;

        if (!email || !password) {
            showToast(
                "Email and password required",
                "error"
            );
            return;
        }

        try {
            const response = await fetch(
                `${API_BASE}/api/auth/login`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({
                        email: email,
                        password: password
                    })
                }
            );

            const result = await response.json();

            console.log("Login Response:", result);

            if (!response.ok) {
                showToast(
                    result.message || "Login failed",
                    "error"
                );
                return;
            }

            if (!result.token) {
                showToast(
                    "Token nahi mila. Backend check karo.",
                    "error"
                );
                return;
            }

            sessionStorage.setItem(
                "token",
                result.token
            );

            sessionStorage.setItem(
                "user",
                JSON.stringify(result.user)
            );

            localStorage.removeItem("token");
            localStorage.removeItem("user");

            console.log(
                "Token saved:",
                sessionStorage.getItem("token")
            );

            console.log(
                "Logged User:",
                result.user
            );

            showToast(
                "Login Successful ✔",
                "success"
            );

            setTimeout(() => {
                window.location.href = "builder.html";
            }, 800);

        } catch (error) {
            console.error("Login Error:", error);

            showToast(
                "Backend server not connected",
                "error"
            );
        }
    });
}
