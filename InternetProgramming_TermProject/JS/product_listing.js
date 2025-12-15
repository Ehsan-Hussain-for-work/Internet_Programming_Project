/* === SEARCH PARAM === */
const params = new URLSearchParams(window.location.search);
const searchQuery = params.get("search");
const category = params.get("category");

const CATEGORY_FILES = {
    Automotive: "../data/Automotive.json",
    Electronics: "../data/Electronics.json",
    Clothing: "../data/Clothing.json",
    "Beauty & Personal Care": "../data/Beauty & Personal Care.json",
    "Home & Kitchen": "../data/Home & Kitchen.json",
    "Garden & Outdoors": "../data/Garden & Outdoors.json",
    "Office Supplies": "../data/Office Supplies.json",
    "Pet Supplies": "../data/Pet Supplies.json",
    "Sports & Outdoors": "../data/Sports & Outdoors.json",
    "Toys & Games": "../data/Toys & Games.json"
};

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
    if (!category) {
        console.error("No category provided");
        return;
    }

    const filePath = CATEGORY_FILES[
        Object.keys(CATEGORY_FILES).find(key => key.toLowerCase() === category.toLowerCase())
    ];

    if (!filePath) {
        console.error("Category not mapped:", category);
        return;
    }

    fetch(filePath)
        .then(res => res.json())
        .then(data => {
            allProducts = data;

            filteredProducts = searchQuery
                ? data.filter(p =>
                    p.name.toLowerCase().includes(searchQuery.toLowerCase())
                  )
                : data;

            renderProducts(filteredProducts);
        })
        .catch(err => console.error("Load failed:", err));
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
        let title = p.name;

        /* HIGHLIGHT SEARCH KEYWORD */
        if (searchQuery) {
            const regex = new RegExp(`(${searchQuery})`, "gi");
            title = title.replace(regex, "<mark>$1</mark>");
        }

        container.innerHTML += `
        <div class="product-card" onclick="goToDetail('${p.id}')">
            <img src="${p.image}" alt="${p.name}">
            <h3>${p.name}</h3>
            <h4>${p.description}</h4>
            <p>$${p.price}</p>
            <p>Remaining Stock: ${p.stock}</p>
            <button onclick="addToCart(${p.id}, '${p.name}', ${p.price}, ${p.stock}, '${p.image}','${p.description}')">
                Add to Cart
            </button>
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
            ? p.name.toLowerCase().includes(searchQuery.toLowerCase())
            : true;

        return p.price <= maxPrice && matchesSearch;
    });

    renderProducts(filteredProducts);
}

/* === NAVIGATION === */
function goToDetail(id) {
    window.location.href = `product_detail.html?id=${id}&category=${encodeURIComponent(category)}`;
}