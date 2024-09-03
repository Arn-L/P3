/*** définitions ***/

var StatusDownlaod = false
let allWorks = []
const selectCategoriesHtml = document.getElementById("selectCategories")
const galleryHtml = document.querySelector(".gallery") // Gallerie page projet
const modalGalleryHtml = document.querySelector("#sectionGallery") // Gallerie page modale
var token = (localStorage.getItem("token"))
const logHtml = document.querySelector("#log")
const filterHtml = document.querySelector(".filtre")

/*** Affichage porjet/edition ***/

if (token != null) {
  logHtml.innerHTML = '<a href="#">logout</a>'
  logHtml.addEventListener("click", function () {
    localStorage.removeItem("token")
    location.reload()
  })
  document.querySelectorAll(".edition").forEach(target => {
    target.style.display = null
  })
  filterHtml.style.display = "none"
  token = (localStorage.getItem("token"))
} else {
  logHtml.innerHTML = '<a href="./login.html">login</a>'
}

/*** FONCTIONS pages projet***/

function fetchGetWorks() {
  fetch("http://localhost:5678/api/works/", { method: "GET" })
    .then(response => response.json())
    .then(result => {
      allWorks = result
    })
    .catch(error => console.log("Fetch works Error : " + error))
}

function fetchGetCategories() {
  fetch("http://localhost:5678/api/categories/", { method: "GET" })
    .then(response => response.json())
    .then(result => {
      displayCategories(result)
    })
    .catch(error => console.log("Fletch Categories Error = " + error))
}

function displayCategories(categories) {
  if (token === null) categories.unshift({ "id": 0, "name": "Tout" })
  categories.forEach(category => {
    if (token === null) {
      displayFilters(category)
    } else {
      // option dans formulaire modale
      const optionHtml = document.createElement("option")
      optionHtml.value = JSON.stringify(category.id)
      optionHtml.innerHTML = category.name
      selectCategoriesHtml.appendChild(optionHtml)
    }
  })
  displayGalleries(allWorks)
}

function displayFilters(category) {
  const buttonHtml = document.createElement("button")
  if (category.id === 0) {
    buttonHtml.className = "submit filterOn"
  } else {
    buttonHtml.className = "submit filterOff"
  }
  buttonHtml.innerText = category.name
  if (category.name.length < 7) {
    buttonHtml.classList.add("little")
  } else {
    buttonHtml.classList.add("big")
  }
  filterHtml.appendChild(buttonHtml)
  buttonHtml.addEventListener("click", function () {
    document.querySelectorAll(".filterOn").forEach(filterON => {
      filterON.classList.remove("filterOn")
      filterON.classList.add("filterOff")
    })
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
  })
}

function displayGalleries(works) { //projet + modale
  // création de tableau d'1 élément
  if (!Array.isArray(works)) {
    let updateWorks = [works]
    allWorks.push(works)
    works = updateWorks
  }
  let i = 0
  while (i < works.length) { // permet l'ajout 1 élt projet
    // Gallerie projet
    const work = works[i] // fetch ne supporte pas works[i].id en Url d'API !
    const figureHtml = document.createElement("figure")
    const imgHtml = document.createElement("img")
    imgHtml.src = work.imageUrl
    const figcaptionHtml = document.createElement("figcaption")
    figcaptionHtml.innerText = work.title
    figureHtml.appendChild(imgHtml)
    figureHtml.appendChild(figcaptionHtml)
    galleryHtml.appendChild(figureHtml)
    if (token != null) {
      // Gallerie modale
      const figureGMHtml = document.createElement("figure")
      const imgGMHtml = document.createElement("img")
      imgGMHtml.src = work.imageUrl
      figureGMHtml.appendChild(imgGMHtml)
      //Bouton suppression
      const buttonGMHtml = document.createElement("button")
      const trashGMHtml = document.createElement("i")
      trashGMHtml.className = "fa-solid fa-trash-can"
      figureGMHtml.appendChild(buttonGMHtml)
      buttonGMHtml.appendChild(trashGMHtml)
      modalGalleryHtml.appendChild(figureGMHtml)
      const deleteMe = function () {
        fetch("http://localhost:5678/api/works/" + work.id, {
          method: "DELETE",
          headers: { Authorization: "Bearer " + token }
        })
          .then(response => response)
          .then(result => {
            console.log("DELETE API")
          })
          .catch(error => {
            console.log("Erreur de chargement de données = " + error)
          })
        allWorks = allWorks.filter(w => w.id !== work.id)
        figureGMHtml.remove()
        figureHtml.remove()
        fetchGetWorks()
        buttonGMHtml.removeEventListener('click', deleteMe)
      }
      buttonGMHtml.addEventListener('click', deleteMe)
    }
    i += 1
  }
  console.log("End of displayGalleries")
}

/*** EXECUTION page projet ***/
fetchGetWorks()
fetchGetCategories()

/*** script modale ***/

