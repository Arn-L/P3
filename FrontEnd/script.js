console.log("loading script...")

/******** définitions *********/
var _download = true
var StatusDownlaod = false
let allWorks = []
const selectCategoriesHtml = document.getElementById("selectCategories")
const galleryHtml = document.querySelector(".gallery") // Gallerie page projet
const modalGalleryHtml = document.querySelector("#sectionGallery") // Gallerie page modale

/**** initialisation ****/
var token = (localStorage.getItem("token"))
console.log("In JS, token storage=", token)// !!! code doit bien sûr être enlevé !!!

// HTML CONDITIONNEL: Affichage page principale
const logHtml = document.querySelector("#log")
const filterHtml = document.querySelector(".filtre")
if (token != null) {
  //menu navigation affichage & écoute logout
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
  // récupération du token
  token = (localStorage.getItem("token"))
  console.log("logout -> token storage=", token)
} else {
  //menu navigation affichage login
  logHtml.innerHTML = '<a href="./login.html">login</a>'
}

// FONCTION: Chargement travaux dans allWorks puis fonction Chargement_catégories
function fetchGetWorks() {
  fetch("http://localhost:5678/api/works/", { method: "GET" })
    .then(response => response.json())
    .then(result => {
      allWorks = result
      console.log("in fetchGetWorks, allWoks=", allWorks)
    })
    .catch(error => console.log("Fetch works Error : " + error))
}

// FONCTION: Chargement puis fonction Configuration_des_catégories
function fetchGetCategories() {
  fetch("http://localhost:5678/api/categories/", { method: "GET" })
    .then(response => response.json())
    .then(result => {
      console.log("in fetchGetCategories, result=", result)
      displayCategories(result)
    })
    .catch(error => console.log("Fetch categories Error = " + error))
}
// SOUS-FONCTION: Configuration des catégories puis fonction Configuration_galleries
function displayCategories(categories) {
  console.log("in displayCategories, categories=", categories)
  if (token === null) categories.unshift({ "id": 0, "name": "Tout" })
  categories.forEach(category => {
    if (token === null) {
      // Configuration des filtres
      displayFilters(category)
    } else {
      // options de sélecteur catégories pour modale ajout photo
      const optionHtml = document.createElement("option")
      optionHtml.value = JSON.stringify(category.id)
      optionHtml.innerHTML = category.name
      selectCategoriesHtml.appendChild(optionHtml)
    }
  })
  // Initialise la gallerie projet
  displayGalleries(allWorks)
}
// SOUS-FONCTION: Configuration d'un filtre
function displayFilters(category) {
  const buttonHtml = document.createElement("button")
  if (category.id === 0) {
    buttonHtml.className = "submit filterOn"
  } else {
    buttonHtml.className = "submit filterOff"
  }
  buttonHtml.innerText = category.name
  filterHtml.appendChild(buttonHtml)
  //évènement bouton filtre ciblées par catégories
  buttonHtml.addEventListener("click", function () {
    // efface toutes les couleurs boutons
    document.querySelectorAll(".filterOn").forEach(filterON => {
      filterON.classList.remove("filterOn")
      filterON.classList.add("filterOff")
    })
    // active la couleur bouton du filtre
    buttonHtml.classList.add("filterOn")
    //tri works
    if (category.id === 0) {
      worksFilter = allWorks
    } else {
      worksFilter = allWorks.filter((workItem) => {
        return workItem.category.id === category.id
      })
    }
    // affichage filtré
    galleryHtml.innerHTML = ""
    displayGalleries(worksFilter)
    console.log("filter =", category.name)
  })
  console.log("Configuration filter", category.name, "ok")
}

// FONCTION configuration des galleries (projet et modales)
function displayGalleries(works) {
  /******************************************************
   * Construit la gallerie projet
  *  En mode édition :
  *        construit la gallerie modale
  *        la suppression de photos
  *        Prévois l'ajout de projet supplémentaire
  *******************************************************/
 
  console.log("displayGalleries : works =", works)
  // création de tableau d'1 élément pour ajout projet
  if (!Array.isArray(works)) {
    let updateWorks = [works]
    allWorks.push(works)
    works = updateWorks
  }
  let i = 0
  while (i < works.length) { // permet l'ajout 1 élt
    // HTML de la gallerie courante
    const work = works[i] // fetch ne supporte pas works[i].id en Url d'API !
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
      // FONCTION de suppression
      const deleteMe = function () {
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
        fetchGetWorks()
        // suppresion de l'écoute poubelle, après suppression
        buttonGMHtml.removeEventListener('click', deleteMe)
      }
      // ecoute de l'évènement poubelle
      buttonGMHtml.addEventListener('click', deleteMe)
    }
    i += 1
  }
  //log
  console.log("End of displayGalleries : works =", works)
}

