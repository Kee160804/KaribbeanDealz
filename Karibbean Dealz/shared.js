// // ===== SHARED CART & UTILITY FUNCTIONS =====

// // Import Supabase client from CDN
// import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm'

// // Connect to your Supabase project
// const supabaseUrl = 'https://your-project.supabase.co'
// const supabaseKey = 'public-anon-key'
// const supabase = createClient(supabaseUrl, supabaseKey)

// // ===== PRODUCTS & CART STATE =====
// let products = []
// let cart = []
// let cartOpen = false

// // Product inventory (fallback/local stock tracking)
// const productInventory = {
//     1: { stock: 10, name: "Eternal Essence" },
//     2: { stock: 15, name: "Silk Touch Lotion" },
//     3: { stock: 8, name: "Velvet Rose" },
//     4: { stock: 12, name: "Ocean Breeze Set" },
//     5: { stock: 20, name: "Noir Mystique" },
//     6: { stock: 18, name: "Citrus Bloom" },
//     7: { stock: 25, name: "Coconut Dream" },
//     8: { stock: 10, name: "Shea Butter Bliss" },
//     9: { stock: 15, name: "Aloe Vera Soothing" },
//     10: { stock: 8, name: "Vitamin C Serum" },
//     11: { stock: 12, name: "Hyaluronic Acid Cream" },
//     12: { stock: 6, name: "Retinol Night Cream" },
//     13: { stock: 20, name: "Charcoal Face Mask" },
//     14: { stock: 15, name: "Lavender Bath Bombs" },
//     15: { stock: 10, name: "Eucalyptus Body Wash" },
//     16: { stock: 12, name: "Rose Petal Bath Salts" },
//     17: { stock: 8, name: "Oatmeal Body Scrub" },
//     18: { stock: 5, name: "Luxury Spa Gift Set" },
//     19: { stock: 10, name: "Romantic Evening Set" },
//     20: { stock: 15, name: "Travel Essential Kit" },
//     21: { stock: 8, name: "Holiday Special Box" }
// }

// // ===== LOAD PRODUCTS =====
// async function loadProducts() {
//     const { data, error } = await supabase.from('products').select('*')
//     if (error) console.error(error)
//     else {
//         products = data
//         renderProducts(products)
//     }
// }

// function renderProducts(products) {
//     const list = document.getElementById('productList')
//     list.innerHTML = ''

//     products.forEach(product => {
//         const item = document.createElement('div')
//         item.className = 'product-item'
//         item.setAttribute('data-product-id', product.id)
//         item.innerHTML = `
//             <h3>${product.name}</h3>
//             <p>Price: $${product.price}</p>
//             <p>Stock: <span id="stock-${product.id}">${product.stock}</span></p>
//             <button class="add-to-cart" data-id="${product.id}" data-name="${product.name}" data-price="${product.price}" data-image="${product.image || ''}">
//                 <i class="fas fa-cart-plus mr-2"></i>Add to Cart
//             </button>
//         `
//         list.appendChild(item)
//     })
// }

// // ===== CART UTILITIES =====
// function loadCart() {
//     try {
//         const savedCart = localStorage.getItem('karibbeanDealzCart')
//         if (savedCart) {
//             cart = JSON.parse(savedCart)
//             updateCartUI()
//         }
//     } catch (error) {
//         console.error('Error loading cart:', error)
//         cart = []
//     }
// }

// function saveCart() {
//     try { localStorage.setItem('karibbeanDealzCart', JSON.stringify(cart)) }
//     catch (error) { console.error('Error saving cart:', error) }
// }

// function isInStock(productId, quantity = 1) {
//     const product = productInventory[productId] || products.find(p => p.id === productId)
//     if (!product) return false
//     const cartItem = cart.find(item => item.id === productId)
//     const currentInCart = cartItem ? cartItem.quantity : 0
//     return (currentInCart + quantity) <= product.stock
// }

// function getRemainingStock(productId) {
//     const product = productInventory[productId] || products.find(p => p.id === productId)
//     if (!product) return 0
//     const cartItem = cart.find(item => item.id === productId)
//     const currentInCart = cartItem ? cartItem.quantity : 0
//     return product.stock - currentInCart
// }

