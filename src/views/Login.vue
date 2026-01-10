<template>
  <div class="login-container">
    <div class="login-card">
      <h2>Pharmacy App Login</h2>
      <form @submit.prevent="handleLogin">
        <div class="form-group">
          <label for="email">Email</label>
          <input
            id="email"
            v-model="email"
            type="email"
            required
            placeholder="Enter your email"
            class="form-input"
          />
        </div>
        <div class="form-group">
          <label for="password">Password</label>
          <input
            id="password"
            v-model="password"
            type="password"
            required
            placeholder="Enter your password"
            class="form-input"
          />
        </div>
        <div v-if="error" class="error-message">
          {{ error }}
        </div>
        <button type="submit" :disabled="loading" class="submit-button">
          {{ loading ? 'Logging in...' : 'Login' }}
        </button>
        <div class="link-container">
          <p>
            Don't have an account?
            <a href="#" @click.prevent="$emit('show-signup')" class="link">Sign up here</a>
          </p>
        </div>
      </form>
    </div>
  </div>
</template>

<script>
import authService from '../services/auth'

export default {
  name: 'LoginView',
  data() {
    return {
      email: '',
      password: '',
      error: null,
      loading: false
    }
  },
  methods: {
    async handleLogin() {
      this.error = null
      this.loading = true

      try {
        const response = await authService.login(this.email, this.password)
        
        // Check user role
        if (response.user.role === 'buyer' || response.user.role === 'seller') {
          // Emit login success event for parent component
          this.$emit('login-success', response.user)
          // Redirect to appropriate dashboard (will implement later)
          console.log(`${response.user.role} logged in:`, response.user)
        } else {
          this.error = 'Invalid user role. Only buyers and sellers can login here.'
          authService.logout()
        }
      } catch (error) {
        this.error = typeof error === 'string' ? error : 'Login failed. Please check your credentials.'
      } finally {
        this.loading = false
      }
    }
  }
}
</script>

<style scoped>
.login-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background-color: #dbeafe; /* Light blue secondary - body background */
  padding: 20px;
}

.login-card {
  background: white;
  padding: 40px;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  width: 100%;
  max-width: 400px;
}

h2 {
  text-align: center;
  margin-bottom: 30px;
  color: #333;
}

.form-group {
  margin-bottom: 20px;
}

label {
  display: block;
  margin-bottom: 5px;
  color: #555;
  font-weight: 500;
}

.form-input {
  width: 100%;
  padding: 12px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 16px;
  box-sizing: border-box;
}

.form-input:focus {
  outline: none;
  border-color: #1d4ed8; /* Dark blue primary */
}

.error-message {
  background-color: #fee;
  color: #c33;
  padding: 12px;
  border-radius: 4px;
  margin-bottom: 20px;
  font-size: 14px;
}

.submit-button {
  width: 100%;
  padding: 12px;
  background-color: #1d4ed8; /* Dark blue primary */
  color: white;
  border: none;
  border-radius: 4px;
  font-size: 16px;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.3s;
}

.submit-button:hover:not(:disabled) {
  background-color: #2563eb;
}

.submit-button:disabled {
  background-color: #ccc;
  cursor: not-allowed;
}

.link-container {
  text-align: center;
  margin-top: 20px;
}

.link-container p {
  margin: 0;
  color: #666;
}

.link {
  color: #1d4ed8; /* Dark blue primary */
  text-decoration: none;
  font-weight: 500;
}

.link:hover {
  text-decoration: underline;
}
</style>
