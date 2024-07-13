/******** définition globales *********/
let allWorks =[];
let works =[];
const galleryHtml = document.querySelector(".gallery");

function fetchWorks() {
    fetch("http://localhost:5678/api/works/", { method: "GET" })
        .then(response => response.json())
        .then(result => {
            allWorks = result;
            workFiltered = allWorks;
            console.log("in fetch allWoks=", allWorks);
        })
        .catch(error => console.log("Fletch works Error : " + error));
}

function fetchCategories() {
    fetch("http://localhost:5678/api/categories/", { method: "GET" })
        .then(response => response.json())
        .then(result => {
            console.log("in fetch Categories=", result);
            displayCategories(result);
        })
        .catch(error => console.log("Fetch categories Error = " + error));
}

function displayCategories(categories) {
    console.log("in display categories=", categories);

    const filterHtml = document.querySelector(".filtre");
    

    categories.forEach(category => {
        console.log("in forEach : category.id", category.id);
        //création bouton catégorie (filtre)
        const buttonHtml = document.createElement("button");
        buttonHtml.innerText = category.name;
        filterHtml.appendChild(buttonHtml);
        //fonction bouton suppression works ciblées
        buttonHtml.addEventListener("click",  function() {
            console.log("in forEach : Listener ", category.id)
            //tri works
             worksFilter = allWorks.filter((workItem) => {
                return workItem.category.id === category.id;
            });
            galleryHtml.innerHTML="";
            displayGallery(worksFilter)
         });
    });
}

function displayGallery(works){
    
    works.forEach(work => {
        const figureHtml = document.createElement("figure");
        const imgHtml = document.createElement("img");
        imgHtml.src = work.imageUrl;
        const figcaptionHtml = document.createElement("figcaption");
        figcaptionHtml.innerText = work.title;
        figureHtml.appendChild(imgHtml);
        figureHtml.appendChild(figcaptionHtml);
        galleryHtml.appendChild(figureHtml);
    });
}




fetchWorks();
fetchCategories();
displayGallery(allWorks)