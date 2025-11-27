// shared.js - Updated Cart Manager
class CartManager {
    constructor() {
        this.cart = this.loadCart();
        this.initCart();
    }

    // Load cart from localStorage
    loadCart() {
        const savedCart = localStorage.getItem('randwestCart');
        return savedCart ? JSON.parse(savedCart) : [];
    }

    // Save cart to localStorage
    saveCart() {
        localStorage.setItem('randwestCart', JSON.stringify(this.cart));
        this.updateCartDisplay();
    }

    // Add item to cart
    addItem(productId, productName, productPrice, quantity = 1) {
        const existingItem = this.cart.find(item => item.id === productId);
        
        if (existingItem) {
            existingItem.quantity += quantity;
        } else {
            this.cart.push({
                id: productId,
                name: productName,
                price: productPrice,
                quantity: quantity
            });
        }
        
        this.saveCart();
        this.showAddToCartAnimation();
    }

    // Remove item from cart
    removeItem(productId) {
        this.cart = this.cart.filter(item => item.id !== productId);
        this.saveCart();
    }

    // Update item quantity
    updateQuantity(productId, newQuantity) {
        const item = this.cart.find(item => item.id === productId);
        if (item) {
            if (newQuantity <= 0) {
                this.removeItem(productId);
            } else {
                item.quantity = newQuantity;
                this.saveCart();
            }
        }
    }

    // Clear entire cart (after purchase)
    clearCart() {
        this.cart = [];
        this.saveCart();
    }

    // Get cart total
    getTotal() {
        return this.cart.reduce((total, item) => total + (item.price * item.quantity), 0);
    }

    // Get total items count
    getTotalItems() {
        return this.cart.reduce((total, item) => total + item.quantity, 0);
    }

    // Update cart display on all pages
    updateCartDisplay() {
        // Update cart count in header
        const cartCountElements = document.querySelectorAll('.cart-count');
        cartCountElements.forEach(element => {
            element.textContent = this.getTotalItems();
        });

        // Update cart modal if it's open
        this.updateCartModal();
    }

    // Update cart modal content
    updateCartModal() {
        const cartModal = document.getElementById('cartModal');
        if (cartModal && cartModal.style.display === 'block') {
            this.renderCartModal();
        }
    }

    // Render cart modal content
    renderCartModal() {
        const cartItems = document.getElementById('cartItems');
        const cartTotal = document.getElementById('cartTotal');
        const emptyCart = document.getElementById('emptyCart');

        if (!cartItems) return;

        if (this.cart.length === 0) {
            cartItems.innerHTML = '';
            if (emptyCart) {
                cartItems.appendChild(emptyCart);
                emptyCart.style.display = 'block';
            }
            if (cartTotal) cartTotal.textContent = 'R0';
            return;
        }

        if (emptyCart) emptyCart.style.display = 'none';

        cartItems.innerHTML = '';
        this.cart.forEach(item => {
            const cartItem = document.createElement('div');
            cartItem.className = 'cart-item';
            cartItem.innerHTML = `
                <div class="cart-item-img">
                    <i class="fas fa-book"></i>
                </div>
                <div class="cart-item-details">
                    <div class="cart-item-title">${item.name}</div>
                    <div class="cart-item-price">R${item.price}</div>
                    <div class="cart-item-quantity">
                        <button class="quantity-btn minus" data-id="${item.id}">-</button>
                        <span class="item-quantity">${item.quantity}</span>
                        <button class="quantity-btn plus" data-id="${item.id}">+</button>
                    </div>
                </div>
                <button class="cart-item-remove" data-id="${item.id}">
                    <i class="fas fa-trash"></i>
                </button>
            `;
            cartItems.appendChild(cartItem);
        });

        if (cartTotal) {
            cartTotal.textContent = `R${this.getTotal()}`;
        }

        // Add event listeners to new cart items
        this.attachCartEventListeners();
    }

    // Show add to cart animation
    showAddToCartAnimation() {
        // Create a flying animation to cart
        this.createFlyingAnimation();
    }