// function addToCart(product) {
//     if (!isInStock(product.id)) {
//         showNotification(`Sorry, ${product.name} is out of stock!`, 'error')
//         return false
//     }

//     const existingItem = cart.find(item => item.id === product.id)
//     if (existingItem) {
//         if (!isInStock(product.id, existingItem.quantity + 1)) {
//             showNotification(`Only ${getRemainingStock(product.id)} ${product.name} left in stock!`, 'warning')
//             return false
//         }
//         existingItem.quantity += 1
//     } else {
//         cart.push({ ...product, quantity: 1 })
//     }

//     saveCart()
//     updateCartUI()
//     updateProductStockDisplays(product.id)
//     showNotification(`${product.name} added to cart!`, 'success')
//     return true
// }

// function removeFromCart(productId) {
//     cart = cart.filter(item => item.id !== productId)
//     saveCart()
//     updateCartUI()
//     updateProductStockDisplays(productId)
//     showNotification('Item removed from cart', 'info')
// }

// function updateQuantity(productId, change) {
//     const item = cart.find(item => item.id === productId)
//     if (!item) return
//     const newQuantity = item.quantity + change

//     if (newQuantity <= 0) { removeFromCart(productId); return }
//     if (!isInStock(productId, newQuantity - item.quantity)) {
//         showNotification(`Only ${getRemainingStock(productId)} items left in stock!`, 'warning')
//         return
//     }

//     item.quantity = newQuantity
//     saveCart()
//     updateCartUI()
//     updateProductStockDisplays(productId)
// }

// function calculateTotal() { return cart.reduce((t, i) => t + i.price * i.quantity, 0).toFixed(2) }

// function updateCartUI() {
//     const cartCount = document.getElementById('cartCount')
//     const cartCountMobile = document.getElementById('cartCountMobile')
//     const cartTotal = document.getElementById('cartTotal')
//     const cartItems = document.getElementById('cartItems')

//     const itemCount = cart.reduce((c, i) => c + i.quantity, 0)
//     if (cartCount) cartCount.textContent = itemCount
//     if (cartCountMobile) cartCountMobile.textContent = itemCount
//     if (cartTotal) cartTotal.textContent = `$${calculateTotal()}`

//     if (cartItems) {
//         if (!cart.length) {
//             cartItems.innerHTML = `<div class="empty-cart">
//                 <i class="fas fa-shopping-cart text-4xl text-gray-300 mb-4"></i>
//                 <p class="text-gray-500">Your cart is empty</p>
//                 <p class="text-sm text-gray-400 mt-2">Add some products to get started!</p>
//             </div>`
//         } else {
//             cartItems.innerHTML = cart.map(item => `
//                 <div class="cart-item">
//                     <img src="${item.image}" alt="${item.name}" class="cart-item-image">
//                     <div class="cart-item-details">
//                         <div class="cart-item-title">${item.name}</div>
//                         <div class="cart-item-price">$${item.price}</div>
//                         <div class="quantity-controls">
//                             <button class="quantity-btn" onclick="updateQuantity(${item.id}, -1)" ${item.quantity <= 1 ? 'disabled' : ''}><i class="fas fa-minus"></i></button>
//                             <span class="quantity-display">${item.quantity}</span>
//                             <button class="quantity-btn" onclick="updateQuantity(${item.id}, 1)" ${!isInStock(item.id) ? 'disabled' : ''}><i class="fas fa-plus"></i></button>
//                             <button class="remove-btn" onclick="removeFromCart(${item.id})"><i class="fas fa-trash"></i></button>
//                         </div>
//                         <div class="stock-info">${getRemainingStock(item.id) > 0 ? `${getRemainingStock(item.id)} left in stock` : 'Out of stock'}</div>
//                     </div>
//                 </div>
//             `).join('')
//         }
//     }
// }

// function updateProductStockDisplays(productId) {
//     const productCards = document.querySelectorAll(`[data-product-id="${productId}"]`)
//     productCards.forEach(card => {
//         const stockBadge = card.querySelector('.stock-badge')
//         const addButton = card.querySelector('.add-to-cart')
//         const remainingStock = getRemainingStock(productId)

//         if (stockBadge) {
//             stockBadge.textContent = `${remainingStock} in stock`
//             stockBadge.className = `stock-badge ${remainingStock > 5 ? 'in-stock' : remainingStock > 0 ? 'low-stock' : 'out-of-stock'}`
//         }

