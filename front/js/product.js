/**
 * Récupère le panier dans le localStorage
 * @returns {[Object]} le panier sous forme d'objet ou un tableau vide
 */
function getLocalStorage() {
    let productInLocalStorage = localStorage.getItem("product");
    return (productInLocalStorage != null) ? JSON.parse(productInLocalStorage) : [];
}

/**
 * fonction pour injecter html et les données du produit dans la page d'acceuil
 * @param {Product} product le produit à afficher 
 */
const displayToProduct = product => {
    // Initialisation option couleur
    let optionColor = "";
    
    //Création des éléments html
    let imgItem = document.querySelector('.item__img');
    let titleItem = document.getElementById('title');
    let priceItem = document.getElementById('price');
    let descriptionItem = document.getElementById('description');
    let colorsSelectItem = document.getElementById('colors');
    let img = document.createElement('img');
    
    // Création des attributs associés aux éléménts html crées
    img.setAttribute("src", product.imageUrl);
    img.setAttribute("alt", product.altTxt);
    // Ajout de l'élément image dans l'élément image item
    imgItem.appendChild(img);
    // Ajout du contenu dans les éléments html
    titleItem.innerText = product.name;
    priceItem.innerText = product.price;
    descriptionItem.innerText = product.description;
    // On parcourt les couleurs du produit ,puis on les ajoute dans option couleur
    product.colors.forEach(colors => {
        optionColor +=`<option value="${colors}">${colors}</option>`;
    });    
    // On ajoute optionColor à la fin de l'élémént colorsSelectItem
    colorsSelectItem.insertAdjacentHTML("beforeend", optionColor); 
      
}

/**
 * Affiche un message d'erreur  
 * @param {ItemHTML} itemError l'élement html
 * @param {string} txtError le texte à afficher dans l'élément html
 */
const displayToMessageError = (itemError,txtError) => {
    let errorsItem = document.createElement('p');
    errorsItem.setAttribute('class', 'errors');
    errorsItem.innerText = txtError;
    itemError.appendChild(errorsItem);
}

/**
 * Affiche fenêtre pop-up quand un produit est ajouté
 * @param {int} quantity la quantité du produit
 * @param {string} name le nom du produit
 * @param {string} color la couleur du produit
 */
const ConfirmationAddProduct = (quantity,name,color) =>{
    if(window.confirm(`Votre commande de ${quantity} ${name} ${color} est ajoutée au panier
    Pour consulter votre panier, cliquez sur OK`)){
        window.location.href ="cart.html";
    }
}

/**
 * Ajoute un produit au panier ou augmente sa quantité s'il est déjà présent
 * @param {Product} product le produit à ajouter au panier
 */
const addProduct = product =>{
    let itemMessageError = document.querySelector(".item__message__error");
    let itemConfirmation = document.querySelector(".item__confirmation");
    let quantity = document.getElementById('quantity').value; 
    let colorSelected = document.getElementById('colors').value;
    
    // Vérification de la selection d'une couleur
    if(document.getElementById('colors').value !== ""){
        // Vérification si la quantité choisie est supérieure à 0 et inférieure ou égale à 100
        if(quantity >0 && quantity <=100){
            // Si oui, on crée l'objet products
            let products = {
                id: product._id,
                name: product.name,
                imageUrl: product.imageUrl,
                altTxt: product.altTxt,
                colorSelected: colorSelected,
                quantity: parseInt(quantity),
                price: product.price
            };

            let productInLocalStorage = getLocalStorage();
            console.table(productInLocalStorage);
            //Vérification de la présence du produit dans le localStorage
            if(productInLocalStorage != null){
                let resultFound = productInLocalStorage.find(p => p.id == products.id && p.colorSelected == products.colorSelected);
                console.log(resultFound);
                // Si le produit commandé est déja dans le panier
                if(resultFound != null){
                    resultFound.quantity = parseInt(products.quantity) + parseInt(resultFound.quantity);
                    localStorage.setItem("product", JSON.stringify(productInLocalStorage));
                    console.table(productInLocalStorage);
                    itemMessageError.style = "display:none";
                    ConfirmationAddProduct(quantity,products.name,colorSelected);
                }else{ // Si le produit n'est pas dans le panier
                    productInLocalStorage.push(products);
                    localStorage.setItem("product", JSON.stringify(productInLocalStorage));
                    console.table(productInLocalStorage);
                    itemMessageError.style = "display:none";
                    ConfirmationAddProduct(quantity,products.name,colorSelected);  
                }
            }else{//Si local storage vide 
                productInLocalStorage.push(products);
                localStorage.setItem("product", JSON.stringify(productInLocalStorage));
                console.table(productInLocalStorage);
                itemMessageError.style = "display:none";
                ConfirmationAddProduct(quantity,products.name,colorSelected); 
            }  
        }else{ // Si la quantité choisie n'est pas comprise entre 1-100
            itemConfirmation.style = "display:none";
            MessageErrorItem(itemMessageError,"La quantité doit être comprise entre 1-100");
        }        
    }else{// Si aucune couleur n'est sélectionnée
        itemConfirmation.style = "display:none";
        MessageErrorItem(itemMessageError,"Veuillez selectionné une couleur");
    }   
}

/**
 * Affiche un message d'erreur si la quantité ou couleur selectionné ne correspond pas 
 * @param {ItemHTML} elt l'élément html
 * @param {string} txt le texte à afficher dans l'élément html
 */
const MessageErrorItem = (elt,txt) =>{
    elt.innerHTML = txt;
    elt.style = "display:flex;justify-content:center;align-items:center";
}

/**
 *  Affiche un produit selectionné dans la page produit selon son id
 */
async function loadProduct(){
    let item = document.querySelector('.item')
    //Récuperer les données de l'URL
    let searchParams = new URLSearchParams(window.location.search);

    //Si le paramètre id existe
    if(searchParams.has('id')){
        let idProduct = searchParams.get("id");
        fetch(`http://localhost:3000/api/products/${idProduct}`)
            .then(response => response.json())
            .then(data => {
                //Affichage dynamique du nom de produit comme titre de la page
                document.title = data.name;
                //Appel de la fonction displayToProduct
                displayToProduct(data);
                //On écoute le bouton ajouter au panier
                document.getElementById('addToCart').addEventListener('click', event =>{
                    event.preventDefault();
                    addProduct(data);      
                })
            })
            .catch (() => {
                document.querySelector('.item article').remove();
                displayToMessageError(item,"Veuillez-nous excuser une erreur s'est produite , réessayer plus tard");
            })
    }else{
        window.location.href = "../html/index.html";
    }
}

loadProduct();