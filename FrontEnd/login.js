console.log("... login.js is loaded")
// autorisation d'après token en exemple de swager, connection bearer du token sur swagger
const TOKEN = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjEsImlhdCI6MTY1MTg3NDkzOSwiZXhwIjoxNjUxOTYxMzM5fQ.JGN1p8YIfR-M-5eQ-Ypy6Ima5cKA4VbfL2xMr2MgHm4";
//Authorization : "Bearer " + token (pai via swagger*/

fetch("http://localhost:5678/api/users/login", {
    method: "POST",
    headers: {"Authorization" : "Bearer " + TOKEN, "Content-Type": "application/json" },
    body: '{"email": "sophie.bluel@test.tld", "password": "S0phie"}'
});

function validLogin(usersData, userLogin) {
    usersData.forEach(word => {   //faire un while (word!=userLogin.email)
        console.log("in validLogin : usersData =",usersData, " | suerLogin =", suerLogin);
        if (word.email==userLogin.email){
            if (word.password==userLogin.password){
                console.log("Login ok !");
                return true;
            } else {
                console.log("Problem 1 : sorry incorrect email or password");
                return false;
            }
        } else {
            console.log("Problem 2 : sorry incorrect email or password");
            return false;
        }        
    });
}

function addListenerFormLog(){
    console.log("in addListenerFormLog : ")

    const formLogin = document.querySelector("#formLog");
    formLogin.addEventListener("submit", function (event){
        event.preventDefault();
        const emailForm = event.target.querySelector("#email").value;
        const passwordForm = event.target.querySelector("#password").value;

        console.log("in addEventListener : formLogin=", formLogin, "| emailForm =", emailForm,", passwordForm =",passwordForm);

        fetch("http://localhost:5678/api/users/login", { 
            method: "POST",
            headers: {"Content-Type": "application/json" },
            body: JSON.stringify({
                email: emailForm,
                password: passwordForm
            })
        })
        .then(response => response.json())
        .then(result => {
            console.log("in Listener Form :  result =", result);
            
            validLogin(result, emailForm, passwordForm)
            // result.token  le stoker dans le localstorage.

            // supprimer le token du locastorage quand logout -> recharge la page avec mode administrateur, si existe un token.
        })
        .catch(error => console.log("fetch error while connection, " + error + error.status))
    })
}

addListenerFormLog();
