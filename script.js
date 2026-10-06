let allProducts = [];

let cart =
    JSON.parse(
        localStorage.getItem(
            "booknestCart"
        )
    ) || [];


// ==================================================
// LOAD PRODUCTS
// ==================================================

async function loadProducts() {

    try {

        const response =
            await fetch(
                `${API_URL}/products`
            );


        if (!response.ok) {

            throw new Error(
                "Unable to load products"
            );

        }


        allProducts =
            await response.json();


        displayProducts(
            allProducts
        );


        updateCartCount();


    } catch (error) {

        console.error(error);


        document.getElementById(
            "productsContainer"
        ).innerHTML = `

            <div style="
                text-align:center;
                grid-column:1/-1;
                padding:50px;
            ">

                <h2>
                    ❌ Backend Not Connected
                </h2>

                <p>
                    Please run:
                </p>

                <code>
                    python app.py
                </code>

            </div>

        `;

    }

}


// ==================================================
// DISPLAY PRODUCTS
// ==================================================

function displayProducts(
    products
) {

    const container =
        document.getElementById(
            "productsContainer"
        );


    document.getElementById(
        "productCount"
    ).textContent =
        `${products.length} products`;


    if (
        products.length === 0
    ) {

        container.innerHTML = `

            <div style="
                grid-column:1/-1;
                text-align:center;
                padding:50px;
            ">

                <h2>
                    😕 No products found
                </h2>

                <p>
                    Try another search.
                </p>

            </div>

        `;

        return;

    }


    container.innerHTML =

        products.map(
            product => `

            <div class="product-card">

                <div
                    class="product-image"
                    onclick="
                        showProduct(
                            ${product.id}
                        )
                    "
                >
                    ${product.emoji}
                </div>


                <span
                    class="product-category"
                >
                    ${product.category}
                </span>


                <h3
                    onclick="
                        showProduct(
                            ${product.id}
                        )
                    "
                >
                    ${product.name}
                </h3>


                <p
                    class="product-description"
                >
                    ${product.description}
                </p>


                <div
                    class="product-bottom"
                >

                    <span
                        class="price"
                    >
                        ₹${product.price}
                    </span>


                    <button
                        class="add-button"
                        onclick="
                            addToCart(
                                ${product.id}
                            )
                        "
                    >
                        + Cart
                    </button>

                </div>

            </div>

        `
        ).join("");

}


// ==================================================
// SEARCH
// ==================================================

function searchProducts() {

    const search =
        document.getElementById(
            "searchInput"
        )
        .value
        .toLowerCase()
        .trim();


    const filtered =
        allProducts.filter(
            product =>

                product.name
                    .toLowerCase()
                    .includes(search)

                ||

                product.category
                    .toLowerCase()
                    .includes(search)

                ||

                product.description
                    .toLowerCase()
                    .includes(search)

        );


    displayProducts(
        filtered
    );

}


// ==================================================
// CATEGORY
// ==================================================

function filterCategory(
    category
) {

    document.getElementById(
        "searchInput"
    ).value = "";


    if (
        category === "All"
    ) {

        displayProducts(
            allProducts
        );

        return;

    }


    const filtered =
        allProducts.filter(
            product =>
                product.category ===
                category
        );


    displayProducts(
        filtered
    );


    document.getElementById(
        "products"
    ).scrollIntoView({
        behavior: "smooth"
    });

}


// ==================================================
// PRODUCT DETAILS
// ==================================================

function showProduct(id) {

    const product =
        allProducts.find(
            p => p.id === id
        );


    if (!product) return;


    document.getElementById(
        "productDetails"
    ).innerHTML = `

        <div class="details-emoji">
            ${product.emoji}
        </div>


        <div class="details-category">
            ${product.category}
        </div>


        <h2>
            ${product.name}
        </h2>


        <div class="details-price">
            ₹${product.price}
        </div>


        <p class="details-description">
            ${product.description}
        </p>


        <p>
            <strong>
                Available:
            </strong>

            ${product.stock}
        </p>


        <br>


        <button
            class="details-add"
            onclick="
                addToCart(
                    ${product.id}
                );

                closeProductModal();
            "
        >
            🛒 Add to Cart
        </button>

    `;


    document.getElementById(
        "productModal"
    ).classList.add(
        "active"
    );

}


function closeProductModal() {

    document.getElementById(
        "productModal"
    ).classList.remove(
        "active"
    );

}


// ==================================================
// ADD CART
// ==================================================

