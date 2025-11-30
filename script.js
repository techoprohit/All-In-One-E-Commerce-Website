// Cart functionality
let cart = JSON.parse(localStorage.getItem('cart')) || [];  

// Function to add item to cart
function addToCart(productId, name, price, image) {
    const existingItem = cart.find(item => item.id === productId);
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({
            id: productId,
            name: name,
            price: parseFloat(price.replace('₹', '').replace(',', '').trim()),
            image: image,
            quantity: 1
        });
    }
    updateCart();
    saveCart();
}

function removeFromCart(productId) {
    cart = cart.filter(item => item.id !== productId);
    updateCart();
    saveCart();
}

function updateQuantity(productId, newQuantity) {
    const item = cart.find(item => item.id === productId);
    if (item) {
        item.quantity = newQuantity;
        if (item.quantity <= 0) {
            removeFromCart(productId);
        } else {
            updateCart();
            saveCart();
        }
    }
}

function updateCart() {
    const cartTable = document.getElementById('cart-table');
    if (cartTable) {
        const tbody = cartTable.querySelector('tbody');
        tbody.innerHTML = '';
        let total = 0;
        cart.forEach(item => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td><img src="${item.image}" alt="${item.name}" style="width:50px; height:50px;"> ${item.name}</td>
                <td>₹${item.price.toFixed(2)}</td>
                <td><input type="number" value="${item.quantity}" min="1" onchange="updateQuantity('${item.id}', this.value)"></td>
                <td>₹${(item.price * item.quantity).toFixed(2)}</td>
                <td><button onclick="removeFromCart('${item.id}')">Remove</button></td>
            `;
            tbody.appendChild(row);
            total += item.price * item.quantity;
        });
        document.getElementById('cart-total').textContent = total.toFixed(2);
    }
    updateCartCount();
}


function saveCart() {
    localStorage.setItem('cart', JSON.stringify(cart));
}

function updateCartCount() {
    const cartCount = document.getElementById('cart-count');
    if (cartCount) {
        cartCount.textContent = cart.reduce((total, item) => total + item.quantity, 0);
    }
}


function filterProducts() {
    const categoryFilter = document.getElementById('category-filter').value;
    const priceFilter = document.getElementById('price-filter').value;
    const products = document.querySelectorAll('.product-item');

    products.forEach(product => {
        const category = product.getAttribute('data-category');
        const price = parseFloat(product.getAttribute('data-price'));
        let show = true;

        if (categoryFilter && category !== categoryFilter) {
            show = false;
        }

        if (priceFilter) {
            const [min, max] = priceFilter.split('-').map(p => p === '+' ? Infinity : parseFloat(p));
            if (price < min || (max && price > max)) {
                show = false;
            }
        }

        product.style.display = show ? 'block' : 'none';
    });
}

function changeImage(src) {
    document.getElementById('main-image').src = src;
}

document.addEventListener('DOMContentLoaded', function() {
    updateCart();
    updateCartCount();

    // Add to cart buttons
    document.querySelectorAll('.add-to-cart').forEach(button => {
        button.addEventListener('click', function(event) {
            event.preventDefault();
            const productItem = this.closest('.product-item');
            const productId = this.getAttribute('data-product-id');
            const name = productItem.querySelector('h4').textContent;
            const price = productItem.querySelector('p').textContent;
            const image = productItem.querySelector('img').src;
            addToCart(productId, name, price, image);
        });
    });

    // Filter products
    const categoryFilter = document.getElementById('category-filter');
    const priceFilter = document.getElementById('price-filter');
    if (categoryFilter && priceFilter) {
        categoryFilter.addEventListener('change', filterProducts);
        priceFilter.addEventListener('change', filterProducts);
    }

    // Checkout form
    const checkoutForm = document.getElementById('checkout-form');
    if (checkoutForm) {
        checkoutForm.addEventListener('submit', function(e) {
            e.preventDefault();
            // Simulate order placement
            document.getElementById('checkout-form').style.display = 'none';
            document.getElementById('order-confirmation').style.display = 'block';
            cart = [];
            saveCart();
        });
    }

    // Login form
    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        loginForm.addEventListener('submit', function(event) {
            event.preventDefault();
            let email = document.getElementById("email").value.trim();
            let password = document.getElementById("password").value.trim();
            if (!email || !password) {
                alert("Please fill in both fields.");
                return;
            }
            localStorage.setItem("email", email);
            localStorage.setItem("password", password);
            window.location.href = "details.html";
        });
    }
});
