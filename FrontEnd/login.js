localStorage.removeItem("token")
const controller = new AbortController()
const signal = controller.signal

function addListenerFormLogin() {
    const formLogin = document.querySelector("#formLog");
    formLogin.addEventListener("submit", function (event) {
        event.preventDefault()
        const emailForm = event.target.querySelector("#email").value
        const passwordForm = event.target.querySelector("#password").value
        var statusToken = false //variable de controle d l'authentfication
        fetch("http://localhost:5678/api/users/login", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                email: emailForm,
                password: passwordForm
            })
        })
            .then(response => {
                if (response.ok) {
                    statusToken = true
                    return response.json()
                } else {
                    console.log("erreur 1 d'indentifiant")
                }
            })
            .then(result => {
                if (statusToken) {
                    localStorage.setItem("token", result.token)
                    window.location = "./index.html"
                } else {
                    alert("Erreur dans l’identifiant ou le mot de passe")
                    location.reload()
                }
            })
            .catch(error => {
                console.log("Error while connection, " + error + error.status)
            })
    })
}
addListenerFormLogin();
