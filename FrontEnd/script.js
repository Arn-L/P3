console.log("loading script...")

/******** définitions *********/
var _download = true
let allWorks = []
let suppList = []

/*
const adminHtml = document.querySelector(".admin")
const filterHtml = document.querySelector(".filtre")
const bannerHtml = document.querySelector("#banner")
const logHtml = document.querySelector("#log")
*/

/**** initialisation ****/
var token = (localStorage.getItem("token"))
console.log("token storage=", token)


/**** HTML conditionnel - affichage page Mode édition ****/
const logHtml = document.querySelector("#log")
const filterHtml = document.querySelector(".filtre")
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
        .catch(error => console.log("Fetch works Error : " + error))
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
    const galleryHtml =document.querySelector(".gallery") // Gallerie page projet
    const modalGalleryHtml = document.querySelector("#sectionGallery") // Gallerie de la modale
    works.forEach(work => {
        // HTML de la gallerie projet
        const figureHtml = document.createElement("figure")
        const imgHtml = document.createElement("img")
        imgHtml.src = work.imageUrl
        const figcaptionHtml = document.createElement("figcaption")
        figcaptionHtml.innerText = work.title
        figureHtml.appendChild(imgHtml)
        figureHtml.appendChild(figcaptionHtml)
        galleryHtml.appendChild(figureHtml)
        console.log("in forEach work.id =", work.id)
        // HTML de la gallerie modale
        const figureGMHtml = document.createElement("figure")
        figureGMHtml.id = "F"+work.id.toString()
        const imgGMHtml = document.createElement("img")
        imgGMHtml.src = work.imageUrl
        const buttonGMHtml = document.createElement("button")
        const trashGMHtml = document.createElement("i")
        trashGMHtml.className = "fa-solid fa-trash-can"//trashGMHtml.id = "T"+work.id
        figureGMHtml.appendChild(imgGMHtml)
        figureGMHtml.appendChild(buttonGMHtml)
        buttonGMHtml.appendChild(trashGMHtml)
        modalGalleryHtml.appendChild(figureGMHtml)
        buttonGMHtml.addEventListener('click', function() {
          fetchWorks()
          var avant = allWorks.length
          console.log("avant suppression allWork=", allWorks)
          // Suppresion dans la base de donnée

          fetch("http://localhost:5678/api/works/"+work.id, {
            method: "DELETE",
            headers: {Authorization: "Bearer "+token}  
            })
        .then(response => response.json())
        .then(result => {
          console.log("supprime",result)
            //if (result.error === {}) alert("Erreur d'authorisation à la base de donnée")
            
        })
        .catch(error => console.log("Erreur d'accès à la base de donnée lors de la suppression", error))
          /*if ((avant !== (allWorks.length+1)) || (allWorks.find(element => element.id === work.id) !== undefined)) {
            alert("Erreur lors de la suppression dans la base donnée !")
            return
          }
          */
          //suppression sur la page porjet & la modale
          allWorks.splice(work.id-1,1)
          figureGMHtml.remove()
          figureHtml.remove()
          console.log("après suppression allWorks=", allWorks)
          console.log("Picture deleted !")
        })
    })
    //log
    console.log("printHtmlGalleryModal: works =", works)
}

