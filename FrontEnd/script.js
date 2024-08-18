console.log("loading script...")

/******** définitions *********/
var _download = true
var StatusDownlaod = false
let allWorks = []
const galleryHtml =document.querySelector(".gallery") // Gallerie page projet
const modalGalleryHtml = document.querySelector("#sectionGallery") // Gallerie de la modale

/**** initialisation ****/
var token = (localStorage.getItem("token"))
console.log("token storage=", token)


/**** HTML conditionnel - affichage page principale ****/
const logHtml = document.querySelector("#log")
const filterHtml = document.querySelector(".filtre")
if (token != null) {
  //menu navigation
  logHtml.innerHTML = '<a href="#">logout</a>'
  logHtml.addEventListener("click", function () {
    localStorage.removeItem("token")
    location.reload()
  })
  //Affichage en mode édition de la page principale
  document.querySelectorAll(".edition").forEach(target => {
    target.style.display = null
  })
  //Filtres désactivés
  filterHtml.style.display = "none"
  //log
  token = (localStorage.getItem("token"))
  console.log("logout -> token storage=", token)
} else {
  //menu navigation affichage login
  logHtml.innerHTML = '<a href="./login.html">login</a>'
}



/**** page principale - projets ****/

/** chargement des travaux dans allWorks **/
function fetchWorks() {
    fetch("http://localhost:5678/api/works/", { method: "GET" })
        .then(response => response.json())
        .then(result => {
            allWorks = result
            console.log("in fetch allWoks=", allWorks)
        })
        .catch(error => console.log("Fetch works Error : " + error))
}

/** Chargement et affichage des filtres catégories */
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
    if (token === null) {
    categories.forEach(category => {
        console.log("in forEach : category.id", category.id)
        //création bouton catégorie (filtre)
        const buttonHtml = document.createElement("button")
        buttonHtml.innerText = category.name
        filterHtml.appendChild(buttonHtml)
        //évènement bouton filtre ciblées par catégories
        buttonHtml.addEventListener("click", function () {
            console.log("filter =", category.id)
            //tri works
            worksFilter = allWorks.filter((workItem) => {
                return workItem.category.id === category.id
            })
            galleryHtml.innerHTML = ""
            displayGallery(worksFilter)
        })
    })
    console.log("Button All ok")
    //création bouton All 
    const buttonAllHtml = document.createElement("button")
    buttonAllHtml.innerText = "   Tout   "
    filterHtml.appendChild(buttonAllHtml)
    //évènement bouton reset filtre
    buttonAllHtml.addEventListener("click", function () {
        console.log("filter = all")
        galleryHtml.innerHTML = ""
        displayGallery(allWorks)
    });
  }
    //Affichage gallerie , si mode courant, après création des filtres
    displayGallery(allWorks)
}
/** construit la gallerie de la page principale
 *  et en mode édition la gallerie modale
 *  ainsi que le fonctionnalité de suppression
 *  et permet aussi d'ajouter un projet supplémentaire */
function displayGallery(works) {
  console.log("displayGallery : works =", works)
  if (!Array.isArray(works)) { 
    let updateWorks = [works]
    allWorks.push(works)
    works = updateWorks}
  let i = 0
  while (i < works.length) { // permet l'ajout 1 élt
    // HTML de la gallerie courante
    const work = works[i] //fetch ne supporte pas works[i].id en Url!
    const figureHtml = document.createElement("figure")
    const imgHtml = document.createElement("img")
    imgHtml.src = work.imageUrl
    const figcaptionHtml = document.createElement("figcaption")
    figcaptionHtml.innerText = work.title
    figureHtml.appendChild(imgHtml)
    figureHtml.appendChild(figcaptionHtml)
    galleryHtml.appendChild(figureHtml)
    console.log("in while work.id =", work.id)
    if (token != null) {
      // HTML de la gallerie édition (modale)
      const figureGMHtml = document.createElement("figure")
      const imgGMHtml = document.createElement("img")
      imgGMHtml.src = work.imageUrl
      //Bouton poubelle de suppression d'image
      const buttonGMHtml = document.createElement("button")
      const trashGMHtml = document.createElement("i")
      trashGMHtml.className = "fa-solid fa-trash-can"
      figureGMHtml.appendChild(imgGMHtml)
      figureGMHtml.appendChild(buttonGMHtml)
      buttonGMHtml.appendChild(trashGMHtml)
      modalGalleryHtml.appendChild(figureGMHtml)
      //évènement de suppression
      buttonGMHtml.addEventListener('click', function () {
        console.log("avant suppression allWork=", allWorks)
        // Suppresion dans la base de donnée
        fetch("http://localhost:5678/api/works/" + work.id, {
          method: "DELETE",
          headers: { Authorization: "Bearer " + token }
        })
          .then(response => response.json())
          .then(result => {
            console.log("supprime", result)
          })
          .catch(error => console.log("Erreur d'accès à la base de donnée lors de la suppression", error))
        //suppression sur la page projet & la modale
        allWorks = allWorks.filter(w => w.id !== work.id)
        figureGMHtml.remove()
        figureHtml.remove()
        console.log("after delete, allWorks=", allWorks)
        console.log("Picture deleted !")
        fetchWorks()
      })
    }
    i += 1
  }
  //log
  console.log("End of displayGallery printHtmlGalleryModal: works =", works)
}

