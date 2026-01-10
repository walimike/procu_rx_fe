<template>
  <div class="seller-dashboard">
    <!-- Left Sidebar -->
    <aside class="sidebar">
      <div class="sidebar-content">
        <div class="logo">
          <h2>MedMarket</h2>
        </div>
        
        <nav class="sidebar-nav">
          <a 
            href="#" 
            @click.prevent="setActiveTab('dashboard')"
            :class="['nav-item', { active: activeNav === 'dashboard' }]"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" class="nav-icon">
              <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              <polyline points="9 22 9 12 15 12 15 22" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
            <span>Dashboard</span>
          </a>
          
          <a 
            href="#" 
            @click.prevent="setActiveTab('products')"
            :class="['nav-item', { active: activeNav === 'products' }]"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" class="nav-icon">
              <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              <polyline points="3.27 6.96 12 12.01 20.73 6.96" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              <line x1="12" y1="22.08" x2="12" y2="12" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
            <span>My Products</span>
          </a>
          
          <a 
            href="#" 
            @click.prevent="setActiveTab('orders')"
            :class="['nav-item', { active: activeNav === 'orders' }]"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" class="nav-icon">
              <circle cx="9" cy="21" r="1" fill="currentColor"/>
              <circle cx="20" cy="21" r="1" fill="currentColor"/>
              <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
            <span>Orders</span>
          </a>
          
          <a 
            href="#" 
            @click.prevent="setActiveTab('analytics')"
            :class="['nav-item', { active: activeNav === 'analytics' }]"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" class="nav-icon">
              <line x1="18" y1="20" x2="18" y2="10" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              <line x1="12" y1="20" x2="12" y2="4" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              <line x1="6" y1="20" x2="6" y2="14" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
            <span>Analytics</span>
          </a>
        </nav>
        
        <div class="sidebar-footer">
          <button class="notification-btn" @click="showNotifications">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              <path d="M13.73 21a2 2 0 0 1-3.46 0" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
          </button>
          <div class="user-avatar" @click="showProfile">
            <span>{{ userInitials }}</span>
          </div>
        </div>
      </div>
    </aside>
    
    <!-- Main Content -->
    <main class="main-content">
      <!-- Header -->
      <header class="dashboard-header">
        <div class="header-left">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" class="header-icon">
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            <polyline points="14 2 14 8 20 8" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            <line x1="16" y1="13" x2="8" y2="13" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            <line x1="16" y1="17" x2="8" y2="17" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            <polyline points="10 9 9 9 8 9" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
          <span>Seller Dashboard</span>
        </div>
        <button v-if="activeTab === 'products'" @click="createProduct" class="add-product-btn">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <line x1="12" y1="5" x2="12" y2="19" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
            <line x1="5" y1="12" x2="19" y2="12" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
          </svg>
          Add New Product
        </button>
      </header>
      
      <h1 class="dashboard-title">Seller Dashboard</h1>
      
      <!-- Metrics Cards -->
      <div class="metrics-grid">
        <div class="metric-card blue">
          <div class="metric-label">My Products</div>
          <div class="metric-value">{{ stats.my_products || 0 }}</div>
        </div>
        
        <div class="metric-card green">
          <div class="metric-label">Active RFQs</div>
          <div class="metric-value">{{ stats.active_rfqs || 0 }}</div>
        </div>
        
        <div class="metric-card orange">
          <div class="metric-label">Orders to Ship</div>
          <div class="metric-value">{{ stats.orders_to_ship || 0 }}</div>
        </div>
        
        <div class="metric-card yellow">
          <div class="metric-label">Vendor Rating</div>
          <div class="metric-value">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg" class="star-icon">
              <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
            </svg>
            {{ stats.vendor_rating || '0.0' }}
          </div>
        </div>
        
        <div class="metric-card purple">
          <div class="metric-label">Total Orders</div>
          <div class="metric-value">{{ stats.total_orders || 0 }}</div>
        </div>
      </div>
      
      <!-- Tabs -->
      <div class="tabs">
        <button 
          v-for="tab in tabs" 
          :key="tab.key"
          @click="activeTab = tab.key"
          :class="['tab-button', { active: activeTab === tab.key }]"
        >
          {{ tab.label }}
        </button>
      </div>
      
      <!-- Tab Content -->
      <div class="tab-content">
        <!-- Products Tab -->
        <div v-if="activeTab === 'products'" class="products-section">
          <div v-if="products.length === 0" class="empty-state">
            <div class="empty-icon">
              <svg width="120" height="120" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" stroke="#9ca3af" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                <polyline points="3.27 6.96 12 12.01 20.73 6.96" stroke="#9ca3af" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                <line x1="12" y1="22.08" x2="12" y2="12" stroke="#9ca3af" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
            </div>
            <h2 class="empty-title">My Products</h2>
            <p class="empty-text">No products yet</p>
            <p class="empty-description">Start by creating your first product listing</p>
            <button @click="createProduct" class="create-product-btn">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <line x1="12" y1="5" x2="12" y2="19" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
                <line x1="5" y1="12" x2="19" y2="12" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
              </svg>
              Create Product
            </button>
          </div>
          
          <div v-else class="products-list">
            <div class="products-header">
              <h2 class="products-title">My Products ({{ products.length }})</h2>
            </div>
            
            <div class="products-table">
              <div class="product-item" v-for="product in products" :key="product.id">
                <div class="product-image">
                  <img 
                    v-if="product.product_images && product.product_images.length > 0" 
                    :src="getImageUrl(product.product_images[0])" 
                    :alt="product.generic_name"
                    @error="handleImageError"
                  />
                  <div v-else class="image-placeholder">
                    <svg width="40" height="40" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" stroke="#9ca3af" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                    </svg>
                  </div>
                </div>
                
                <div class="product-details">
                  <div class="product-info">
                    <h3 class="product-name">{{ product.generic_name }}</h3>
                    <p class="product-brand">{{ product.brand_name }}</p>
                    <div class="product-meta">
                      <span class="product-category">{{ product.category.name }}</span>
                      <span v-if="product.reference_price" class="product-price">
                        ${{ parseFloat(product.reference_price).toFixed(2) }}
                      </span>
                    </div>
                  </div>
                </div>
                
                <div class="product-status">
                  <span :class="['status-badge', `status-${product.status}`]">
                    {{ product.status.charAt(0).toUpperCase() + product.status.slice(1) }}
                  </span>
                </div>
                
                <div class="product-actions">
                  <button 
                    v-if="product.status === 'pending'" 
                    class="action-btn view-btn" 
                    @click="viewProduct(product)"
                    title="View Details"
                  >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                      <circle cx="12" cy="12" r="3" stroke="currentColor" stroke-width="2"/>
                    </svg>
                  </button>
                  <button 
                    v-if="product.status === 'rejected'"
                    class="action-btn edit-btn" 
                    @click="editProduct(product)"
                    title="Edit Product"
                  >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                      <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <!-- Other tabs content will go here -->
        <div v-else class="tab-placeholder">
          <p>{{ getActiveTabLabel() }} content coming soon</p>
        </div>
      </div>
    </main>
  </div>
