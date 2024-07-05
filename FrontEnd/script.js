

function fetchCategories(){
    fetch("http://localhost:5678/api/categories/",{
        method:"GET"
    })
    .then(response =>  response.json())
    .then(result => {
        console.log("in fetch Categories=",result);
        displayCategories(result);

    })
    .catch(error => console.log("Erreur : " + error));
}

function displayCategories(categories){
    const filtreHtml = document.querySelector(".filtre");
    console.log("in dispay categories=",categories);
    categories.forEach(category => {
        const boutonHtml = document.createElement("button");
        boutonHtml.innerText=category.name;
        filtreHtml.appendChild(boutonHtml);
    });
    
}

fetchCategories();

function fetchWorks(){
    fetch("http://localhost:5678/api/works/",{
        method:"GET"
    })
    .then(response =>  response.json())
    .then(result => {
        console.log("in fetch woks=",result);
        displayWorks(result);

    })
    .catch(error => console.log("Erreur : " + error));
}

function displayWorks(works){
    const galleryHtml = document.querySelector(".gallery");
    console.log("in dispay works =",works);
    works.forEach(work => {
        const figureHtml = document.createElement("figure");
        const imgHtml = document.createElement("img");
        imgHtml.src= work.imageUrl;
        const figcaptionHtml = document.createElement("figcaption");
        figcaptionHtml.innerText=work.title;
        figureHtml.appendChild(imgHtml);
        figureHtml.appendChild(figcaptionHtml);
        galleryHtml.appendChild(figureHtml);
        
    
    })
}

fetchWorks();
