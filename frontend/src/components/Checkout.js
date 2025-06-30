import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { useCart } from '../contexts/CartContext'
import { createOrder, processPayment, confirmOrder, formatPrice } from '../services/orderService'

const Checkout = ({ isOpen, onClose, onSuccess }) => {
  const { items, getCartTotal, clearCart, setCustomerInfo } = useCart()
  const [currentStep, setCurrentStep] = useState(1)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState(null)

  const [customerData, setCustomerData] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    orderType: 'delivery'
  })

  const [paymentData, setPaymentData] = useState({
    method: 'card',
    // 🔄 REAL PAYMENT FIELDS - REPLACE WITH ACTUAL FORM:
    // cardNumber: '',
    // expiryDate: '',
    // cvv: '',
    // billingAddress: '',
    // 
    // FOR STRIPE:
    // stripeToken: null,
    // 
    // FOR SQUARE:
    // squareNonce: null,
    dummyCard: '4242-4242-4242-4242' // 🔄 REMOVE FOR PRODUCTION
  })

  const handleCustomerSubmit = (e) => {
    e.preventDefault()
    if (!customerData.name || !customerData.email || !customerData.phone) {
      setError('Please fill in all required fields')
      return
    }
    setError(null)
    setCurrentStep(2)
  }

  const handlePaymentSubmit = async (e) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)

    try {
      // Step 1: Create order
      console.log('📦 Creating order...')
      const orderResult = await createOrder(items, customerData, customerData.orderType)
      
      // Step 2: Process payment
      console.log('💳 Processing payment...')
      const paymentResult = await processPayment(orderResult, paymentData)
      
      // Step 3: Confirm order
      console.log('✅ Confirming order...')
      await confirmOrder(paymentResult.order_id, paymentResult.payment_id)
      
      // Success!
      setCustomerInfo(customerData)
      clearCart()
      setCurrentStep(3)
      
      // Auto-close after success
      setTimeout(() => {
        onSuccess({
          orderId: paymentResult.order_id,
          paymentId: paymentResult.payment_id,
          total: getCartTotal()
        })
        onClose()
      }, 3000)

    } catch (err) {
      console.error('Checkout error:', err)
      setError(err.message)
    } finally {
      setIsLoading(false)
    }
  }

  if (!isOpen) return null

  return (
    <motion.div
      className="checkout-overlay"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <motion.div
        className="checkout-modal"
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.8, opacity: 0 }}
      >
        <div className="checkout-header">
          <h2>Checkout</h2>
          <button className="checkout-close" onClick={onClose}>✕</button>
        </div>

        <div className="checkout-progress">
          <div className={`progress-step ${currentStep >= 1 ? 'active' : ''}`}>
            <span>1</span> Customer Info
          </div>
          <div className={`progress-step ${currentStep >= 2 ? 'active' : ''}`}>
            <span>2</span> Payment
          </div>
          <div className={`progress-step ${currentStep >= 3 ? 'active' : ''}`}>
            <span>3</span> Confirmation
          </div>
        </div>

        <div className="checkout-content">
          {/* Step 1: Customer Information */}
          {currentStep === 1 && (
            <motion.form
              onSubmit={handleCustomerSubmit}
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
            >
              <h3>Customer Information</h3>
              
              <div className="form-group">
                <label>Order Type</label>
                <select
                  value={customerData.orderType}
                  onChange={(e) => setCustomerData({...customerData, orderType: e.target.value})}
                >
                  <option value="delivery">🚚 Delivery</option>
                  <option value="pickup">🏃 Pickup</option>
                </select>
              </div>

              <div className="form-group">
                <label>Full Name *</label>
                <input
                  type="text"
                  value={customerData.name}
                  onChange={(e) => setCustomerData({...customerData, name: e.target.value})}
                  required
                />
              </div>

              <div className="form-group">
                <label>Email *</label>
                <input
                  type="email"
                  value={customerData.email}
                  onChange={(e) => setCustomerData({...customerData, email: e.target.value})}
                  required
                />
              </div>

              <div className="form-group">
                <label>Phone *</label>
                <input
                  type="tel"
                  value={customerData.phone}
                  onChange={(e) => setCustomerData({...customerData, phone: e.target.value})}
                  required
                />
              </div>

              {customerData.orderType === 'delivery' && (
                <div className="form-group">
                  <label>Delivery Address *</label>
                  <textarea
                    value={customerData.address}
                    onChange={(e) => setCustomerData({...customerData, address: e.target.value})}
                    required={customerData.orderType === 'delivery'}
                    rows="3"
                  />
                </div>
              )}

              {error && <div className="error-message">{error}</div>}

              <button type="submit" className="continue-btn">
                Continue to Payment
              </button>
            </motion.form>
          )}

          {/* Step 2: Payment */}
          {currentStep === 2 && (
            <motion.form
              onSubmit={handlePaymentSubmit}
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
            >
              <h3>Payment Information</h3>
              
              <div className="order-summary">
                <h4>Order Summary</h4>
                {items.map((item) => (
                  <div key={item.id} className="summary-item">
                    <span>{item.name} × {item.quantity}</span>
                    <span>{formatPrice(item.price * item.quantity)}</span>
                  </div>
                ))}
                <div className="summary-total">
                  <strong>Total: {formatPrice(getCartTotal())}</strong>
                </div>
              </div>

              <div className="payment-methods">
                <h4>Payment Method</h4>
                
                {/* 🔄 DUMMY PAYMENT UI - REPLACE WITH REAL PAYMENT FORMS */}
                <div className="payment-dummy">
                  <div className="dummy-notice">
                    🔄 <strong>DUMMY PAYMENT SYSTEM</strong>
                    <p>This will be replaced with real payment processing (Stripe, Square, etc.)</p>
                  </div>
                  
                  <div className="form-group">
                    <label>Payment Method</label>
                    <select
                      value={paymentData.method}
                      onChange={(e) => setPaymentData({...paymentData, method: e.target.value})}
                    >
                      <option value="card">💳 Credit Card</option>
                      <option value="cash">💵 Cash (Pickup Only)</option>
                    </select>
                  </div>

                  {paymentData.method === 'card' && (
                    <div className="dummy-card-form">
                      <div className="form-group">
                        <label>Card Number (Dummy)</label>
                        <input
                          type="text"
                          value={paymentData.dummyCard}
                          onChange={(e) => setPaymentData({...paymentData, dummyCard: e.target.value})}
                          placeholder="4242-4242-4242-4242"
                        />
                      </div>
                      <div className="form-row">
                        <div className="form-group">
                          <label>Expiry (Dummy)</label>
                          <input type="text" placeholder="12/25" />
                        </div>
                        <div className="form-group">
                          <label>CVV (Dummy)</label>
                          <input type="text" placeholder="123" />
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* 🔄 REAL PAYMENT FORMS WILL GO HERE:
                
                FOR STRIPE:
                <div id="stripe-card-element">
                  <CardElement options={stripeOptions} />
                </div>
                
                FOR SQUARE:
                <div id="square-card-container">
                  <div id="card-number"></div>
                  <div id="card-exp-date"></div>
                  <div id="card-cvv"></div>
                </div>
                
                */}
              </div>

              {error && <div className="error-message">{error}</div>}

              <div className="checkout-actions">
                <button
                  type="button"
                  className="back-btn"
                  onClick={() => setCurrentStep(1)}
                >
                  Back
                </button>
                <button
                  type="submit"
                  className="pay-btn"
                  disabled={isLoading}
                >
                  {isLoading ? 'Processing...' : `Pay ${formatPrice(getCartTotal())}`}
                </button>
              </div>
            </motion.form>
          )}

          {/* Step 3: Confirmation */}
          {currentStep === 3 && (
            <motion.div
              className="confirmation-screen"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
            >
              <div className="success-icon">🎉</div>
              <h3>Order Confirmed!</h3>
              <p>Thank you for your order! We'll start preparing your food right away.</p>
              <div className="order-details">
                <p><strong>Order Type:</strong> {customerData.orderType}</p>
                <p><strong>Total:</strong> {formatPrice(getCartTotal())}</p>
                {customerData.orderType === 'delivery' && (
                  <p><strong>Delivery Time:</strong> 25-35 minutes</p>
                )}
                {customerData.orderType === 'pickup' && (
                  <p><strong>Pickup Time:</strong> 15-20 minutes</p>
                )}
              </div>
              <p className="confirmation-note">
                You'll receive a confirmation email and SMS with your order details.
              </p>
            </motion.div>
          )}
        </div>
      </motion.div>
    </motion.div>
  )
}

export default Checkout