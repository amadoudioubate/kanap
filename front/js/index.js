/**
 * Affiche les données du produit en injectant html dans la page d'acceuil 
 * @param {Product} product 
 */
const displayToProduct = product =>{
    // Création des éléments html
    let linkElt = document.createElement("a");
    let articleElt = document.createElement("article");
    let imgElt = document.createElement("img");
    let nameElt = document.createElement("h3");
    let descriptionElt = document.createElement("p");
            
    // Création des attributs associés aux éléménts html crées 
    linkElt.setAttribute("href",`../html/product.html?id=${product._id}`);
    imgElt.setAttribute("src", product.imageUrl);
    imgElt.setAttribute("alt", product.altTxt);
    nameElt.setAttribute("class", "productName");
    descriptionElt.setAttribute("class", "productDescription");

    // Ajout des éléments enfants sur les éléments parents
    articleElt.appendChild(imgElt);
    articleElt.appendChild(nameElt);
    articleElt.appendChild(descriptionElt);
    linkElt.appendChild(articleElt);
    // Selection de l'id de l'items, puis ajouter l'élément linkElt dessus
    document.getElementById('items').appendChild(linkElt);
     // Ajout du contenu dans les éléments html       
    nameElt.innerText = product.name;
    descriptionElt.innerText = (product.description).substr(0,45)+"...";
}

/**
 * affiche le message d'erreur
 * @param {ItemHTML} elt 
 * @param {string} txtError 
 */
const displayToMessageError = (elt,txtError) => {
    let errors = document.createElement('p');
    errors.setAttribute('class', 'errors');
    errors.innerText = txtError;
    elt.appendChild(errors);
}

/**
 * Affiche les produits dans la page d'acceuil
 */
async function loadProduct() {
    fetch('http://localhost:3000/api/products')
    .then(reponse => reponse.json())
    .then(data => {
        // Parcourir les données retournées et les afficher 
        for(let dataProduct of data) {
            displayToProduct(dataProduct);
            console.table(dataProduct);
        }
    })
    .catch (() => { // si fetch se passe mal
        alert("Attention votre serveur en local Nodejs n'est pas lancé, veuillez contacter l'administrateur du site");
        displayToMessageError(document.getElementById('items'),"Nous sommes désolés aucun produit n'est disponible, veuillez réessayer ultérieurement");
    })
}
loadProduct();