console.log("login.js is loading..." )
localStorage.removeItem("token");
/******* défintions *******/
let controller = new AbortController()
console.log("Token =",JSON.stringify(localStorage.getItem("token")))

function addListenerFormLogin() {
    console.log("in addListenerFormLog : ")

    const formLogin = document.querySelector("#formLog");
    formLogin.addEventListener("submit", function (event) {
        event.preventDefault()
        const emailForm = event.target.querySelector("#email").value
        const passwordForm = event.target.querySelector("#password").value
        console.log("in addEventListener : formLogin=", formLogin, "| emailForm =", emailForm, ", passwordForm =", passwordForm)     
        
        var statusToken=false //variable d'interuption non identifié
        fetch("http://localhost:5678/api/users/login", {
            method: "POST",
            headers: {
                 "Content-Type": "application/json" ,
                 signal: controller.signal
                },
            body: JSON.stringify({
                email: emailForm,
                password: passwordForm
            })
        })       
            .then(response => {
                
                if (response.ok){
                    response.json()
                    statusToken =true                    
                } else {                    
                    console.log("erreur 1 d'indentifiant")
                    alert("Erreur dans l’identifiant ou le mot de passe")
                    controller.abort() // ne fonctionne pas...?
                    location.reload()
             }})
            .then(result => {
                if (statusToken){
                        console.log("...Token is in local Storage", JSON.stringify(result))
                        localStorage.setItem("token", result)
                        window.location = "./index.html"
                }
                    
                    
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
