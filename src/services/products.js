import api from './api'

class ProductsService {
  async getCategories() {
    try {
      const response = await api.get('/api/categories')
      return response.data.categories
    } catch (error) {
      throw error.response?.data?.error || error.message || 'Failed to fetch categories'
    }
  }

  async createProduct(productData) {
    try {
      const formData = new FormData()
      
      // Append product fields - Rails expects nested params
      formData.append('product[generic_name]', productData.generic_name || '')
      formData.append('product[brand_name]', productData.brand_name || '')
      formData.append('product[category_id]', productData.category_id || '')
      if (productData.reference_price) {
        formData.append('product[reference_price]', productData.reference_price.toString())
      }
      
      // Append product images - Rails parses arrays from FormData automatically
      if (productData.product_images && productData.product_images.length > 0) {
        productData.product_images.forEach((file) => {
          formData.append('product_images[]', file)
        })
      }
      
      // Append compliance documents
      if (productData.compliance_documents && productData.compliance_documents.length > 0) {
        productData.compliance_documents.forEach((file) => {
          formData.append('compliance_documents[]', file)
        })
      }
      
      console.log('Sending product creation request to /api/products')
      const response = await api.post('/api/products', formData)
      
      return response.data
    } catch (error) {
      console.error('Product creation error:', error)
      console.error('Error response:', error.response)
      console.error('Request URL:', error.config?.url)
      console.error('Request method:', error.config?.method)
      
      if (!error.response) {
        throw 'Network error: Could not reach the server. Please ensure Rails server is running on port 3000.'
      }
      
      if (error.response?.status === 404) {
        throw `Endpoint not found (404). URL: ${error.config?.baseURL}${error.config?.url}. Please check if the Rails server is running.`
      }
      
      if (error.response?.data?.errors) {
        const errors = Array.isArray(error.response.data.errors) 
          ? error.response.data.errors 
          : [error.response.data.errors]
        throw errors
      }
      
      throw error.response?.data?.error || error.message || 'Failed to create product'
    }
  }

  async getMyProducts() {
    try {
      const response = await api.get('/api/products/my_products')
      return response.data.products
    } catch (error) {
      throw error.response?.data?.error || error.message || 'Failed to fetch products'
    }
  }

  async getAllProducts() {
    try {
      const response = await api.get('/api/products')
      return response.data.products
    } catch (error) {
      throw error.response?.data?.error || error.message || 'Failed to fetch products'
    }
  }
}

export default new ProductsService()