if (_download) {
    _download = !_download
    console.log("-------- download main page script completed ! ----------")
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
function displayGalleryModal() {
    disableModal(document.querySelector("#modalAddPhoto"))
    enableModal(document.querySelector("#modalGallery"))
    disableModal(document.querySelector("#jsModalBefore"))

}
//affichage modale ajout photo
function displayAddPhotoModal() {
    disableModal(document.querySelector("#modalGallery"))
    enableModal(document.querySelector("#modalAddPhoto"))
    enableModal(document.querySelector("#jsModalBefore"))

}

function openModal(event) {
    event.preventDefault()
    const target = document.querySelector(event.target.getAttribute("data-modal"))
    if (currentModal === null) {
        console.log("first opening")
        document.querySelector("#jsModalClose").addEventListener('click', closeModal)
        document.querySelector("#jsModalBefore").addEventListener('click', displayGalleryModal)
        document.querySelector("#addButton").addEventListener('click', displayAddPhotoModal)
        document.querySelector("#validButton").addEventListener('click', displayGalleryModal)
    }
    console.log("in openModal, target =", target)
    enableModal(target)
    currentModal=target.id
    console.log("the ", target.id, " is opened...")
}
 
const closeModal = function (event) {
    event.preventDefault()
    if (currentModal === null) return
    const target = document.querySelector(event.target.getAttribute("data-modal"))
    console.log("in closeModal event=", event) ; console.log("target=", target)
    disableModal(target)
    if (target === "#modal") {
        document.querySelectorAll(".js").removeEventListener("click", closeModal)
        document.querySelector("#modalGallery div").innerHTML= ""
        document.querySelector("#AddPhoto div").innerHTML= ""
        currentModal = null
    }
    console.log("the ", target.id, " is closed...")

}




/*** https://developer.mozilla.org/fr/docs/Web/HTML/Element/input/file modifié ***/
var inputHtml = document.getElementById("image_uploads");
var previewHtml = document.querySelector(".preview");
inputHtml.style.opacity = 0;

inputHtml.addEventListener("input", function(e) {
  testField()
  updateImageDisplay()
})


function updateImageDisplay() {
  

  while (previewHtml.firstChild) {
    previewHtml.removeChild(previewHtml.firstChild);
  }
  
  var currentFiles = inputHtml.files;
  if (currentFiles.length === 0) {
    var paraHtml = document.createElement("p");
    paraHtml.textContent = "Aucun fichier sélectionné";
    previewHtml.appendChild(paraHtml);
  } else {
    var list = document.createElement("ol");
    previewHtml.appendChild(list);
    
    for (var i = 0; i < currentFiles.length; i++) {
      console.log("lecture du fichier n°:", i+1)
      var listItem = document.createElement("li");
      if (validFileType(currentFiles[i])) {
        
        var image = document.createElement("img");
        image.src = window.URL.createObjectURL(currentFiles[i]);

        listItem.appendChild(image);
      } else {
        var paraHtml = document.createElement("p");
        paraHtml.textContent = "Le format du fichier n'est pas valide";
        listItem.appendChild(paraHtml);
      }

      list.appendChild(listItem);
    }
  }
  var titleForm ="titre essais"
  var categoryForm= ''

  

  const formData = new FormData()
  const addTitleForm = document.getElementById("addTitle").value
  const addCategoryForm = document.getElementById("addCategory").value
  formData.append('image', currentFiles)
  formData.append('title', addTitleForm)
  formData.append('category', addCategoryForm)
  

  var StatusDownlaod = false
  const formHtml = document.querySelector("#formFichier")
  formHtml.addEventListener("submit", function(event) {
  event.preventDefault()
    fetch("http://localhost:5678/api/works/", {
      method: "POST",
      headers: { Authorization: "Bearer " + token },
      body: formData
    })
      .then(response => {
        if (response.ok) {
          StatusDownlaod = true
          console.log("submit ok")
        } else {
          console.log("erreur de transmission")
        }
      })
      .then(result => {
        if (StatusDownlaod) {
          console.log("...download photo ok")
        } else {
          console.log("erreur submit 2")
        }
      })
      .catch(error => {
        console.log("fetch error while connection, " + error + error.status)
      })
  })
}

function testField() {
  console.log("In TestField")
  const formField = document.getElementById("formFichier")
  const inputsText = formField.querySelectorAll('input[type="text"]')
  const inputFile = formField.querySelector('input[type="file"]')
  inputsText.forEach(input => {
    input.addEventListener('input', () => {
      console.log("In input.EventListener")
      let allInputs = true
      inputsText.forEach(input => {
          if (input.value.trim() === '') {
            allInputs = false
            console.log("All fields")
          }
      })
      //if (inputFile.lenght === 0) allInputs = false
      if(allInputs) {
          getElementById("validButton").removeAttribute('disabled')
        } else {
          getElementById("validButton").setAttribute('disabled', 'disabled')
        }
      })
    })
  }

var fileTypes = ["image/jpeg", "image/pjpeg", "image/png"];
function validFileType(file) {
  for (var i = 0; i < fileTypes.length; i++) {
    if (file.type === fileTypes[i]) {
      return true;
    }
  }

  return false;
}

function returnFileSize(number) {
  if (number < 1024) {
    return number + " octets";
  } else if (number >= 1024 && number < 1048576) {
    return (number / 1024).toFixed(1) + " Ko";
  } else if (number >= 1048576) {
    return (number / 1048576).toFixed(1) + " Mo";
  }
}



console.log("...the modal is loaded")