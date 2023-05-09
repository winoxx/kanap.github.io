let orderId = getOrderId()
displayOrderId(orderId)
clear()

function getOrderId(){
    const queryString = window.location.search;
    const UrlParams = new URLSearchParams(queryString);
    return UrlParams.get("orderId");
    
}

function displayOrderId(orderId){
let orderIdElement = document.getElementById("orderId")
orderIdElement.innerHTML = orderId

}

function clear(){
    let clear = window.localStorage
    clear.clear(
    )
}