if (token != null) {
  currentModal = null
  const modalHtml = document.querySelector("#modal")
  const formFichierHtml = document.getElementById("formFichier")
  const formFieldsHtml = formFichierHtml.querySelectorAll("input, select") // champs de formulaire à surveiller
  const modifyHtml = document.querySelector(".modify")
  modifyHtml.addEventListener("click", openModal)

  /*** FONCTIONS : ***/
  function enableModal(target) {
    if (target === null) return
    target.style.display = null
    target.removeAttribute('aria-hidden')
    target.setAttribute('aria-modal', 'true')
  }
  function disableModal(target) {
    if (target === null) return
    target.style.display = "none"
    target.setAttribute('aria-hidden', 'true')
    target.removeAttribute('aria-modal')
  }
  function displayGalleryModal() {
    disableModal(document.querySelector("#modalAddPhoto"))
    enableModal(document.querySelector("#modalGallery"))
    disableModal(document.querySelector("#jsModalBefore"))
  }

  function displayAddPhotoModal() {
    //fenêtre d'aperçue image
    previewHtml.innerHTML = `<img id="exemple" src="./assets/icons/icone-d-image-grey.png" alt="télécharger votre fichier">`
    document.querySelector(".underPhoto").style.display = 'block'
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
    // création de la fermeture modale overlay
    document.querySelector("#modal").removeEventListener('click', closeModal)
    document.querySelector("#modal").addEventListener('click', closeModal)
    document.querySelector(".modalContent").removeEventListener('click', stopPropagation)
    document.querySelector(".modalContent").addEventListener('click', stopPropagation)
    // fermeture de la modale par bouton
    document.querySelector("#jsModalClose").removeEventListener('click', closeModal)
    document.querySelector("#jsModalClose").addEventListener('click', closeModal)
    // affichage et navigation la modale
    document.querySelector("#jsModalBefore").removeEventListener('click', displayGalleryModal)
    document.querySelector("#jsModalBefore").addEventListener('click', displayGalleryModal)
    document.querySelector("#addPhotoButton").removeEventListener('click', displayAddPhotoModal)
    document.querySelector("#addPhotoButton").addEventListener('click', displayAddPhotoModal)
    currentModal = target.id
  }
  
  const closeModal = function (event) {
    event.preventDefault()
    if (currentModal === null) return
    const target = document.querySelector("aside")
    disableModal(target)
    currentModal = null
    document.querySelector("#jsModalBefore").removeEventListener('click', displayGalleryModal)
    document.querySelector("#addPhotoButton").removeEventListener('click', displayAddPhotoModal)
    document.querySelector("#jsModalClose").removeEventListener('click', closeModal)
    document.querySelector(".modalContent").removeEventListener('click', stopPropagation)
    document.querySelector("#modal").removeEventListener('click', closeModal)
  }
    const stopPropagation = function (event) { // Délimitation overlay
      event.stopPropagation()
  }

  /*** modale ajout photo ***/
  
  // source modidié https://developer.mozilla.org/fr/docs/Web/HTML/Element/input/file
  const inputHtml = document.getElementById("imageUploads")
  const previewHtml = document.querySelector(".preview")
  inputHtml.style.opacity = 0
  inputHtml.addEventListener("change", function (e) {
    if (_clickFiles) {
      completedForm("formFichier", [null, undefined, ''], "validButton", 'input, select')
      _clickFiles = false
    }
    updateImageDisplay()
  })
  function completedForm(formId, tabValues, ButtonId, entriesHtml) {
    const Fields = document.getElementById(formId).querySelectorAll(entriesHtml)
    Fields.forEach((field) => {
      field.removeEventListener('change', () => {
        testForm(Fields, tabValues, ButtonId)
      })
      field.addEventListener('change', () => {
        testForm(Fields, tabValues, ButtonId)
      })
    })
  }
  function testForm(formId, tabValues, ButtonId) {
    if (testFields(formId, tabValues)) {
      document.getElementById(ButtonId).removeAttribute("disabled")
    } else {
      document.getElementById(ButtonId).disabled = true
    }
  }
  function testFields(formId, tabValues) {
    for (var input of formId) {
      if (tabValues.includes(input.value)) {
        return false
      }
    }
    console.log("TestField...", true)
    return true
  }
  var fileTypes = [4194304, "image/jpeg", "image/pjpeg", "image/png"]
  function validFileType(file) {
    for (var i = 1; i < fileTypes.length; i++) {
      if (file.type === fileTypes[i] && file.size > 1 && file.size <= fileTypes[0]) {
        return true;
      }
    }
    if (file.size > fileTypes[0]) {
      return "fichier supérieur à " + fileTypes[0] / 1048576 + "Mo"
    } else if (file === undefined || file === '') {
      return "Aucun fichier sélectionné"
    } else {
      return "Le format du fichier n'est pas valide"
    }
  }
  
  let _clickFiles = true
  function updateImageDisplay() { // aperçu d'ajout image
    while (previewHtml.firstChild) { previewHtml.removeChild(previewHtml.firstChild); }
    currentFiles = inputHtml.files[0]
    if (validFileType(currentFiles) === true) {
      console.log("File reading")
      document.querySelector(".underPhoto").style.display = "none"
      const image = document.createElement("img")
      image.src = window.URL.createObjectURL(currentFiles)
      previewHtml.appendChild(image)
      testForm("formFichier", [null, undefined, ''], "validButton")
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
          console.log("POST API")
          return response.json()
        } else {
          console.log("erreur de chargement de l'image")
        }
      })
      .then(result => {
        if (StatusDownlaod) {
          currentFiles = null
          displayAddPhotoModal()
          displayGalleries(result)
        } else {
          console.log("erreur de chargement de l'image")
        }
      })
      .catch(error => {
        console.log("fetch error while connection, " + error + error.status)
        alert("Erreur de chargement de données = " + error)
      })
  })
}