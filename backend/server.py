from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Optional
import uvicorn
import time
import random
import string

app = FastAPI()

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# =============================================================================
# 🔧 DUMMY API MODELS - READY FOR REAL INTEGRATION
# =============================================================================
# These models will be replaced with real POS/payment system models

class OrderItem(BaseModel):
    id: str
    name: str
    price: float
    quantity: int
    total: float

class Customer(BaseModel):
    name: str
    email: str
    phone: str
    address: Optional[str] = None

class OrderData(BaseModel):
    items: List[OrderItem]
    customer: Customer
    order_type: str  # delivery, pickup, dine_in
    subtotal: float
    tax: float
    total: float
    timestamp: str

class PaymentData(BaseModel):
    order: dict  # Changed from OrderData to dict to handle any structure
    payment: dict

class OrderConfirmation(BaseModel):
    order_id: str
    payment_id: str
    status: str

# =============================================================================
# 📊 DUMMY DATABASE - REPLACE WITH REAL DATABASE
# =============================================================================
# In production, replace with MongoDB, PostgreSQL, etc.
orders_db = {}
payments_db = {}

def generate_order_id():
    """Generate a unique order ID"""
    return f"BBG{int(time.time())}{random.choice(string.ascii_uppercase)}{random.randint(10, 99)}"

def generate_payment_id():
    """Generate a dummy payment ID"""
    return f"pay_{int(time.time())}_{random.randint(1000, 9999)}"

# =============================================================================
# 🏠 BASIC HEALTH CHECK
# =============================================================================
@app.get("/")
def read_root():
    return {"message": "Brooklyn Bodega API - Ready for orders!"}

@app.get("/api/")
def api_health():
    return {"message": "Brooklyn Bodega API - Ready for orders!"}

# =============================================================================
# 📦 ORDER MANAGEMENT ENDPOINTS
# =============================================================================

@app.post("/api/orders")
def create_order(order_data: OrderData):
    """
    🔄 DUMMY ORDER CREATION - REPLACE WITH REAL POS INTEGRATION
    
    Real integrations:
    - Toast: POST /orders with location_id, restaurant_id
    - Square: POST /orders with location_id, fulfillment details
    - Custom: Save to your database and trigger kitchen system
    """
    try:
        # Generate order ID
        order_id = generate_order_id()
        
        # 🔄 DUMMY ORDER PROCESSING
        # In production, this would:
        # 1. Validate items against menu/inventory
        # 2. Calculate real tax based on location
        # 3. Send to kitchen display system
        # 4. Update inventory
        # 5. Send confirmation to customer
        
        # Simulate processing time
        time.sleep(0.5)
        
        # Store order (replace with real database)
        orders_db[order_id] = {
            "id": order_id,
            "data": order_data.dict(),
            "status": "pending",
            "created_at": time.time(),
            "estimated_time": 25 if order_data.order_type == "delivery" else 15
        }
        
        print(f"📦 Created order {order_id}: {order_data.customer.name} - {order_data.order_type}")
        
        return {
            "success": True,
            "order_id": order_id,
            "status": "pending",
            "estimated_time": orders_db[order_id]["estimated_time"],
            "message": "Order created successfully"
        }
        
    except Exception as e:
        print(f"❌ Order creation failed: {e}")
        raise HTTPException(status_code=500, detail=f"Order creation failed: {str(e)}")

@app.post("/api/payments/process")
def process_payment(payment_data: PaymentData):
    """
    🔄 DUMMY PAYMENT PROCESSING - REPLACE WITH REAL PAYMENT INTEGRATION
    
    Real integrations:
    FOR STRIPE:
    - Create payment intent with stripe.PaymentIntent.create()
    - Handle webhook for payment confirmation
    
    FOR SQUARE:
    - Use Square Payments API with card nonce
    - Process payment with CreatePayment endpoint
    
    FOR TOAST:
    - Use Toast payment processing with order ID
    - Handle Toast webhook notifications
    """
    try:
        # Get order from request data
        order_data = payment_data.order
        
        # Generate payment ID
        payment_id = generate_payment_id()
        
        # 🔄 DUMMY PAYMENT VALIDATION
        # In production, this would:
        # 1. Validate payment method (Stripe token, Square nonce, etc.)
        # 2. Process payment with real payment processor
        # 3. Handle payment failures and retries
        # 4. Store payment record
        # 5. Send receipt to customer
        
        # Simulate payment processing
        time.sleep(1.0)
        
        # Simulate occasional payment failures (5% failure rate)
        if random.random() < 0.05:
            raise HTTPException(status_code=400, detail="Payment declined")
        
        # Store payment record
        payments_db[payment_id] = {
            "id": payment_id,
            "order_total": order_data.get('total', 0),
            "customer": order_data.get('customer', {}),
            "status": "completed",
            "processed_at": time.time(),
            "method": payment_data.payment.get("method", "card")
        }
        
        print(f"💳 Processed payment {payment_id}: ${order_data.get('total', 0)}")
        
        return {
            "success": True,
            "payment_id": payment_id,
            "order_id": f"order_{int(time.time())}",  # Would be real order ID
            "amount": order_data.total,
            "status": "completed",
            "message": "Payment processed successfully"
        }
        
    except HTTPException:
        raise
    except Exception as e:
        print(f"❌ Payment processing failed: {e}")
        raise HTTPException(status_code=500, detail=f"Payment processing failed: {str(e)}")

