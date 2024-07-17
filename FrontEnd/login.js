console.log("login.js is loading...")
var _download = true
localStorage.removeItem("token")

/******* défintions *******/
const controller = new AbortController()
const signal = controller.signal
console.log("Token =", JSON.stringify(localStorage.getItem("token")))

function addListenerFormLogin() {
    console.log("in addListenerFormLog : ")
    const formLogin = document.querySelector("#formLog");
    formLogin.addEventListener("submit", function (event) {
        event.preventDefault()
        const emailForm = event.target.querySelector("#email").value
        const passwordForm = event.target.querySelector("#password").value
        console.log("in addEventListener : formLogin=", formLogin, "| emailForm =", emailForm, ", passwordForm =", passwordForm)

        var statusToken = false //variable de controle d l'authentfication
        fetch("http://localhost:5678/api/users/login", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                email: emailForm,
                password: passwordForm
            }),
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
                    console.log("...Token is in local Storage", result.token)
                    localStorage.setItem("token", result.token)
                    window.location = "./index.html"
                } else {
                    console.log("erreur 2 d'indentifiant")
                    alert("Erreur dans l’identifiant ou le mot de passe")
                    console.log("Token =", JSON.stringify(localStorage.getItem("token")))
                    location.reload()
                }
            })
            .catch(error => {
                console.log("fetch error while connection, " + error + error.status)
            })
    })
}

if (_download) {
    _download = !_download
    console.log("-------- download login completed ! ----------")
}

/**** excécution ****/
addListenerFormLogin();
