document.addEventListener('DOMContentLoaded', function() {

    // 1. VERIFICACIÓN DE SESIÓN (Protección de ruta)
    const currentUser = localStorage.getItem('currentUser');
    
    if (!currentUser && !window.location.pathname.includes('login.html')) {
        window.location.href = 'login.html';
        return; 
    }

    // 2. MOSTRAR INFO DE USUARIO EN EL NAV
    const userNameDisplay = document.getElementById('user-name-display');
    if (userNameDisplay && currentUser) {
        userNameDisplay.textContent = currentUser;
    }

    // 3. LÓGICA DE LOGOUT
    const logoutBtn = document.getElementById('logout-btn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', (e) => {
            e.preventDefault();
            localStorage.removeItem('currentUser');
            window.location.href = 'login.html';
        });
    }

    // 4. FUNCIONES DE FAVORITOS POR USUARIO
    function getFavorites() {
        if (!currentUser) return [];
        return JSON.parse(localStorage.getItem(`favs_${currentUser}`)) || [];
    }

    function toggleFavorite(id) {
        if (!currentUser) return;
        let favs = getFavorites();
        const cleanId = decodeURIComponent(id);
        
        if (favs.includes(cleanId)) {
            favs = favs.filter(item => item !== cleanId);
        } else {
            favs.push(cleanId);
        }
        
        localStorage.setItem(`favs_${currentUser}`, JSON.stringify(favs));
        updateHeartIcons(); 
    }

    // 5. BASE DE DATOS DE PRODUCTOS
    const productsDatabase = {
        'schwarzw alder': { category: 'pasteles', title: "Schwarzwälder Kirsch", description: "Authentic Black Forest cake...", sizes: { 'individual': { price: '$85.00', image: 'images/Schwarzwälder_Kirsch.png' }, 'medium': { price: '$650.00', image: 'images/Schwarzwälder_Kirsch.png' }, 'large': { price: '$950.00', image: 'images/Schwarzwälder_Kirsch.png' } } },
        'berliner': { category: 'donas', title: "Classic Berliner", description: "Fluffy golden doughnut...", sizes: { 'individual': { price: '$45.00', image: 'images/Classic Berliner.png' }, 'half dozen': { price: '$250.00', image: 'images/Classic Berliner.png' }, 'dozen': { price: '$480.00', image: 'images/Classic Berliner.png' } } },
        'apfelstrudel': { category: 'strudel', title: "Klassischer Apfelstrudel", description: "Thin, crispy pastry dough...", sizes: { 'individual': { price: '$55.00', image: 'images/Klassischer Apfelstrudel.png' }, 'half dozen': { price: '$320.00', image: 'images/half-dozen.png' }, 'dozen': { price: '$600.00', image: 'images/Klassischer Apfelstrudel.png' } } }
    };

    // 6. FILTROS (Index.html)
    const filterButtons = document.querySelectorAll('.filter-btn');
    const productCards = document.querySelectorAll('.product-card');

    filterButtons.forEach(btn => {
        btn.addEventListener('click', function() {
            filterButtons.forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            const category = this.getAttribute('data-filter');
            const favs = getFavorites();
            
            productCards.forEach(card => {
                const link = card.querySelector('.buy-btn-link').getAttribute('href');
                const id = decodeURIComponent(link.split('=')[1]);
                if (category === 'all') {
                    card.style.display = 'block';
                } else if (category === 'favs') {
                    card.style.display = favs.includes(id) ? 'block' : 'none';
                } else {
                    const productData = productsDatabase[id];
                    card.style.display = (productData && productData.category === category) ? 'block' : 'none';
                }
            });
        });
    });

    // 7. DETALLES DE PRODUCTO (Product.html)
    const urlParams = new URLSearchParams(window.location.search);
    const productId = urlParams.get('product');

    if (productId && productsDatabase[productId]) {
        const currentProductData = productsDatabase[productId];
        const titleElement = document.getElementById('product-title');
        const descElement = document.getElementById('product-description');
        const priceElement = document.getElementById('product-price');
        const mainImage = document.getElementById('main-product-image');
        
        if (titleElement) {
            titleElement.textContent = currentProductData.title;
            descElement.textContent = currentProductData.description;
            document.title = currentProductData.title + " - Kuchenhaus";
            const initialSize = 'individual';
            priceElement.textContent = currentProductData.sizes[initialSize].price;
            mainImage.src = currentProductData.sizes[initialSize].image;

            const sizeButtons = document.querySelectorAll('.size-options .option-btn');
            sizeButtons.forEach(button => {
                button.addEventListener('click', function() {
                    sizeButtons.forEach(btn => btn.classList.remove('active'));
                    this.classList.add('active');
                    const selectedSize = this.getAttribute('data-size');
                    const sizeData = currentProductData.sizes[selectedSize];
                    if (sizeData) {
                        mainImage.style.opacity = '0.5';
                        setTimeout(() => {
                            mainImage.src = sizeData.image;
                            priceElement.textContent = sizeData.price;
                            mainImage.style.opacity = '1';
                        }, 200);
                    }
                });
            });
        }
    }

    // 8. CORAZONES VISUALES
    function updateHeartIcons() {
        const favs = getFavorites();
        const allHeartBtns = document.querySelectorAll('.icon-btn');
        allHeartBtns.forEach(btn => {
            const card = btn.closest('.product-card');
            if (card) {
                const link = card.querySelector('.buy-btn-link').getAttribute('href');
                const id = decodeURIComponent(link.split('=')[1]);
                const icon = btn.querySelector('i');
                if (favs.includes(id)) {
                    btn.classList.add('active-fav');
                    if(icon) icon.className = 'fi fi-sr-heart';
                } else {
                    btn.classList.remove('active-fav');
                    if(icon) icon.className = 'fi fi-rr-heart';
                }
            }
        });
    }

    document.querySelectorAll('.icon-btn').forEach(btn => {
        btn.addEventListener('click', function(e) {
            e.preventDefault();
            const card = this.closest('.product-card');
            const link = card.querySelector('.buy-btn-link').getAttribute('href');
            const id = link.split('=')[1];
            toggleFavorite(id);
        });
    });

    // 9. LÓGICA DEL CARRITO (Cart.html)
    function getCart() {
        return JSON.parse(localStorage.getItem(`cart_${currentUser}`)) || [];
    }

    function renderCart() {
        const container = document.getElementById('cart-items-container');
        const totalElement = document.getElementById('cart-total');
        if (!container) return;

        const cart = getCart();
        container.innerHTML = '';
        let total = 0;

        if (cart.length === 0) {
            container.innerHTML = '<p style="color: #ccc; text-align: center; font-family: Poppins;">Your cart is empty.</p>';
        } else {
            cart.forEach((item, index) => {
                total += item.price * item.qty;
                container.innerHTML += `
                    <div class="cart-item" style="display: flex; align-items: center; background: #252525; padding: 20px; margin-bottom: 15px; border-radius: 8px; justify-content: space-between; border: 1px solid #333;">
                        <img src="${item.image}" style="width: 80px; height: 80px; object-fit: cover; border-radius: 5px;">
                        <div style="flex-grow: 1; margin-left: 20px;">
                            <h3 style="color: #C5A059; margin: 0; font-family: Playfair Display;">${item.name}</h3>
                            <p style="color: #ccc; font-size: 0.8rem; margin: 5px 0; font-family: Poppins;">Size: ${item.size} | Qty: ${item.qty}</p>
                        </div>
                        <p style="color: #F4F4F0; font-weight: bold; font-family: Poppins;">$${(item.price * item.qty).toFixed(2)}</p>
                        <button onclick="removeFromCart(${index})" style="background: none; border: none; color: #ff4757; cursor: pointer; margin-left: 20px; font-size: 1.2rem;">&times;</button>
                    </div>
                `;
            });
        }
        if(totalElement) totalElement.textContent = `$${total.toFixed(2)}`;
    }

    // Hacer la función global para que el botón "X" la encuentre
    window.removeFromCart = function(index) {
        let cart = getCart();
        cart.splice(index, 1);
        localStorage.setItem(`cart_${currentUser}`, JSON.stringify(cart));
        renderCart();
    };

    // Agregar al carrito desde Product.html
    const addToCartBtn = document.querySelector('.add-to-cart-large-btn');
    if (addToCartBtn && productId) {
        addToCartBtn.addEventListener('click', () => {
            let cart = getCart();
            const activeSizeBtn = document.querySelector('.size-options .option-btn.active');
            const size = activeSizeBtn ? activeSizeBtn.getAttribute('data-size') : 'individual';
            const priceText = document.getElementById('product-price').textContent;
            const priceNum = parseFloat(priceText.replace('$', ''));
            const qty = parseInt(document.getElementById('qty-input').value);

            const newItem = {
                id: productId,
                name: document.getElementById('product-title').textContent,
                size: size,
                price: priceNum,
                image: document.getElementById('main-product-image').src,
                qty: qty
            };

            cart.push(newItem);
            localStorage.setItem(`cart_${currentUser}`, JSON.stringify(cart));
            alert("Added to cart!");
        });
    }

    // 10. SELECTORES Y EVENTOS INICIALES
    const qtyInput = document.getElementById('qty-input');
    if(qtyInput) {
        document.getElementById('qty-plus').addEventListener('click', () => { qtyInput.value = parseInt(qtyInput.value) + 1; });
        document.getElementById('qty-minus').addEventListener('click', () => { if (parseInt(qtyInput.value) > 1) qtyInput.value = parseInt(qtyInput.value) - 1; });
    }

    renderCart();
    updateHeartIcons(); 
});