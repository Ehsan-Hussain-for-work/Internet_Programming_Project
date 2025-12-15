document.addEventListener("DOMContentLoaded", () => {
  loadCategories();
  loadFeaturedProducts();
});

/* Categories */
function loadCategories() {
  fetch("../data/categories.xml")
    .then(res => res.text())
    .then(str => new window.DOMParser().parseFromString(str, "text/xml"))
    .then(data => {
      const categories = data.getElementsByTagName("category");
      const container = document.getElementById("category-container");

      for (let cat of categories) {
        const div = document.createElement("div");
        div.className = "category-card";
        div.textContent = cat.textContent;
        div.onclick = () => {
          window.location.href = `product_listing.html?category=${cat.textContent}`;
        };
        container.appendChild(div);
      }
    });
}

/* Featured Products */
function loadFeaturedProducts() {
  fetch("../data/Automotive.json")
    .then(res => res.json())
    .then(products => {
      const featured = products.slice(0, 10);
      const container = document.getElementById("featured-products");

      featured.forEach(p => {
        container.innerHTML += `
          <div class="product-card">
            <img src="${p.image}" alt="${p.name}">
            <h3>${p.name}</h3>
            <h4>${p.description}</h4>
            <p>$${p.price}</p>
            <p>Remaining Stock: ${p.stock}</p>
            <button onclick="addToCart(${p.id}, '${p.name}', ${p.price}, ${p.stock}, '${p.image}','${p.description}')">Add to Cart</button>        
          </div>
        `;
      });
    });
}