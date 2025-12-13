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
      const featured = products.slice(0, 4);
      const container = document.getElementById("featured-products");

      featured.forEach(p => {
        container.innerHTML += `
          <div class="product-card">
            <img src="${p.image}" alt="${p.title}">
            <h3>${p.title}</h3>
            <p>$${p.price}</p>
          </div>
        `;
      });
    });
}