</template>

<script>
import authService from '../services/auth'
import productsService from '../services/products'
import { API_BASE_URL } from '../services/api'

export default {
  name: 'SellerDashboard',
  data() {
    return {
      activeNav: 'dashboard',
      activeTab: 'products',
      tabs: [
        { key: 'products', label: 'Products' },
        { key: 'orders', label: 'Orders & Fulfillment' },
        { key: 'rfqs', label: 'RFQs' },
        { key: 'ratings', label: 'Performance Ratings' },
        { key: 'payouts', label: 'Payout History' }
      ],
      stats: {
        my_products: 0,
        active_rfqs: 0,
        orders_to_ship: 0,
        vendor_rating: '0.0',
        total_orders: 0
      },
      products: [],
      user: null
    }
  },
  computed: {
    userInitials() {
      if (!this.user || !this.user.email) return 'U'
      const email = this.user.email
      return email.charAt(0).toUpperCase()
    }
  },
  mounted() {
    this.user = authService.getUser()
    this.loadDashboardData()
  },
  watch: {
    activeTab(newTab) {
      if (newTab === 'products') {
        this.loadProducts()
      }
    }
  },
  methods: {
    setActiveTab(tab) {
      this.activeNav = tab
      if (tab === 'products') {
        this.activeTab = 'products'
      }
    },
    async loadDashboardData() {
      await this.loadProducts()
      // TODO: Load other stats when backend endpoints are ready
      // this.stats = await dashboardService.getStats()
    },
    async loadProducts() {
      try {
        // Load seller's products
        this.products = await productsService.getMyProducts()
        this.stats.my_products = this.products.length
      } catch (error) {
        console.error('Error loading products:', error)
      }
    },
    createProduct() {
      this.$emit('create-product')
    },
    showNotifications() {
      // TODO: Implement notifications
      console.log('Show notifications')
    },
    showProfile() {
      // TODO: Implement profile menu
      console.log('Show profile')
    },
    getActiveTabLabel() {
      const tab = this.tabs.find(t => t.key === this.activeTab)
      return tab ? tab.label : ''
    },
    handleImageError(event) {
      // Hide broken image and show placeholder
      event.target.style.display = 'none'
    },
    viewProduct(product) {
      // TODO: Implement product view modal/page
      console.log('View product:', product)
      alert(`Product: ${product.generic_name}\nStatus: ${product.status}\nCategory: ${product.category.name}`)
    },
    editProduct(product) {
      // TODO: Implement product edit functionality
      console.log('Edit product:', product)
      alert(`Edit product: ${product.generic_name}`)
    },
    getImageUrl(imagePath) {
      // Handle both full URLs and relative paths
      if (!imagePath) return ''
      if (imagePath.startsWith('http://') || imagePath.startsWith('https://')) {
        return imagePath
      }
      return `${API_BASE_URL}${imagePath}`
    }
  }
}
</script>

