console.log("loading script...")

/******** définitions *********/
let allWorks = []
var _download = true
const galleryHtml = document.querySelector(".gallery")
const adminHtml = document.querySelector(".admin")
const filterHtml = document.querySelector(".filtre")
const bannerHtml = document.querySelector("#banner")
const logHtml = document.querySelector("#log")


/**** initialisation ****/
var token = (localStorage.getItem("token"))
console.log("token storage=", token)


/**** HTML conditionnel - affichage page Mode édition ****/
if (token != null) {
    //menu navigation
    logHtml.innerHTML = '<a href="#">logout</a>'
    logHtml.addEventListener("click", function () {
        localStorage.removeItem("token")
        location.reload()
    })
    //mode édition de la page principale
    document.querySelectorAll(".edition").forEach(target => {
        target.style.display = null
    })
    filterHtml.style.display = "none"
    //log
    token = (localStorage.getItem("token"))
    console.log("logout -> token storage=", token)

} else {
    //menu navigation
    logHtml.innerHTML = '<a href="./login.html">login</a>'
}








/**** page principale - projets ****/
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
            displayCategories(result)
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
    })
}

if (_download) {
    _download = !_download
    console.log("-------- download script completed ! ----------")
}

fetchWorks()
fetchCategories()



/*** script modale ***/
/* La gallerie photo de la modale est chargé initialement, puis actualisé (ajout/suppression)
/* Les pages contenus "Gallerie photo" et "Ajout photo" sont générés inialement en Html, puis
/* activé ou désactivté en fonction de la navigation dans la modale
/* La fonction openModal(event) gère l'affichage de la modale
/* et du contenu en fonction de l'évènement des 'click' boutons 
/* 
 */
console.log("the modal script is loading...")
currentModal = null
const modalHtml = document.querySelector("#modal")

// Bouton [modifier] page édition
const modifyHtml = document.querySelector(".modify")
modifyHtml.addEventListener("click", openModal)

/**** sous fonctions du contenu de la modale ****/
// activation balise Html
function enableModal(target) {
    target.style.display = null
    target.removeAttribute('aria-hidden')
    target.setAttribute('aria-modal', 'true')
}
// Désactivation balise Html
function disableModal(target) {
    if (target === null) retrun
    target.style.display = "none"
    target.setAttribute('aria-hidden', 'true')
    target.removeAttribute('aria-modal')
}
// affichage modale gallerie
function displayGalleryModal(target) {
    disableModal(document.querySelector("#modalAddPhoto"))
    enableModal(document.querySelector("#modalGallery"))
}
//affichage modale ajout photo
function displayAddPhotoModal() {
    disableModal(document.querySelector("#modalGallery"))
    enableModal(document.querySelector("#modalAddPhoto"))
}

function openModal(event) {
    event.preventDefault()
    const target = document.querySelector(event.target.getAttribute("data-modal"))
    if (currentModal === null) {
        console.log("first opening")
        printHtmlGalleryModal(allWorks) //chargement code HTML de la gallerie modale <div modalGallery>
        //printHtmlAddPhotoModal() 
        //target = document.querySelector("#modal")
        document.querySelector("#jsModalClose").addEventListener('click', closeModal)
        document.querySelector("#addButton").addEventListener('click', displayAddPhotoModal)
        document.querySelector("#validButton").addEventListener('click', displayGalleryModal)

    }
    console.log("in openModal, target =", target)
    enableModal(target)
    currentModal=target.id
    //log
    console.log("the ", target.id, " is opened...")
}
 
const closeModal = function (event) {
    event.preventDefault()
    if (currentModal === null) return
    const target = document.querySelector(event.target.getAttribute("data-modal"))
    console.log("in closeModal event=", event) ; console.log("target=", target)
    disableModal(target)
    if (target === "#modal") {
        document.querySelectorAll("js").removeEventListener("click", closeModal)
        document.querySelector("#modalGallery div").innerHTML= ""
        document.querySelector("#AddPhoto div").innerHTML= ""
        currentModal = null
    }
    console.log("the ", target.id, " is closed...")

}

function printHtmlGalleryModal(works) {
    const modalGalleryHtml = document.querySelector(".modalGallery")
    works.forEach(work => {
        const figureHtml = document.createElement("figure")
        const imgHtml = document.createElement("img")
        imgHtml.src = work.imageUrl
        figureHtml.appendChild(imgHtml)
        modalGalleryHtml.appendChild(figureHtml)
    })
    //log
    console.log("printHtmlGalleryModal: works =", works)
}

function printHtmlAddPhotoModal() {
    document.querySelector("#sectionAddPhoto").innerHTML =`
    <p>section AddPhoto</p>    
    `
    /*<div class="pictureBox">
        <img scr="./assets/icons/icone-d-image.png" alt="">
    </div>
    `
    */

    // <input type="file">
}












console.log("...the modal is loaded")