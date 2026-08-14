document.addEventListener("DOMContentLoaded", () => {

    fetch("features.html")
        .then(response => response.text())
        .then(data => {
            document.getElementById("features-container").innerHTML = data;
        })
        .catch(error => console.log(error));

});