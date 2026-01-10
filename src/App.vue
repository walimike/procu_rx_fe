<template>
  <div id="app">
    <Login 
      v-if="!isAuthenticated && currentView === 'login'" 
      @login-success="handleLoginSuccess"
      @show-signup="showSignup"
    />
    <SignupView 
      v-else-if="!isAuthenticated && currentView === 'signup'" 
      @signup-success="handleSignupSuccess"
      @show-login="showLogin"
    />
    <div v-else class="authenticated-view">
      <h1>Welcome, {{ userEmail }}!</h1>
      <p>You are logged in as: {{ userRole }}</p>
      <button @click="handleLogout" class="logout-button">Logout</button>
    </div>
  </div>
</template>

<script>
import Login from './views/Login.vue'
import SignupView from './views/SignupView.vue'
import authService from './services/auth'

export default {
  name: 'App',
  components: {
    Login,
    SignupView
  },
  data() {
    return {
      isAuthenticated: false,
      user: null,
      currentView: 'login' // 'login' or 'signup'
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
        // Verify token is still valid
        authService.getCurrentUser().then(user => {
          if (user) {
            this.user = user
          } else {
            this.isAuthenticated = false
            this.user = null
          }
        }).catch(() => {
          this.isAuthenticated = false
          this.user = null
        })
      }
    },
    handleLoginSuccess(user) {
      this.user = user
      this.isAuthenticated = true
    },
    handleSignupSuccess(user) {
      this.user = user
      this.isAuthenticated = true
    },
    showLogin() {
      this.currentView = 'login'
    },
    showSignup() {
      this.currentView = 'signup'
    },
    handleLogout() {
      authService.logout()
      this.isAuthenticated = false
      this.user = null
      this.currentView = 'login'
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
}

.authenticated-view {
  padding: 40px;
  text-align: center;
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
