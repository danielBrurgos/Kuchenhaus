document.addEventListener('DOMContentLoaded', function() {

    const productsDatabase = {
        'schwarzw alder': {
            title: "Schwarzwälder Kirsch",
            description: "Authentic Black Forest cake featuring chocolate sponge layers, rich whipped cream, tart cherries, and a touch of Kirschwasser brandy.",
            sizes: {
                'individual': { price: '$85.00', image: 'images/Schwarzwälder_Kirsch.png' }, 
                'medium':     { price: '$650.00', image: 'images/Schwarzwälder_Kirsch.png' },
                'large':      { price: '$950.00', image: 'images/Schwarzwälder_Kirsch.png' }
            }
        },
        'berliner': {
            title: "Classic Berliner",
            description: "Fluffy golden doughnut filled with raspberry jam and dusted with powdered sugar. A timeless German treat.",
            sizes: {
                'individual': { price: '$45.00', image: 'images/Classic Berliner.png' },
                'half dozen': { price: '$250.00', image: 'images/Classic Berliner.png' },
                'dozen':      { price: '$480.00', image: 'images/Classic Berliner.png' }
            }
        },
        'apfelstrudel': {
            title: "Klassischer Apfelstrudel",
            description: "Thin, crispy pastry dough baked golden brown, filled with fresh spiced apples, juicy raisins, and roasted almonds.",
            sizes: {
                'individual': { price: '$55.00', image: 'images/Klassischer Apfelstrudel.png' },
                'half dozen': { price: '$320.00', image: 'images/half-dozen.png' },
                'dozen':      { price: '$600.00', image: 'images/Klassischer Apfelstrudel.png' }
            }
        }
    };

    const urlParams = new URLSearchParams(window.location.search);
    const productId = urlParams.get('product');
    const currentProductData = productsDatabase[productId] || productsDatabase['schwarzw alder'];

    const titleElement = document.getElementById('product-title');
    const descElement = document.getElementById('product-description');
    const priceElement = document.getElementById('product-price');
    const mainImage = document.getElementById('main-product-image');
    
    const sizeButtons = document.querySelectorAll('.size-options .option-btn');
    const flavorButtons = document.querySelectorAll('.flavor-options .option-btn');
    const qtyInput = document.getElementById('qty-input');

    titleElement.textContent = currentProductData.title;
    descElement.textContent = currentProductData.description;
    document.title = currentProductData.title + " - Kuchenhaus";

    const initialSize = 'individual';
    priceElement.textContent = currentProductData.sizes[initialSize].price;
    mainImage.src = currentProductData.sizes[initialSize].image;

    sizeButtons.forEach(button => {
        button.addEventListener('click', function() {
            sizeButtons.forEach(btn => btn.classList.remove('active'));
            this.classList.add('active');

            const selectedSize = this.getAttribute('data-size');
            const sizeData = currentProductData.sizes[selectedSize];

            if (sizeData) {
                mainImage.style.opacity = '0.5';
                priceElement.style.opacity = '0.5';
                
                setTimeout(() => {
                    mainImage.src = sizeData.image;
                    priceElement.textContent = sizeData.price;
                    mainImage.style.opacity = '1';
                    priceElement.style.opacity = '1';
                }, 200);
            }
        });
    });

    flavorButtons.forEach(button => {
        button.addEventListener('click', function() {
            flavorButtons.forEach(btn => btn.classList.remove('active'));
            this.classList.add('active');
        });
    });

    document.getElementById('qty-plus').addEventListener('click', () => {
        qtyInput.value = parseInt(qtyInput.value) + 1;
    });
    document.getElementById('qty-minus').addEventListener('click', () => {
        if (parseInt(qtyInput.value) > 1) {
            qtyInput.value = parseInt(qtyInput.value) - 1;
        }
    });
});