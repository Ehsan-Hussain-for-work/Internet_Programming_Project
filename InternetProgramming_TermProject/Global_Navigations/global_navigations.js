document.addEventListener("DOMContentLoaded", function () {
    loadCategories();
    updateCartCount();
});

function loadCategories() {
    fetch("../data/categories.xml")
        .then(response => response.text())
        .then(data => {
            const parser = new DOMParser();
            const xmlDoc = parser.parseFromString(data, "text/xml");

            const categories = xmlDoc.getElementsByTagName("category");

            buildHeaderNav(categories);
            buildFooterCatalog(categories);
        })
        .catch(err => {
            console.error("Failed to load categories:", err);
        });
}

/* ===== HEADER NAVIGATION ===== */
function buildHeaderNav(categories) {
    const subsection = document.querySelector("header > .subsection");
    if (!subsection) return;

    subsection.innerHTML = "";

    const nav = document.createElement("nav");
    const ul = document.createElement("ul");

    for (let cat of categories) {
        const name = cat.getElementsByTagName("name")[0]?.textContent;
        if (!name) continue;

        const li = document.createElement("li");
        const a = document.createElement("a");

        a.href = "#";
        a.textContent = name;

        li.appendChild(a);
        ul.appendChild(li);
    }

    nav.appendChild(ul);
    subsection.appendChild(nav);
}

/* ===== FOOTER CATALOG ===== */
function buildFooterCatalog(categories) {
    const container = document.querySelector("footer .catalog-list");
    if (!container) return;

    container.innerHTML = "";

    for (let cat of categories) {
        const name = cat.getElementsByTagName("name")[0]?.textContent;
        if (!name) continue;

        const link = document.createElement("a");
        link.href = "#";
        link.textContent = name;

        container.appendChild(link);
    }
}

/* ===== CART SECTION ===== */
function getCart() {
    const storedCart = localStorage.getItem("cart");

    if (storedCart) {
        try {
            return JSON.parse(storedCart);
        } catch (e) {
            console.error("Cart parse error:", e);
            return [];
        }
    }
    return [];
}

function addToCart(id, name, price, stock, image, description) {
    const cart = getCart(); 
    const existingItem = cart.find(item => item.id === id); 

    if (existingItem) {
        if (existingItem.quantity < stock) {
            existingItem.quantity += 1;
        } else {
            alert(`Cannot add more of ${name}. Stock limit (${stock}) reached.`);
            return;
        }
    } else {
        const newItem = {id,name,description,price,stock,image,quantity: 1};
        cart.push(newItem);
    }
    
    saveCart(cart);
    updateCartCount();
}

function saveCart(cart) {
    const cartString = JSON.stringify(cart);
    localStorage.setItem("cart", cartString);
}

function updateCartCount() {
    const cart = getCart();
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);

    const cartCountElement = document.getElementById("cart-count");

    if (cartCountElement) {
        cartCountElement.textContent = totalItems;
    }
}