//         if (addButton) {
//             if (remainingStock === 0) {
//                 addButton.disabled = true
//                 addButton.innerHTML = '<i class="fas fa-times mr-2"></i>Out of Stock'
//                 addButton.classList.add('out-of-stock-btn')
//             } else {
//                 addButton.disabled = false
//                 addButton.innerHTML = '<i class="fas fa-cart-plus mr-2"></i>Add to Cart'
//                 addButton.classList.remove('out-of-stock-btn')
//             }
//         }
//     })
// }

// // ===== NOTIFICATIONS =====
// function showNotification(message, type = 'success') {
//     const existing = document.querySelectorAll('.custom-notification')
//     existing.forEach(n => n.remove())

//     const notification = document.createElement('div')
//     const typeClasses = { success: 'bg-green-500', error: 'bg-red-500', warning: 'bg-yellow-500', info: 'bg-blue-500' }
//     notification.className = `custom-notification fixed top-20 right-4 ${typeClasses[type]} text-white px-6 py-3 rounded-lg shadow-lg z-50 transform transition-transform duration-300`
//     notification.innerHTML = `<div class="flex items-center"><i class="fas fa-${type === 'success' ? 'check-circle' : type === 'error' ? 'exclamation-circle' : type === 'warning' ? 'exclamation-triangle' : 'info-circle'} mr-2"></i><span>${message}</span></div>`
//     document.body.appendChild(notification)
//     setTimeout(() => { notification.style.transform = 'translateX(0)' }, 10)
//     setTimeout(() => { notification.style.transform = 'translateX(100%)'; setTimeout(() => notification.remove(), 300) }, 3000)
// }

// // ===== CART TOGGLE =====
// function toggleCart() {
//     const cartSidebar = document.getElementById('cartSidebar')
//     const cartOverlay = document.getElementById('cartOverlay')
//     cartOpen = !cartOpen
//     if (cartOpen) { cartSidebar.classList.add('open'); cartOverlay.classList.add('active'); document.body.style.overflow = 'hidden' }
//     else { cartSidebar.classList.remove('open'); cartOverlay.classList.remove('active'); document.body.style.overflow = 'auto' }
// }

// // ===== MOBILE MENU =====
// function initMobileMenu() {
//     const mobileMenuButton = document.getElementById('mobileMenuButton')
//     const closeMobileMenu = document.getElementById('closeMobileMenu')
//     const mobileMenu = document.getElementById('mobileMenu')
//     if (!mobileMenuButton || !mobileMenu) return

//     mobileMenuButton.addEventListener('click', () => { mobileMenu.classList.add('open'); document.body.style.overflow = 'hidden' })
//     closeMobileMenu.addEventListener('click', () => { mobileMenu.classList.remove('open'); document.body.style.overflow = 'auto' })
//     document.querySelectorAll('.mobile-menu a').forEach(link => link.addEventListener('click', () => { mobileMenu.classList.remove('open'); document.body.style.overflow = 'auto' }))
// }

// // ===== BACK TO TOP =====
// function initBackToTop() {
//     const backToTopButton = document.getElementById('backToTop')
//     if (!backToTopButton) return
//     window.addEventListener('scroll', () => { window.pageYOffset > 300 ? backToTopButton.classList.remove('hidden') : backToTopButton.classList.add('hidden') })
//     backToTopButton.addEventListener('click', () => { window.scrollTo({ top: 0, behavior: 'smooth' }) })
// }

// // ===== SUPABASE STOCK UPDATE =====
// async function decreaseStock(productId, quantity) {
//     try {
//         const { error } = await supabase.rpc('decrease_stock', { pid: productId, qty: quantity })
//         if (error) throw error
//         return true
//     } catch (err) {
//         console.error(`Failed to decrease stock for product ${productId}:`, err)
//         return false
//     }
// }

// // ===== CHECKOUT =====
// async function processCheckout(orderData) {
//     if (!cart.length) { showNotification('Your cart is empty!', 'error'); return false }
//     showNotification('Processing your order...', 'info')

//     let stockFailed = false
//     for (const item of cart) {
//         const success = await decreaseStock(item.id, item.quantity)
//         if (!success) { stockFailed = true; showNotification(`Failed to update stock for ${item.name}`, 'error') }
//     }

