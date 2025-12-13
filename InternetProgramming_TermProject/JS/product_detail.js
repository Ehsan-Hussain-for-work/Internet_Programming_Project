document.addEventListener("DOMContentLoaded", () => {
    const params = new URLSearchParams(window.location.search);
    const productId = params.get("id");

    fetch("../data/Automotive.json")
        .then(res => res.json())
        .then(products => {
            const product = products.find(p => p.id == productId);
            displayProduct(product);
            showRelated(products, product.category);
        });
});

function displayProduct(p) {
    document.getElementById("product-image").src = p.image;
    document.getElementById("product-title").textContent = p.title;
    document.getElementById("product-price").textContent = `$${p.price}`;
    document.getElementById("product-description").textContent = p.description;
    document.getElementById("product-sku").textContent = p.sku;
    document.getElementById("product-stock").textContent = p.available ? "In Stock" : "Out of Stock";
}

function addToCart() {
    const qty = document.getElementById("quantity").value;
    alert(`Added ${qty} item(s) to cart`);
}

function showRelated(products, category) {
    const related = products.filter(p => p.category === category).slice(0, 3);
    const container = document.getElementById("related-products");

    related.forEach(p => {
        container.innerHTML += `
      <div class="product-card">
        <img src="${p.image}">
        <p>${p.title}</p>
      </div>
    `;
    });
}
