// =============================================================================
// 🔧 DUMMY API SERVICE - READY FOR REAL INTEGRATION
// =============================================================================
// This service layer abstracts all ordering logic and API calls.
// Easy to swap out for Stripe, Toast, Square, or any POS system later.
// Just update the endpoints and authentication below.
// =============================================================================

const API_BASE_URL = process.env.REACT_APP_BACKEND_URL + '/api'

// =============================================================================
// 📡 DUMMY API ENDPOINTS - REPLACE WITH REAL INTEGRATION
// =============================================================================
const ENDPOINTS = {
  // 🔄 REPLACE THESE WITH REAL API ENDPOINTS:
  CREATE_ORDER: '/orders',              // → Stripe: '/checkout/sessions' or Toast: '/orders'
  PROCESS_PAYMENT: '/payments/process', // → Stripe: '/payments/intents' or Square: '/payments'
  CONFIRM_ORDER: '/orders/confirm',     // → POS webhook endpoint
  GET_ORDER_STATUS: '/orders',          // → Real order tracking endpoint
}

// =============================================================================
// 🔐 DUMMY AUTHENTICATION - REPLACE WITH REAL API KEYS
// =============================================================================
const getAuthHeaders = () => {
  return {
    'Content-Type': 'application/json',
    // 🚨 REPLACE WITH REAL API AUTHENTICATION:
    // 'Authorization': `Bearer ${process.env.REACT_APP_STRIPE_PUBLISHABLE_KEY}`,
    // 'X-API-Key': process.env.REACT_APP_TOAST_API_KEY,
    // 'Square-Application-Id': process.env.REACT_APP_SQUARE_APP_ID,
    'X-Dummy-Auth': 'dummy-api-key' // 🔄 REMOVE THIS LINE FOR PRODUCTION
  }
}

// =============================================================================
// 💳 PAYMENT PROCESSING - MODULAR FOR EASY INTEGRATION SWAP
// =============================================================================
export const processPayment = async (orderData, paymentDetails) => {
  try {
    // 🔄 DUMMY PAYMENT PROCESSING - REPLACE WITH REAL INTEGRATION:
    // 
    // FOR STRIPE:
    // const stripe = await loadStripe(process.env.REACT_APP_STRIPE_PUBLISHABLE_KEY)
    // const session = await fetch('/api/checkout/sessions', { ... })
    // return stripe.redirectToCheckout({ sessionId: session.id })
    //
    // FOR SQUARE:
    // const payments = Square.payments(process.env.REACT_APP_SQUARE_APP_ID)
    // const card = await payments.card()
    // const result = await card.tokenize()
    //
    // FOR TOAST:
    // const response = await fetch('/api/toast/orders', { ... })

    console.log('🔄 DUMMY PAYMENT PROCESSING:', { orderData, paymentDetails })
    
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 2000))
    
    // Simulate payment processing
    const response = await fetch(`${API_BASE_URL}${ENDPOINTS.PROCESS_PAYMENT}`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify({
        order: orderData,
        payment: paymentDetails,
        // 🔄 ADD REAL PAYMENT DATA HERE:
        // stripe_token: paymentDetails.stripe_token,
        // square_nonce: paymentDetails.square_nonce,
        // toast_payment_id: paymentDetails.toast_payment_id,
      })
    })

    if (!response.ok) {
      throw new Error('Payment processing failed')
    }

    const result = await response.json()
    
    // 🔄 RETURN REAL PAYMENT RESULT:
    // return {
    //   success: result.success,
    //   payment_id: result.payment_intent_id, // Stripe
    //   transaction_id: result.transaction.id, // Square
    //   order_id: result.order_id // Toast
    // }
    
    return {
      success: true,
      payment_id: `dummy_payment_${Date.now()}`,
      order_id: result.order_id || `order_${Date.now()}`,
      message: '🎉 Payment processed successfully! (Dummy)'
    }

  } catch (error) {
    console.error('Payment processing error:', error)
    throw new Error(`Payment failed: ${error.message}`)
  }
}

