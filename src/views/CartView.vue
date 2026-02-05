<template>
  <div class="cart-view">
    <!-- Header -->
    <header class="cart-header">
      <div class="header-content">
        <button @click="goBack" class="back-btn">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M19 12H5M12 19l-7-7 7-7" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
          Back
        </button>
        <h1 class="page-title">Shopping Cart</h1>
        <div class="header-spacer"></div>
      </div>
    </header>

    <!-- Cart Items -->
    <div v-if="localCart.length > 0" class="cart-content">
      <div class="cart-items">
        <div v-for="(item, index) in localCart" :key="index" class="cart-item">
          <div class="item-image">
            <img 
              v-if="item.product.product_images && item.product.product_images.length > 0" 
              :src="getImageUrl(item.product.product_images[0])" 
              :alt="item.product.generic_name"
              @error="handleImageError"
            />
            <div v-else class="image-placeholder">
              <svg width="40" height="40" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" stroke="#9ca3af" stroke-width="2"/>
              </svg>
            </div>
          </div>
          
          <div class="item-details">
            <h3 class="item-name">{{ item.product.generic_name }}</h3>
            <p class="item-brand">{{ item.product.brand_name }}</p>
            <p class="item-price">${{ getItemPrice(item) }}</p>
          </div>
          
          <div class="item-quantity">
            <button @click="decreaseQuantity(index)" class="qty-btn">-</button>
            <span class="qty-value">{{ item.quantity }}</span>
            <button @click="increaseQuantity(index)" class="qty-btn">+</button>
          </div>
          
          <button @click="removeItem(index)" class="remove-btn">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <line x1="18" y1="6" x2="6" y2="18" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
              <line x1="6" y1="6" x2="18" y2="18" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
            </svg>
          </button>
        </div>
      </div>
      
      <!-- Cart Summary -->
      <div class="cart-summary">
        <div class="summary-row">
          <span>Subtotal:</span>
          <span>${{ total.toFixed(2) }}</span>
        </div>
        <div class="summary-row total">
          <span>Total:</span>
          <span>${{ total.toFixed(2) }}</span>
        </div>
        <button @click="proceedToCheckout" class="checkout-btn">
          Proceed to Checkout
        </button>
      </div>
    </div>

    <!-- Empty Cart -->
    <div v-else class="empty-cart">
      <svg width="120" height="120" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" style="opacity: 0.5; color: #9ca3af; margin-bottom: 24px;">
        <circle cx="9" cy="21" r="1" fill="currentColor"/>
        <circle cx="20" cy="21" r="1" fill="currentColor"/>
        <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
      </svg>
      <h2>Your cart is empty</h2>
      <p>Add some products to get started!</p>
      <button @click="goBack" class="back-to-products-btn">Browse Products</button>
    </div>
  </div>
</template>

<script>
import { API_BASE_URL } from '../services/api'

export default {
  name: 'CartView',
  props: {
    cart: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      localCart: []
    }
  },
  computed: {
    total() {
      return this.localCart.reduce((sum, item) => {
        const price = item.product.reference_price || 0
        return sum + (price * item.quantity)
      }, 0)
    }
  },
  watch: {
    cart: {
      immediate: true,
      handler(newCart) {
        this.localCart = JSON.parse(JSON.stringify(newCart))
      }
    }
  },
  methods: {
    getItemPrice(item) {
      const price = item.product.reference_price || 0
      return (price * item.quantity).toFixed(2)
    },
    increaseQuantity(index) {
      this.localCart[index].quantity += 1
      this.updateCart()
    },
    decreaseQuantity(index) {
      if (this.localCart[index].quantity > 1) {
        this.localCart[index].quantity -= 1
        this.updateCart()
      }
    },
    removeItem(index) {
      this.localCart.splice(index, 1)
      this.updateCart()
    },
    updateCart() {
      localStorage.setItem('cart', JSON.stringify(this.localCart))
      this.$emit('cart-updated', this.localCart)
    },
    proceedToCheckout() {
      this.$emit('checkout', this.localCart)
    },
    goBack() {
      this.$emit('go-back')
    },
    getImageUrl(imagePath) {
      if (!imagePath) return ''
      if (imagePath.startsWith('http://') || imagePath.startsWith('https://')) {
        return imagePath
      }
      return `${API_BASE_URL}${imagePath}`
    },
    handleImageError(event) {
      event.target.style.display = 'none'
    }
  }
}
</script>

