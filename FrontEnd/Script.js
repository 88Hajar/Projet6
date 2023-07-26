
//fonction fetch work et categories
async function fetchWorksAndCategories() {
    const [worksResponse, categoriesResponse] = await Promise.all([
        fetch('http://localhost:5678/api/works'),
        fetch('http://localhost:5678/api/categories')
    ]);

    const works = await worksResponse.json(); //recuperer tous les work en json dans la constante works
    const categories = await categoriesResponse.json(); //recuperer tous les categories en json dans la constante categories

    return [works, categories]; //on retourne les constantes works et categories
}

console.log('token is ' + sessionStorage.getItem("token"));
const fil = document.getElementById('fil');
const edit = document.getElementById('edit');
const modifier1 = document.getElementById('modifier1');
const modifier2 = document.getElementById('modifier2');
const modifier3 = document.getElementById('modifier3');
const login = document.getElementById('login');

modifier1.setAttribute("class", "Pasafficher");
edit.setAttribute("class", "Pasafficher");
modifier2.setAttribute("class", "Pasafficher");
modifier3.setAttribute("class", "Pasafficher");
fil.setAttribute("class", "afficher");
let arr=[];
console.log(login.textContent);

if (sessionStorage.getItem("token") != null) {
    login.textContent = "Logout";
    modifier1.setAttribute("class", "afficher");
    modifier2.setAttribute("class", "afficher");
    modifier3.setAttribute("class", "afficher");
    edit.setAttribute("class", "edit");
    fil.setAttribute("class", "Pasafficher");
}

login.addEventListener("click", (e) => {
sessionStorage.clear();
console.log("Token is cleared "+ sessionStorage.getItem("token"));
})

fetchWorksAndCategories().then(([works, categories]) => {


    const div = document.getElementById('filtres'); //on récupere la div avec l'id filtres dans une constante div
    const list= document.getElementById('categorie');
    // fetched Categories
    for (let categorie of categories) {  /**boucle sur chaque element dans data */
        const filtre = document.createElement('li'); /*à chaque itération on créé un filtre */

        filtre.setAttribute("class", "inactive");
        filtre.innerHTML = `${categorie.name}`;
        div.appendChild(filtre);
       // console.log(categorie.name, categorie.id)
        arr.push([categorie.id,categorie.name]);
       //créé liste déroulante dans la modal ajout photo
       const option = document.createElement('option');
       option.innerHTML = `${categorie.name}`;
       list.appendChild(option);
    };

    const div2 = document.getElementById('gallery'); //on récupere la div avec l'id gallery dans une constante div2
    const gallery2 = document.getElementById('gallery2'); 
    // fetched Works
    for (let work of works) {
        const figure = document.createElement('figure'); /*à chaque itération on créé une figure */
        /**dans chaque figure on rajoute le code html avec chaque image récuperée de work */
        figure.setAttribute("id", work.category.name); //l'id de figure est le nom de la categorie
        figure.setAttribute("class", "activeimg"); //on met une class en activeimg par defaut pour afficher l'image
        figure.innerHTML = `  
                        <img src="${work.imageUrl}" alt="${work.title}" data-filter="${work.category.name}">
                        <figcaption>${work.title}</figcaption>`;
        div2.appendChild(figure); //on rajoute la figure à la constante div2
        const figure2 = document.createElement('figure');
        figure2.setAttribute("id", work.id);
        figure2.setAttribute("class", "modal-figure");
        figure2.innerHTML = `<div><div class="arrow"><i class="fa-solid fa-arrows-up-down-left-right" style="color: #ffffff;"></i></div><div  class="trash" onclick="supprimerphoto(${work.id})"><i class="fa-solid fa-trash-can" style="color: #ffffff;"></i>
        </div> <img src="${work.imageUrl}" class="modal-div"> <figcaption>éditer</figcaption> </div>`;
        gallery2.appendChild(figure2);
    };

    // récuperer tous les filtres sur la pages dans une constante filtres
    const filtres = document.querySelectorAll("#filtres li");

    for (let filtre of filtres) {
        const figures = document.querySelectorAll("#gallery figure"); //récuperer toutes les figures sur la page 

        filtre.addEventListener("click", function () { //EventListener sur click 
            let tag = this.textContent; //récuperer le texte (nom du filtre)

            filtres.forEach((filtre) => {

                filtre.setAttribute("class", "inactive");

            });
            this.className = "active";

            for (let figure of figures) {  //boucle sur les figures  
                figure.setAttribute("class", "inactiveimg"); //on met l'attribut class en activeimg pour afficher toutes les images          
                if (tag == figure.getAttribute("id") || (tag == "Tous")) { //on rajoute une condition sur le nom du filtre      

                    figure.setAttribute("class", "activeimg");  //on change la class en activeimg pour afficher les images qui corespondent au filtre
                }

            }
        });




    };


}).catch(error => {
    console.log("erreur fetch"); // afficher une erreur si probleme de fetch des categories ou des works
});