if (_download) {
    _download = !_download
    console.log("-------- download main page script completed ! ----------")
}

fetchWorks()
fetchCategories()


console.log("the modal script is loading...")

/*** script modale ***/
/* La gallerie photo de la modale est chargé initialement, puis actualisé (ajout/suppression)
/* Les pages contenus "Gallerie photo" et "Ajout photo" sont générés inialement en Html, puis
/* activé ou désactivté (aria-hidden) en fonction de la navigation dans la modale
/* Les fonctions display[laModale](event) gèrent l'affichage des modales
/* et du contenu en fonction de l'évènement des 'click' boutons 
 */
if (token != null) {
  currentModal = null
  const modalHtml = document.querySelector("#modal")

  // Bouton [modifier] page édition
  const modifyHtml = document.querySelector(".modify")
  modifyHtml.addEventListener("click", openModal)

  /**** sous-fonctions gestion contenu de la modale ****/
  // activation balise Html
  function enableModal(target) {
    if (target === null) return
    target.style.display = null
    target.removeAttribute('aria-hidden')
    target.setAttribute('aria-modal', 'true')
  }
  // Désactivation balise Html
  function disableModal(target) {
    if (target === null) return
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
    //Initialisation de la modale ajout projet
    previewHtml.innerHTML = `<img id="exemple" src="./assets/icons/icone-d-image-grey.png" alt="télécharger votre fichier">`
    const formFichier = document.getElementById("formFichier")
    const formFields = formFichier.querySelectorAll('input, select, textarea')
    formFields.forEach((field) => { field.value = "" })
    _clickFiles = false // initialise la condition de requête submit
    //Affichage
    disableModal(document.querySelector("#modalGallery"))
    enableModal(document.querySelector("#modalAddPhoto"))
    enableModal(document.querySelector("#jsModalBefore"))
  }

  function openModal() {
    const target = document.querySelector("aside")
    displayGalleryModal()
    enableModal(target)
    console.log("modale opening")
    document.querySelector("#jsModalClose").addEventListener('click', closeModal)
    document.querySelector("#jsModalBefore").addEventListener('click', displayGalleryModal)
    document.querySelector("#addButton").addEventListener('click', displayAddPhotoModal)
    console.log("in openModal, target =", target)
    currentModal = target.id
    console.log("the ", target.id, " is opened...")
  }

  function closeModal() {
    if (currentModal === null) return
    const target = document.querySelector("aside")
    disableModal(target)
    console.log("the ", target.id, " is closed...")
    currentModal = null
  }




  /*** source modidié https://developer.mozilla.org/fr/docs/Web/HTML/Element/input/file ***/
  const inputHtml = document.getElementById("image_uploads");
  const previewHtml = document.querySelector(".preview");
  inputHtml.style.opacity = 0;
  var currentFiles // fichiers photo à ajouter
  inputHtml.addEventListener("change", function (e) {
    console.log("In imput event click currentFiles=", currentFiles)
    updateImageDisplay()
  })

  // gestion formulaire modale d'ajout projet
  function updateImageDisplay() {
    //testField() // suveille la complétude du formulaires
    while (previewHtml.firstChild) { previewHtml.removeChild(previewHtml.firstChild); }
    console.log("In updateImageDisplay inputHtml.files=", inputHtml.files)
    console.log("In updateImageDisplay inputHtml.files[0]=", inputHtml.files[0])
    currentFiles = inputHtml.files[0]
    console.log("And currentFiles= inputHtml.files[0] :", currentFiles)
    if (currentFiles === undefined) {
      const paraHtml = document.createElement("p")
      paraHtml.textContent = "Aucun fichier sélectionné"
      previewHtml.appendChild(paraHtml)
    } else {
      const list = document.createElement("ol")
      previewHtml.appendChild(list)
      console.log("lecture du fichier")
      const listItem = document.createElement("li")
      if (validFileType(currentFiles)) {
        //apperçu img
        const image = document.createElement("img")
        image.src = window.URL.createObjectURL(currentFiles)
        listItem.appendChild(image)
      } else {
        var paraHtml = document.createElement("p")
        paraHtml.textContent = "Le format du fichier n'est pas valide"
        listItem.appendChild(paraHtml)
      }
      list.appendChild(listItem)
    }
    
  }

 
  const formHtml = document.querySelector("#formFichier")
  formHtml.addEventListener("submit", function (event) {
    event.preventDefault()
    const formData = new FormData()
    formData.append('image', currentFiles)
    formData.append('title', document.getElementById("addTitle").value)
    formData.append('category', parseInt(document.getElementById("addCategory").value))
    console.log("In POST formData=", formData, formData.title, formData.image, formData.category)
    fetch("http://localhost:5678/api/works", {
      method: 'POST',
      headers: {
        Authorization: "Bearer " + token,
      },
      body: formData
    })
      .then(response => {
        if (response.ok) {
          StatusDownlaod = true
          console.log("submit ok")
          return response.json()
        } else {
          console.log("erreur de transmission")
        }
      })
      .then(result => {
        if (StatusDownlaod) {
          console.log("...download photo ", result)
          console.log("result.imageUrl", result.imageUrl)
          console.log("result.title", result.title)
          console.log("End of submit, allWorks =", allWorks)
          currentFiles = null
          displayAddPhotoModal()
          displayGallery(result)
          // document.getElementById("validButton").disabled = true

        } else {
          console.log("erreur submit 2")
        }
      })
      .catch(error => {
        console.log("fetch error while connection, " + error + error.status)
      })
  })
  


 function fetchData() {
      fetchWorks()
      galleryHtml.innerHTML = ""
      modalGalleryHtml.innerHTML = ""
      displayGallery(allWorks)
      console.log("...update galleries")
  }

  function testField() {
    console.log("In TestField")
    const formFichier = document.getElementById("formFichier")
    const CurrentFile = formFichier.querySelector('input[type="file"]')
    const formFields = formFichier.querySelectorAll('input[type="text"], select, textarea'); // Sélectionnez tous les champs de formulaire à surveiller
    // Créez un tableau pour stocker l'état de remplissage de chaque champ de formulaire
    let fieldsFilled = Array.from(formFields).map(() => false);
    formFields.forEach((field, index) => {
      fieldsFilled[index] = field.value !== ''; // Met à jour l'état de remplissage du champ
      if ((fieldsFilled.every(filled => filled)) && (CurrentFile.files !== '')) {
        document.getElementById("validButton").disabled = false
      } else {
        document.getElementById("validButton").disabled = true
      }
      field.addEventListener('input', function () { // crée les évènement de mise à jours
        fieldsFilled[index] = field.value !== '';
        if ((fieldsFilled.every(filled => filled)) && (CurrentFile.files !== '')) {
          document.getElementById("validButton").disabled = false
        } else {
          document.getElementById("validButton").disabled = true
        }
      })
    })
    CurrentFile.addEventListener('change', function () { // crée l'évènement pour le fichier
      if ((fieldsFilled.every(filled => filled)) && (CurrentFile.files !== '')) {
        document.getElementById("validButton").disabled = false
      } else {
        document.getElementById("validButton").disabled = true
      }
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
  console.log("...the modal is loaded")
}
