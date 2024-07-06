//définition variables globales
let filtreTabDisplay =[];


function fetchCategories(){
    fetch("http://localhost:5678/api/categories/",{ method:"GET" })
    .then(response =>  response.json())
    .then(result => {
        console.log("in fetch Categories=",result);
        displayCategories(result);
    })
    .catch(error => console.log("Flech Error : " + error));
}

function displayCategories(categories){
    const filtreHtml = document.querySelector(".filtre");
    console.log("in dispay categories=",categories);
    categories.forEach(category => {
        const boutonHtml = document.createElement("button");
        boutonHtml.id = category.id.toString(10);
        boutonHtml.innerText=category.name;
        filtreHtml.appendChild(boutonHtml);
        filtreTabDisplay[boutonHtml.id]=true;
        boutonHtml.addEventListener("click", function (category) {
            filtreTabDisplay[boutonHtml.id] = ! filtreTabDisplay[boutonHtml.id];
            console.log("Button ", boutonHtml.id, ": display=",filtreTabDisplay[boutonHtml.id]);
            location.reload();
            //const boutonTarget = filtreHtml.getElementById(boutonHtml.id);
            
            if (filtreTabDisplay[boutonHtml.id]){
                //boutonTarget.style.backgroundColor = "green";
            } else {
                //boutonTarget.style.backgroundColor = "transparent";
                document.querySelector(boutonHtml.id).innerHTML = '';

            };
            

        });
    });
}

fetchCategories();

function fetchWorks(){
    fetch("http://localhost:5678/api/works/",{ method:"GET" })
    .then(response =>  response.json())
    .then(result => {
        console.log("in fetch woks=",result);
        displayWorks(result);

    })
    .catch(error => console.log("Flech Error : " + error));
}

function displayWorks(works){
    const galleryHtml = document.querySelector(".gallery");
    console.log("in dispay works =", works);
    works.forEach(work => {
        //console.log(work.category.id)
        if (filtreTabDisplay[work.category.id]) {
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
