<<<<<<< HEAD
console.log("...login.js is loaded")

const adminEmail= "sophie.bluel@test.tld";
const adminPassword= "S0phie";
const TOKEN="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjEsImlhdCI6MTY1MTg3NDkzOSwiZXhwIjoxNjUxOTYxMzM5fQ.JGN1p8YIfR-M-5eQ-Ypy6Ima5cKA4VbfL2xMr2MgHm4"


function LoginListener() {
    const formulaireLogin = document.querySelector(".formLogin");
    formulaireLogin.addEventListener("submit", function (event) {
        event.preventDefault();
        console.log("submit :", event);
        console.log("email", event.email);
        console.log("passeword=", event.password);
      
    });
    /*
    formulaireLogin.addEventListener("load", () => {
        function sendData() {
          const XHR = new XMLHttpRequest();
      
          // on crée l'objet FormData en le rattachant
          // à l'élément de formulaire
          const FD = new FormData(form);
      
          // On définit ce qui se produit lorsque
          // les données sont bien envoyées
          XHR.addEventListener("load", (event) => {
            alert(event.target.responseText);
          });
      
          // On définit ce qui se produit en cas
          // d'erreur
          XHR.addEventListener("error", (event) => {
            alert("Une erreur est survenue.");
          });
      
          // On prépare la requête
          XHR.open("POST", "https://example.com/cors.php");
      
          // On envoie les données avec ce qui a été
          // fourni dans le formulaire
          XHR.send(FD);
        }
      
        // On récupère une référence au formulaire HTML
        const form = document.getElementById("monFormulaire");
      
        // On ajoute un gestionnaire d'évènement 'submit'
        form.addEventListener("submit", (event) => {
          event.preventDefault();
      
          sendData();
        });
        
      };*/
      
}

LoginListener();

function valideLogin(){
    fetch("http://localhost:5678/api/users/login/", { method: "GET" })
    .then(response => response.json())
    .then(result => {
        console.log("in users login=", result.email, ", password=",result.password);
        return result.json();
    })
    .catch(error => {
        console.log("Flech Error : " + Response.status +" | "+ error);
    });

}
=======
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
>>>>>>> c8f878fb241d149b9b95200c6b37788f231f2228
