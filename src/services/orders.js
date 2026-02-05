import api from './api'

class OrdersService {
  async createOrder(orderData) {
    try {
      const response = await api.post('/api/orders', {
        order_items: orderData.items.map(item => ({
          product_id: item.product_id,
          quantity: item.quantity
        })),
        whatsapp_number: orderData.whatsapp_number,
        delivery_address: orderData.delivery_address,
        notes: orderData.notes
      })
      
      return response.data
    } catch (error) {
      throw error.response?.data?.error || error.response?.data?.errors || error.message || 'Failed to create order'
    }
  }
  
  async getMyOrders() {
    try {
      const response = await api.get('/api/orders')
      return response.data.orders
    } catch (error) {
      throw error.response?.data?.error || error.message || 'Failed to fetch orders'
    }
  }
  
  async getOrder(orderId) {
    try {
      const response = await api.get(`/api/orders/${orderId}`)
      return response.data.order
    } catch (error) {
      throw error.response?.data?.error || error.message || 'Failed to fetch order'
    }
  }

  async getSellerOrders(status = 'all') {
    try {
      const response = await api.get('/api/orders/seller_orders', {
        params: { status }
      })
      return response.data.orders
    } catch (error) {
      throw error.response?.data?.error || error.message || 'Failed to fetch seller orders'
    }
  }

  async sellerConfirmOrder(orderId) {
    try {
      const response = await api.post(`/api/orders/${orderId}/seller_confirm`)
      return response.data
    } catch (error) {
      throw error.response?.data?.error || error.message || 'Failed to confirm order'
    }
  }

  async sellerMarkDelivered(orderId) {
    try {
      const response = await api.post(`/api/orders/${orderId}/seller_mark_delivered`)
      return response.data
    } catch (error) {
      throw error.response?.data?.error || error.message || 'Failed to mark order as delivered'
    }
  }

  async downloadInvoice(orderId) {
    try {
      const response = await api.get(`/api/orders/${orderId}/invoice`, {
        responseType: 'blob'
      })
      return response.data
    } catch (error) {
      throw error.response?.data?.error || error.message || 'Failed to download invoice'
    }
  }
}

export default new OrdersService()