//     if (!stockFailed) {
//         cart.forEach(item => { const p = products.find(pr => pr.id === item.id); if (p) p.stock -= item.quantity; updateProductStockDisplays(item.id) })

//         sendOrderWhatsApp({ ...orderData, items: [...cart], total: calculateTotal() })
//         const emailSent = await sendOrderEmail({ ...orderData, items: [...cart], total: calculateTotal() })
//         if (emailSent) showNotification('Order confirmation sent to your email!', 'success')

//         cart = []; saveCart(); updateCartUI()
//         return true
//     } else {
//         showNotification('Order could not be fully processed. Please try again.', 'warning')
//         return false
//     }
// }

// // ===== CART INITIALIZATION =====
// function initCart() {
//     const cartIcon = document.getElementById('cartIcon')
//     const cartIconMobile = document.getElementById('cartIconMobile')
//     const closeCart = document.getElementById('closeCart')
//     const cartOverlay = document.getElementById('cartOverlay')

//     if (cartIcon) cartIcon.addEventListener('click', toggleCart)
//     if (cartIconMobile) cartIconMobile.addEventListener('click', toggleCart)
//     if (closeCart) closeCart.addEventListener('click', toggleCart)
//     if (cartOverlay) cartOverlay.addEventListener('click', toggleCart)

//     document.addEventListener('click', function(e) {
//         if (e.target.closest('.add-to-cart')) {
//             e.preventDefault()
//             const button = e.target.closest('.add-to-cart')
//             const product = {
//                 id: parseInt(button.getAttribute('data-id')),
//                 name: button.getAttribute('data-name'),
//                 price: parseFloat(button.getAttribute('data-price')),
//                 image: button.getAttribute('data-image')
//             }
//             addToCart(product)
//         }
//     })
// }

// // ===== INITIALIZATION =====
// function initializeShared() {
//     loadCart()
//     initMobileMenu()
//     initCart()
//     initBackToTop()
//     loadProducts()
// }

// // Initialize when DOM is loaded
// if (document.readyState === 'loading') {
//     document.addEventListener('DOMContentLoaded', initializeShared)
// } else { initializeShared() }

// // ===== EXPORT FUNCTIONS FOR OTHER PAGES =====
// export {
//     getRemainingStock,
//     isInStock,
//     addToCart,
//     removeFromCart,
//     updateQuantity,
//     calculateTotal,
//     showNotification,
//     processCheckout,
//     loadProducts
// }



















// // ===== SHARED CART & UTILITY FUNCTIONS =====

// //  Import Supabase client from CDN (for front-end)
// import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm'

// //  Connect to your Supabase project
// const supabaseUrl = 'https://your-project.supabase.co'
// const supabaseKey = 'public-anon-key'
// const supabase = createClient(supabaseUrl, supabaseKey)

// //  Load and display all products
// async function loadProducts() {
//   const { data, error } = await supabase.from('products').select('*')
//   if (error) console.error(error)
//   else renderProducts(data)
// }

// //  Render product list
// function renderProducts(products) {
//   const list = document.getElementById('productList')
//   list.innerHTML = ''

//   products.forEach(product => {
//     const item = document.createElement('div')
//     item.className = 'product-item'
//     item.innerHTML = `
//       <h3>${product.name}</h3>
//       <p>Price: $${product.price}</p>
//       <p>Stock: <span id="stock-${product.id}">${product.stock}</span></p>
//       <button onclick="buyProduct(${product.id}, 1)">Buy 1</button>
//     `
//     list.appendChild(item)
//   })
// }

// //  When user clicks "Buy"
// async function buyProduct(productId, qty) {
//   const { error } = await supabase.rpc('decrease_stock', { pid: productId, qty })
//   if (error) console.error('Purchase error:', error)
//   else console.log('Stock updated for product', productId)
// }

// //  Subscribe to real-time stock updates
// supabase
//   .channel('public:products')
//   .on(
//     'postgres_changes',
//     { event: '*', schema: 'public', table: 'products' },
//     payload => {
//       const { id, stock } = payload.new
//       const stockSpan = document.getElementById(`stock-${id}`)
//       if (stockSpan) stockSpan.textContent = stock
//     }
//   )
//   .subscribe()