// =============================================================================
// 📦 ORDER MANAGEMENT - READY FOR POS INTEGRATION
// =============================================================================
export const createOrder = async (cartItems, customerInfo, orderType = 'delivery') => {
  try {
    // 🔄 FORMAT ORDER DATA FOR REAL POS SYSTEM:
    const orderData = {
      items: cartItems.map(item => ({
        // 🔄 MAP TO REAL POS ITEM FORMAT:
        // sku: item.sku,           // Toast/Square item ID
        // menu_item_id: item.id,   // POS menu item ID  
        // modifiers: item.mods,    // POS modifiers
        id: item.id,
        name: item.name,
        price: parseFloat(item.price),
        quantity: item.quantity,
        total: parseFloat(item.price) * item.quantity
      })),
      customer: {
        // 🔄 MAP TO REAL POS CUSTOMER FORMAT:
        name: customerInfo.name,
        phone: customerInfo.phone,
        email: customerInfo.email,
        address: customerInfo.address || null
      },
      order_type: orderType, // delivery, pickup, dine_in
      subtotal: cartItems.reduce((sum, item) => sum + (parseFloat(item.price) * item.quantity), 0),
      tax: 0, // 🔄 CALCULATE REAL TAX
      total: cartItems.reduce((sum, item) => sum + (parseFloat(item.price) * item.quantity), 0),
      timestamp: new Date().toISOString(),
      // 🔄 ADD REAL POS REQUIRED FIELDS:
      // location_id: process.env.REACT_APP_LOCATION_ID,
      // restaurant_id: process.env.REACT_APP_RESTAURANT_ID,
    }

    console.log('🔄 CREATING ORDER:', orderData)

    const response = await fetch(`${API_BASE_URL}${ENDPOINTS.CREATE_ORDER}`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(orderData)
    })

    if (!response.ok) {
      throw new Error('Failed to create order')
    }

    const result = await response.json()
    return result

  } catch (error) {
    console.error('Order creation error:', error)
    throw new Error(`Order creation failed: ${error.message}`)
  }
}

// =============================================================================
// 📧 ORDER CONFIRMATION - WEBHOOK READY
// =============================================================================
export const confirmOrder = async (orderId, paymentId) => {
  try {
    // 🔄 REAL WEBHOOK HANDLING:
    // This will be triggered by Stripe webhooks, Toast notifications, etc.
    
    const response = await fetch(`${API_BASE_URL}${ENDPOINTS.CONFIRM_ORDER}`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify({
        order_id: orderId,
        payment_id: paymentId,
        status: 'confirmed',
        // 🔄 ADD REAL CONFIRMATION DATA:
        // webhook_signature: req.headers['stripe-signature'],
        // toast_webhook_token: req.headers['toast-webhook-token'],
      })
    })

    if (!response.ok) {
      throw new Error('Order confirmation failed')
    }

    return await response.json()

  } catch (error) {
    console.error('Order confirmation error:', error)
    throw error
  }
}

// =============================================================================
// 📊 ORDER TRACKING - REAL-TIME STATUS UPDATES
// =============================================================================
export const getOrderStatus = async (orderId) => {
  try {
    const response = await fetch(`${API_BASE_URL}${ENDPOINTS.GET_ORDER_STATUS}/${orderId}`, {
      headers: getAuthHeaders()
    })

    if (!response.ok) {
      throw new Error('Failed to get order status')
    }

    return await response.json()

  } catch (error) {
    console.error('Order status error:', error)
    throw error
  }
}

// =============================================================================
// 🔧 UTILITY FUNCTIONS - INTEGRATION HELPERS
// =============================================================================
export const formatPrice = (price) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD'
  }).format(price)
}

export const generateOrderId = () => {
  return `BBG${Date.now()}${Math.random().toString(36).substring(2, 5).toUpperCase()}`
}

// 🔄 ADD REAL POS INTEGRATION UTILITIES:
// export const syncWithPOS = async (orderData) => { ... }
// export const updateInventory = async (items) => { ... }
// export const sendToKitchen = async (orderId) => { ... }