    // Create flying item animation
    createFlyingAnimation() {
        // This is a visual effect - you can customize it
        console.log('Item added to cart animation!');
    }

    // Initialize cart functionality
    initCart() {
        this.updateCartDisplay();
        this.attachCartEventListeners();
        this.setupCartModal();
        this.setupCheckout();
    }

    // Attach event listeners to cart elements
    attachCartEventListeners() {
        // Remove existing listeners first to prevent duplicates
        this.removeAllEventListeners();

        // Quantity minus buttons
        document.querySelectorAll('.quantity-btn.minus').forEach(button => {
            button.addEventListener('click', (e) => {
                const productId = e.target.getAttribute('data-id');
                const item = this.cart.find(item => item.id === productId);
                if (item) {
                    this.updateQuantity(productId, item.quantity - 1);
                }
            });
        });

        // Quantity plus buttons
        document.querySelectorAll('.quantity-btn.plus').forEach(button => {
            button.addEventListener('click', (e) => {
                const productId = e.target.getAttribute('data-id');
                const item = this.cart.find(item => item.id === productId);
                if (item) {
                    this.updateQuantity(productId, item.quantity + 1);
                }
            });
        });

        // Remove buttons
        document.querySelectorAll('.cart-item-remove').forEach(button => {
            button.addEventListener('click', (e) => {
                const productId = e.target.closest('button').getAttribute('data-id');
                this.removeItem(productId);
            });
        });

        // Add to cart buttons
        document.querySelectorAll('.add-to-cart').forEach(button => {
            button.addEventListener('click', (e) => {
                const productId = e.target.getAttribute('data-id');
                const productName = e.target.getAttribute('data-name');
                const productPrice = parseInt(e.target.getAttribute('data-price'));
                
                this.addItem(productId, productName, productPrice, 1);
                
                // Visual feedback
                this.showButtonConfirmation(e.target);
            });
        });
    }

    // Remove all event listeners to prevent duplicates
    removeAllEventListeners() {
        // This is a simplified approach - in production you might want to use
        // event delegation or more sophisticated event management
        const cloneMinus = document.querySelectorAll('.quantity-btn.minus');
        const clonePlus = document.querySelectorAll('.quantity-btn.plus');
        const cloneRemove = document.querySelectorAll('.cart-item-remove');
        const cloneAddToCart = document.querySelectorAll('.add-to-cart');

        cloneMinus.forEach(btn => btn.replaceWith(btn.cloneNode(true)));
        clonePlus.forEach(btn => btn.replaceWith(btn.cloneNode(true)));
        cloneRemove.forEach(btn => btn.replaceWith(btn.cloneNode(true)));
        cloneAddToCart.forEach(btn => btn.replaceWith(btn.cloneNode(true)));
    }

    // Show button confirmation animation
    showButtonConfirmation(button) {
        const originalText = button.innerHTML;
        const originalBackground = button.style.background;
        
        button.innerHTML = '<i class="fas fa-check"></i> Added!';
        button.style.background = 'linear-gradient(135deg, #10b981, #34d399)';
        button.disabled = true;
        
        setTimeout(() => {
            button.innerHTML = originalText;
            button.style.background = originalBackground;
            button.disabled = false;
        }, 2000);
    }

    // Setup cart modal functionality
    setupCartModal() {
        const cartIcon = document.getElementById('cartIcon');
        const cartModal = document.getElementById('cartModal');
        const closeCart = document.getElementById('closeCart');
        const overlay = document.getElementById('overlay');
        const continueShopping = document.getElementById('continueShopping');

        if (cartIcon && cartModal) {
            cartIcon.addEventListener('click', () => {
                cartModal.style.display = 'block';
                if (overlay) overlay.style.display = 'block';
                document.body.style.overflow = 'hidden';
                this.renderCartModal();
            });
        }

        if (closeCart) {
            closeCart.addEventListener('click', () => {
                cartModal.style.display = 'none';
                if (overlay) overlay.style.display = 'none';
                document.body.style.overflow = 'auto';
            });
        }

        if (overlay) {
            overlay.addEventListener('click', () => {
                cartModal.style.display = 'none';
                overlay.style.display = 'none';
                document.body.style.overflow = 'auto';
            });
        }

        if (continueShopping) {
            continueShopping.addEventListener('click', () => {
                cartModal.style.display = 'none';
                if (overlay) overlay.style.display = 'none';
                document.body.style.overflow = 'auto';
            });
        }
    }

