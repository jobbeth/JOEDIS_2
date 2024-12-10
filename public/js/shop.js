document.addEventListener("DOMContentLoaded", () => {
    const cart = [];
    const popup = document.getElementById("popup");
    const cartItemsContainer = document.getElementById("cart-items");
    const totalPriceEl = document.getElementById("total-price");
    const continueShoppingBtn = document.getElementById("continue-shopping");
    const checkoutBtn = document.getElementById("checkout");
    const closePopupBtn = document.getElementById("close-popup");
    const userIconDiv = document.querySelector(".user-icon");

    // Liste over gyldige vouchers og deres regler
    const vouchers = {
        "juice25": {
            discount: 25,
            type: "juice",
            used: false,
            message: "25% off on juice"
        },
        "sandwich25": {
            discount: 25,
            type: "sandwich",
            used: false,
            message: "25% off on sandwiches"
        },
        "advent50": {
            discount: 50,
            type: "all",
            used: false,
            message: "50% off your entire order"
        },
        "jul81": {
            discount: 81,
            type: "all",
            used: false,
            message: "81% off your entire order"
        }
    };

    // Funktion til at tjekke om brugeren er logget ind
    function isLoggedIn() {
        return localStorage.getItem("isLoggedIn") === "true";
    }

    // Opdater brugersymbol
    function updateUserIcon() {
        const isLoggedInStatus = isLoggedIn();

        if (isLoggedInStatus) {
            userIconDiv.innerHTML = 
                `<span>&#128100;</span>
                <button class="logout-button">LOG OUT</button>
            `;

            const logoutButton = document.querySelector(".logout-button");
            logoutButton.addEventListener("click", () => {
                localStorage.removeItem("isLoggedIn");
                localStorage.removeItem("username");

                alert("You have been logged out.");
                window.location.href = "/login.html"; // Redirect to login page
            });
        } else {
            userIconDiv.innerHTML = 
                `<span>&#128100;</span>
                <a href="login.html">LOGIN</a>
            `;
        }
    }

    updateUserIcon();

    // Tilføj vare til kurv
    document.querySelectorAll(".add-to-cart").forEach(button => {
        button.addEventListener("click", (event) => {
            if (!isLoggedIn()) {
                alert("You must be logged in to add items to the cart.");
                window.location.href = "login.html";
                event.preventDefault();
                return;
            }

            const itemName = button.dataset.item;
            const itemPrice = parseFloat(button.dataset.price);

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

    // Opdater kurvindhold
    function updateCart() {
        cartItemsContainer.innerHTML = "";
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

    // Vis popup
    function showPopup() {
        popup.classList.add("visible");
    }

    // Skjul popup ved "Continue Shopping"
    continueShoppingBtn.addEventListener("click", () => {
        popup.classList.remove("visible");
    });

    // Skjul popup ved klik på luk-knappen
    closePopupBtn.addEventListener("click", () => {
        popup.classList.remove("visible");
    });

    // Checkout-knap
    checkoutBtn.addEventListener("click", () => {
        if (!isLoggedIn()) {
            alert("You need to be logged in to checkout.");
            window.location.href = "login.html";
        } else {
            alert("Thank you for your purchase!");
            cart.length = 0;
            updateCart();
            popup.classList.remove("visible");
        }
    });

    // Voucher anvendelsesfunktion
    document.getElementById("apply-voucher").addEventListener("click", () => {
        const voucherCode = document.getElementById("voucher-code").value.trim().toLowerCase();
        const voucherMessageEl = document.getElementById("voucher-message");

        if (!vouchers[voucherCode]) {
            voucherMessageEl.textContent = "Invalid code.";
            voucherMessageEl.style.color = "red";
            return;
        }

        const voucher = vouchers[voucherCode];
        if (voucher.used) {
            voucherMessageEl.textContent = "This code can only be used once.";
            voucherMessageEl.style.color = "red";
            return;
        }

        let totalDiscount = 0;
        if (voucher.type === "juice") {
            cart.forEach(item => {
                if (item.name.toLowerCase().includes("power shake")) {  // Matcher juicevare
                    totalDiscount += item.price * (voucher.discount / 100) * item.quantity;
                }
            });
        } else if (voucher.type === "sandwich") {
            cart.forEach(item => {
                if (item.name.toLowerCase().includes("tunacado")) {  // Matcher sandwich
                    totalDiscount += item.price * (voucher.discount / 100) * item.quantity;
                }
            });
        } else if (voucher.type === "all") {
            cart.forEach(item => {
                totalDiscount += item.price * (voucher.discount / 100) * item.quantity;
            });
        }

        if (totalDiscount > 0) {
            const totalBeforeDiscount = parseFloat(totalPriceEl.textContent);
            const newTotal = totalBeforeDiscount - totalDiscount;
            totalPriceEl.textContent = newTotal.toFixed(2);
            voucher.used = true;

            voucherMessageEl.textContent = `${voucher.message} applied. You saved €${totalDiscount.toFixed(2)}!`;
            voucherMessageEl.style.color = "green";

            // Skjul voucher-feltet efter brug
            document.querySelector(".voucher-section").style.display = "none";
        } else {
            voucherMessageEl.textContent = "The code does not apply to items in your cart.";
            voucherMessageEl.style.color = "red";
        }
    });
});