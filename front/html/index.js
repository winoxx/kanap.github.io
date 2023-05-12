fetch("http://localhost:3000/api/products")
  .then((res) => res.json())
  .then((data) => {
    for (product of data) {
      afficherArticles(product);
    }

    function afficherArticles(canap) {
      let image = document.createElement("img");
      image.src = canap.imageUrl;

      let anchor = document.createElement("a");
      anchor.href = "product.html?id=" + canap._id;

      let h3 = document.createElement("h3");
      h3.textContent = canap.name;

      let paragraph = document.createElement("p");
      paragraph.textContent = canap.description;

      let article = document.createElement("article");

      let items = document.querySelector("#items");
      items.appendChild(anchor);

      article.appendChild(image);
      article.appendChild(h3);
      article.appendChild(paragraph);
      anchor.appendChild(article);
    }
  });
