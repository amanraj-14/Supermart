
document.addEventListener("DOMContentLoaded", function () {

    let cartItems = [];

const products = [


// 🥛 Dairy
{ id: 1, name: "Milk", price: 40, category:"dairy", image: "Images/milk.jpg" },
{ id: 2, name: "Butter", price: 55, category:"dairy", image: "Images/butter.jpg" },
{ id: 3, name: "Cheese", price: 110, category:"dairy", image: "Images/cheese.jpg" },
{ id: 4, name: "Paneer", price: 90, category:"dairy", image: "Images/paneer.jpg" },
{ id: 5, name: "Curd", price: 35, category:"dairy", image: "Images/curd.jpg" },

// 🥦 Vegetables
{ id: 6, name: "Tomato", price: 20, category:"vegetable", image: "Images/tomato.jpg" },
{ id: 7, name: "Potato", price: 22, category:"vegetable", image: "Images/potato.jpg" },
{ id: 8, name: "Onion", price: 18, category:"vegetable", image: "Images/onion.jpg" },
{ id: 9, name: "Carrot", price: 25, category:"vegetable", image: "Images/carrot.jpg" },
{ id: 10, name: "Cabbage", price: 30, category:"vegetable", image: "Images/cabbage.jpg" },
{ id: 11, name: "Spinach", price: 15, category:"vegetable", image: "Images/spinach.jpg" },

// 🍎 Fruits
{ id: 12, name: "Apple", price: 120, category:"fruit", image: "Images/apple.jpg" },
{ id: 13, name: "Banana", price: 60, category:"fruit", image: "Images/banana.jpg" },
{ id: 14, name: "Orange", price: 80, category:"fruit", image: "Images/orange.jpg" },
{ id: 15, name: "Mango", price: 150, category:"fruit", image: "Images/mango.jpg" },
{ id: 16, name: "Grapes", price: 90, category:"fruit", image: "Images/grapes.jpg" },

// 🍞 Bakery (grocery me rakh diya)

{ id: 17, name: "Bread", price: 30, category:"grocery", image: "Images/bread.jpg" },
{ id: 18, name: "Buns", price: 25, category:"grocery", image: "Images/buns.jpg" },
{ id: 19, name: "Cake", price: 250, category:"grocery", image: "Images/cake.jpg" },
{ id: 20, name: "Cookies", price: 40, category:"grocery", image: "Images/cookies.jpg" },

// 🍚 Grocery
{ id: 21, name: "Rice", price: 70, category:"grocery", image: "Images/rice.jpg" },
{ id: 22, name: "Wheat Flour", price: 65, category:"grocery", image: "Images/flour.jpg" },
{ id: 23, name: "Sugar", price: 35, category:"grocery", image: "Images/sugar.jpg" },
{ id: 24, name: "Salt", price: 20, category:"grocery", image: "Images/salt.jpg" },
{ id: 25, name: "Tea", price: 120, category:"grocery", image: "Images/tea.jpg" },
{ id: 26, name: "Coffee", price: 150, category:"grocery", image: "Images/coffee.jpg" },

// 🥤 Beverages
{ id: 27, name: "Cold Drink", price: 45, category:"grocery", image: "Images/colddrink.jpg" },
{ id: 28, name: "Juice", price: 60, category:"grocery", image: "Images/juice.jpg" },
{ id: 29, name: "Mineral Water", price: 20, category:"grocery", image: "Images/water.jpg" },

// 🥚 Others
{ id: 30, name: "Eggs", price: 75, category:"grocery", image: "Images/eggs.jpg" }


];


    const recommendationMap = {
    "Milk": ["Bread", "Butter", "Tea"],
    "Butter": ["Bread", "Jam"],
    "Cheese": ["Bread", "Tomato"],
    "Paneer": ["Tomato", "Onion"],

    "Tomato": ["Onion", "Potato"],
    "Potato": ["Onion", "Cabbage"],
    "Onion": ["Tomato", "Potato"],
    "Carrot": ["Cabbage", "Spinach"],

    "Apple": ["Banana", "Orange"],
    "Banana": ["Milk", "Apple"],
    "Orange": ["Apple", "Juice"],
    "Mango": ["Grapes", "Juice"],

    "Bread": ["Butter", "Jam"],
    "Cake": ["Cold Drink"],
    "Cookies": ["Tea", "Coffee"],

    "Rice": ["Wheat Flour", "Salt"],
    "Wheat Flour": ["Rice", "Salt"],
    "Sugar": ["Tea", "Coffee"],
    "Tea": ["Sugar", "Cookies"],
    "Coffee": ["Sugar", "Cookies"],

    "Eggs": ["Bread", "Butter"],
    "Cold Drink": ["Chips"],
    "Juice": ["Apple", "Orange"]
};

    const productsContainer = document.getElementById("product-list");
    const recommendContainer = document.querySelector(".recommendations");
    const searchInput = document.querySelector(".search-box");
    const cartDropdown = document.getElementById("cart-dropdown");
    const cartCount = document.getElementById("cart-count");

    const categoryButtons = document.querySelectorAll(".category-btn");

categoryButtons.forEach(button => {

    button.addEventListener("click", () => {

        categoryButtons.forEach(btn => btn.classList.remove("active"));
        button.classList.add("active");

        const category = button.dataset.category;

        if (category === "all") {
            displayProducts(products);
            return;
        }

        const filtered = products.filter(p => p.category === category);

        displayProducts(filtered);

    });

});

    /* ================= DISPLAY PRODUCTS ================= */

function displayProducts(list) {

productsContainer.innerHTML = "";

list.forEach(product => {

productsContainer.innerHTML += `
<div class="card">

<div class="badge">20% OFF</div>

<img src="${product.image}">
<h4>${product.name}</h4>
<p>₹ ${product.price}</p>

<div id="cart-btn-${product.id}">
<button onclick="addToCart(${product.id})" class="add-btn">
Add to Cart
</button>
</div>

</div>
`;

});

}

    /* ================= ADD TO CART ================= */

   window.addToCart = function (id) {

    const item = products.find(p => p.id === id);
    const existing = cartItems.find(p => p.id === id);

    if (existing) {
        existing.quantity += 1;
    } else {
        cartItems.push({ ...item, quantity: 1 });
    }

    // ✅ BACKEND API CALL ADD KIYA
    fetch("http://127.0.0.1:8000/cart", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            product_id: item.id,
            name: item.name,
            price: item.price,
            quantity: 1
        })
    })
    .then(res => res.json())
    .then(data => console.log("Backend:", data))
    .catch(err => console.log("Error:", err));

    showRecommendations(item.name);
    renderCart();

    const box = document.getElementById(`cart-btn-${id}`);
    const currentItem = cartItems.find(p => p.id === id);

    box.innerHTML = `
    <div class="qty-box">
        <button onclick="decreaseQty(${id})">-</button>
        <span id="qty-${id}">${currentItem.quantity}</span>
        <button onclick="addToCart(${id})">+</button>
    </div>
    `;
};

    /* ================= RENDER CART ================= */

    function renderCart() {
        cartDropdown.innerHTML = "";

        if (cartItems.length === 0) {
            cartDropdown.innerHTML = "<p class='empty-cart'>Your cart is empty</p>";
            cartCount.innerText = 0;
            return;
        }

        let total = 0;
        let count = 0;

        cartItems.forEach(item => {
            total += item.price * item.quantity;
            count += item.quantity;

            cartDropdown.innerHTML += `
                <div class="cart-item">
                    <img src="${item.image}" class="cart-img">

                    <div class="cart-details">
                        <span class="cart-name">${item.name}</span>
                        <div class="cart-qty">
                            <button onclick="decreaseQty(${item.id})">-</button>
                            <span>${item.quantity}</span>
                            <button onclick="increaseQty(${item.id})">+</button>
                        </div>
                        <span class="remove" onclick="removeItem(${item.id})">Remove</span>
                    </div>

                    <div class="cart-price">₹${item.price * item.quantity}</div>
                </div>
            `;
        });

        cartDropdown.innerHTML += `
            <div class="cart-footer">
                <div class="cart-total">Total: ₹${total}</div>
                <button class="checkout-btn" onclick="checkout()">Checkout</button>
            </div>
        `;

        cartCount.innerText = count;
    }

    /* ================= CART OPERATIONS ================= */

   window.increaseQty = function (id) {
    const item = cartItems.find(p => p.id === id);
    item.quantity += 1;

    document.getElementById(`qty-${id}`).innerText = item.quantity;

    renderCart();
};
   window.decreaseQty = function (id) {

const item = cartItems.find(p => p.id === id);

if (item.quantity > 1) {

    item.quantity -= 1;
    document.getElementById(`qty-${id}`).innerText = item.quantity;

} 
else {

    cartItems = cartItems.filter(p => p.id !== id);

    const box = document.getElementById(`cart-btn-${id}`);

    box.innerHTML = `
    <button onclick="addToCart(${id})" class="add-btn">
    Add to Cart
    </button>
    `;

}

renderCart();

};

    window.removeItem = function (id) {
        cartItems = cartItems.filter(p => p.id !== id);
        renderCart();
    };

  window.checkout = async function () {

    let total = cartItems.reduce((sum, item) => 
        sum + item.price * item.quantity, 0);

    const res = await fetch("http://127.0.0.1:8000/create-order", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ amount: total })
    });

    const order = await res.json();

    const options = {
        key: "rzp_test_SVoZ2GmFSGHSS5",
        amount: order.amount,
        currency: "INR",
        name: "SuperMart",
        description: "Grocery Order",
        order_id: order.id,

        handler: function (response) {
            console.log("SUCCESS:", response);

            alert("Payment Successful 🎉");

            // ✅ FIXED EMAIL CALL
            fetch("http://127.0.0.1:8000/payment-success", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    email: "amanr835222@gmail.com",
                    amount: total   // ✅ FIX
                })
            })
            .then(res => res.json())
            .then(data => console.log("Email:", data))
            .catch(err => console.log(err));

            cartItems = [];
            renderCart();
        },

        theme: {
            color: "#3399cc"
        }
    };

    const rzp = new Razorpay(options);
    rzp.open();
};

    /* ================= RECOMMENDATIONS ================= */
