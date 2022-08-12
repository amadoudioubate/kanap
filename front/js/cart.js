/**
 * Récupère les données dans le localStorage
 * @returns {tableau d'Object}
 */
const getLocalStorage = () =>{
   return localStorage.getItem("product") ? JSON.parse(localStorage.getItem("product")) : [];
}
console.table(getLocalStorage());

/**
* Affiche les données du produit en injectant le HTML
* @param {Object} product 
*/
const displayToCart = product =>{
    // Création des éléments html
    let cartItem = document.createElement('article');
    let cartItemImg = document.createElement('div');
    let imgItem = document.createElement('img');
    let cartItemContent = document.createElement('div');
    let cartItemContentTitlePriceColor = document.createElement('div');
    let nameItem = document.createElement('h2');
    let colorItem = document.createElement('p');
    let priceItem = document.createElement('p');
    let cartItemContentSettings = document.createElement('div');
    let cartItemContentSettingsQuantity = document.createElement('div');
    let qte = document.createElement('p');
    let itemInputQuantity = document.createElement('input');
    let cartItemContentSettingsDelete = document.createElement('div');
    let deleteItem = document.createElement('p');

    // Création des attributs associés aux éléménts html crées 
    cartItem.setAttribute('class','cart__item');
    cartItem.setAttribute('data-id',product.id)
    cartItemImg.setAttribute('class','cart__item__img');
    imgItem.setAttribute('src',product.imageUrl);
    imgItem.setAttribute('alt',product.altTxt);
    cartItemContent.setAttribute('class','cart__item__content');
    cartItemContentTitlePriceColor.setAttribute('class','cart__item__content__titlePrice');
    cartItemContentSettings.setAttribute('class','cart__item__content__settings');
    cartItemContentSettingsQuantity.setAttribute('class','cart__item__content__settings__quantity');
    itemInputQuantity.setAttribute('type','number');
    itemInputQuantity.setAttribute('class','itemQuantity');
    itemInputQuantity.setAttribute('name','itemQuantity');
    itemInputQuantity.setAttribute('min','1');
    itemInputQuantity.setAttribute('max','100');
    itemInputQuantity.setAttribute('value',product.quantity);
    cartItemContentSettingsDelete.setAttribute('class','cart__item__content__settings__delete');
    deleteItem.setAttribute('class','deleteItem');

    // Ajout des éléments enfants sur les éléments parents
    document.getElementById('cart__items').appendChild(cartItem);
    cartItem.appendChild(cartItemImg);
    cartItem.appendChild(cartItemContent);
    cartItemImg.appendChild(imgItem);
    cartItemContent.appendChild(cartItemContentTitlePriceColor);
    cartItemContent.appendChild(cartItemContentSettings);
    cartItemContentTitlePriceColor.appendChild(nameItem);
    cartItemContentTitlePriceColor.appendChild(colorItem);
    cartItemContentTitlePriceColor.appendChild(priceItem);
    cartItemContentSettings.appendChild(cartItemContentSettingsQuantity);
    cartItemContentSettings.appendChild(cartItemContentSettingsDelete);
    cartItemContentSettingsQuantity.appendChild(qte);
    cartItemContentSettingsQuantity.appendChild(itemInputQuantity);
    cartItemContentSettingsDelete.appendChild(deleteItem);
        
    //Ajout du contenu sur les éléments html
    nameItem.innerText = product.name;
    colorItem.innerText = product.colorSelected;
    priceItem.innerHTML = `${product.price} \u20ac`;
    qte.innerText = "Qte :";
    deleteItem.innerText = "Supprimer";
}

/**
* Calcule la quantité totale de produit dans le panier 
* @returns {int} la quantité de produit dans le panier
*/
const getTotalQuantity = () => {
    let totalQuantity=0;
    let itemQuantity = document.querySelectorAll('.itemQuantity');
    if(itemQuantity.length >= 1){
        itemQuantity.forEach(element => totalQuantity += parseInt(element.value))
    }
    return totalQuantity;  
}
console.log(getTotalQuantity());

/**
* Calcule le prix total de produit dans panier 
* @returns {int} prix total du panier
*/
const getTotalPrice = () => {
    let productInLocalStorage = getLocalStorage();
    let totalPrice = 0;
    if(localStorage.length >= 1){
        for(product of productInLocalStorage){
            totalPrice += (product.quantity * product.price);
        }
        return totalPrice;
    }else{
        return 0;
    }
}
console.log(getTotalPrice());

