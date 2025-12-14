function calculateTotals(cart) {
    const selectedDeliveryOption = $('input[name="delivery"]:checked').val();
    const isExpressChecked = (selectedDeliveryOption === 'express');
    
    const subtotal = cart.reduce((total, currentItem) => total + currentItem.price * currentItem.quantity, 0);
    const taxRate = 0.15;
    const expressFee = 10.00;
    const taxes = subtotal * taxRate;
    const deliveryFees = isExpressChecked ? expressFee : 0.00;

    const total = subtotal + taxes + deliveryFees;

    var $subtotal = $("#subtotal");
    var $tax = $("#tax");
    var $total = $("#total");
    var $deliveryFees = $("#deliveryFees");

    $subtotal.text(subtotal.toFixed(2));
    $tax.text(taxes.toFixed(2));
    $deliveryFees.text(deliveryFees.toFixed(2));
    $total.text(total.toFixed(2));
}

function renderCart() {
    const cart = getCart();
    const container = document.getElementById("cart-list");
    container.innerHTML = " ";

    if (cart.length === 0) {
        container.innerHTML = "<p id='empty-cart-message'>Your cart is empty.</p>";
        calculateTotals([]);
        return;
    } else {
        cart.forEach(item => {
        container.innerHTML += `
        <div class="cart-list">
            <img src="${item.image}" alt="${item.title}">
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
    calculateTotals(cart);
}

function handleDeliveryChange() {
    const cart = getCart();
    calculateTotals(cart);
}

function confirmOrder() {
    const firstNameValue = document.getElementById("firstName").value.trim();
    const lastNameValue = document.getElementById("lastName").value.trim();
    const phoneValue = document.getElementById("phone").value.trim();
    const emailValue = document.getElementById("email").value.trim();
    const addressValue = document.getElementById("address").value.trim();
    const totalValue = document.getElementById("total").textContent;
    const deliveryValue = document.querySelector('input[name="delivery"]:checked').value;

    if (!firstNameValue || !lastNameValue || !phoneValue || !emailValue || !addressValue) {
        alert("All fields are required!");
        return;
    }

    const information = { firstNameValue, lastNameValue, phoneValue, emailValue, addressValue, totalValue, deliveryValue};
    const informationString = JSON.stringify(information);
    localStorage.setItem("personal-info", informationString);

    window.location.href = "order_confirmation.html";
}

document.addEventListener("DOMContentLoaded", renderCart);

