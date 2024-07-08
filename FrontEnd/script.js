/******** définition globales *********/
let filtreArrayDisplay = [];


function fetchCategories() {
    fetch("http://localhost:5678/api/categories/", { method: "GET" })
        .then(response => response.json())
        .then(result => {
            console.log("in fetch Categories=", result);
            displayCategories(result);
        })
        .catch(error => console.log("Flech Error : " + error));
}

function displayCategories(categories) {
    const filtreHtml = document.querySelector(".filtre");
    console.log("in dispay categories=", categories);
    categories.forEach(category => {
        const boutonHtml = document.createElement("button");
        boutonHtml.innerText = category.name;
        filtreHtml.appendChild(boutonHtml);
        filtreArrayDisplay[category.id] = true;
        var categoryId = category.id;
        console.log("in forEach : category", category);
        boutonHtml.addEventListener("click", function (category) {
            filtreArrayDisplay[categoryId] = !filtreArrayDisplay[categoryId];
            console.log("in EventListener : category=", category, "categoryId", categoryId, filtreArrayDisplay[categoryId]);
            galleryHtml = document.querySelector(".gallery");
            galleryHtml.innerHTML="";
            fetchWorks();
        });
    });
}

fetchCategories();

function fetchWorks() {
    fetch("http://localhost:5678/api/works/", { method: "GET" })
        .then(response => response.json())
        .then(result => {
            console.log("in fetch woks=", result);
            displayWorks(result);

        })
        .catch(error => console.log("Flech Error : " + error));
}

function displayWorks(works) {
    const galleryHtml = document.querySelector(".gallery");
    console.log("in dispay works =", works);
    works.forEach(work => {
        //console.log(work.category.id)
        if (filtreArrayDisplay[work.category.id]) {
            const figureHtml = document.createElement("figure");
            const imgHtml = document.createElement("img");
            imgHtml.src = work.imageUrl;
            const figcaptionHtml = document.createElement("figcaption");
            figcaptionHtml.innerText = work.title;
            figureHtml.appendChild(imgHtml);
            figureHtml.appendChild(figcaptionHtml);
            galleryHtml.appendChild(figureHtml);
        }
    });
}

fetchWorks();






/*** connexion ****/


