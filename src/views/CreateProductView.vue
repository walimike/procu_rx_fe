<template>
  <div class="create-product-container">
    <div class="form-wrapper">
      <h1 class="form-title">Create Product Listing</h1>
      
      <form @submit.prevent="handleSubmit" class="product-form">
        <!-- Product Details - Two Columns -->
        <div class="form-section">
          <h2 class="section-title">Product Details</h2>
          <div class="form-row">
            <!-- Left Column -->
            <div class="form-column">
              <div class="form-group">
                <label for="generic_name" class="required-label">Generic Name *</label>
                <input
                  id="generic_name"
                  v-model="formData.generic_name"
                  type="text"
                  required
                  placeholder="e.g., Ibuprofen"
                  class="form-input"
                />
                <span class="helper-text">The non-proprietary pharmaceutical name</span>
              </div>
              
              <div class="form-group">
                <label for="category" class="required-label">Category *</label>
                <select
                  id="category"
                  v-model="formData.category_id"
                  required
                  class="form-input"
                >
                  <option value="">Select a category</option>
                  <option v-for="category in categories" :key="category.id" :value="category.id">
                    {{ category.name }}
                  </option>
                </select>
              </div>
            </div>
            
            <!-- Right Column -->
            <div class="form-column">
              <div class="form-group">
                <label for="brand_name" class="required-label">Brand Name *</label>
                <input
                  id="brand_name"
                  v-model="formData.brand_name"
                  type="text"
                  required
                  placeholder="e.g., Advil"
                  class="form-input"
                />
                <span class="helper-text">The commercial brand name</span>
              </div>
              
              <div class="form-group">
                <label for="reference_price">Reference Price (USD)</label>
                <input
                  id="reference_price"
                  v-model="formData.reference_price"
                  type="number"
                  step="0.01"
                  min="0"
                  placeholder="Optional reference price"
                  class="form-input"
                />
              </div>
            </div>
          </div>
        </div>
        
        <!-- Product Images Upload -->
        <div class="form-section">
          <label class="section-title">Product Images</label>
          <div 
            class="upload-zone"
            @click="triggerFileInput('images')"
            @dragover.prevent="handleDragOver"
            @drop.prevent="handleDrop($event, 'images')"
          >
            <input
              ref="imagesInput"
              type="file"
              accept="image/png,image/jpeg,image/jpg"
              multiple
              @change="handleFileSelect($event, 'images')"
              class="file-input"
            />
            <div class="upload-content">
              <svg width="48" height="48" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" class="upload-icon">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M17 8l-5-5-5 5M12 3v12" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
              <p class="upload-text">Click to upload product images</p>
              <p class="upload-hint">PNG, JPG up to 10MB</p>
            </div>
          </div>
          <div v-if="selectedImages.length > 0" class="file-list">
            <div v-for="(file, index) in selectedImages" :key="index" class="file-item">
              <span>{{ file.name }}</span>
              <button type="button" @click="removeFile('images', index)" class="remove-file-btn">×</button>
            </div>
          </div>
        </div>
        
        <!-- Compliance Documents Upload -->
        <div class="form-section">
          <label class="section-title">Compliance Documents</label>
          <div 
            class="upload-zone"
            @click="triggerFileInput('documents')"
            @dragover.prevent="handleDragOver"
            @drop.prevent="handleDrop($event, 'documents')"
          >
            <input
              ref="documentsInput"
              type="file"
              accept="application/pdf,.doc,.docx"
              multiple
              @change="handleFileSelect($event, 'documents')"
              class="file-input"
            />
            <div class="upload-content">
              <svg width="48" height="48" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" class="upload-icon">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M17 8l-5-5-5 5M12 3v12" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
              <p class="upload-text">Click to upload compliance documents</p>
              <p class="upload-hint">PDF, DOC up to 10MB</p>
            </div>
          </div>
          <div v-if="selectedDocuments.length > 0" class="file-list">
            <div v-for="(file, index) in selectedDocuments" :key="index" class="file-item">
              <span>{{ file.name }}</span>
              <button type="button" @click="removeFile('documents', index)" class="remove-file-btn">×</button>
            </div>
          </div>
        </div>
        
        <!-- Error Message -->
        <div v-if="error" class="error-message">
          <p v-if="typeof error === 'string'">{{ error }}</p>
          <ul v-else>
            <li v-for="(err, index) in error" :key="index">{{ err }}</li>
          </ul>
        </div>
        
        <!-- Action Buttons -->
        <div class="form-actions">
          <button type="submit" :disabled="loading" class="submit-btn">
            {{ loading ? 'Submitting...' : 'Submit for Approval' }}
          </button>
          <button type="button" @click="handleCancel" class="cancel-btn">Cancel</button>
        </div>
        
        <!-- Submission Note -->
        <p class="submission-note">
          Your product will be reviewed by our admin team before appearing in the marketplace.
        </p>
      </form>
    </div>
  </div>
