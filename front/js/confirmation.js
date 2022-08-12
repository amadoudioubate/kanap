/**
 * Récupère le numéro de la commande et l'affiche
 */
function getOrderId(){
    document.getElementById('orderId').innerHTML = localStorage.getItem("orderId");
    document.getElementById('orderId').style = "font-weight :600"
    localStorage.clear();
}
getOrderId();
