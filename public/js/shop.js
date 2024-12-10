document.addEventListener("DOMContentLoaded", () => {
    const cart = [];
    const popup = document.getElementById("popup");
    const cartItemsContainer = document.getElementById("cart-items");
    const totalPriceEl = document.getElementById("total-price");
    const continueShoppingBtn = document.getElementById("continue-shopping");
    const checkoutBtn = document.getElementById("checkout");
    const closePopupBtn = document.getElementById("close-popup");
    const userIconDiv = document.querySelector(".user-icon");

    // Function to check if the user is logged in
    function isLoggedIn() {
        return localStorage.getItem("isLoggedIn") === "true";
    }

    // Function to update the user icon (Login/Logout button)
    function updateUserIcon() {
        const isLoggedInStatus = isLoggedIn();
        
        if (isLoggedInStatus) {
            userIconDiv.innerHTML = `
                <span>&#128100;</span>
                <button class="logout-button">LOG OUT</button>
            `;

            const logoutButton = document.querySelector(".logout-button");
            logoutButton.addEventListener("click", () => {
                // Remove login status and username from localStorage
                localStorage.removeItem("isLoggedIn");
                localStorage.removeItem("username");

                alert("You have been logged out.");
                window.location.href = "/login.html"; // Redirect to login page
            });
        } else {
            userIconDiv.innerHTML = `
                <span>&#128100;</span>
                <a href="login.html">LOGIN</a>
            `;
        }
    }

    // Update user icon on page load
    updateUserIcon();

    // Add item to cart
    document.querySelectorAll(".add-to-cart").forEach(button => {
        button.addEventListener("click", (event) => {
            if (!isLoggedIn()) {
                // If not logged in, redirect to login page
                alert("You must be logged in to add items to the cart.");
                window.location.href = "login.html"; // Redirect to login page
                event.preventDefault(); // Stop further execution
                return; // Exit the function
            }

            const itemName = button.dataset.item;
            const itemPrice = parseFloat(button.dataset.price);

            // Check if the item is already in the cart
            const existingItem = cart.find(item => item.name === itemName);
            if (existingItem) {
                existingItem.quantity++;
            } else {
                cart.push({ name: itemName, price: itemPrice, quantity: 1 });
            }

            updateCart();
            showPopup();
        });
    });

    // Update cart content
    function updateCart() {
        cartItemsContainer.innerHTML = ""; // Clear existing items
        let total = 0;

        cart.forEach(item => {
            const cartItemEl = document.createElement("div");
            cartItemEl.className = "cart-item";
            cartItemEl.innerHTML = 
                `<span>${item.name} (€${item.price})</span>
                <div>
                    <button class="decrease-quantity">-</button>
                    <span>${item.quantity}</span>
                    <button class="increase-quantity">+</button>
                </div>`;
            cartItemsContainer.appendChild(cartItemEl);

            total += item.price * item.quantity;

            // Handle quantity change buttons
            const decreaseBtn = cartItemEl.querySelector(".decrease-quantity");
            const increaseBtn = cartItemEl.querySelector(".increase-quantity");

            decreaseBtn.addEventListener("click", () => {
                if (item.quantity > 1) {
                    item.quantity--;
                } else {
                    cart.splice(cart.indexOf(item), 1);
                }
                updateCart();
            });

            increaseBtn.addEventListener("click", () => {
                item.quantity++;
                updateCart();
            });
        });

        totalPriceEl.textContent = total.toFixed(2);
    }

    // Show popup
    function showPopup() {
        popup.classList.add("visible");
    }

    // Hide popup on "Continue Shopping"
    continueShoppingBtn.addEventListener("click", () => {
        popup.classList.remove("visible");
    });

    // Hide popup when close button is clicked
    closePopupBtn.addEventListener("click", () => {
        popup.classList.remove("visible");
    });

    // Checkout button
    checkoutBtn.addEventListener("click", () => {
        if (!isLoggedIn()) {
            alert("You need to be logged in to checkout.");
            window.location.href = "login.html";  // Redirect to login page
        } else {
            alert("Thank you for your purchase!");
            cart.length = 0; // Clear the cart
            updateCart();
            popup.classList.remove("visible");
        }
    });
});