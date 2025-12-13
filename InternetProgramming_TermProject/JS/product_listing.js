let allProducts = [];
let filteredProducts = [];

document.addEventListener("DOMContentLoaded", () => {
  loadProducts();

  document.getElementById("sort").addEventListener("change", sortProducts);
  document.getElementById("priceRange").addEventListener("input", filterByPrice);
});

function loadProducts() {
  fetch("../data/Automotive.json")
    .then(res => res.json())
    .then(data => {
      allProducts = data;
      filteredProducts = data;
      renderProducts(filteredProducts);
    });
}

function renderProducts(products) {
  const container = document.getElementById("product-list");
  container.innerHTML = "";

  products.forEach(p => {
    container.innerHTML += `
      <div class="product-card" onclick="goToDetail('${p.id}')">
        <img src="${p.image}">
        <h3>${p.title}</h3>
        <p>$${p.price}</p>
      </div>
    `;
  });
}

function sortProducts() {
  const value = document.getElementById("sort").value;

  if (value === "low-high") {
    filteredProducts.sort((a, b) => a.price - b.price);
  } else if (value === "high-low") {
    filteredProducts.sort((a, b) => b.price - a.price);
  }
  renderProducts(filteredProducts);
}

function filterByPrice(e) {
  const maxPrice = e.target.value;
  document.getElementById("priceValue").textContent = maxPrice;

  filteredProducts = allProducts.filter(p => p.price <= maxPrice);
  renderProducts(filteredProducts);
}

function goToDetail(id) {
  window.location.href = `product_detail.html?id=${id}`;
}
