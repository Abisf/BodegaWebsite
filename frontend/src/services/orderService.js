// =============================================================================
// 🔧 BROOKLYN BODEGA ORDERING SERVICE
// =============================================================================
// This service layer abstracts all ordering logic and API calls.
// Easy to swap out for real integrations - just update the endpoints below.
// =============================================================================

const API_BASE_URL = process.env.REACT_APP_BACKEND_URL + '/api'

// =============================================================================
// 📡 API ENDPOINTS - TODO: Replace with real integration endpoints
// =============================================================================
const ENDPOINTS = {
  // TODO: Replace with Stripe integration
  // CREATE_ORDER: '/checkout/sessions'
  // TODO: Replace with Square integration  
  // CREATE_ORDER: '/square/orders'
  // TODO: Replace with Toast POS integration
  // CREATE_ORDER: '/toast/orders'
  CREATE_ORDER: '/orders',

  // TODO: Replace with Stripe payment processing
  // PROCESS_PAYMENT: '/payments/intents'
  // TODO: Replace with Square payment processing
  // PROCESS_PAYMENT: '/payments'
  // TODO: Replace with Toast payment processing
  // PROCESS_PAYMENT: '/toast/payments'
  PROCESS_PAYMENT: '/payments/process',

  // TODO: Replace with real webhook endpoint
  CONFIRM_ORDER: '/orders/confirm',
  
  // TODO: Replace with real order tracking
  GET_ORDER_STATUS: '/orders',
}

// =============================================================================
// 🔐 AUTHENTICATION - TODO: Replace with real API keys
// =============================================================================
const getAuthHeaders = () => {
  return {
    'Content-Type': 'application/json',
    // TODO: Replace with Stripe publishable key
    // 'Authorization': `Bearer ${process.env.REACT_APP_STRIPE_PUBLISHABLE_KEY}`,
    // TODO: Replace with Square application ID
    // 'Square-Application-Id': process.env.REACT_APP_SQUARE_APP_ID,
    // TODO: Replace with Toast API key
    // 'X-API-Key': process.env.REACT_APP_TOAST_API_KEY,
    'X-Dummy-Auth': 'dummy-api-key' // TODO: Remove this line for production
  }
}

