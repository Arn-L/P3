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
