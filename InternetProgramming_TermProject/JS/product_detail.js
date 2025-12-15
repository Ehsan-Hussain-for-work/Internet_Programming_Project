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

document.addEventListener("DOMContentLoaded", () => {
    const params = new URLSearchParams(window.location.search);

    const productId = params.get("id");
    const category = decodeURIComponent(params.get("category") || "").trim();

    if (!productId || !category) {
        console.error("Missing product id or category");
        return;
    }

    const filePath = CATEGORY_FILES[category];

    if (!filePath) {
        console.error("Invalid category:", category);
        return;
    }

    fetch(filePath)
        .then(res => res.json())
        .then(products => {
            const product = products.find(p => p.id == productId);

            if (!product) {
                console.error("Product not found:", productId);
                return;
            }

            displayProduct(product);
            showRelated(products, product.category);
        })
        .catch(err => console.error("Failed to load product:", err));
});

function displayProduct(p) {
    document.getElementById("product-image").src = p.image;
    document.getElementById("product-title").textContent = p.name;
    document.getElementById("product-price").textContent = `$${p.price}`;
    document.getElementById("product-description").textContent = p.description;
    document.getElementById("product-sku").textContent = p.sku;
    document.getElementById("product-stock").textContent =
        p.stock > 0 ? "In Stock" : "Out of Stock";
}

function addToCartPDP() {
    const qty = document.getElementById("quantity").value;
    
    
}

function showRelated(products, currentCategory) {    
    const related = products.filter(p => p.category === currentCategory).slice(0, 3);
    const container = document.getElementById("related-products");
    container.innerHTML = ""; 

    related.forEach(p => {
        const productCategory = p.category;

        container.innerHTML += `
        <div class="product-card" onclick="goToDetail('${p.id}', '${productCategory}')">
            <img src="${p.image}" alt="${p.name}">
            <h3>${p.name}</h3>
            <h4>${p.description}</h4>
            <p>$${p.price}</p>
            <p>Remaining Stock: ${p.stock}</p>
        </div>
        `;
    });
}

function goToDetail(id, categoryName) {
    window.location.href = `product_detail.html?id=${id}&category=${encodeURIComponent(categoryName)}`;
}