</template>

<script>
import productsService from '../services/products'
import authService from '../services/auth'

export default {
  name: 'CreateProductView',
  data() {
    return {
      categories: [],
      formData: {
        generic_name: '',
        brand_name: '',
        category_id: '',
        reference_price: ''
      },
      selectedImages: [],
      selectedDocuments: [],
      error: null,
      loading: false
    }
  },
  mounted() {
    this.loadCategories()
    // Check if user is a seller
    if (!authService.isSeller()) {
      this.$emit('unauthorized')
    }
  },
  methods: {
    async loadCategories() {
      try {
        this.categories = await productsService.getCategories()
      } catch (error) {
        this.error = 'Failed to load categories. Please refresh the page.'
        console.error('Error loading categories:', error)
      }
    },
    triggerFileInput(type) {
      if (type === 'images') {
        this.$refs.imagesInput.click()
      } else {
        this.$refs.documentsInput.click()
      }
    },
    handleFileSelect(event, type) {
      const files = Array.from(event.target.files)
      this.validateAndAddFiles(files, type)
    },
    handleDragOver(event) {
      event.preventDefault()
      event.currentTarget.classList.add('drag-over')
    },
    handleDrop(event, type) {
      event.preventDefault()
      event.currentTarget.classList.remove('drag-over')
      const files = Array.from(event.dataTransfer.files)
      this.validateAndAddFiles(files, type)
    },
    validateAndAddFiles(files, type) {
      const maxSize = 10 * 1024 * 1024 // 10MB
      
      files.forEach(file => {
        // Check file size
        if (file.size > maxSize) {
          this.error = `${file.name} exceeds 10MB limit`
          return
        }
        
        // Validate file types
        if (type === 'images') {
          const validTypes = ['image/png', 'image/jpeg', 'image/jpg']
          if (!validTypes.includes(file.type)) {
            this.error = `${file.name} is not a valid image file (PNG, JPG only)`
            return
          }
          this.selectedImages.push(file)
        } else {
          const validTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document']
          const validExtensions = ['.pdf', '.doc', '.docx']
          const fileName = file.name.toLowerCase()
          const isValid = validTypes.includes(file.type) || validExtensions.some(ext => fileName.endsWith(ext))
          if (!isValid) {
            this.error = `${file.name} is not a valid document file (PDF, DOC only)`
            return
          }
          this.selectedDocuments.push(file)
        }
      })
      
      this.error = null
    },
    removeFile(type, index) {
      if (type === 'images') {
        this.selectedImages.splice(index, 1)
      } else {
        this.selectedDocuments.splice(index, 1)
      }
    },
    async handleSubmit() {
      this.error = null
      this.loading = true
      
      try {
        const productData = {
          ...this.formData,
          product_images: this.selectedImages,
          compliance_documents: this.selectedDocuments
        }
        
        const response = await productsService.createProduct(productData)
        this.$emit('product-created', response.product)
        alert(response.message || 'Product created successfully!')
        this.resetForm()
      } catch (error) {
        console.error('Create product error:', error)
        if (typeof error === 'string') {
          this.error = error
        } else if (Array.isArray(error)) {
          this.error = error.join(', ')
        } else if (error.response?.status === 404) {
          this.error = 'Server endpoint not found. Please ensure the Rails API server is running on port 3000 and restart it if needed.'
        } else {
          this.error = error.response?.data?.error || error.message || 'Failed to create product. Please try again.'
        }
      } finally {
        this.loading = false
      }
    },
    handleCancel() {
      this.$emit('cancel')
    },
    resetForm() {
      this.formData = {
        generic_name: '',
        brand_name: '',
        category_id: '',
        reference_price: ''
      }
      this.selectedImages = []
      this.selectedDocuments = []
      this.error = null
    }
  }
}
</script>

