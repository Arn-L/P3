console.log("the modal is loading...")
currentModal = null

function openModal(event) {
    event.preventFefautl()
    const target = document.querySelector(event.target.getAttribute('href'))
    target.style.display = null
    target.removeAttribute('aria-hidden')
    target.setAttribute('aria-modal', 'true')
    currentModal = target
    currentModal.addEventListener('clic', closeModale)
    //log
    console.log("the modal is opened...")
}

const closeModal = function (event){
    if (modal === null) return
    event.preventDefault()
    currentModal.style.display = "none"
    currentModal.setAttribute('aria-hidden', "true")
    currentModal.removeAttribute('aria-modal')
    currentModal = null
    //log
    console.log("the modal is closed...")
}

    closeBtn.addEventListener("click", function () {
       
        modal.style.display = "none"
    })
    
    console.log("...the modal is loaded")