/**
* Affiche la quantité totale et le prix total de produit ajouté dans le panier
*/
const displayTotalQtyAndPrice = () => {
    //Injection html dans la page panier du nombre d'articles
    document.getElementById('totalQuantity').innerHTML = getTotalQuantity();
    //Injection html dans la page panier du prix total d'articles
    document.getElementById('totalPrice').innerHTML = getTotalPrice(); 
}
displayTotalQtyAndPrice();

/**
* Crée un tableau des id produits
* @returns {[string]} un tableau de string contenant les id des produits dans le localStorage
*/
const getListProductId = () =>{
    let productInLocalStorage = getLocalStorage();
    if(localStorage.length >= 1){
        return productInLocalStorage.map(product => product.id);
    }else{
        return [];
    }   
}
console.table(getListProductId());

/**
* Affiche message quand le panier est vide
*/
const displayBasketEmpty = () => {
    let cartEmpty = document.createElement('p');
    let achat = document.createElement('a');
    cartEmpty.innerHTML = "Votre panier est vide";
    cartEmpty.style = "text-align:center;font-size:30px";
    document.getElementById('cart__items').style = "margin-bottom:20px";
    achat.setAttribute("href", "./index.html");
    achat.setAttribute("class","item__achat__continue");
    achat.style = "display:block;text-align:center;text-transform:uppercase;background-color:white;text-decoration:none;width: 50%;margin: 0 auto;padding-top: 20px;padding-bottom: 20px";
    achat.innerHTML = "Continuer mes achats";
    document.getElementById('cart__items').appendChild(cartEmpty);
    document.getElementById('cart__items').appendChild(achat);
}

/**
 * Modifie la quantité de produit
 */
const modifyQuantityProduct = () =>{
    let productInLocalStorage = getLocalStorage();
    let itemsQuantity = document.querySelectorAll(".itemQuantity");
    
    for (let i = 0; i < itemsQuantity.length; i++){
        itemsQuantity[i].addEventListener("change" , (event) => {
            event.preventDefault();

            //Selection de l'element à modifier en fonction de son id ET sa couleur
            let quantityToModify = productInLocalStorage[i].quantity;
            let quantityModifValue = itemsQuantity[i].valueAsNumber;
            if(quantityModifValue > 0 && quantityModifValue <= 100){
                const resultFound = productInLocalStorage.find(p => 
                    p.quantityModifValue !== quantityToModify  && p.id === productInLocalStorage[i].id && p.colorSelected === productInLocalStorage[i].colorSelected);
                console.log(resultFound);
                resultFound.quantity = quantityModifValue;
                productInLocalStorage[i].quantity = resultFound.quantity;
    
                localStorage.setItem("product", JSON.stringify(productInLocalStorage));
            
                // rafraichessement rapide de la page
                location.reload();
            }else{
                alert("La quantité doit être comprise entre 1-100");
                location.reload();
            }
            
        });
    }
}

/**
 * Suppression d'un produit
 */
const deleteProduct= () =>{
    let productInLocalStorage = getLocalStorage();
    let itemsDelete = document.querySelectorAll(".deleteItem"); 
    for(let i=0;i<itemsDelete.length;i++){
        itemsDelete[i].addEventListener('click', event =>{
            event.preventDefault();
            console.log(productInLocalStorage[i].id);
            console.log(productInLocalStorage[i].colorSelected);
            console.log(i);
            let idProductToDelete = productInLocalStorage[i].id;
            let colorProductToDelete = productInLocalStorage[i].colorSelected;
            // Filtrage selon id ou color du produit
            let resultFound = productInLocalStorage.filter(p => p.id !== idProductToDelete || p.colorSelected !== colorProductToDelete);
        
            localStorage.setItem('product', JSON.stringify(resultFound));
            
            // rafraichessement rapide de la page
            alert('Ce produit a bien été supprimé du panier');
            location.reload();   
        });
    }     
}

/**
 * Envoie de la commande au back-end
 */
