document.addEventListener("DOMContentLoaded", function () {
    loadCategories();
    updateCartCount();
});

//Entry Point
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

//Header Navigation
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

        a.textContent = name;
        a.href = `product_listing.html?category=${encodeURIComponent(name)}`;

        li.appendChild(a);
        ul.appendChild(li);
    }

    nav.appendChild(ul);
    subsection.appendChild(nav);
}

//Footer Catalog
function buildFooterCatalog(categories) {
    const container = document.querySelector("footer .catalog-list");
    if (!container) return;

    container.innerHTML = "";

    for (let cat of categories) {
        const name = cat.getElementsByTagName("name")[0]?.textContent;
        if (!name) continue;

        const link = document.createElement("a");
        link.textContent = name;
        link.href = `product_listing.html?category=${encodeURIComponent(name)}`;

        container.appendChild(link);
    }
}

//Profile Accessor
function NavigateAccount() {
    const user = getLoggedInUser();

    if (!user) {
        return window.location.href = "login.html";
    } else {
        return window.location.href = "profile.html";
    }
}

//Logged in Check
function getLoggedInUser() {
    const match = document.cookie
        .split("; ")
        .find(row => row.startsWith("authToken="));

    return match ? decodeURIComponent(match.split("=")[1]) : null;
}

//Creates Cookies
function setCookie(name, value, days = 7) {
    const expires = new Date(Date.now() + days * 864e5).toUTCString();
    document.cookie = `${name}=${encodeURIComponent(value)}; expires=${expires}; path=/`;
}

//Gets Cookies (if made)
function getCookie(name) {
    return document.cookie
        .split("; ")
        .reduce((r, v) => {
            const parts = v.split("=");
            return parts[0] === name ? decodeURIComponent(parts[1]) : r;
        }, "");
}

//Cart Based on Account
function getCart() {
    const user = getLoggedInUser();

    if (!user) {
        return [];
    }

    const cartCookie = getCookie(`cart_${user}`);

    if (!cartCookie) {
        return [];
    }

    try {
        return JSON.parse(cartCookie);
    } catch (e) {
        console.error("Cart parse error:", e);
        return [];
    }
}

//Saves Account Cart
function saveCart(cart) {
    const user = getLoggedInUser();

    if (!user) {
        return;
    } else {
        setCookie(`cart_${user}`, JSON.stringify(cart));
    }
}

//Adding to a Cart
function addToCart(id, name, price, stock, image, description) {
    const user = getLoggedInUser();

    if (!user) {
        alert("Please log in to add items to the cart.");
        return;
    }

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
        cart.push({id,name,description,price,stock,image,quantity: 1});
    }

    saveCart(cart);
    updateCartCount();
}

//Counting Items in Cart
function updateCartCount() {
    const cart = getCart();
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);

    const cartCountElement = document.getElementById("cart-count");

    if (cartCountElement) {
        cartCountElement.textContent = totalItems;
    }
}