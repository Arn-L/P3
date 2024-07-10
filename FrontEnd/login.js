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

    const formLogin = document.querySelector(".formLog");
    formLogin.addEventListener("submit", function (event){
        event.preventDefault();
        const emailForm = event.target.querySelector("[name=email]").value;
        const passwordForm = event.target.querySelector("[name=password]").value;

        console.log("in addEventListener : formLogin=", formLogin, "| emailForm =", emailForm,", passwordForm =",passwordForm);
        console.log("transtype event.json()=" , event.json());

        fetch("http://localhost:5678/api/users/login", { 
            method: "GET",
            headers: {"Authorization" : "Bearer " + TOKEN, "Content-Type": "application/json" },
            body: {"email": string, "password": string}
        })
        .then(response => response.json())
        .then(result => {
            console.log("in Listener Form :  result =", result);
            
            validLogin(result, event.json())})
        .catch(error => console.log("fetch error while connection, " + error))
    })
}

addListenerFormLog();