@app.post("/api/orders/confirm")
def confirm_order(confirmation: OrderConfirmation):
    """
    🔄 DUMMY ORDER CONFIRMATION - REPLACE WITH REAL WEBHOOK HANDLING
    
    Real integrations:
    - Handle Stripe webhooks for payment confirmation
    - Process Toast order status updates
    - Send confirmation emails/SMS
    - Update kitchen display system
    """
    try:
        order_id = confirmation.order_id
        payment_id = confirmation.payment_id
        
        # 🔄 DUMMY CONFIRMATION PROCESSING
        # In production, this would:
        # 1. Verify webhook signature
        # 2. Update order status in database
        # 3. Send confirmation email/SMS
        # 4. Notify kitchen staff
        # 5. Start preparation timer
        # 6. Send order to delivery system if applicable
        
        # Update order status
        if order_id.replace("order_", "") in [o["id"] for o in orders_db.values()]:
            # Find and update order
            for oid, order in orders_db.items():
                if order["id"] == order_id:
                    order["status"] = "confirmed"
                    order["payment_id"] = payment_id
                    order["confirmed_at"] = time.time()
                    break
        
        print(f"✅ Confirmed order {order_id} with payment {payment_id}")
        
        return {
            "success": True,
            "order_id": order_id,
            "payment_id": payment_id,
            "status": "confirmed",
            "message": "Order confirmed successfully"
        }
        
    except Exception as e:
        print(f"❌ Order confirmation failed: {e}")
        raise HTTPException(status_code=500, detail=f"Order confirmation failed: {str(e)}")

@app.get("/api/orders/{order_id}")
def get_order_status(order_id: str):
    """
    🔄 DUMMY ORDER STATUS - REPLACE WITH REAL ORDER TRACKING
    
    Real integrations:
    - Query POS system for real order status
    - Integrate with delivery tracking
    - Provide real-time updates
    """
    try:
        # Find order in dummy database
        for oid, order in orders_db.items():
            if order["id"] == order_id:
                return {
                    "success": True,
                    "order": order,
                    "status": order["status"],
                    "estimated_time": order["estimated_time"]
                }
        
        raise HTTPException(status_code=404, detail="Order not found")
        
    except HTTPException:
        raise
    except Exception as e:
        print(f"❌ Order status lookup failed: {e}")
        raise HTTPException(status_code=500, detail=f"Order lookup failed: {str(e)}")

# =============================================================================
# 🔧 ADMIN/TESTING ENDPOINTS - REMOVE IN PRODUCTION
# =============================================================================

@app.get("/api/admin/orders")
def list_all_orders():
    """Admin endpoint to view all orders - REMOVE IN PRODUCTION"""
    return {
        "orders": list(orders_db.values()),
        "total_orders": len(orders_db)
    }

@app.get("/api/admin/payments")
def list_all_payments():
    """Admin endpoint to view all payments - REMOVE IN PRODUCTION"""
    return {
        "payments": list(payments_db.values()),
        "total_payments": len(payments_db)
    }

@app.delete("/api/admin/reset")
def reset_dummy_data():
    """Reset all dummy data - REMOVE IN PRODUCTION"""
    global orders_db, payments_db
    orders_db = {}
    payments_db = {}
    return {"message": "All dummy data reset"}

# =============================================================================
# 🚀 SERVER STARTUP
# =============================================================================

if __name__ == "__main__":
    print("🏪 Starting Brooklyn Bodega API Server...")
    print("🔄 Running in DUMMY MODE - Ready for real integrations!")
    uvicorn.run(app, host="0.0.0.0", port=8000)