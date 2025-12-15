/* === SEARCH PARAM === */
const params = new URLSearchParams(window.location.search);
const searchQuery = params.get("search");

/* === DATA === */
let allProducts = [];
let filteredProducts = [];

/* === INIT === */
document.addEventListener("DOMContentLoaded", () => {
    loadProducts();

    document.getElementById("sort").addEventListener("change", sortProducts);
    document.getElementById("priceRange").addEventListener("input", filterByPrice);
});

/* === LOAD PRODUCTS === */
function loadProducts() {
    fetch("../data/Automotive.json")
        .then(res => res.json())
        .then(data => {
            allProducts = data;

            /* SEARCH FILTER */
            if (searchQuery) {
                filteredProducts = data.filter(p =>
                    p.title.toLowerCase().includes(searchQuery.toLowerCase())
                );
            } else {
                filteredProducts = data;
            }

            renderProducts(filteredProducts);
        });
}

/* === RENDER PRODUCTS === */
function renderProducts(products) {
    const container = document.getElementById("product-list");
    container.innerHTML = "";

    if (products.length === 0) {
        container.innerHTML = "<p>No results found.</p>";
        return;
    }

    products.forEach(p => {
        let title = p.title;

        /* HIGHLIGHT SEARCH KEYWORD */
        if (searchQuery) {
            const regex = new RegExp(`(${searchQuery})`, "gi");
            title = title.replace(regex, "<mark>$1</mark>");
        }

        container.innerHTML += `
      <div class="product-card"
           tabindex="0"
           role="button"
           aria-label="View product ${p.title}"
           onclick="goToDetail('${p.id}')"
           onkeydown="if(event.key==='Enter'){goToDetail('${p.id}')}"
      >
        <img src="${p.image}" alt="${p.title}">
        <h3>${title}</h3>
        <p>$${p.price}</p>
      </div>
    `;
    });
}


/* === SORT === */
function sortProducts() {
    const value = document.getElementById("sort").value;

    if (value === "low-high") {
        filteredProducts.sort((a, b) => a.price - b.price);
    } else if (value === "high-low") {
        filteredProducts.sort((a, b) => b.price - a.price);
    }

    renderProducts(filteredProducts);
}

/* === PRICE FILTER === */
function filterByPrice(e) {
    const maxPrice = e.target.value;
    document.getElementById("priceValue").textContent = maxPrice;

    filteredProducts = allProducts.filter(p => {
        const matchesSearch = searchQuery
            ? p.title.toLowerCase().includes(searchQuery.toLowerCase())
            : true;

        return p.price <= maxPrice && matchesSearch;
    });

    renderProducts(filteredProducts);
}

/* === NAVIGATION === */
function goToDetail(id) {
    window.location.href = `product_detail.html?id=${id}`;
}
