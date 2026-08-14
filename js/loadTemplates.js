document.addEventListener("DOMContentLoaded", () => {

    fetch("templates.html")
        .then(response => response.text())
        .then(data => {
            document.getElementById("templates-container").innerHTML = data;
        })
        .catch(error => console.log(error));

});