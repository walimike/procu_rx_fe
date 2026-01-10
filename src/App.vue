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
    <div v-else-if="isAuthenticated" class="authenticated-view">
      <h1>Welcome, {{ userEmail }}!</h1>
      <p>You are logged in as: {{ userRole }}</p>
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
import authService from './services/auth'

export default {
  name: 'App',
  components: {
    LandingPage,
    Login,
    SignupView,
    SellerDashboard,
    CreateProductView
  },
  data() {
    return {
      isAuthenticated: false,
      user: null,
      currentView: 'landing', // 'landing', 'login', 'signup', 'create-product', or 'dashboard'
      signupRole: 'buyer', // Default role for signup
      dashboardKey: 0 // Key to force re-render dashboard
    }
  },
  computed: {
    userEmail() {
      return this.user?.email || ''
    },
    userRole() {
      return this.user?.role || ''
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
        this.currentView = 'dashboard'
        // Verify token is still valid
        authService.getCurrentUser().then(user => {
          if (user) {
            this.user = user
            this.currentView = 'dashboard'
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
      this.currentView = 'dashboard'
    },
    handleSignupSuccess(user) {
      this.user = user
      this.isAuthenticated = true
      this.currentView = 'dashboard'
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
