let searchProducts = [];

/* Load mock product data */
fetch("../data/Automotive.json")
    .then(res => res.json())
    .then(data => searchProducts = data);

/* Elements */
const searchInput = document.getElementById("search-bar");
const suggestionsBox = document.createElement("div");
suggestionsBox.className = "search-suggestions";
searchInput.parentElement.appendChild(suggestionsBox);

/* Live suggestions */
searchInput.addEventListener("input", () => {
    const query = searchInput.value.trim().toLowerCase();
    suggestionsBox.innerHTML = "";

    if (query.length === 0) return;

    const matches = searchProducts
        .filter(p => p.title.toLowerCase().includes(query))
        .slice(0, 5);

    matches.forEach(p => {
        const item = document.createElement("div");
        item.textContent = p.title;
        item.onclick = () => {
            window.location.href = `product_listing.html?search=${encodeURIComponent(query)}`;
        };
        suggestionsBox.appendChild(item);
    });
});

searchInput.addEventListener("keydown", e => {
    if (e.key === "Enter") {
        e.preventDefault();
        searchButton.click();
    }
});
