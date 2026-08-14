document.addEventListener(
    "DOMContentLoaded",
    async () => {

        const loginBtn =
            document.querySelector(
                ".login-btn"
            );

        const signupBtn =
            document.querySelector(
                ".signup-btn"
            );

        const userMenu =
            document.getElementById(
                "userMenu"
            );

        const username =
            document.getElementById(
                "username"
            );

        const logoutBtn =
            document.getElementById(
                "logoutBtn"
            );


        try {

            const response =
                await fetch(
                    "http://localhost:5000/api/auth/me",
                    {
                        method: "GET",

                        credentials: "include"
                    }
                );


            if (!response.ok) {

                if (loginBtn) {
                    loginBtn.style.display =
                        "inline-flex";
                }

                if (signupBtn) {
                    signupBtn.style.display =
                        "inline-flex";
                }

                if (userMenu) {
                    userMenu.style.display =
                        "none";
                }

                return;
            }


            const result =
                await response.json();


            const user =
                result.user;


            if (loginBtn) {
                loginBtn.style.display =
                    "none";
            }


            if (signupBtn) {
                signupBtn.style.display =
                    "none";
            }


            if (userMenu) {
                userMenu.style.display =
                    "flex";
            }


            if (username) {

                username.textContent =
                    user.name;
            }


        } catch (error) {

            console.error(
                "Auth check failed:",
                error
            );

        }


        if (logoutBtn) {

            logoutBtn.addEventListener(
                "click",
                async () => {

                    try {

                        await fetch(
                            "http://localhost:5000/api/auth/logout",
                            {
                                method: "POST",
                                credentials:
                                    "include"
                            }
                        );

                    } catch (error) {

                        console.error(error);

                    }


                    window.location.href =
                        "login.html";
                }
            );
        }

    }
);