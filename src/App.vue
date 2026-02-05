<template>
  <div id="app">
    <LandingPage
      v-if="!isAuthenticated && currentView === 'landing'"
      @show-login="showLogin"
      @show-signup="handleShowSignup"
    />
    <Login 
      v-else-if="!isAuthenticated && currentView === 'login'" 
      @login-success="handleLoginSuccess"
      @show-signup="showSignup"
    />
    <SignupView 
      v-else-if="!isAuthenticated && currentView === 'signup'" 
      @signup-success="handleSignupSuccess"
      @show-login="showLogin"
      :default-role="signupRole"
    />
    <SellerDashboard
      v-else-if="isAuthenticated && userRole === 'seller' && currentView === 'dashboard'"
      :key="dashboardKey"
      @create-product="showCreateProduct"
    />
    <CreateProductView
      v-else-if="isAuthenticated && userRole === 'seller' && currentView === 'create-product'"
      @product-created="handleProductCreated"
      @cancel="handleCancelProduct"
      @unauthorized="handleUnauthorized"
    />
    <BuyerProductsView
      v-else-if="isAuthenticated && userRole === 'buyer' && currentView === 'products'"
      @view-cart="showCart"
      @cart-updated="handleCartUpdated"
      @logout="handleLogout"
    />
    <CartView
      v-else-if="isAuthenticated && userRole === 'buyer' && currentView === 'cart'"
      :cart="cart"
      @cart-updated="handleCartUpdated"
      @checkout="showCheckout"
      @go-back="showProducts"
    />
    <CheckoutView
      v-else-if="isAuthenticated && userRole === 'buyer' && currentView === 'checkout'"
      :cart="cart"
      @cart-cleared="handleCartCleared"
      @go-back="showCart"
      @view-orders="showOrders"
    />
    <div v-else-if="isAuthenticated" class="authenticated-view">
      <h1>Welcome, {{ userEmail }}!</h1>
      <p>You are logged in as: {{ userRole }}</p>
      <p style="color: #ef4444; margin: 16px 0;">Debug: currentView = {{ currentView }}</p>
      <div v-if="userRole === 'buyer'">
        <button @click="showProducts" class="create-product-btn">Browse Products</button>
      </div>
      <button @click="handleLogout" class="logout-button">Logout</button>
    </div>
  </div>
</template>

<script>
import LandingPage from './views/LandingPage.vue'
import Login from './views/Login.vue'
import SignupView from './views/SignupView.vue'
import SellerDashboard from './views/SellerDashboard.vue'
import CreateProductView from './views/CreateProductView.vue'
import BuyerProductsView from './views/BuyerProductsView.vue'
import CartView from './views/CartView.vue'
import CheckoutView from './views/CheckoutView.vue'
import authService from './services/auth'

export default {
  name: 'App',
  components: {
    LandingPage,
    Login,
    SignupView,
    SellerDashboard,
    CreateProductView,
    BuyerProductsView,
    CartView,
    CheckoutView
  },
  data() {
    return {
      isAuthenticated: false,
      user: null,
      currentView: 'landing', // 'landing', 'login', 'signup', 'create-product', 'dashboard', 'products', 'cart', 'checkout'
      signupRole: 'buyer', // Default role for signup
      dashboardKey: 0, // Key to force re-render dashboard
      cart: JSON.parse(localStorage.getItem('cart') || '[]')
    }
  },
  computed: {
    userEmail() {
      return this.user?.email || ''
    },
    userRole() {
      // Handle both string ('buyer') and number (0) role formats
      const role = this.user?.role
      if (typeof role === 'number') {
        const roleMap = { 0: 'buyer', 1: 'seller', 2: 'admin' }
        return roleMap[role] || ''
      }
      return role || ''
    }
  },
  mounted() {
    this.checkAuthentication()
  },
  methods: {
    checkAuthentication() {
      if (authService.isAuthenticated()) {
        this.user = authService.getUser()
        this.isAuthenticated = true
        // Set initial view based on role
        if (this.user.role === 'buyer') {
          this.currentView = 'products'
        } else if (this.user.role === 'seller') {
          this.currentView = 'dashboard'
        } else {
          this.currentView = 'dashboard'
        }
        // Verify token is still valid
        authService.getCurrentUser().then(user => {
          if (user) {
            this.user = user
            if (user.role === 'buyer') {
              this.currentView = 'products'
            } else if (user.role === 'seller') {
              this.currentView = 'dashboard'
            }
          } else {
            this.isAuthenticated = false
            this.user = null
            this.currentView = 'landing'
          }
        }).catch(() => {
          this.isAuthenticated = false
          this.user = null
          this.currentView = 'landing'
        })
      }
    },
    handleLoginSuccess(user) {
      this.user = user
      this.isAuthenticated = true
      if (user.role === 'buyer') {
        this.currentView = 'products'
      } else if (user.role === 'seller') {
        this.currentView = 'dashboard'
      } else {
        this.currentView = 'dashboard'
      }
    },
    handleSignupSuccess(user) {
      this.user = user
      this.isAuthenticated = true
      if (user.role === 'buyer') {
        this.currentView = 'products'
      } else if (user.role === 'seller') {
        this.currentView = 'dashboard'
      } else {
        this.currentView = 'dashboard'
      }
    },
    showCreateProduct() {
      if (this.userRole === 'seller') {
        this.currentView = 'create-product'
      }
    },
    handleProductCreated() {
      // Force dashboard to reload by incrementing key
      this.dashboardKey += 1
      this.currentView = 'dashboard'
    },
    handleCancelProduct() {
      this.currentView = 'dashboard'
    },
    handleUnauthorized() {
      alert('Only sellers can create products.')
      this.currentView = 'dashboard'
    },
    showLogin() {
      this.currentView = 'login'
    },
    showSignup(role = 'buyer') {
      this.signupRole = role
      this.currentView = 'signup'
    },
    handleShowSignup(role = 'buyer') {
      this.showSignup(role)
    },
    handleLogout() {
      authService.logout()
      this.isAuthenticated = false
      this.user = null
      this.currentView = 'landing'
      this.cart = []
      localStorage.removeItem('cart')
    },
    showProducts() {
      this.currentView = 'products'
    },
    showCart() {
      this.currentView = 'cart'
    },
    showCheckout() {
      this.currentView = 'checkout'
    },
    showOrders() {
      // TODO: Implement orders view
      this.currentView = 'products'
    },
    handleCartUpdated(cart) {
      this.cart = cart
      localStorage.setItem('cart', JSON.stringify(cart))
    },
    handleCartCleared() {
      this.cart = []
      localStorage.removeItem('cart')
    }
  },
  watch: {
    isAuthenticated(newVal) {
      if (newVal && this.user) {
        this.currentView = 'dashboard'
      }
    }
  }
}
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
  min-height: 100vh;
  margin: 0;
  padding: 0;
  background-color: #dbeafe; /* Light blue secondary - body background */
}

.authenticated-view {
  padding: 40px;
  text-align: center;
  background-color: #dbeafe; /* Light blue secondary - body background */
  min-height: 100vh;
}

.seller-actions {
  margin: 30px 0;
}

.create-product-btn {
  padding: 12px 24px;
  background-color: #1d4ed8;
  color: white;
  border: none;
  border-radius: 6px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: background-color 0.2s;
  margin-bottom: 20px;
}

.create-product-btn:hover {
  background-color: #2563eb;
}

.logout-button {
  margin-top: 20px;
  padding: 10px 20px;
  background-color: #dc3545;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 16px;
}

.logout-button:hover {
  background-color: #c82333;
}
</style>