const checkFormAndPostRequest = () => {

    // On récupère les inputs depuis le DOM.
    let firstName = document.getElementById('firstName');
    let lastName = document.getElementById('lastName');
    let address = document.getElementById('address');
    let city = document.getElementById('city');
    let email = document.getElementById('email');
    let btnCommande = document.getElementById('order');
    let regNameValid = /^[a-zA-ZéèîïÉÈÎÏ][a-zéèêàçîï]+([-'\s][a-zA-ZéèîïÉÈÎÏ][a-zéèêàçîï]+)?$/;
    //let reglastNameValid = /^[a-zA-ZéèîïÉÈÎÏ][a-zéèêàçîï]+([-'\s][a-zA-ZéèîïÉÈÎÏ][a-zéèêàçîï]+)?$/;
    let regEmailValid =  /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
    
    // Lors d'un clic, si l'un des champs n'est pas rempli ou invalide, on affiche une erreur, on empêche l'envoi du formulaire..
    btnCommande.addEventListener("click", (e) => {
        //Validation prenom
        if(firstName.validity.valueMissing){
            e.preventDefault();
            document.getElementById('firstNameErrorMsg').innerText = "Veuillez renseigner ce champ";   
        }
        if(!(firstName.validity.valueMissing)){
            e.preventDefault();
            document.getElementById('firstNameErrorMsg').innerText = "";   
        }
        if(regNameValid.test(firstName.value) == false){
            e.preventDefault();
            document.getElementById('firstNameErrorMsg').innerText = "Prénom est invalide";
        } 

        //Validation Nom
        if(lastName.validity.valueMissing){
            e.preventDefault();
            document.getElementById('lastNameErrorMsg').innerText = "Veuillez renseigner ce champ";
        }
        if(!(lastName.validity.valueMissing)){
            e.preventDefault();
            document.getElementById('lastNameErrorMsg').innerText = "";
        }
        if(regNameValid.test(lastName.value) == false){
            e.preventDefault();
            document.getElementById('lastNameErrorMsg').innerText = "Nom est invalide";
        }

        //Validation adresse
        if(address.validity.valueMissing){
            e.preventDefault();
            document.getElementById('addressErrorMsg').innerText = "Veuillez renseigner ce champ"
        }
        if(!(address.validity.valueMissing)){
            e.preventDefault();
            document.getElementById('addressErrorMsg').innerText = ""
        }

        //Validation ville
        if(city.validity.valueMissing){
            e.preventDefault();
            document.getElementById('cityErrorMsg').innerText = "Veuillez renseigner ce champ"
        }
        if(!(city.validity.valueMissing)){
            e.preventDefault();
            document.getElementById('cityErrorMsg').innerText = ""
        }

        //Validation email
        if(email.validity.valueMissing){
            e.preventDefault();
            document.getElementById('emailErrorMsg').innerText = "Veuillez renseigner ce champ"
        }
        if(!(email.validity.valueMissing)){
            e.preventDefault();
            document.getElementById('emailErrorMsg').innerText = ""
        }
        if(regEmailValid.test(email.value) == false){
            e.preventDefault();
            document.getElementById('emailErrorMsg').innerText = "Email est invalide"
        }else{
            
            // Si le formulaire est valide, le tableau products contiendra un tableau d'objet Product-ID 
            //qui sont les produits achetés, et order contiendra ce tableau ainsi que l'objet qui contient 
            //les infos du client
            
            const order = {
                contact: {
                    firstName: firstName.value,
                    lastName: lastName.value,
                    city: city.value,
                    address: address.value,
                    email: email.value
                },
                products: getListProductId()
            };
            console.log(order);
    
            /*********-------  Envoi de la requête POST au back-end --------*********/
            // On crée l'entête de la requête
            const options = {
                method: "POST",
                body: JSON.stringify(order),
                headers: { "Content-Type": "application/json" },
            };
            console.log(options);
    
            // Envoie de la requête avec l'en-tête.  
            fetch('http://localhost:3000/api/products/order', options)
            .then(response => response.json())
            .then(data => {
                
                // Vider le localStorage
                localStorage.clear();
                // LocalStorage qui ne contiendra plus que l'order id.
                localStorage.setItem("orderId", data.orderId);
                // Rediriger vers la page confirmation
                window.location.href = "../html/confirmation.html";
            })
            .catch((error) => {
                alert("Il y a eu une erreur : " + error.message);
            });
        }
    });
  }


/**
 * Affiche les produits dans le panier et prépare les évenements suppression du produit, 
 * modification de la quantité, envoie de la commande 
 */
 async function loadProduct(){
    let productInLocalStorage = getLocalStorage();
    //S'il y a deja de produit enregistré dans le localStorage
    if(localStorage.length >= 1){
        for(product of productInLocalStorage){    
            displayToCart(product);  
        }
        
        displayTotalQtyAndPrice(); 
        modifyQuantityProduct();
        deleteProduct();
         
        checkFormAndPostRequest();
          
    }else{ //S'il n'ya pas de produit enregistré dans le localStorage
        
        displayBasketEmpty();
        displayTotalQtyAndPrice(); 
    } 
}

loadProduct();