<style scoped>
.seller-dashboard {
  display: flex;
  min-height: 100vh;
  background-color: #f9fafb;
}

/* Sidebar */
.sidebar {
  width: 250px;
  background-color: white;
  border-right: 1px solid #e5e7eb;
  display: flex;
  flex-direction: column;
}

.sidebar-content {
  display: flex;
  flex-direction: column;
  height: 100vh;
  padding: 24px 0;
}

.logo {
  padding: 0 24px 32px;
  border-bottom: 1px solid #e5e7eb;
}

.logo h2 {
  margin: 0;
  font-size: 20px;
  font-weight: 700;
  color: #1d4ed8;
}

.sidebar-nav {
  flex: 1;
  padding: 24px 0;
}

.nav-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 24px;
  color: #6b7280;
  text-decoration: none;
  font-size: 14px;
  font-weight: 500;
  transition: all 0.2s;
  cursor: pointer;
}

.nav-item:hover {
  background-color: #f9fafb;
  color: #374151;
}

.nav-item.active {
  background-color: #eff6ff;
  color: #1d4ed8;
  border-right: 3px solid #1d4ed8;
}

.nav-icon {
  color: currentColor;
}

.sidebar-footer {
  display: flex;
  align-items: center;
  justify-content: space-around;
  padding: 16px 24px;
  border-top: 1px solid #e5e7eb;
}

.notification-btn {
  background: none;
  border: none;
  color: #6b7280;
  cursor: pointer;
  padding: 8px;
  border-radius: 6px;
  transition: all 0.2s;
}

.notification-btn:hover {
  background-color: #f9fafb;
  color: #374151;
}

.user-avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background-color: #1d4ed8;
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 600;
  font-size: 16px;
  cursor: pointer;
  transition: transform 0.2s;
}

.user-avatar:hover {
  transform: scale(1.05);
}

/* Main Content */
.main-content {
  flex: 1;
  padding: 32px;
  background-color: #f9fafb;
  overflow-y: auto;
}

.dashboard-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
}

.header-left {
  display: flex;
  align-items: center;
  gap: 12px;
  font-size: 16px;
  font-weight: 500;
  color: #374151;
}

.header-icon {
  color: #6b7280;
}

.add-product-btn {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 16px;
  background-color: #1d4ed8;
  color: white;
  border: none;
  border-radius: 6px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.2s;
}

.add-product-btn:hover {
  background-color: #2563eb;
}

.dashboard-title {
  font-size: 32px;
  font-weight: 700;
  color: #111827;
  margin: 0 0 32px 0;
}

/* Metrics Grid */
.metrics-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 24px;
  margin-bottom: 32px;
}