function showRecommendations(productName){

recommendContainer.innerHTML = "";

const selected = products.find(p => p.name === productName);

if(!selected) return;

const filtered = products.filter(p =>
p.category === selected.category &&
p.name !== productName
).slice(0,3);

filtered.forEach(item => {

recommendContainer.innerHTML += `
<div class="recommend-card">

<img src="${item.image}">

<div class="recommend-info">
<h4>${item.name}</h4>
<p>₹ ${item.price}</p>

<button onclick="addToCart(${item.id})">Add</button>
</div>

</div>
`;

});

}
    /* ================= SEARCH ================= */

const topSearch = document.getElementById("topSearchBar");
const bigSearch = document.getElementById("bigSearchBar");

function searchProducts(value){

    if(value.trim() === ""){
        displayProducts(products);
        return;
    }

    const filtered = products.filter(product =>
        product.name.toLowerCase().includes(value.toLowerCase())
    );

    displayProducts(filtered);
}

topSearch.addEventListener("keyup", () => {
    searchProducts(topSearch.value);
});

bigSearch.addEventListener("keyup", () => {
    searchProducts(bigSearch.value);
});

    displayProducts(products);

    /* ================= TOGGLE CART ================= */

    window.toggleCart = function () {
        cartDropdown.style.display =
            cartDropdown.style.display === "block" ? "none" : "block";
    };

});

// Set deal end time (24 hours from now)
let dealEnd = new Date().getTime() + (24 * 60 * 60 * 1000);

let timer = setInterval(function () {

    let now = new Date().getTime();
    let distance = dealEnd - now;

    let hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    let minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    let seconds = Math.floor((distance % (1000 * 60)) / 1000);

    document.getElementById("deal-timer").innerHTML =
        hours + " : " + minutes + " : " + seconds;

    if (distance < 0) {
        clearInterval(timer);
        document.getElementById("deal-timer").innerHTML = "Deal Ended";
    }

}, 1000);