// //  Run when page loads
// loadProducts()




// ////////////////////////////////////////////////////////////

// // Shopping Cart State

let cart = [];
let cartOpen = false;

// Product Inventory with Stock Management
const productInventory = {
    1: { stock: 10, name: "Eternal Essence" },
    2: { stock: 15, name: "Silk Touch Lotion" },
    3: { stock: 8, name: "Velvet Rose" },
    4: { stock: 12, name: "Ocean Breeze Set" },
    5: { stock: 20, name: "Noir Mystique" },
    6: { stock: 18, name: "Citrus Bloom" },
    7: { stock: 25, name: "Coconut Dream" },
    8: { stock: 10, name: "Shea Butter Bliss" },
    9: { stock: 15, name: "Aloe Vera Soothing" },
    10: { stock: 8, name: "Vitamin C Serum" },
    11: { stock: 12, name: "Hyaluronic Acid Cream" },
    12: { stock: 6, name: "Retinol Night Cream" },
    13: { stock: 20, name: "Charcoal Face Mask" },
    14: { stock: 15, name: "Lavender Bath Bombs" },
    15: { stock: 10, name: "Eucalyptus Body Wash" },
    16: { stock: 12, name: "Rose Petal Bath Salts" },
    17: { stock: 8, name: "Oatmeal Body Scrub" },
    18: { stock: 5, name: "Luxury Spa Gift Set" },
    19: { stock: 10, name: "Romantic Evening Set" },
    20: { stock: 15, name: "Travel Essential Kit" },
    21: { stock: 8, name: "Holiday Special Box" }
};

/**
 * Load cart from localStorage
 */
function loadCart() {
    try {
        const savedCart = localStorage.getItem('karibbeanDealzCart');
        if (savedCart) {
            cart = JSON.parse(savedCart);
            updateCartUI();
        }
    } catch (error) {
        console.error('Error loading cart:', error);
        cart = [];
    }
}

/**
 * Save cart to localStorage
 */
function saveCart() {
    try {
        localStorage.setItem('karibbeanDealzCart', JSON.stringify(cart));
    } catch (error) {
        console.error('Error saving cart:', error);
    }
}

/**
 * Check if product is in stock
 * @param {number} productId - Product ID
 * @param {number} quantity - Desired quantity
 * @returns {boolean} - True if in stock
 */
function isInStock(productId, quantity = 1) {
    const product = productInventory[productId];
    if (!product) return false;
    
    const cartItem = cart.find(item => item.id === productId);
    const currentInCart = cartItem ? cartItem.quantity : 0;
    
    return (currentInCart + quantity) <= product.stock;
}

/**
 * Get remaining stock for product
 * @param {number} productId - Product ID
 * @returns {number} - Remaining stock
 */
function getRemainingStock(productId) {
    const product = productInventory[productId];
    if (!product) return 0;
    
    const cartItem = cart.find(item => item.id === productId);
    const currentInCart = cartItem ? cartItem.quantity : 0;
    
    return product.stock - currentInCart;
}

/**
 * Add product to cart with stock validation
 * @param {Object} product - Product object to add
 * @returns {boolean} - Success status
 */
function addToCart(product) {
    if (!isInStock(product.id)) {
        showNotification(`Sorry, ${product.name} is out of stock!`, 'error');
        return false;
    }
    
    const existingItem = cart.find(item => item.id === product.id);
    
    if (existingItem) {
        if (!isInStock(product.id, existingItem.quantity + 1)) {
            showNotification(`Only ${getRemainingStock(product.id)} ${product.name} left in stock!`, 'warning');
            return false;
        }
        existingItem.quantity += 1;
    } else {
        cart.push({
            ...product,
            quantity: 1
        });
    }
    
    saveCart();
    updateCartUI();
    updateProductStockDisplays(product.id);
    showNotification(`${product.name} added to cart!`, 'success');
    return true;
}

/**
 * Remove product from cart
 * @param {number} productId - ID of product to remove
 */
function removeFromCart(productId) {
    cart = cart.filter(item => item.id !== productId);
    saveCart();
    updateCartUI();
    updateProductStockDisplays(productId);
    showNotification('Item removed from cart', 'info');
}

