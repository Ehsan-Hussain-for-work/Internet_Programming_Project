let searchProducts = [];

const PRODUCT_FILES = [
    "../data/Automotive.json",
    "../data/Electronics.json",
    "../data/Clothing.json",
    "../data/Home & Kitchen.json",
    "../data/Beauty & Personal Care.json",
    "../data/Office Supplies.json",
    "../data/Pet Supplies.json",
    "../data/Sports & Outdoors.json",
    "../data/Toys & Games.json"
];

Promise.all(PRODUCT_FILES.map(file => fetch(file).then(r => r.json())))
    .then(allData => {
        searchProducts = allData.flat();
    });

/* Elements */
const searchInput = document.getElementById("search-bar");
const suggestionsBox = document.createElement("div");
suggestionsBox.className = "search-suggestions";
searchInput.parentElement.appendChild(suggestionsBox);
const searchButton = document.getElementById("search-button");

/* Live suggestions */
searchInput.addEventListener("input", () => {
    const query = searchInput.value.trim().toLowerCase();
    suggestionsBox.innerHTML = "";

    if (!query) return;

    const matches = searchProducts
        .filter(p => p.name.toLowerCase().includes(query))
        .slice(0, 99);

    matches.forEach(p => {
        const item = document.createElement("div");
        item.innerHTML = p.name.replace(
            new RegExp(query, "gi"),
            match => `<strong>${match}</strong>`
        );

        item.onclick = () => {
            window.location.href =
                `product_detail.html?id=${p.id}&category=${encodeURIComponent(p.category)}`;
        };

        suggestionsBox.appendChild(item);
    });
});

searchButton.addEventListener("click", () => {
    const query = searchInput.value.trim();
    if (!query) return;

    window.location.href = `product_listing.html?search=${encodeURIComponent(query)}`;
});

searchInput.addEventListener("keydown", e => {
    if (e.key === "Enter") {
        e.preventDefault();
        searchButton.click();
    }
});