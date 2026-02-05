<template>
  <div class="checkout-view">
    <!-- Header -->
    <header class="checkout-header">
      <div class="header-content">
        <button @click="goBack" class="back-btn">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M19 12H5M12 19l-7-7 7-7" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
          Back
        </button>
        <h1 class="page-title">Checkout</h1>
        <div class="header-spacer"></div>
      </div>
    </header>

    <div v-if="!orderCreated" class="checkout-content">
      <!-- Order Form -->
      <div class="checkout-form">
        <h2 class="section-title">Order Details</h2>
        
        <div class="form-group">
          <label for="whatsapp">Your WhatsApp Number *</label>
          <input 
            id="whatsapp"
            v-model="formData.whatsapp_number" 
            type="tel" 
            placeholder="+1234567890"
            required
            class="form-input"
          />
          <small class="form-help">We'll use this to contact you about your order</small>
        </div>
        
        <div class="form-group">
          <label for="address">Delivery Address *</label>
          <textarea 
            id="address"
            v-model="formData.delivery_address" 
            rows="4"
            placeholder="Enter your complete delivery address"
            required
            class="form-input"
          ></textarea>
        </div>
        
        <div class="form-group">
          <label for="notes">Additional Notes (Optional)</label>
          <textarea 
            id="notes"
            v-model="formData.notes" 
            rows="3"
            placeholder="Any special instructions or notes for the seller"
            class="form-input"
          ></textarea>
        </div>
      </div>
      
      <!-- Order Summary -->
      <div class="order-summary">
        <h2 class="section-title">Order Summary</h2>
        
        <div class="summary-items">
          <div v-for="(item, index) in cart" :key="index" class="summary-item">
            <div class="item-info">
              <span class="item-name">{{ item.product.generic_name }}</span>
              <span class="item-qty">Qty: {{ item.quantity }}</span>
            </div>
            <span class="item-price">${{ getItemPrice(item) }}</span>
          </div>
        </div>
        
        <div class="summary-total">
          <span>Total:</span>
          <span>${{ total.toFixed(2) }}</span>
        </div>
        
        <button 
          @click="createOrder" 
          :disabled="!canSubmit || submitting"
          class="submit-order-btn"
        >
          <span v-if="submitting">Creating Order...</span>
          <span v-else>Create Order & Open WhatsApp</span>
        </button>
        
        <div v-if="error" class="error-message">
          {{ error }}
        </div>
      </div>
    </div>

    <!-- Order Created Success -->
    <div v-else class="order-success">
      <div class="success-icon">
        <svg width="80" height="80" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="12" cy="12" r="10" stroke="#10b981" stroke-width="2"/>
          <path d="M8 12l2 2 4-4" stroke="#10b981" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
      </div>
      
      <h2>Order Created Successfully!</h2>
      <p class="order-number">Order Number: {{ createdOrders[0]?.order_number }}</p>
      
      <div class="whatsapp-links">
        <p class="instructions">Click the button below to send your order via WhatsApp:</p>
        
        <a 
          v-for="(order, index) in createdOrders" 
          :key="index"
          :href="whatsappLinks[index]" 
          target="_blank"
          class="whatsapp-btn"
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" fill="currentColor"/>
          </svg>
          Send Order #{{ order.order_number }} via WhatsApp
        </a>
      </div>
      
      <button @click="goToOrders" class="view-orders-btn">
        View My Orders
      </button>
    </div>
  </div>
</template>

<script>
import ordersService from '../services/orders'

export default {
  name: 'CheckoutView',
  props: {
    cart: {
      type: Array,
      required: true
    }
  },
  data() {
    return {
      formData: {
        whatsapp_number: '',
        delivery_address: '',
        notes: ''
      },
      submitting: false,
      error: null,
      orderCreated: false,
      createdOrders: [],
      whatsappLinks: []
    }
  },
  computed: {
    total() {
      return this.cart.reduce((sum, item) => {
        const price = item.product.reference_price || 0
        return sum + (price * item.quantity)
      }, 0)
    },
    canSubmit() {
      return this.formData.whatsapp_number.trim() && 
             this.formData.delivery_address.trim() &&
             this.cart.length > 0
    }
  },
  methods: {
    getItemPrice(item) {
      const price = item.product.reference_price || 0
      return (price * item.quantity).toFixed(2)
    },
    async createOrder() {
      if (!this.canSubmit) return
      
      this.submitting = true
      this.error = null
      
      try {
        const response = await ordersService.createOrder({
          items: this.cart,
          whatsapp_number: this.formData.whatsapp_number,
          delivery_address: this.formData.delivery_address,
          notes: this.formData.notes
        })
        
        this.createdOrders = response.orders || [response.order] || []
        this.whatsappLinks = response.whatsapp_links || []
        this.orderCreated = true
        
        // Clear cart
        localStorage.removeItem('cart')
        this.$emit('cart-cleared')
        
      } catch (error) {
        console.error('Order creation error:', error)
        this.error = Array.isArray(error) ? error.join(', ') : error
      } finally {
        this.submitting = false
      }
    },
    goBack() {
      this.$emit('go-back')
    },
    goToOrders() {
      this.$emit('view-orders')
    }
  }
}
</script>

