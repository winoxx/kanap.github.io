let totalPrice = 0;
let totalQuantity = 0;

// admettons cart est un classeur
// objet est dans le classeur cart
// je fais une boucle dans le classeur pour prendre l'objet
displayLocageStorage();
// creation fonction pour interoger la base de donnée
function displayLocageStorage() {
  const cart_locaStorage = localStorage.length;
  const cart = JSON.parse(localStorage.getItem("cart"));
  for (const e in cart) {
    const product = cart[e];
    console.log(product.quantity); //afficher quantity du product
    fetch(`http://localhost:3000/api/products/${product.id}`)
    .then((response) => response.json())
    // appeller la fonction puis  base de donnee du panier (product) et celle par defaut (res)
    .then((res) => AddProduct(product, res));
  }
}
// creation fonction pour unir les deux base de donnée (produit et panier) à mettre en parametre
function AddProduct(cart_product, data_product) {
  let key = cart_product.id + cart_product.color;
  
  let article = document.createElement("article");
  article.classList.add("cart__item");
  article.dataset.id = cart_product.id;
  article.dataset.color = cart_product.color;
  
  //creation id pour contenir l'article a voir avec jeremy
  let cart_items = document.getElementById("cart__items");
  cart_items.appendChild(article);
  
  
  // construction div image contient image
  let cart__item__img = document.createElement("div");
  cart__item__img.classList.add("cart__item__img");
  let image = document.createElement("img");
  image.src = data_product.imageUrl;
  cart__item__img.appendChild(image);
 
  
  // creation element h2, color et prix
  let h2 = document.createElement("h2");
  h2.textContent = data_product.name;
  
  let paragraphe_color = document.createElement("p");
  paragraphe_color.textContent = cart_product.color;
  
  let paragraphe_price = document.createElement("p");
  paragraphe_price.textContent = data_product.price + "€";
  
  // construction div contient h2 color et prix
  let cart__item__content = document.createElement("div");
  cart__item__content.classList.add("cart__item__content");
  
  let cart_item_content_description = document.createElement("div");
  cart_item_content_description.classList.add("cart__item__content__description");
  
  cart__item__content.appendChild(cart_item_content_description)
  
  cart_item_content_description.appendChild(h2)
  article.appendChild(cart__item__img)
  cart_item_content_description.appendChild(paragraphe_color)
  cart_item_content_description.appendChild(paragraphe_price)
  
  article.appendChild(cart__item__content);
  
  
  let div_content_settings = document.createElement("div");
  let div_content_settings_quantity = document.createElement("div");

  div_content_settings.classList.add("cart__item__content__settings");
  div_content_settings_quantity.classList.add( "cart__item__content__settings__quantity"
    );
    
    let setting_price = document.createElement("p");
    setting_price.textContent = "Qté :";
    div_content_settings_quantity.appendChild(setting_price);
    let input = document.createElement("input");
    input.type = "number";
    input.classList.add("itemQuantity");
    input.name = "itemQuantity";
    input.min = "1";
    input.max = "100";
    // base de donnée du cart
    input.value = cart_product.quantity;
    // ecoute du changement de quantité appelle de la fonction et entroduire la clé (color et id) et input pour la valeur
    input.addEventListener("change", () => calcultatNewValue(key, input.value));
    
    div_content_settings_quantity.appendChild(input);
    div_content_settings.appendChild(div_content_settings_quantity);
    article.appendChild(div_content_settings);
    
    let div_delete = document.createElement("div");
    div_delete.classList.add("cart__item__content__settings__delete");
    div_delete.addEventListener("click", () => deleteCart(cart_product, key));
    const p = document.createElement("p");
    p.classList.add("deleteItem")
    
    p.textContent = "Supprimer";
    div_delete.appendChild(p);
    div_content_settings.appendChild(div_delete);
    // fonction avec paramentres
    AffichePriceAndQuantity(data_product, cart_product);
    
    
  }
  
  // creation fonction pour interroge base de donnée et modifier la quantité
  function calcultatNewValue(key, newvalue) {
    const cart = JSON.parse(localStorage.getItem("cart"));
    cart[key].quantity = newvalue;
    localStorage.setItem("cart", JSON.stringify(cart));
    //appel fonction pour recaculer automatiquement
    resetCart()
    
    
  }
  // panier est un panier dans localstorage. corriger utilisation de l'objet
  function deleteCart(cart_product, key) {
    // personne pour afficher le panier
    const cart = JSON.parse(localStorage.getItem("cart"));
    // delete cart avec key
    delete cart[key]
    //personne pour modifier le panier 
    localStorage.setItem("cart", JSON.stringify(cart));
    // fonction appellé pour recalculer
    resetCart()
    
  }  
  
  // fonction a appeller dans la fonction addproduct
  function AffichePriceAndQuantity(data_product, cart_product) {
    let total = data_product.price * cart_product.quantity;
    affichePrice(total);
    afficheQuantity(cart_product.quantity);
  }
  
  //ok
  function affichePrice(prix) {
    totalPrice += prix; // cela incremente la variable totalPrice declaré en externe
    let Price = document.querySelector("#totalPrice");
    Price.textContent = totalPrice;
  }
  //ok
  function afficheQuantity(nombre) {
    totalQuantity += Number(nombre); // cela incremente la variable totalPrice declaré en externe
    let Quantity = document.querySelector("#totalQuantity");
    Quantity.textContent = totalQuantity;
  }
  
  
  // restart le panier avec bonne quantité et bon prix
  function resetCart() {
    let items = document.getElementById("cart__items");
    while (items.childNodes.length > 0) {
      items.removeChild(items.childNodes[0])
      
    }
    totalPrice = 0;
    totalQuantity = 0;
    // fonction qui traite le localstorage
    displayLocageStorage();
  }
  
  let orderButton = document.querySelector("#order")
  orderButton.addEventListener("click", (e) => submitform(e))
  
  
  function submitform(e){
    let form = document.querySelector(".cart__order__form")
    
    
    e.preventDefault() 
    e.stopPropagation()
    if(ValidateForm()){
      let body = infoCustommer()
      console.log(body)
      
      const cart = JSON.parse(localStorage.getItem("cart"));
      
      if (!cart || cart.length == 0){
        alert("select product in basket Please")
      }else{
        fetch("http://localhost:3000/api/products/order",
        { 
          method: "POST", 
          body: JSON.stringify(body),
          headers:{
            "Content-Type": "application/json"
          }
        })
        .then((res) => res.json()) 
        .then((data) => {
          let orderId = data.orderId
          
          window.location.href = "/front/html/confirmation.html" + "?orderId=" + orderId
          console.log(orderId)
          
        })
        .catch((err)=> console.log(err))
        
      }
      
    }
    clear()
    
    
  } 
  
  function infoCustommer(){
    let form = document.querySelector(".cart__order__form")
    
    let firstName = document.getElementById("firstName").value
    let lastName = document.getElementById("lastName").value
    let address = document.getElementById("address").value
    let city = document.getElementById("city").value
    let email = document.getElementById("email").value
    
    let body = {
      contact:{
        firstName: firstName,
        lastName: lastName,
        address: address,
        city: city,
        email: email
      },
      //array vide 
      products: getId()
    }
    return body
  }
  // affiche valeur des inputs
  function getId(){
    let cart = JSON.parse(localStorage.getItem("cart"))
    let ids = []
    let products = Object.values(cart)
    for (let index = 0; index < products.length; index++) {
      ids.push(products[index].id)
      
    }
    return ids
  }
  
  // //     let h = 15
  // //     let f = 13
  
  // //     function AddPro(f, h){
  // //         let c = f + h
  // //         console.log("c" + c)
  
  // //     }
  
  // //    AddPro(10,10)
  // //    AddPro(104,10)
  // //    AddPro(1045,10)
  // //    AddPro(10324324,10)
  //    AddPro(107777,10)
  
  /****************FORMULAIRE**************** */
  
  function ValidateForm(){
    
    let countError = 0;
    
    
    
    /*FirstName*/
    let input_firstName = document.getElementById("firstName")
    let regex_firstName = /^[A-Za-z-\s]+$/
    if(input_firstName.value.trim() === ""){
      let msgError = document.getElementById("firstNameErrorMsg")
      msgError.innerHTML = "le champ firstname est requis" 
      countError++
    }else if (regex_firstName.test(input_firstName.value) == false){
      let msgError = document.getElementById("firstNameErrorMsg")
      msgError.innerHTML = "le champ firstname doit comporter des lettres majuscules ou minuscules"
      countError++
    }else if (regex_firstName.test(input_firstName.value) == true){
      let msgError = document.getElementById("firstNameErrorMsg")
      msgError.innerHTML = ""
      
    }
    
    /* LastName*/
    
    let input_lastName = document.getElementById("lastName")
    let regex_lastName = /^[A-Za-z-\s]+$/
    if(input_lastName.value.trim() === ""){
      let msgError = document.getElementById("lastNameErrorMsg")
      msgError.innerHTML = "le champ lastname est requis"
      countError++
    }else if (regex_lastName.test(input_lastName.value) == false){
      let msgError = document.getElementById("lastNameErrorMsg")
      msgError.innerHTML = "le champ lastname doit comporter des lettres majuscules, minuscules et tirets"
      countError++
    }else if (regex_lastName.test(input_lastName.value) == true){
      let msgError = document.getElementById("lastNameErrorMsg")
      msgError.innerHTML = ""
    }
    /* Address*/
    let input_address = document.getElementById("address")
    let regex_address = /^[0-9A-Za-z- \s]+$/
    if(input_address.value.trim() === ""){
      let msgError = document.getElementById("addressErrorMsg")
      msgError.innerHTML = "le champ address est requis"
      countError++
    }
    else if (regex_address.test(input_address.value) == false){
      let msgError = document.getElementById("addressErrorMsg")
      msgError.innerHTML = "le champ adress doit comporter des lettres et un numero de rue"
      countError++
    }else if (regex_address.test(input_address.value) == true){
      let msgError = document.getElementById("addressErrorMsg")
      msgError.innerHTML = ""
    }
    
    /* city*/
    let input_city = document.getElementById("city")
    let regex_city = /^[A-Za-z-\s]+$/
    if(input_city.value.trim() === ""){
      let msgError = document.getElementById("cityErrorMsg")
      msgError.innerHTML = "le champ city est requis"
      countError++
      
    }else if (regex_city.test(input_city.value) == false){
      let msgError = document.getElementById("cityErrorMsg")
      msgError.innerHTML = "le champ city doit comporter des lettres"
      countError++
    }else if (regex_city.test(input_city.value) == true){
      let msgError = document.getElementById("cityErrorMsg")
      msgError.innerHTML = ""
    }
    
    /* email*/
    let input_email = document.getElementById("email")
    let regex_email =  /^[a-z0-9._-]+@[a-z0-9._-]+\.[a-z]{2,6}$/
    if(input_email.value.trim() === ""){
      let msgError = document.getElementById("emailErrorMsg")
      msgError.innerHTML = "le champ email est requis"
      countError++
      
    }else if (regex_email.test(input_email.value) == false){
      let msgError = document.getElementById("emailErrorMsg")
      msgError.innerHTML = "le champ email doit etre validé "
      countError++
    }
    else if (regex_email.test(input_email.value) == true){
      let msgError = document.getElementById("emailErrorMsg")
      msgError.innerHTML = ""
    }
    
    return countError === 0;
  }
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  