    // Setup checkout functionality
    setupCheckout() {
        const checkoutBtn = document.querySelector('.cart-actions .btn-success');
        if (checkoutBtn) {
            checkoutBtn.addEventListener('click', (e) => {
                e.preventDefault();
                this.processCheckout();
            });
        }
    }

    // Process checkout
    processCheckout() {
        if (this.cart.length === 0) {
            alert('Your cart is empty!');
            return;
        }

        // Show checkout processing
        const checkoutBtn = document.querySelector('.cart-actions .btn-success');
        const originalText = checkoutBtn.textContent;
        checkoutBtn.textContent = 'Processing...';
        checkoutBtn.disabled = true;

        // Simulate payment processing
        setTimeout(() => {
            // In real implementation, this would connect to payment gateway
            this.completePurchase();
            
            // Reset button
            checkoutBtn.textContent = originalText;
            checkoutBtn.disabled = false;
        }, 2000);
    }

    // Complete purchase and clear cart
    completePurchase() {
        // Save order to localStorage for demo purposes
        const order = {
            id: 'ORD-' + Date.now(),
            items: [...this.cart],
            total: this.getTotal(),
            date: new Date().toISOString(),
            status: 'completed'
        };

        // Save order history
        this.saveOrder(order);
        
        // Clear cart
        this.clearCart();
        
        // Show success message
        this.showPurchaseSuccess(order);
        
        // Close cart modal
        const cartModal = document.getElementById('cartModal');
        const overlay = document.getElementById('overlay');
        if (cartModal) cartModal.style.display = 'none';
        if (overlay) overlay.style.display = 'none';
        document.body.style.overflow = 'auto';
    }

    // Save order to localStorage
    saveOrder(order) {
        const orders = JSON.parse(localStorage.getItem('randwestOrders') || '[]');
        orders.push(order);
        localStorage.setItem('randwestOrders', JSON.stringify(orders));
    }

    // Show purchase success message
    showPurchaseSuccess(order) {
        // Create success modal
        const successModal = document.createElement('div');
        successModal.className = 'success-modal';
        successModal.innerHTML = `
            <div class="success-content">
                <div class="success-icon">
                    <i class="fas fa-check-circle"></i>
                </div>
                <h3>Purchase Successful!</h3>
                <p>Thank you for your order. Your materials are available for download.</p>
                <p><strong>Order ID:</strong> ${order.id}</p>
                <p><strong>Total:</strong> R${order.total}</p>
                <div class="success-actions">
                    <button class="btn btn-success" id="downloadMaterials">Download Materials</button>
                    <button class="btn btn-outline" id="closeSuccess">Continue Shopping</button>
                </div>
            </div>
        `;

        // Add styles
        successModal.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0,0,0,0.5);
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 2000;
        `;

        const successContent = successModal.querySelector('.success-content');
        successContent.style.cssText = `
            background: white;
            padding: 40px;
            border-radius: 12px;
            text-align: center;
            max-width: 500px;
            width: 90%;
        `;

        document.body.appendChild(successModal);

        // Add event listeners
        document.getElementById('downloadMaterials').addEventListener('click', () => {
            this.downloadMaterials(order);
            successModal.remove();
        });

        document.getElementById('closeSuccess').addEventListener('click', () => {
            successModal.remove();
        });
    }

    // Download materials (demo implementation)
    downloadMaterials(order) {
        alert('Your training materials are being prepared for download...\n\nIn a real implementation, this would generate download links for your purchased items.');
        // In real implementation, this would generate actual download links
    }
}

// Initialize cart manager when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    window.cartManager = new CartManager();
    
    // Also update cart display when page becomes visible (for multi-tab support)
    document.addEventListener('visibilitychange', function() {
        if (!document.hidden) {
            window.cartManager.updateCartDisplay();
        }
    });
});