// =============================================================================
// 💳 PAYMENT PROCESSING - TODO: Replace with real payment integration
// =============================================================================
export const processPayment = async (orderData, paymentDetails) => {
  try {
    // TODO: Replace with Stripe integration
    // const stripe = await loadStripe(process.env.REACT_APP_STRIPE_PUBLISHABLE_KEY)
    // const session = await fetch('/api/checkout/sessions', {
    //   method: 'POST',
    //   headers: getAuthHeaders(),
    //   body: JSON.stringify({
    //     line_items: orderData.items.map(item => ({
    //       price_data: {
    //         currency: 'usd',
    //         product_data: { name: item.name },
    //         unit_amount: Math.round(item.price * 100)
    //       },
    //       quantity: item.quantity
    //     })),
    //     customer_email: orderData.customer.email,
    //     success_url: window.location.origin + '/order-success',
    //     cancel_url: window.location.origin + '/cart'
    //   })
    // })
    // return stripe.redirectToCheckout({ sessionId: session.id })

    // TODO: Replace with Square integration
    // const payments = Square.payments(process.env.REACT_APP_SQUARE_APP_ID)
    // const card = await payments.card()
    // const tokenResult = await card.tokenize()
    // const response = await fetch('/api/square/payments', {
    //   method: 'POST',
    //   headers: getAuthHeaders(),
    //   body: JSON.stringify({
    //     source_id: tokenResult.token,
    //     amount_money: {
    //       amount: Math.round(orderData.total * 100),
    //       currency: 'USD'
    //     },
    //     idempotency_key: uuidv4()
    //   })
    // })

    // TODO: Replace with Toast integration
    // const response = await fetch('/api/toast/orders', {
    //   method: 'POST', 
    //   headers: getAuthHeaders(),
    //   body: JSON.stringify({
    //     restaurantGuid: process.env.REACT_APP_TOAST_RESTAURANT_ID,
    //     selections: orderData.items.map(item => ({
    //       guid: item.toast_guid,
    //       quantity: item.quantity
    //     })),
    //     customer: {
    //       firstName: orderData.customer.name.split(' ')[0],
    //       lastName: orderData.customer.name.split(' ')[1] || '',
    //       email: orderData.customer.email,
    //       phone: orderData.customer.phone
    //     }
    //   })
    // })

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
        // TODO: Add real payment data when integrating:
        // stripe_token: paymentDetails.stripe_token,
        // square_nonce: paymentDetails.square_nonce,
        // toast_payment_id: paymentDetails.toast_payment_id,
      })
    })

    if (!response.ok) {
      throw new Error('Payment processing failed')
    }

    const result = await response.json()
    
    // TODO: Return real payment result format
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
// 📦 ORDER MANAGEMENT - TODO: Replace with real POS integration
// =============================================================================
export const createOrder = async (cartItems, customerInfo, orderType = 'delivery') => {
  try {
    // TODO: Format order data for real POS system
    const orderData = {
      items: cartItems.map(item => ({
        // TODO: Map to real POS item format when integrating:
        // toast_guid: item.toast_guid,        // Toast menu item GUID
        // square_item_id: item.square_id,     // Square catalog item ID
        // stripe_price_id: item.stripe_id,    // Stripe price ID
        id: item.id,
        name: item.name,
        price: parseFloat(item.price),
        quantity: item.quantity,
        total: parseFloat(item.price) * item.quantity
      })),
      customer: {
        // TODO: Map to real POS customer format when integrating
        name: customerInfo.name,
        phone: customerInfo.phone,
        email: customerInfo.email,
        address: customerInfo.address || null
      },
      order_type: orderType, // delivery, pickup, dine_in
      subtotal: cartItems.reduce((sum, item) => sum + (parseFloat(item.price) * item.quantity), 0),
      tax: 0, // TODO: Calculate real tax based on location
      total: cartItems.reduce((sum, item) => sum + (parseFloat(item.price) * item.quantity), 0),
      timestamp: new Date().toISOString(),
      // TODO: Add real POS required fields when integrating:
      // location_id: process.env.REACT_APP_LOCATION_ID,
      // restaurant_id: process.env.REACT_APP_RESTAURANT_ID,
      // toast_restaurant_guid: process.env.REACT_APP_TOAST_RESTAURANT_GUID,
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
// 📧 ORDER CONFIRMATION - TODO: Replace with real webhook handling
// =============================================================================
export const confirmOrder = async (orderId, paymentId) => {
  try {
    // TODO: Real webhook handling when integrating:
    // This will be triggered by Stripe webhooks, Toast notifications, etc.
    // Verify webhook signatures for security
    
    const response = await fetch(`${API_BASE_URL}${ENDPOINTS.CONFIRM_ORDER}`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify({
        order_id: orderId,
        payment_id: paymentId,
        status: 'confirmed',
        // TODO: Add real confirmation data when integrating:
        // webhook_signature: req.headers['stripe-signature'],
        // toast_webhook_token: req.headers['toast-webhook-token'],
        // square_webhook_signature: req.headers['square-signature'],
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
// 📊 ORDER TRACKING - TODO: Replace with real-time status updates
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
// 🔧 UTILITY FUNCTIONS
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

// TODO: Add real POS integration utilities when implementing:
// export const syncWithStripe = async (orderData) => { ... }
// export const syncWithSquare = async (orderData) => { ... }  
// export const syncWithToast = async (orderData) => { ... }
// export const updateInventory = async (items) => { ... }
// export const sendToKitchen = async (orderId) => { ... }
// export const notifyDelivery = async (orderData) => { ... }