<style scoped>
.checkout-view {
  min-height: 100vh;
  background-color: #dbeafe;
  padding-bottom: 40px;
}

.checkout-header {
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

.checkout-content {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
  display: grid;
  grid-template-columns: 1fr 400px;
  gap: 24px;
}

.checkout-form {
  background: white;
  border-radius: 8px;
  padding: 24px;
}

.section-title {
  font-size: 20px;
  font-weight: 700;
  color: #111827;
  margin: 0 0 24px 0;
}

.form-group {
  margin-bottom: 24px;
}

.form-group label {
  display: block;
  font-size: 14px;
  font-weight: 500;
  color: #374151;
  margin-bottom: 8px;
}

.form-input {
  width: 100%;
  padding: 10px 12px;
  border: 1px solid #d1d5db;
  border-radius: 6px;
  font-size: 14px;
  font-family: inherit;
  transition: border-color 0.2s;
}

.form-input:focus {
  outline: none;
  border-color: #1d4ed8;
  box-shadow: 0 0 0 3px rgba(29, 78, 216, 0.1);
}

.form-help {
  display: block;
  font-size: 12px;
  color: #6b7280;
  margin-top: 4px;
}

.order-summary {
  background: white;
  border-radius: 8px;
  padding: 24px;
  height: fit-content;
  position: sticky;
  top: 20px;
}

.summary-items {
  margin-bottom: 16px;
}

.summary-item {
  display: flex;
  justify-content: space-between;
  padding: 12px 0;
  border-bottom: 1px solid #e5e7eb;
}

.item-info {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.item-name {
  font-size: 14px;
  font-weight: 500;
  color: #111827;
}

.item-qty {
  font-size: 12px;
  color: #6b7280;
}

.item-price {
  font-size: 14px;
  font-weight: 600;
  color: #059669;
}

.summary-total {
  display: flex;
  justify-content: space-between;
  font-size: 20px;
  font-weight: 700;
  color: #111827;
  padding-top: 16px;
  border-top: 2px solid #e5e7eb;
  margin-bottom: 24px;
}

.submit-order-btn {
  width: 100%;
  padding: 14px;
  background-color: #1d4ed8;
  color: white;
  border: none;
  border-radius: 6px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: background-color 0.2s;
}

.submit-order-btn:hover:not(:disabled) {
  background-color: #2563eb;
}

.submit-order-btn:disabled {
  background-color: #9ca3af;
  cursor: not-allowed;
}

.error-message {
  margin-top: 16px;
  padding: 12px;
  background-color: #fee2e2;
  color: #dc2626;
  border-radius: 6px;
  font-size: 14px;
}

.order-success {
  max-width: 600px;
  margin: 40px auto;
  background: white;
  border-radius: 8px;
  padding: 40px;
  text-align: center;
}

.success-icon {
  margin-bottom: 24px;
}

.order-success h2 {
  font-size: 24px;
  font-weight: 700;
  color: #111827;
  margin: 0 0 16px 0;
}

.order-number {
  font-size: 18px;
  font-weight: 600;
  color: #1d4ed8;
  margin: 0 0 32px 0;
}

.instructions {
  font-size: 16px;
  color: #6b7280;
  margin: 0 0 24px 0;
}

.whatsapp-links {
  margin-bottom: 32px;
}

.whatsapp-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
  width: 100%;
  padding: 14px;
  background-color: #25D366;
  color: white;
  border: none;
  border-radius: 6px;
  font-size: 16px;
  font-weight: 600;
  text-decoration: none;
  margin-bottom: 12px;
  transition: background-color 0.2s;
}

.whatsapp-btn:hover {
  background-color: #20BA5A;
}

.view-orders-btn {
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

.view-orders-btn:hover {
  background-color: #2563eb;
}

@media (max-width: 968px) {
  .checkout-content {
    grid-template-columns: 1fr;
  }
  
  .order-summary {
    position: static;
  }
}
</style>