if (_download) {
  _download = !_download
  console.log("-------- download main page script completed ! ----------")
}

fetchGetWorks()
fetchGetCategories()



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
  const formFichierHtml = document.getElementById("formFichier")
  const formFieldsHtml = formFichierHtml.querySelectorAll("input, select") // champs de formulaire à surveiller
  

  // Bouton [modifier] page édition
  const modifyHtml = document.querySelector(".modify")
  modifyHtml.addEventListener("click", openModal)

  /**** gestion contenu de la modale ****/
  // SOUS-FONCTION: activation balise Html
  function enableModal(target) {
    if (target === null) return
    target.style.display = null
    target.removeAttribute('aria-hidden')
    target.setAttribute('aria-modal', 'true')
  }
  // SOUS-FONCTION: Désactivation balise Html
  function disableModal(target) {
    if (target === null) return
    target.style.display = "none"
    target.setAttribute('aria-hidden', 'true')
    target.removeAttribute('aria-modal')
  }
  // SOUS-FONCTION: affichage modale gallerie
  function displayGalleryModal() {
    disableModal(document.querySelector("#modalAddPhoto"))
    enableModal(document.querySelector("#modalGallery"))
    disableModal(document.querySelector("#jsModalBefore"))
  }
  // SOUS-FONCTION: affichage modale ajout photo
  function displayAddPhotoModal() {
    //Initialisation de la modale ajout projet
    previewHtml.innerHTML = `<img id="exemple" src="./assets/icons/icone-d-image-grey.png" alt="télécharger votre fichier">`
    formFichierHtml.querySelectorAll('input, select').forEach((field) => { field.value = "" })
    _clickFiles = true // initialise la condition de requête submit
    document.getElementById("validButton").disabled = true
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
    // création de la fermeture modale overlay
    document.querySelector("#modal").addEventListener('click', closeModal)
    document.querySelector(".modalContent").addEventListener('click', stopPropagation)
    // fermeture de la modale par bouton
    document.querySelector("#jsModalClose").addEventListener('click', closeModal)
    // navigation des pages gallerie et ajout de la modale
    document.querySelector("#jsModalBefore").addEventListener('click', displayGalleryModal)
    document.querySelector("#addButton").addEventListener('click', displayAddPhotoModal)
    //log
    console.log("in openModal, target =", target)
    console.log("the ", target.id, " is opened...")
    currentModal = target.id
  }

  // SOUS-FONCTION: Délimitation overlay
  const stopPropagation = function (event) {
    event.stopPropagation()
  }

  // FONCTION: fermeture modale
  const closeModal = function (event) {
    event.preventDefault()
    if (currentModal === null) return
    console.log("listen click =", event.target)
    const target = document.querySelector("aside")
    disableModal(target)
    console.log("the ", target.id, " is closed...")
    currentModal = null
    // suppression des écoutes d'évènements
    document.querySelector("#jsModalBefore").removeEventListener('click', displayGalleryModal)
    document.querySelector("#addButton").removeEventListener('click', displayAddPhotoModal)
    document.querySelector("#jsModalClose").removeEventListener('click', closeModal)
    document.querySelector(".modalContent").removeEventListener('click', stopPropagation)
    document.querySelector("#modal").removeEventListener('click', closeModal)
  }

  /*** source modidié https://developer.mozilla.org/fr/docs/Web/HTML/Element/input/file ***/
  // Initialisation de l'input de téléchargement fichier
  const inputHtml = document.getElementById("imageUploads")
  const previewHtml = document.querySelector(".preview")
  inputHtml.style.opacity = 0
  // écoute d'évènement de téléchargement
  var currentFiles // fichiers photo à ajouter
  inputHtml.addEventListener("change", function (e) {
    console.log("In input event click currentFiles=", currentFiles)
    if (_clickFiles) {
      completedForm("formFichier", [null, undefined, ''], "validButton", 'input, select')
      _clickFiles = false
    }
    updateImageDisplay()
  })

