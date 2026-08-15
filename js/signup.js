const form = document.getElementById("signupForm");

function showToast(message, type) {
    const toast = document.getElementById("toast");

    toast.innerHTML = message;
    toast.className = "toast show " + type;

    setTimeout(() => {
        toast.className = "toast";
    }, 3000);
}

form.addEventListener("submit", async function (e) {
    e.preventDefault();

    const name = document.getElementById("name").value.trim();
    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value;
    const confirmPassword =
        document.getElementById("confirmPassword").value;

    if (!name || !email || !password || !confirmPassword) {
        showToast(
            "All fields are required",
            "error"
        );
        return;
    }

    if (password !== confirmPassword) {
        showToast(
            "Passwords do not match",
            "error"
        );
        return;
    }

    try {
        const response = await fetch(
            "/api/auth/signup",
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    name,
                    email,
                    password
                })
            }
        );

        const result = await response.json();

        if (!response.ok) {
            showToast(
                result.message || "Signup failed",
                "error"
            );
            return;
        }

        showToast(
            "Account Created Successfully ✔",
            "success"
        );

        setTimeout(() => {
            window.location.href = "login.html";
        }, 1200);

    } catch (error) {
        console.error("Signup Error:", error);

        showToast(
            "Backend server se connection nahi hua",
            "error"
        );
    }
});