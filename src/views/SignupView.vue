<template>
  <div class="signup-container">
    <div class="signup-card">
      <h2>Create Account</h2>
      <form @submit.prevent="handleSignup">
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
        <div class="form-group">
          <label for="passwordConfirmation">Confirm Password</label>
          <input
            id="passwordConfirmation"
            v-model="passwordConfirmation"
            type="password"
            required
            placeholder="Confirm your password"
            class="form-input"
          />
        </div>
        <div class="form-group">
          <label for="role">I want to register as:</label>
          <select id="role" v-model="role" required class="form-input">
            <option value="buyer">Buyer</option>
            <option value="seller">Seller</option>
          </select>
        </div>
        <div v-if="error" class="error-message">
          {{ error }}
        </div>
        <button type="submit" :disabled="loading" class="submit-button">
          {{ loading ? 'Creating account...' : 'Sign Up' }}
        </button>
        <div class="link-container">
          <p>
            Already have an account?
            <a href="#" @click.prevent="$emit('show-login')" class="link">Login here</a>
          </p>
        </div>
      </form>
    </div>
  </div>
</template>

<script>
import authService from '../services/auth'

export default {
  name: 'SignupView',
  data() {
    return {
      email: '',
      password: '',
      passwordConfirmation: '',
      role: 'buyer',
      error: null,
      loading: false
    }
  },
  methods: {
    async handleSignup() {
      this.error = null
      
      // Validate passwords match
      if (this.password !== this.passwordConfirmation) {
        this.error = 'Passwords do not match'
        return
      }

      // Validate password length
      if (this.password.length < 6) {
        this.error = 'Password must be at least 6 characters long'
        return
      }

      this.loading = true

      try {
        const response = await authService.signup(
          this.email,
          this.password,
          this.passwordConfirmation,
          this.role
        )
        
        // Emit signup success event for parent component
        this.$emit('signup-success', response.user)
        console.log(`${response.user.role} account created:`, response.user)
      } catch (error) {
        this.error = typeof error === 'string' ? error : 'Signup failed. Please check your information.'
      } finally {
        this.loading = false
      }
    }
  }
}
</script>

<style scoped>
.signup-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background-color: #f5f5f5;
  padding: 20px;
}

.signup-card {
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

select.form-input {
  cursor: pointer;
}

.form-input:focus {
  outline: none;
  border-color: #4DBA87;
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
  background-color: #4DBA87;
  color: white;
  border: none;
  border-radius: 4px;
  font-size: 16px;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.3s;
  margin-bottom: 20px;
}

.submit-button:hover:not(:disabled) {
  background-color: #45a675;
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
  color: #4DBA87;
  text-decoration: none;
  font-weight: 500;
}

.link:hover {
  text-decoration: underline;
}
</style>