function completedForm(formId, tabValues, ButtonId, entriesHtml) {
  console.log("In completedForm, entriesHtml=", entriesHtml)
  const Fields = document.getElementById(formId).querySelectorAll(entriesHtml) 
  Fields.forEach((field) =>{
    field.addEventListener('change', () =>{
  testForm(Fields, tabValues, ButtonId)
    })
  })
}

function initCompletedForm(formId, tabValues, ButtonId, entriesHtml ) {
  document.getElementById(formId).querySelectorAll(entriesHtml).forEach((field) =>{
    field.removeEventListener('change', () =>{
  testForm(formId, tabValues, ButtonId)
  field.value = forceTab(tabValues)[0]
    })
  })
  document.getElementById(ButtonId).disabled = true
}

  function testForm(formId, tabValues, ButtonId ) {
    console.log("In testForm, formId=",formId)
    if(testFields(formId, tabValues)) {
      document.getElementById(ButtonId).removeAttribute("disabled")
    } else {
      document.getElementById(ButtonId).disabled = true
    }
  }

  function testFields(formId, tabValues) {
    for (var input of formId) {
      console.log("input", input.id,"=", input.value)
      if (tabValues.includes(input.value)) {
        console.log("TestField...", false)
        return false}
      }
      console.log("TestField...", true)
    return true
  }
  // SOUS-FONCTION: validité du type de fichier
  var fileTypes = [4194304, "image/jpeg", "image/pjpeg", "image/png"]
  function validFileType(file) {
    for (var i = 1; i < fileTypes.length; i++) {
      if (file.type === fileTypes[i] && file.size >1 && file.size <= fileTypes[0]) {
        return true;
      }
    }
    if (file.size > fileTypes[0]) {
      return "fichier supérieur à "+ fileTypes[0]/1048576+"Mo"
    } else if (file === undefined || file === '') {
      return "Aucun fichier sélectionné"
    } else {
      return "Le format du fichier n'est pas valide"
    }
  }

  // FONCTION: Gestion affichage aperçu d'ajout image
  let _clickFiles = true
  function updateImageDisplay() {
    while (previewHtml.firstChild) { previewHtml.removeChild(previewHtml.firstChild); }
    currentFiles = inputHtml.files[0]
    console.log("In updateImageDisplay, currentFiles= inputHtml.files[0] :", currentFiles)
    if (validFileType(currentFiles) === true) {
      console.log("lecture du fichier")
      //apperçu img
      const image = document.createElement("img")
      image.src = window.URL.createObjectURL(currentFiles)
      previewHtml.appendChild(image)
    } else {
      const paraHtml = document.createElement("p")
      paraHtml.innerText = validFileType(currentFiles)
      previewHtml.appendChild(paraHtml)
    }
  }

  
  






  formFichierHtml.addEventListener("submit", (event) => {
    event.preventDefault()
    const formData = new FormData()
    formData.append('image', currentFiles)
    formData.append('title', document.getElementById("addTitle").value)
    formData.append('category', parseInt(document.getElementById("selectCategories").value))
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
          displayGalleries(result)
          // document.getElementById("validButton").disabled = true
        } else {
          console.log("erreur submit 2")
        }
      })
      .catch(error => {
        console.log("fetch error while connection, " + error + error.status)
      })
  })

  
  console.log("...the modal is loaded")

}




/*
  function forceTab(tab1, tab2 = null) {
    if (Array.isArray(tab2)) {
      if (Array.isArray(tab2[0])) {
        return tab2.push(forceTab(tab1))
      } else {
        return tab2.push(tab1)
      }
    } else if (tab2 !== null) {
      if (!Array.isArray(tab1)) {
        return [tab1,  tab2]
      } else {
        return tab1.push(tab2)
      }
    } else {
      if (!Array.isArray(tab1)) {
        let updateTab = [tab1]
        tab1 = updateTab
      }
      return tab1
    }
  }
*/