const modal= document.getElementById('id01');

const container = document.getElementById('container');
document.addEventListener("mouseup", function(event) {
    if (!container.contains(event.target)) {
        modal.style.display='none';
    }
})

const w3container = document.getElementById('w3container');
w3container.addEventListener("click", function(){
    modal.style.display='none';
    window.location = window.location;
})

function fonctionmodal(){
    console.log("j'ai clické sur modifier");
    modal.style.display='block';

    
 //   dialog::backdrop {
     //   background: rgba(*, *, *, *);
   //   }

}

const modal2= document.getElementById('id02');

function ajouterphoto(){
    modal.style.display='none';
    modal2.style.display='block';
}

const ajouter = document.getElementById("ajouterphoto");

ajouter.addEventListener("click", function(){
    ajouterphoto();
})

const input = document.getElementById("btnupload");
const icon = document.getElementById("icon");
const output = document.getElementById("upload");
var types = ["jpg","png"];
let imagesArray = [];
let urlimg="";

input.addEventListener("change", function() {
    const file = input.files;
    //console.log(file.type,types.includes(file.type) );
    
   // Vérification de taille de l'image"
  if (file[0].size <= 4096*1024) {

    icon.style.display='none';
    // On affiche l'image sur la page ...
    imagesArray.push(file[0]);
    let images = "";
    imagesArray.forEach((image, index) => {
    urlimg=URL.createObjectURL(image);
    images += `
            <img src="${urlimg}" id="newimage" class="newimg">
            `
        })
    output.innerHTML = images; //Ajouter l'image au modal2

}   
else {
    alert("La taille de l'image doit être < à 4Mo");
}
})



function supprimerphoto(i){

const thiselement = document.getElementById(i);

console.log('http://localhost:5678/api/works/'+i," token is: ",sessionStorage.getItem("token" ));

fetch(`http://localhost:5678/api/works/`+i, {
    method: 'DELETE',
    headers: { 
        'Authorization': 'Bearer '+ sessionStorage.getItem("token")
    }

})
.then (function (response){
    if (response.ok) {
        console.log("delete ok");
        thiselement.remove();
        //rafraichir la modal
       // modal.style.display='none';
        //modal.style.display='block';
      
    }
else {
    console.log("erreur de suppression");
}
})
.catch(function(error){
    console.log("Bug")
})
}

const fermer = document.getElementById("fermer");
fermer.addEventListener("click",()=> {
    document.getElementById('id02').style.display='none';
    input.files[0]="";
});


modifier1.addEventListener("click",()=> {
    fonctionmodal();
});
modifier2.addEventListener("click",()=> {
    fonctionmodal();
});
modifier3.addEventListener("click",()=> {
    fonctionmodal();
});

const back = document.getElementById("back");
back.addEventListener("click",()=>{

    modal2.style.display='none';
    modal.style.display='block';
});



//Fonction Ajouter Photo

const titre = document.getElementById("titre");
const cat = document.getElementById("categorie");
const bntvalider= document.getElementById("valider");
input.addEventListener("change", buttonState);
const photo = imagesArray;

bntvalider.disabled=true;

titre.addEventListener("keyup", buttonState);
cat.addEventListener("change", buttonState);

function buttonState() {
    if ((titre.value !== "") && (cat.value !== "vide") && (photo.length !== 0) ) {
        bntvalider.disabled = false; // enable the button once the input field has content
        bntvalider.style.background="#1D6154";
    } else {
        bntvalider.disabled = true; // return disabled as true whenever the input field is empty
        bntvalider.style.background="#A7A7A7";
    }
}
// fetch envoi de nouvelle photo

bntvalider.addEventListener("click", function (e) {
    e.preventDefault();

console.log(input.files[0]);
const imageUrl = input.files[0];
//console.log(imageUrl);
//console.log(photo[0].name);
const form = new FormData();
const userId = "1";
form.append('image',imageUrl);
form.append('title',titre.value);
for (let categorie of arr) {
    if (categorie[1] === cat.value){
        form.append("category",categorie[0]);
    }
}
//form.append('userId', userId);
console.log("form is", form);
fetch('http://localhost:5678/api/works', {
    method: 'POST',
    body: form,
    headers: {
        //'accept': 'application/json',
        'authorization': 'Bearer '+ sessionStorage.getItem("token"),
       // 'Content-Type': 'multipart/form-data'
    }
})
.then(res => {
    if (res.ok) { 
        modal2.style.display='none';
        window.location = window.location;
        //location.reload(true);
        //fetchWorksAndCategories()
  }
})

});