/**
 * Update product quantity in cart
 * @param {number} productId - ID of product to update
 * @param {number} change - Quantity change (+1 or -1)
 */
function updateQuantity(productId, change) {
    const item = cart.find(item => item.id === productId);
    if (item) {
        const newQuantity = item.quantity + change;
        
        if (newQuantity <= 0) {
            removeFromCart(productId);
            return;
        }
        
        if (!isInStock(productId, newQuantity - item.quantity)) {
            showNotification(`Only ${getRemainingStock(productId)} items left in stock!`, 'warning');
            return;
        }
        
        item.quantity = newQuantity;
        saveCart();
        updateCartUI();
        updateProductStockDisplays(productId);
    }
}

/**
 * Calculate total cart value
 * @returns {string} Formatted total amount
 */
function calculateTotal() {
    return cart.reduce((total, item) => total + (item.price * item.quantity), 0).toFixed(2);
}

/**
 * Update all cart-related UI elements
 */
function updateCartUI() {
    const cartCount = document.getElementById('cartCount');
    const cartCountMobile = document.getElementById('cartCountMobile');
    const cartTotal = document.getElementById('cartTotal');
    const cartItems = document.getElementById('cartItems');
    
    // Update cart count badges
    if (cartCount) {
        const itemCount = cart.reduce((count, item) => count + item.quantity, 0);
        cartCount.textContent = itemCount;
        if (cartCountMobile) cartCountMobile.textContent = itemCount;
    }
    
    // Update total amount
    if (cartTotal) {
        cartTotal.textContent = `$${calculateTotal()}`;
    }
    
    // Update cart items list
    if (cartItems) {
        if (cart.length === 0) {
            cartItems.innerHTML = `
                <div class="empty-cart">
                    <i class="fas fa-shopping-cart text-4xl text-gray-300 mb-4"></i>
                    <p class="text-gray-500">Your cart is empty</p>
                    <p class="text-sm text-gray-400 mt-2">Add some products to get started!</p>
                </div>
            `;
        } else {
            cartItems.innerHTML = cart.map(item => `
                <div class="cart-item">
                    <img src="${item.image}" alt="${item.name}" class="cart-item-image">
                    <div class="cart-item-details">
                        <div class="cart-item-title">${item.name}</div>
                        <div class="cart-item-price">$${item.price}</div>
                        <div class="quantity-controls">
                            <button class="quantity-btn" onclick="updateQuantity(${item.id}, -1)" ${item.quantity <= 1 ? 'disabled' : ''}>
                                <i class="fas fa-minus"></i>
                            </button>
                            <span class="quantity-display">${item.quantity}</span>
                            <button class="quantity-btn" onclick="updateQuantity(${item.id}, 1)" ${!isInStock(item.id) ? 'disabled' : ''}>
                                <i class="fas fa-plus"></i>
                            </button>
                            <button class="remove-btn" onclick="removeFromCart(${item.id})">
                                <i class="fas fa-trash"></i>
                            </button>
                        </div>
                        <div class="stock-info">
                            ${getRemainingStock(item.id) > 0 ? 
                                `${getRemainingStock(item.id)} left in stock` : 
                                'Out of stock'}
                        </div>
                    </div>
                </div>
            `).join('');
        }
    }
}

/**
 * Update stock displays for a specific product
 * @param {number} productId - Product ID to update
 */
function updateProductStockDisplays(productId) {
    // Update product cards
    const productCards = document.querySelectorAll(`[data-product-id="${productId}"]`);
    productCards.forEach(card => {
        const stockBadge = card.querySelector('.stock-badge');
        const addButton = card.querySelector('.add-to-cart');
        const remainingStock = getRemainingStock(productId);
        
        if (stockBadge) {
            stockBadge.textContent = `${remainingStock} in stock`;
            stockBadge.className = `stock-badge ${remainingStock > 5 ? 'in-stock' : remainingStock > 0 ? 'low-stock' : 'out-of-stock'}`;
        }
        
        if (addButton) {
            if (remainingStock === 0) {
                addButton.disabled = true;
                addButton.innerHTML = '<i class="fas fa-times mr-2"></i>Out of Stock';
                addButton.classList.add('out-of-stock-btn');
            } else {
                addButton.disabled = false;
                addButton.innerHTML = '<i class="fas fa-cart-plus mr-2"></i>Add to Cart';
                addButton.classList.remove('out-of-stock-btn');
            }
        }
    });
}

