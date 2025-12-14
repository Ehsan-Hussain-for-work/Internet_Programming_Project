function generateRandomOrderNumber() {
    const orderNumber = Math.floor(Math.random() * 900000) + 100000;
    document.getElementById("orderNumber").textContent = orderNumber;
}

function getInformation() {
    const personString = localStorage.getItem("personal-info");
    if (!personString) return; 
    
    const person = JSON.parse(personString);

    document.getElementById("firstName").textContent = person.firstNameValue;
    document.getElementById("lastName").textContent = person.lastNameValue;
    document.getElementById("address").textContent = person.addressValue;
    document.getElementById("phone").textContent = person.phoneValue;
    document.getElementById("total").textContent = parseFloat(person.totalValue).toFixed(2);

    if (person.deliveryValue === "express") {
        document.getElementById("delivery").textContent = "Express";
    } else {
        document.getElementById("delivery").textContent = "Standard";
    }
}

function renderCart() {
    const cart = getCart();
    const container = document.getElementById("receipt-items");
    container.innerHTML = " ";

    if (cart.length === 0) {
        container.innerHTML = "<p id='empty-cart-message'>Your cart is empty.</p>";
        calculateTotals([]);
        return;
    } else {
        cart.forEach(item => {
        container.innerHTML += `
        <div class="order-summary">
            <img src="${item.image}" alt="${item.name}">
            <div class="info">
                <h3>${item.name}</h3>
                <p>${item.description}</p>
                <p>$${item.price.toFixed(2)}</p>
                <p>Quanitiy: ${item.quantity}</p>
            </div>
        </div>
        `;
        });
    }
}

document.addEventListener("DOMContentLoaded", () => {
    generateRandomOrderNumber();
    getInformation();
    renderCart();
});
