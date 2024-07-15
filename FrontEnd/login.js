console.log("login.js is loading..." )
localStorage.removeItem("token");
/******* défintions *******/

console.log("Token =",JSON.stringify(localStorage.getItem("token")))

function addListenerFormLogin() {
    console.log("in addListenerFormLog : ")

    const formLogin = document.querySelector("#formLog");
    formLogin.addEventListener("submit", function (event) {
        event.preventDefault();
        const emailForm = event.target.querySelector("#email").value;
        const passwordForm = event.target.querySelector("#password").value;
        console.log("in addEventListener : formLogin=", formLogin, "| emailForm =", emailForm, ", passwordForm =", passwordForm);     
        
        fetch("http://localhost:5678/api/users/login", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                email: emailForm,
                password: passwordForm
            })
        })
            .then(response => {
                if (response.ok){
                    response.json()
                } else {
                    console.log("erreur 1 d'indentifiant")
                    alert("Erreur dans l’identifiant ou le mot de passe")
                }})
            .then(result => {
                    console.log("...Token is in local Storage", JSON.stringify(result))
                    localStorage.setItem("token", result)
                    window.location = "./index.html"
            })
            .catch(error => {
                console.log("fetch error while connection, " + error + error.status)

            })
    })
}

    // result.token  le stoker dans le localstorage.
    /***
     * localStorage.setItem("truc","machin")
     * 
     * var chose = localStorage.getItem("truc")
     * 
     * localStorage.remeItem("truc")
     * localStorage.clear()
     *  
     * 
    
    
    
     */
    // supprimer le token du locastorage quand logout -> recharge la page avec mode administrateur, si existe un token.


addListenerFormLogin();
