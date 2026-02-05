<template>
  <div class="buyer-products">
    <!-- Header -->
    <header class="products-header">
      <div class="header-content">
        <h1 class="page-title">Browse Products</h1>
        <div class="header-actions">
          <button @click="viewCart" class="cart-btn">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <circle cx="9" cy="21" r="1" fill="currentColor"/>
              <circle cx="20" cy="21" r="1" fill="currentColor"/>
              <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
            <span v-if="cartItemCount > 0" class="cart-badge">{{ cartItemCount }}</span>
          </button>
          <button @click="handleLogout" class="logout-btn">Logout</button>
        </div>
      </div>
    </header>

    <!-- Filters -->
    <div class="filters">
      <select v-model="selectedCategory" @change="filterProducts" class="category-filter">
        <option value="">All Categories</option>
        <option v-for="category in categories" :key="category.id" :value="category.id">
          {{ category.name }}
        </option>
      </select>
    </div>

    <!-- Loading State -->
    <div v-if="loading" class="loading">
      <p>Loading products...</p>
    </div>

    <!-- Products Grid -->
    <div v-else-if="filteredProducts.length > 0" class="products-grid">
      <div v-for="product in filteredProducts" :key="product.id" class="product-card">
        <div class="product-image">
          <img 
            v-if="product.product_images && product.product_images.length > 0" 
            :src="getImageUrl(product.product_images[0])" 
            :alt="product.generic_name"
            @error="handleImageError"
          />
          <div v-else class="image-placeholder">
            <svg width="60" height="60" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" stroke="#9ca3af" stroke-width="2"/>
            </svg>
          </div>
        </div>
        
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
        
        <div class="product-actions">
          <button @click="addToCart(product)" class="add-to-cart-btn">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <line x1="12" y1="5" x2="12" y2="19" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
              <line x1="5" y1="12" x2="19" y2="12" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
            </svg>
            Add to Cart
          </button>
        </div>
      </div>
    </div>

    <!-- Empty State -->
    <div v-else class="empty-state">
      <p>No products found.</p>
    </div>
  </div>
</template>

<script>
import productsService from '../services/products'
import { API_BASE_URL } from '../services/api'

export default {
  name: 'BuyerProductsView',
  data() {
    return {
      products: [],
      categories: [],
      selectedCategory: '',
      loading: true,
      cart: JSON.parse(localStorage.getItem('cart') || '[]')
    }
  },
  computed: {
    filteredProducts() {
      if (!this.selectedCategory) {
        return this.products
      }
      return this.products.filter(p => p.category.id === parseInt(this.selectedCategory))
    },
    cartItemCount() {
      return this.cart.reduce((sum, item) => sum + item.quantity, 0)
    }
  },
  mounted() {
    this.loadProducts()
    this.loadCategories()
  },
  methods: {
    async loadProducts() {
      try {
        this.loading = true
        this.products = await productsService.getAllProducts()
      } catch (error) {
        console.error('Error loading products:', error)
        alert('Failed to load products. Please try again.')
      } finally {
        this.loading = false
      }
    },
    async loadCategories() {
      try {
        this.categories = await productsService.getCategories()
      } catch (error) {
        console.error('Error loading categories:', error)
      }
    },
    addToCart(product) {
      const existingItem = this.cart.find(item => item.product_id === product.id)
      
      if (existingItem) {
        existingItem.quantity += 1
      } else {
        this.cart.push({
          product_id: product.id,
          product: product,
          quantity: 1
        })
      }
      
      localStorage.setItem('cart', JSON.stringify(this.cart))
      this.$emit('cart-updated', this.cart)
    },
    viewCart() {
      this.$emit('view-cart')
    },
    handleLogout() {
      this.$emit('logout')
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
    },
    filterProducts() {
      // Filtering is handled by computed property
    }
  }
}
</script>

<style scoped>
.buyer-products {
  min-height: 100vh;
  background-color: #dbeafe;
  padding-bottom: 40px;
}

.products-header {
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

.page-title {
  font-size: 24px;
  font-weight: 700;
  color: #111827;
  margin: 0;
}

.header-actions {
  display: flex;
  align-items: center;
  gap: 16px;
}

.cart-btn {
  position: relative;
  background: none;
  border: none;
  color: #1d4ed8;
  cursor: pointer;
  padding: 8px;
  border-radius: 6px;
  transition: background-color 0.2s;
}

.cart-btn:hover {
  background-color: #eff6ff;
}

.cart-badge {
  position: absolute;
  top: 0;
  right: 0;
  background-color: #ef4444;
  color: white;
  border-radius: 50%;
  width: 20px;
  height: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 12px;
  font-weight: 600;
}

.logout-btn {
  padding: 8px 16px;
  background-color: #ef4444;
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-size: 14px;
  font-weight: 500;
}

.logout-btn:hover {
  background-color: #dc2626;
}

.filters {
  max-width: 1200px;
  margin: 0 auto 24px;
  padding: 0 20px;
}

.category-filter {
  padding: 10px 16px;
  border: 1px solid #d1d5db;
  border-radius: 6px;
  font-size: 14px;
  background-color: white;
  color: #111827;
  cursor: pointer;
}

.loading {
  text-align: center;
  padding: 80px 20px;
  color: #6b7280;
}

.products-grid {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 24px;
}

.product-card {
  background: white;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  transition: transform 0.2s, box-shadow 0.2s;
}

.product-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.product-image {
  width: 100%;
  height: 200px;
  background-color: #f3f4f6;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
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
  color: #9ca3af;
}

.product-info {
  padding: 16px;
}

.product-name {
  font-size: 18px;
  font-weight: 600;
  color: #111827;
  margin: 0 0 8px 0;
}

.product-brand {
  font-size: 14px;
  color: #6b7280;
  margin: 0 0 12px 0;
}

.product-meta {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.product-category {
  padding: 4px 12px;
  background-color: #eff6ff;
  color: #1d4ed8;
  border-radius: 12px;
  font-size: 12px;
  font-weight: 500;
}

.product-price {
  color: #059669;
  font-weight: 600;
  font-size: 16px;
}

.product-actions {
  padding: 0 16px 16px;
}

.add-to-cart-btn {
  width: 100%;
  padding: 10px;
  background-color: #1d4ed8;
  color: white;
  border: none;
  border-radius: 6px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  transition: background-color 0.2s;
}

.add-to-cart-btn:hover {
  background-color: #2563eb;
}

.empty-state {
  text-align: center;
  padding: 80px 20px;
  color: #6b7280;
}

@media (max-width: 768px) {
  .products-grid {
    grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
    gap: 16px;
  }
}
</style>
