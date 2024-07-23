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
console.log("the modal is loading...")
currentModal = null
const modalHtml =document.querySelector("#modal")
const titleModalHtml = document.querySelector("#titlemodal")
const buttonModalHtml = document.querySelector("#modalButton")



function openModal(event) {
    event.preventDefault()
    const target = document.querySelector(event.target.getAttribute('href'))
    modalHtml.style.display = null
    modalHtml.removeAttribute('aria-hidden')
    modalHtml.setAttribute('aria-modal', 'true')
    currentModal = target
    displayModal(currentModal.id) 
    //log
    console.log("the modal",currentModal.id," is opened...")
}

const closeModal = function (event){
    if (currentModal === null) return
    event.preventDefault()
    modalHtml.style.display = "none"
    modalHtml.setAttribute('aria-hidden', "true")
    modalHtml.removeAttribute('aria-modal')
    currentModal.innerHTML = ""

    //log
    console.log("the modal",currentModal.id," is closed...")
    currentModal = null
    
}

const modifierHtml = document.querySelector(".modifier")
modifierHtml.addEventListener("click", openModal)

const closeBtn = document.querySelector(".close")
closeBtn.addEventListener("click", closeModal)

function displayModal(event) {
    if (event === "modalGallery") {
        displayGalleryModal(allWorks)
    } else {
        titleModalHtml.innerHTML="Ajout photo"
        buttonModalHtml.setAttribute('value',"Valider")
        document.querySelector("#modalAddPhoto").style.display= null
    }
    //log
    console.log("the modal",currentModal.id," is opening...")


}


function displayGalleryModal(works) {
    //présentation - constant
    titleModalHtml.innerHTML='Galerie photo'
    buttonModalHtml.setAttribute('value',"Ajouter une photo")
    //contenu - variable
    const modalGalleryHtml = document.querySelector("#modalGallery")
    modalGalleryHtml.innerHTML = ""
    works.forEach(work => {
        const figureHtml = document.createElement("figure")
        const imgHtml = document.createElement("img")
        imgHtml.src = work.imageUrl
        figureHtml.appendChild(imgHtml)
        modalGalleryHtml.appendChild(figureHtml)
    })
    //log
    console.log("displayGalleryModal: works =", works)
}


function displayAddPhoto() {
    document.querySelector(".addPhoto").style.display= null

    
        
}











console.log("...the modal is loaded")