/**
 * Show a temporary notification message
 * @param {string} message - Message to display
 * @param {string} type - Type of notification (success, error, warning, info)
 */
function showNotification(message, type = 'success') {
    // Remove existing notifications
    const existingNotifications = document.querySelectorAll('.custom-notification');
    existingNotifications.forEach(notification => notification.remove());
    
    const notification = document.createElement('div');
    const typeClasses = {
        success: 'bg-green-500',
        error: 'bg-red-500',
        warning: 'bg-yellow-500',
        info: 'bg-blue-500'
    };
    
    notification.className = `custom-notification fixed top-20 right-4 ${typeClasses[type]} text-white px-6 py-3 rounded-lg shadow-lg z-50 transform transition-transform duration-300`;
    notification.innerHTML = `
        <div class="flex items-center">
            <i class="fas fa-${type === 'success' ? 'check-circle' : type === 'error' ? 'exclamation-circle' : type === 'warning' ? 'exclamation-triangle' : 'info-circle'} mr-2"></i>
            <span>${message}</span>
        </div>
    `;
    
    document.body.appendChild(notification);
    
    // Animate in
    setTimeout(() => {
        notification.style.transform = 'translateX(0)';
    }, 10);
    
    // Remove after 3 seconds
    setTimeout(() => {
        notification.style.transform = 'translateX(100%)';
        setTimeout(() => {
            if (notification.parentNode) {
                notification.remove();
            }
        }, 300);
    }, 3000);
}

/**
 * Toggle cart sidebar visibility
 */
function toggleCart() {
    const cartSidebar = document.getElementById('cartSidebar');
    const cartOverlay = document.getElementById('cartOverlay');
    
    cartOpen = !cartOpen;
    if (cartOpen) {
        cartSidebar.classList.add('open');
        cartOverlay.classList.add('active');
        document.body.style.overflow = 'hidden';
    } else {
        cartSidebar.classList.remove('open');
        cartOverlay.classList.remove('active');
        document.body.style.overflow = 'auto';
    }
}

// ===== MOBILE MENU FUNCTIONALITY =====
function initMobileMenu() {
    const mobileMenuButton = document.getElementById('mobileMenuButton');
    const closeMobileMenu = document.getElementById('closeMobileMenu');
    const mobileMenu = document.getElementById('mobileMenu');

    if (mobileMenuButton && mobileMenu) {
        mobileMenuButton.addEventListener('click', () => {
            mobileMenu.classList.add('open');
            document.body.style.overflow = 'hidden';
        });

        closeMobileMenu.addEventListener('click', () => {
            mobileMenu.classList.remove('open');
            document.body.style.overflow = 'auto';
        });

        // Close mobile menu when clicking on links
        document.querySelectorAll('.mobile-menu a').forEach(link => {
            link.addEventListener('click', () => {
                mobileMenu.classList.remove('open');
                document.body.style.overflow = 'auto';
            });
        });
    }
}

// ===== CART INITIALIZATION =====
function initCart() {
    const cartIcon = document.getElementById('cartIcon');
    const cartIconMobile = document.getElementById('cartIconMobile');
    const closeCart = document.getElementById('closeCart');
    const cartOverlay = document.getElementById('cartOverlay');

    // Cart toggle event listeners
    if (cartIcon) cartIcon.addEventListener('click', toggleCart);
    if (cartIconMobile) cartIconMobile.addEventListener('click', toggleCart);
    if (closeCart) closeCart.addEventListener('click', toggleCart);
    if (cartOverlay) cartOverlay.addEventListener('click', toggleCart);

    // Add to cart buttons event delegation
    document.addEventListener('click', function(e) {
        if (e.target.closest('.add-to-cart')) {
            e.preventDefault();
            const button = e.target.closest('.add-to-cart');
            const product = {
                id: parseInt(button.getAttribute('data-id')),
                name: button.getAttribute('data-name'),
                price: parseFloat(button.getAttribute('data-price')),
                image: button.getAttribute('data-image')
            };
            addToCart(product);
        }
    });
}

