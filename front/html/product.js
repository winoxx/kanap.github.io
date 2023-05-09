// chercher l'ID d'un article
const queryString = window.location.search;
console.log(queryString);

const UrlParams = new URLSearchParams(queryString);
const id = UrlParams.get("id");
let item_price = 0;

// recuperation donnée
fetch(`http://localhost:3000/api/products/${id}`)
  .then((response) => response.json())
  .then((res) => kanap(res));

function kanap(products) {
  // creation varialbes et  les identifier et les mettre en relation avec base de donnée
  const price = products.price;
  const name = products.name;
  const quantity = products.quantity;
  const description = products.description;
  const allText = products.allText;
  const imageUrl = products.imageUrl;
  const _id = products._id;
  const colors = products.colors;
  item_price = price;

  // creation balise img et la classe parent item_img
  let image = document.createElement("img");
  image.src = imageUrl;
  image.alt = allText;
  const parent = document.querySelector(".item__img");
  parent.appendChild(image);

  // ne pas creer toutes les div et classe se concentrer sur les parents des elements que l'on veut afficher et inserer et surtout les ID
  // comme ci dessous
  let h1 = document.querySelector("#title");
  h1.textContent = name;

  let span = document.querySelector("#price");
  span.textContent = price;

  let p = document.querySelector("#description");
  p.textContent = description;

  // menu deroulant donc un peu plus difficile
  let select = document.querySelector("#colors");
  colors.forEach((colors) => {
    console.log(colors);
    const option = document.createElement("option");
    option.value = colors;
    option.textContent = colors;
    select.appendChild(option);
  });
}

const button = document.querySelector("#addToCart");
if (button != null) {
  button.addEventListener("click", (e) => {
    const colors = document.querySelector("#colors").value;
    const quantity = document.querySelector("#quantity").value;
    if (
      colors == null ||
      colors == "" ||
      quantity == null ||
      quantity <= 0 ||
      quantity > 100
    ) {
      alert(
        "veuillez saisir une couleur de canapé et le nombre de canapé que vous désirez  merci de votre confiance"
      );
    } else {
      let cart = localStorage.getItem("cart");
      if (cart == null) {
        cart = {};
      } else {
        cart = JSON.parse(cart);
      }
      const key = id + colors;
      if (cart[key] != undefined) {
        cart[key].quantity += Number(quantity);
      } else {
        const data = {
          //price: item_price,
          quantity: Number(quantity),
          color: colors,
          id: id,
        };
        cart[key] = data;
      }
      localStorage.setItem("cart", JSON.stringify(cart));
      window.location.href = "cart.html";
    }
  });
}
