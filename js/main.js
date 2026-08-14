const menuToggle = document.getElementById("menuToggle");
const navLinks = document.querySelector(".nav-links");
const navBtn = document.querySelector(".nav-btn");

menuToggle.addEventListener("click", () => {

    menuToggle.classList.toggle("active");

    navLinks.classList.toggle("active");

    navBtn.classList.toggle("active");

});