function addToCart(id) {

    const product =
        allProducts.find(
            p => p.id === id
        );


    if (!product) return;


    const existing =
        cart.find(
            item => item.id === id
        );


    if (existing) {

        if (
            existing.quantity
            >= product.stock
        ) {

            alert(
                "Maximum available stock reached."
            );

            return;

        }


        existing.quantity++;

    } else {

        cart.push({

            id:
                product.id,

            name:
                product.name,

            price:
                product.price,

            emoji:
                product.emoji,

            quantity:
                1

        });

    }


    saveCart();

    updateCartCount();


    alert(
        `${product.name} added to cart 🛒`
    );

}


// ==================================================
// SAVE CART
// ==================================================

function saveCart() {

    localStorage.setItem(
        "booknestCart",
        JSON.stringify(
            cart
        )
    );

}


// ==================================================
// CART COUNT
// ==================================================

function updateCartCount() {

    const count =
        cart.reduce(
            (
                total,
                item
            ) =>
                total +
                item.quantity,
            0
        );


    document.getElementById(
        "cartCount"
    ).textContent =
        count;

}


// ==================================================
// OPEN CART
// ==================================================

function openCart() {

    displayCart();


    document.getElementById(
        "cartModal"
    ).classList.add(
        "active"
    );

}


function closeCart() {

    document.getElementById(
        "cartModal"
    ).classList.remove(
        "active"
    );

}


// ==================================================
// DISPLAY CART
// ==================================================

function displayCart() {

    const container =
        document.getElementById(
            "cartItems"
        );


    if (
        cart.length === 0
    ) {

        container.innerHTML = `

            <div style="
                text-align:center;
                padding:40px;
            ">

                <div style="
                    font-size:60px;
                ">
                    🛒
                </div>

                <h3>
                    Your cart is empty
                </h3>

                <p>
                    Add products to continue.
                </p>

            </div>

        `;


        document.getElementById(
            "cartTotal"
        ).textContent =
            "₹0";


        return;

    }


    container.innerHTML =

        cart.map(
            item => `

            <div
                class="cart-item"
            >

                <div
                    class="cart-item-emoji"
                >
                    ${item.emoji}
                </div>


                <div
                    class="cart-item-info"
                >

                    <h4>
                        ${item.name}
                    </h4>

                    <p>
                        ₹${item.price}
                    </p>

                </div>


                <div
                    class="quantity"
                >

                    <button
                        onclick="
                            changeQuantity(
                                ${item.id},
                                -1
                            )
                        "
                    >
                        −
                    </button>


                    <strong>
                        ${item.quantity}
                    </strong>


                    <button
                        onclick="
                            changeQuantity(
                                ${item.id},
                                1
                            )
                        "
                    >
                        +
                    </button>

                </div>


                <button
                    class="remove-button"
                    onclick="
                        removeFromCart(
                            ${item.id}
                        )
                    "
                >
                    Remove
                </button>

            </div>

        `
        ).join("");


    const total =
        cart.reduce(
            (
                sum,
                item
            ) =>
                sum +
                (
                    item.price *
                    item.quantity
                ),
            0
        );


    document.getElementById(
        "cartTotal"
    ).textContent =
        `₹${total}`;

}


// ==================================================
// CHANGE QUANTITY
// ==================================================

function changeQuantity(
    id,
    amount
) {

    const item =
        cart.find(
            item =>
                item.id === id
        );


    if (!item) return;


    const product =
        allProducts.find(
            p =>
                p.id === id
        );


    item.quantity +=
        amount;


    if (
        product &&
        item.quantity >
        product.stock
    ) {

        item.quantity =
            product.stock;

    }


    if (
        item.quantity <= 0
    ) {

        cart =
            cart.filter(
                item =>
                    item.id !== id
            );

    }


    saveCart();

    updateCartCount();

    displayCart();

}


// ==================================================
// REMOVE
// ==================================================

function removeFromCart(
    id
) {

    cart =
        cart.filter(
            item =>
                item.id !== id
        );


    saveCart();

    updateCartCount();

    displayCart();

}


// ==================================================
// CHECKOUT
// ==================================================

function openCheckout() {

    if (
        cart.length === 0
    ) {

        alert(
            "Your cart is empty!"
        );

        return;

    }


    displayCheckoutSummary();


    closeCart();


    document.getElementById(
        "checkoutModal"
    ).classList.add(
        "active"
    );

}


function closeCheckout() {

    document.getElementById(
        "checkoutModal"
    ).classList.remove(
        "active"
    );

}


// ==================================================
// CHECKOUT SUMMARY
// ==================================================

