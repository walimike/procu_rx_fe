import api from './api'

class AuthService {
  async signup(email, password, passwordConfirmation, role = 'buyer') {
    try {
      const response = await api.post('/api/signup', {
        email,
        password,
        password_confirmation: passwordConfirmation,
        role
      })
      
      if (response.data.token) {
        localStorage.setItem('auth_token', response.data.token)
        localStorage.setItem('user', JSON.stringify(response.data.user))
        return response.data
      }
      
      throw new Error('No token received')
    } catch (error) {
      if (error.response?.data?.errors) {
        throw error.response.data.errors.join(', ')
      }
      throw error.response?.data?.error || error.message || 'Signup failed'
    }
  }

  async login(email, password) {
    try {
      const response = await api.post('/api/login', {
        email,
        password
      })
      
      if (response.data.token) {
        localStorage.setItem('auth_token', response.data.token)
        localStorage.setItem('user', JSON.stringify(response.data.user))
        return response.data
      }
      
      throw new Error('No token received')
    } catch (error) {
      throw error.response?.data?.error || error.message || 'Login failed'
    }
  }

  async logout() {
    localStorage.removeItem('auth_token')
    localStorage.removeItem('user')
  }

  getToken() {
    return localStorage.getItem('auth_token')
  }

  getUser() {
    const userStr = localStorage.getItem('user')
    return userStr ? JSON.parse(userStr) : null
  }

  isAuthenticated() {
    return !!this.getToken()
  }

  async getCurrentUser() {
    try {
      const response = await api.get('/api/me')
      if (response.data.user) {
        localStorage.setItem('user', JSON.stringify(response.data.user))
        return response.data.user
      }
      return null
    } catch (error) {
      this.logout()
      return null
    }
  }

  isBuyer() {
    const user = this.getUser()
    return user?.role === 'buyer'
  }

  isSeller() {
    const user = this.getUser()
    return user?.role === 'seller'
  }
}

export default new AuthService()
