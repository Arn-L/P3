console.log("loading script...")

/******** définitions *********/
let allWorks = []
var _download = true
const galleryHtml = document.querySelector(".gallery")
const filterHtml = document.querySelector(".filtre")
const logHtml = document.querySelector("#log")


/***** modale de page *****/
console.log("the modal is loading...")

var token = (localStorage.getItem("token"))
console.log("token storage=", token)
if(token != null){ 
    logHtml.innerHTML='<a href="#">logout</a>'
    logHtml.addEventListener("click", function () {
        localStorage.removeItem("token")
        token = (localStorage.getItem("token"))
        console.log("logout -> token storage=", token)
        location.reload()
    })
} else {
    logHtml.innerHTML='<a href="./login.html">login</a>'
}



/***** page projet */
function fetchWorks() {
    fetch("http://localhost:5678/api/works/", { method: "GET" })
        .then(response => response.json())
        .then(result => {
            allWorks = result
            console.log("in fetch allWoks=", allWorks)
        })
        .catch(error => console.log("Fletch works Error : " + error))
}

function fetchCategories() {
    fetch("http://localhost:5678/api/categories/", { method: "GET" })
        .then(response => response.json())
        .then(result => {
            console.log("in fetch Categories=", result)
            displayCategories(result);
        })
        .catch(error => console.log("Fetch categories Error = " + error))
}

function displayCategories(categories) {
    console.log("in display categories=", categories)
    categories.forEach(category => {
        console.log("in forEach : category.id", category.id)
        //création bouton catégorie (filtre)
        const buttonHtml = document.createElement("button")
        buttonHtml.innerText = category.name
        filterHtml.appendChild(buttonHtml)
        //fonction bouton suppression works ciblées
        buttonHtml.addEventListener("click", function () {
            console.log("Listener =", category.id)
            //tri works
            worksFilter = allWorks.filter((workItem) => {
                return workItem.category.id === category.id
            })
            galleryHtml.innerHTML = ""
            displayGallery(worksFilter)
        })
    })
    console.log("Button All ok")
    //création bouton All (filtre)
    const buttonAllHtml = document.createElement("button")
    buttonAllHtml.innerText = "   Tout   "
    filterHtml.appendChild(buttonAllHtml)
    //fonction bouton reset iltre
    buttonAllHtml.addEventListener("click", function () {
        console.log("Listener = all")
        galleryHtml.innerHTML = ""
        displayGallery(allWorks)
    });
    
    displayGallery(allWorks)
}

function displayGallery(works) {
    console.log("displayGallery : works =", works)
    works.forEach(work => {
        const figureHtml = document.createElement("figure")
        const imgHtml = document.createElement("img")
        imgHtml.src = work.imageUrl
        const figcaptionHtml = document.createElement("figcaption")
        figcaptionHtml.innerText = work.title
        figureHtml.appendChild(imgHtml)
        figureHtml.appendChild(figcaptionHtml)
        galleryHtml.appendChild(figureHtml)
    });
    if (_download) {
        _download = !_download
        console.log("-------- download completed ! ----------")

    }
}

fetchWorks()
fetchCategories()