function displayCheckoutSummary() {

    const summary =
        document.getElementById(
            "checkoutSummary"
        );


    summary.innerHTML =

        cart.map(
            item => `

            <div
                style="
                    display:flex;
                    justify-content:space-between;
                    margin:8px 0;
                "
            >

                <span>
                    ${item.emoji}
                    ${item.name}
                    × ${item.quantity}
                </span>

                <strong>
                    ₹${
                        item.price *
                        item.quantity
                    }
                </strong>

            </div>

        `
        ).join("");


    const total =
        cart.reduce(
            (
                sum,
                item
            ) =>
                sum +
                (
                    item.price *
                    item.quantity
                ),
            0
        );


    document.getElementById(
        "checkoutTotal"
    ).textContent =
        `Total: ₹${total}`;

}


// ==================================================
// PLACE ORDER
// ==================================================

document.getElementById(
    "checkoutForm"
).addEventListener(
    "submit",
    async function(event) {

        event.preventDefault();


        // Browser validation
        if (
            !this.checkValidity()
        ) {

            this.reportValidity();

            return;

        }


        // -----------------------------
        // CUSTOMER DETAILS
        // -----------------------------

        const customer = {

            name:
                document.getElementById(
                    "customerName"
                ).value.trim(),

            email:
                document.getElementById(
                    "customerEmail"
                ).value.trim(),

            phone:
                document.getElementById(
                    "customerPhone"
                ).value.trim(),

            address:
                document.getElementById(
                    "customerAddress"
                ).value.trim(),

            city:
                document.getElementById(
                    "customerCity"
                ).value.trim(),

            state:
                document.getElementById(
                    "customerState"
                ).value,

            pincode:
                document.getElementById(
                    "customerPincode"
                ).value.trim()

        };


        // -----------------------------
        // EXTRA VALIDATION
        // -----------------------------

        if (
            customer.phone.length !==
            10
        ) {

            alert(
                "Please enter a valid 10-digit phone number."
            );

            return;

        }


        if (
            customer.pincode.length !==
            6
        ) {

            alert(
                "Please enter a valid 6-digit pincode."
            );

            return;

        }


        if (
            cart.length === 0
        ) {

            alert(
                "Your cart is empty."
            );

            return;

        }


        // -----------------------------
        // SEND TO FLASK
        // -----------------------------

        try {

            const response =
                await fetch(
                    `${API_URL}/orders`,
                    {

                        method:
                            "POST",

                        headers: {

                            "Content-Type":
                                "application/json"

                        },

                        body:
                            JSON.stringify({

                                customer:
                                    customer,

                                cart:
                                    cart

                            })

                    }
                );


            const result =
                await response.json();


            // -----------------------------
            // SERVER REJECTED ORDER
            // -----------------------------

            if (
                !response.ok ||
                !result.success
            ) {

                alert(
                    result.error ||
                    "Order could not be placed."
                );

                return;

            }


            // -----------------------------
            // ONLY NOW SUCCESS
            // -----------------------------

            const orderId =
                result.order.order_id;


            cart = [];


            saveCart();

            updateCartCount();


            closeCheckout();


            this.reset();


            document.getElementById(
                "successMessage"
            ).innerHTML = `

                <div>

                    <div
                        style="
                            font-size:60px;
                        "
                    >
                        🎉
                    </div>


                    <h2>
                        Order Placed Successfully!
                    </h2>


                    <p>
                        Thank you for shopping
                        with BookNest.
                    </p>


                    <p>
                        <strong>
                            Order ID:
                        </strong>

                        ${orderId}
                    </p>


                    <p>
                        Your order will be
                        delivered to:
                    </p>


                    <p>
                        ${customer.address},
                        ${customer.city},
                        ${customer.state}
                        -
                        ${customer.pincode}
                    </p>


                    <button
                        onclick="
                            closeSuccess()
                        "
                    >
                        Continue Shopping
                    </button>

                </div>

            `;


            document.getElementById(
                "successMessage"
            ).classList.add(
                "active"
            );


        } catch (error) {

            console.error(
                error
            );


            alert(
                "Cannot connect to BookNest server. Please make sure Flask is running."
            );

        }

    }
);


// ==================================================
// SUCCESS
// ==================================================

function closeSuccess() {

    document.getElementById(
        "successMessage"
    ).classList.remove(
        "active"
    );

}


// ==================================================
// SCROLL
// ==================================================

function scrollToProducts() {

    document.getElementById(
        "products"
    ).scrollIntoView({
        behavior: "smooth"
    });

}


// ==================================================
// START
// ==================================================

loadProducts();