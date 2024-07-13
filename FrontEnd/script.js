/******** définition globales *********/
//let filtreArrayDisplay = [];
let allWorks =[]; 
workFiltered = [];
var categoryId = [];


function fetchWorks() {
    fetch("http://localhost:5678/api/works/", { method: "GET" })
        .then(response => response.json())
        .then(result => {
            allWorks = result;
            workFiltered = allWorks;
            console.log("in fetch allwoks=", allWorks);
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
    const filterHtml = document.querySelector(".filtre");
    console.log("in dispay categories=", categories);
    categories.forEach(category => {
        const buttonHtml = document.createElement("button");
        buttonHtml.innerText = category.name;
        filterHtml.appendChild(buttonHtml);
        //filterArrayDisplay[category.id] = true;
        categoryId = category.id;
        
        console.log("in forEach : categoryId", categoryId);

        buttonHtml.addEventListener("click",  (category) => {
           //filterArrayDisplay[categoryId] = !filterArrayDisplay[categoryId];
            console.log("in EventListener : category=", category, "categoryId", categoryId);
            galleryHtml = document.querySelector(".gallery");
            galleryHtml.innerHTML="";
            workFiltered = allWorks.filter((workItem) => {
                console.log( "in EventListener workItem=",workItem.category.id);
                return workItem.category.id === category.id;
                console.log("workfiltred =", workFiltered, "allworks =",allWorks);

            displayWorks(workFiltered);

            });
            
        });

    });
    displayWorks(allWorks);
}

function displayWorks(works) {
    const galleryHtml = document.querySelector(".gallery");
    console.log("in dispay works =", works);
    works.forEach(work => {
        //console.log(work.category.id)
        //if (filtreArrayDisplay[work.category.id]) {
        
            const figureHtml = document.createElement("figure");
            const imgHtml = document.createElement("img");
            imgHtml.src = work.imageUrl;
            const figcaptionHtml = document.createElement("figcaption");
            figcaptionHtml.innerText = work.title;
            figureHtml.appendChild(imgHtml);
            figureHtml.appendChild(figcaptionHtml);
            galleryHtml.appendChild(figureHtml);
        //}
    });
}

fetchWorks();
fetchCategories();