// ===== BACK TO TOP FUNCTIONALITY =====
function initBackToTop() {
    const backToTopButton = document.getElementById('backToTop');

    if (backToTopButton) {
        window.addEventListener('scroll', () => {
            if (window.pageYOffset > 300) {
                backToTopButton.classList.remove('hidden');
            } else {
                backToTopButton.classList.add('hidden');
            }
        });

        backToTopButton.addEventListener('click', () => {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }
}

// ===== ORDER MANAGEMENT & NOTIFICATIONS =====

/**
 * Send order via EmailJS
 * @param {Object} orderData - Order data to send
 * @returns {Promise} - Email sending promise
 */
async function sendOrderEmail(orderData) {
    // EmailJS configuration (you'll need to set up an account)
    const serviceID = 'your_emailjs_service_id';
    const templateID = 'your_emailjs_template_id';
    const publicKey = 'your_emailjs_public_key';
    
    try {
        // Initialize EmailJS if not already done
        if (typeof emailjs === 'undefined') {
            console.error('EmailJS not loaded');
            return false;
        }
        
        await emailjs.send(serviceID, templateID, {
            to_name: 'Karibbean Dealz',
            from_name: orderData.name,
            from_email: orderData.email,
            phone: orderData.phone,
            address: orderData.address,
            payment_method: orderData.paymentMethod,
            order_notes: orderData.notes || 'No additional notes',
            order_items: formatOrderItemsForEmail(orderData.items),
            order_total: `$${orderData.total}`,
            order_date: new Date().toLocaleDateString()
        }, publicKey);
        
        return true;
    } catch (error) {
        console.error('Email sending failed:', error);
        return false;
    }
}

/**
 * Format order items for email display
 * @param {Array} items - Order items
 * @returns {string} - Formatted items string
 */
function formatOrderItemsForEmail(items) {
    return items.map(item => 
        `${item.name} - Qty: ${item.quantity} - $${(item.price * item.quantity).toFixed(2)}`
    ).join('\n');
}

/**
 * Send order via WhatsApp
 * @param {Object} orderData - Order data to send
 */
function sendOrderWhatsApp(orderData) {
    const phoneNumber = '18001234567'; // Replace with your WhatsApp business number
    
    let message = `🛍️ *NEW ORDER - Karibbean Dealz* 🛍️\n\n`;
    message += `*Customer Information:*\n`;
    message += `👤 Name: ${orderData.name}\n`;
    message += `📧 Email: ${orderData.email}\n`;
    message += `📞 Phone: ${orderData.phone}\n`;
    message += `📍 Address: ${orderData.address}\n`;
    message += `💳 Payment Method: ${orderData.paymentMethod}\n\n`;
    
    message += `*Order Details:*\n`;
    orderData.items.forEach(item => {
        message += `• ${item.name} x ${item.quantity} - $${(item.price * item.quantity).toFixed(2)}\n`;
    });
    
    message += `\n*Order Total: $${orderData.total}*\n`;
    message += `📅 Order Date: ${new Date().toLocaleDateString()}\n`;
    
    if (orderData.notes) {
        message += `\n*Customer Notes:*\n${orderData.notes}\n`;
    }
    
    message += `\n_This order was placed through the Karibbean Dealz website._`;
    
    const encodedMessage = encodeURIComponent(message);
    window.open(`https://wa.me/${phoneNumber}?text=${encodedMessage}`, '_blank');
}

/**
 * Process checkout and send notifications
 * @param {Object} orderData - Order data
 */
async function processCheckout(orderData) {
    try {
        showNotification('Processing your order...', 'info');
        
        // Send WhatsApp message
        sendOrderWhatsApp(orderData);
        
        // Try to send email (optional)
        const emailSent = await sendOrderEmail(orderData);
        if (emailSent) {
            showNotification('Order confirmation sent to your email!', 'success');
        }
        
        // Clear cart after successful order
        cart = [];
        saveCart();
        updateCartUI();
        
        return true;
    } catch (error) {
        console.error('Checkout processing failed:', error);
        showNotification('Order placed! There was an issue sending confirmation.', 'warning');
        return true; // Still consider it successful as WhatsApp should work
    }
}

// ===== INITIALIZATION =====
function initializeShared() {
    loadCart();
    initMobileMenu();
    initCart();
    initBackToTop();
}

// Initialize when DOM is loaded
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeShared);
} else {
    initializeShared();
}