<style scoped>
.create-product-container {
  min-height: 100vh;
  background-color: #dbeafe;
  padding: 40px 20px;
  display: flex;
  justify-content: center;
  align-items: flex-start;
}

.form-wrapper {
  background: white;
  border-radius: 8px;
  padding: 40px;
  max-width: 900px;
  width: 100%;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

.form-title {
  font-size: 28px;
  font-weight: 700;
  color: #111827;
  margin-bottom: 32px;
}

.form-section {
  margin-bottom: 32px;
}

.section-title {
  font-size: 16px;
  font-weight: 600;
  color: #374151;
  margin-bottom: 16px;
  display: block;
}

.form-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 24px;
}

.form-column {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.required-label {
  font-size: 14px;
  font-weight: 500;
  color: #374151;
}

.required-label::after {
  content: '*';
  color: #dc2626;
  margin-left: 4px;
}

.form-input {
  padding: 10px 12px;
  border: 1px solid #d1d5db;
  border-radius: 6px;
  font-size: 14px;
  transition: border-color 0.2s;
}

.form-input:focus {
  outline: none;
  border-color: #1d4ed8;
}

.helper-text {
  font-size: 12px;
  color: #6b7280;
}

.upload-zone {
  border: 2px dashed #d1d5db;
  border-radius: 8px;
  padding: 48px 24px;
  text-align: center;
  cursor: pointer;
  transition: border-color 0.2s, background-color 0.2s;
}

.upload-zone:hover {
  border-color: #1d4ed8;
  background-color: #f9fafb;
}

.upload-zone.drag-over {
  border-color: #1d4ed8;
  background-color: #eff6ff;
}

.file-input {
  display: none;
}

.upload-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
}

.upload-icon {
  color: #9ca3af;
}

.upload-text {
  font-size: 14px;
  font-weight: 500;
  color: #374151;
  margin: 0;
}

.upload-hint {
  font-size: 12px;
  color: #6b7280;
  margin: 0;
}

.file-list {
  margin-top: 16px;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.file-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 8px 12px;
  background-color: #f9fafb;
  border-radius: 4px;
  font-size: 14px;
  color: #374151;
}

.remove-file-btn {
  background: none;
  border: none;
  color: #dc2626;
  font-size: 20px;
  cursor: pointer;
  padding: 0 8px;
  line-height: 1;
}

.remove-file-btn:hover {
  color: #991b1b;
}

.error-message {
  background-color: #fee;
  color: #dc2626;
  padding: 12px 16px;
  border-radius: 6px;
  margin-bottom: 24px;
  font-size: 14px;
}

.error-message ul {
  margin: 0;
  padding-left: 20px;
}

.form-actions {
  display: flex;
  gap: 16px;
  margin-bottom: 16px;
}

.submit-btn {
  flex: 1;
  background-color: #1d4ed8;
  color: white;
  border: none;
  padding: 12px 24px;
  border-radius: 6px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: background-color 0.2s;
}

.submit-btn:hover:not(:disabled) {
  background-color: #2563eb;
}

.submit-btn:disabled {
  background-color: #9ca3af;
  cursor: not-allowed;
}

.cancel-btn {
  flex: 1;
  background-color: white;
  color: #374151;
  border: 1px solid #d1d5db;
  padding: 12px 24px;
  border-radius: 6px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: background-color 0.2s;
}

.cancel-btn:hover {
  background-color: #f9fafb;
}

.submission-note {
  font-size: 14px;
  color: #6b7280;
  text-align: center;
  margin: 0;
}

/* Responsive Design */
@media (max-width: 768px) {
  .form-wrapper {
    padding: 24px;
  }
  
  .form-row {
    grid-template-columns: 1fr;
    gap: 20px;
  }
  
  .form-actions {
    flex-direction: column;
  }
}
</style>
