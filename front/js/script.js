
function getLocalStorage() {
    let productInLocalStorage = localStorage.getItem("product");
    return (productInLocalStorage != null) ? JSON.parse(productInLocalStorage) : [];
}

/**
 * affiche le message d'erreur s'il les produits ne se chargent pas 
 * @param {item parent } elt 
 * @param {texte erreur} txtError 
 */
 const displayToMessageError = (elt,txtError) => {
    let errors = document.createElement('p');
    errors.setAttribute('class', 'errors');
    errors.innerText = txtError;
    elt.appendChild(errors);
}