.metric-card {
  background: white;
  border-radius: 8px;
  padding: 24px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.metric-label {
  font-size: 14px;
  color: #6b7280;
  margin-bottom: 8px;
  font-weight: 500;
}

.metric-value {
  font-size: 32px;
  font-weight: 700;
  display: flex;
  align-items: center;
  gap: 8px;
}

.metric-card.blue .metric-value {
  color: #1d4ed8;
}

.metric-card.green .metric-value {
  color: #10b981;
}

.metric-card.orange .metric-value {
  color: #f59e0b;
}

.metric-card.yellow .metric-value {
  color: #eab308;
}

.metric-card.purple .metric-value {
  color: #8b5cf6;
}

.star-icon {
  width: 20px;
  height: 20px;
}

/* Tabs */
.tabs {
  display: flex;
  gap: 8px;
  border-bottom: 2px solid #e5e7eb;
  margin-bottom: 24px;
}

.tab-button {
  padding: 12px 24px;
  background: none;
  border: none;
  font-size: 14px;
  font-weight: 500;
  color: #6b7280;
  cursor: pointer;
  border-bottom: 2px solid transparent;
  margin-bottom: -2px;
  transition: all 0.2s;
}

.tab-button:hover {
  color: #374151;
}

.tab-button.active {
  color: #1d4ed8;
  border-bottom-color: #1d4ed8;
}

/* Tab Content */
.tab-content {
  background: white;
  border-radius: 8px;
  padding: 32px;
  min-height: 400px;
}

/* Empty State */
.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 80px 20px;
  text-align: center;
}

.empty-icon {
  margin-bottom: 24px;
  opacity: 0.5;
}

.empty-title {
  font-size: 24px;
  font-weight: 700;
  color: #111827;
  margin: 0 0 8px 0;
}

.empty-text {
  font-size: 18px;
  color: #6b7280;
  margin: 0 0 4px 0;
}

.empty-description {
  font-size: 14px;
  color: #9ca3af;
  margin: 0 0 32px 0;
}

.create-product-btn {
  display: flex;
  align-items: center;
  gap: 8px;
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

.create-product-btn:hover {
  background-color: #2563eb;
}

.tab-placeholder {
  padding: 80px 20px;
  text-align: center;
  color: #6b7280;
}

.products-list {
  width: 100%;
}

.products-header {
  margin-bottom: 24px;
}

.products-title {
  font-size: 20px;
  font-weight: 700;
  color: #111827;
  margin: 0;
}

.products-table {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.product-item {
  display: grid;
  grid-template-columns: 80px 1fr auto auto;
  gap: 20px;
  align-items: center;
  padding: 20px;
  background-color: #f9fafb;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  transition: all 0.2s;
}

.product-item:hover {
  background-color: #f3f4f6;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
}

.product-image {
  width: 80px;
  height: 80px;
  border-radius: 8px;
  overflow: hidden;
  background-color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 1px solid #e5e7eb;
}

.product-image img {
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
  background-color: #f3f4f6;
  color: #9ca3af;
}

.product-details {
  flex: 1;
}

.product-info {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.product-name {
  font-size: 16px;
  font-weight: 600;
  color: #111827;
  margin: 0;
}

.product-brand {
  font-size: 14px;
  color: #6b7280;
  margin: 0;
}

.product-meta {
  display: flex;
  align-items: center;
  gap: 16px;
  font-size: 13px;
}

.product-category {
  padding: 4px 12px;
  background-color: #eff6ff;
  color: #1d4ed8;
  border-radius: 12px;
  font-weight: 500;
}

.product-price {
  color: #059669;
  font-weight: 600;
}

.product-status {
  display: flex;
  align-items: center;
}

.status-badge {
  padding: 6px 12px;
  border-radius: 12px;
  font-size: 12px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.status-pending {
  background-color: #fef3c7;
  color: #d97706;
}

.status-approved {
  background-color: #d1fae5;
  color: #059669;
}

.status-rejected {
  background-color: #fee2e2;
  color: #dc2626;
}

.product-actions {
  display: flex;
  gap: 8px;
  align-items: center;
}

.action-btn {
  width: 36px;
  height: 36px;
  border-radius: 6px;
  border: 1px solid #e5e7eb;
  background-color: white;
  color: #6b7280;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s;
}

.action-btn:hover {
  background-color: #f9fafb;
  border-color: #d1d5db;
  color: #374151;
}

.view-btn:hover {
  background-color: #eff6ff;
  border-color: #1d4ed8;
  color: #1d4ed8;
}

.edit-btn:hover {
  background-color: #fef3c7;
  border-color: #d97706;
  color: #d97706;
}

/* Responsive */
@media (max-width: 768px) {
  .sidebar {
    width: 200px;
  }
  
  .metrics-grid {
    grid-template-columns: 1fr;
  }
  
  .tabs {
    overflow-x: auto;
    flex-wrap: nowrap;
  }
  
  .tab-button {
    white-space: nowrap;
  }
}
</style>