<style scoped>
.cart-view {
  min-height: 100vh;
  background-color: #dbeafe;
}

.cart-header {
  background-color: white;
  border-bottom: 1px solid #e5e7eb;
  padding: 16px 0;
  margin-bottom: 24px;
}

.header-content {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.back-btn {
  display: flex;
  align-items: center;
  gap: 8px;
  background: none;
  border: none;
  color: #1d4ed8;
  cursor: pointer;
  font-size: 14px;
  font-weight: 500;
  padding: 8px;
  border-radius: 6px;
  transition: background-color 0.2s;
}

.back-btn:hover {
  background-color: #eff6ff;
}

.page-title {
  font-size: 24px;
  font-weight: 700;
  color: #111827;
  margin: 0;
}

.header-spacer {
  width: 100px;
}

.cart-content {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
  display: grid;
  grid-template-columns: 1fr 400px;
  gap: 24px;
}

.cart-items {
  background: white;
  border-radius: 8px;
  padding: 24px;
}

.cart-item {
  display: grid;
  grid-template-columns: 80px 1fr auto auto;
  gap: 16px;
  align-items: center;
  padding: 16px 0;
  border-bottom: 1px solid #e5e7eb;
}

.cart-item:last-child {
  border-bottom: none;
}

.item-image {
  width: 80px;
  height: 80px;
  border-radius: 6px;
  overflow: hidden;
  background-color: #f3f4f6;
  display: flex;
  align-items: center;
  justify-content: center;
}

.item-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.image-placeholder {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #9ca3af;
}

.item-details {
  flex: 1;
}

.item-name {
  font-size: 16px;
  font-weight: 600;
  color: #111827;
  margin: 0 0 4px 0;
}

.item-brand {
  font-size: 14px;
  color: #6b7280;
  margin: 0 0 8px 0;
}

.item-price {
  font-size: 16px;
  font-weight: 600;
  color: #059669;
  margin: 0;
}

.item-quantity {
  display: flex;
  align-items: center;
  gap: 12px;
}

.qty-btn {
  width: 32px;
  height: 32px;
  border: 1px solid #d1d5db;
  background-color: white;
  border-radius: 6px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 18px;
  color: #374151;
  transition: all 0.2s;
}

.qty-btn:hover {
  background-color: #f9fafb;
  border-color: #1d4ed8;
  color: #1d4ed8;
}

.qty-value {
  font-size: 16px;
  font-weight: 600;
  color: #111827;
  min-width: 30px;
  text-align: center;
}

.remove-btn {
  background: none;
  border: none;
  color: #ef4444;
  cursor: pointer;
  padding: 8px;
  border-radius: 6px;
  transition: background-color 0.2s;
}

.remove-btn:hover {
  background-color: #fee2e2;
}

.cart-summary {
  background: white;
  border-radius: 8px;
  padding: 24px;
  height: fit-content;
  position: sticky;
  top: 20px;
}

.summary-row {
  display: flex;
  justify-content: space-between;
  margin-bottom: 16px;
  font-size: 16px;
  color: #6b7280;
}

.summary-row.total {
  font-size: 20px;
  font-weight: 700;
  color: #111827;
  padding-top: 16px;
  border-top: 2px solid #e5e7eb;
}

.checkout-btn {
  width: 100%;
  padding: 14px;
  background-color: #1d4ed8;
  color: white;
  border: none;
  border-radius: 6px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  margin-top: 16px;
  transition: background-color 0.2s;
}

.checkout-btn:hover {
  background-color: #2563eb;
}

.empty-cart {
  max-width: 600px;
  margin: 80px auto;
  text-align: center;
  padding: 40px 20px;
}

.empty-cart h2 {
  font-size: 24px;
  font-weight: 700;
  color: #111827;
  margin: 0 0 8px 0;
}

.empty-cart p {
  font-size: 16px;
  color: #6b7280;
  margin: 0 0 24px 0;
}

.back-to-products-btn {
  padding: 12px 24px;
  background-color: #1d4ed8;
  color: white;
  border: none;
  border-radius: 6px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: background-color 0.2s;
}

.back-to-products-btn:hover {
  background-color: #2563eb;
}

@media (max-width: 968px) {
  .cart-content {
    grid-template-columns: 1fr;
  }
  
  .cart-summary {
    position: static;
  }
}
</style>
