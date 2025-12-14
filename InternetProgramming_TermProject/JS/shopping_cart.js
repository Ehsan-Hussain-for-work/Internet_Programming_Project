
function getCart() {
    const storedCart = localStorage.getItem("cart");

    if (storedCart) {
        return JSON.parse(storedCart);
    } else {
        console.error("Could not parse cart data from localStorage:", e);
        localStorage.removeItem("cart"); 
        return []; 
    }
}


function calculateTotals(cart) {
    const subtotal = cart.reduce((total, currentItem) => total + currentItem.price * currentItem.quantity, 0);
    const taxes = subtotal * 0.15;
    const total = subtotal + taxes;

    $("#subtotal").text(subtotal.toFixed(2));
    $("#tax").text(taxes.toFixed(2));
    $("#total").text(total.toFixed(2));
}

function removeItem(id) {
  const cart = getCart().filter(i => i.id !== id);
  localStorage.setItem("cart", JSON.stringify(cart));
  renderCart();
  updateCartCount();
}

function updateQty(id, qty) {
    const cart = getCart();
    const item = cart.find(i => i.id === id);
    if (!item) return;

    let newQty = Math.max(1, parseInt(qty));

    if (newQty > item.stock) {
        newQty = item.stock; 
        alert(`Sorry, you can only order a maximum of ${item.stock} unit(s) of ${item.name}.`); 
    }

    item.quantity = newQty;
    localStorage.setItem("cart", JSON.stringify(cart));
    renderCart();
    updateCartCount();
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
                <input type="number" min="1" value="${item.quantity}"
                onchange="updateQty(${item.id}, this.value)">
                <button onclick="removeItem(${item.id})">Remove</button>
            </div>
        </div>
        `;
        });
    }
    calculateTotals(cart);
}

document.addEventListener("DOMContentLoaded", renderCart);
