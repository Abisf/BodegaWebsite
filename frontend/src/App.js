import React, { Suspense, useState, useRef } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { OrbitControls, Text, Box, Sphere, Cylinder } from '@react-three/drei'
import { motion, AnimatePresence } from 'framer-motion'
import { CartProvider, useCart } from './contexts/CartContext'
import Cart from './components/Cart'
import Checkout from './components/Checkout'
import TestCheckout from './TestCheckout'
import { formatPrice } from './services/orderService'
import './App.css'

// 3D Food Models
const SandwichModel = ({ position, rotation, scale = [1, 1, 1] }) => {
  const meshRef = useRef()
  
  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.y += 0.005
    }
  })

  return (
    <group position={position} rotation={rotation} scale={scale} ref={meshRef}>
      {/* Bottom bread */}
      <Cylinder args={[1.2, 1.2, 0.3]} position={[0, -0.5, 0]}>
        <meshStandardMaterial color="#DEB887" />
      </Cylinder>
      {/* Lettuce */}
      <Cylinder args={[1.1, 1.1, 0.1]} position={[0, -0.2, 0]}>
        <meshStandardMaterial color="#90EE90" />
      </Cylinder>
      {/* Meat */}
      <Cylinder args={[1.0, 1.0, 0.2]} position={[0, 0, 0]}>
        <meshStandardMaterial color="#8B4513" />
      </Cylinder>
      {/* Cheese */}
      <Cylinder args={[1.1, 1.1, 0.1]} position={[0, 0.2, 0]}>
        <meshStandardMaterial color="#FFD700" />
      </Cylinder>
      {/* Top bread */}
      <Cylinder args={[1.2, 1.2, 0.3]} position={[0, 0.5, 0]}>
        <meshStandardMaterial color="#DEB887" />
      </Cylinder>
    </group>
  )
}

const WingsModel = ({ position, rotation, scale = [1, 1, 1] }) => {
  const meshRef = useRef()
  
  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.y += 0.008
    }
  })

  return (
    <group position={position} rotation={rotation} scale={scale} ref={meshRef}>
      {/* Wing pieces */}
      <Sphere args={[0.4]} position={[-0.5, 0.2, 0]}>
        <meshStandardMaterial color="#CD853F" />
      </Sphere>
      <Box args={[0.6, 0.3, 0.2]} position={[-0.5, 0, 0]}>
        <meshStandardMaterial color="#D2691E" />
      </Box>
      <Sphere args={[0.4]} position={[0.5, 0.2, 0]}>
        <meshStandardMaterial color="#CD853F" />
      </Sphere>
      <Box args={[0.6, 0.3, 0.2]} position={[0.5, 0, 0]}>
        <meshStandardMaterial color="#D2691E" />
      </Box>
      {/* Sauce */}
      <Sphere args={[0.1]} position={[0, -0.2, 0]}>
        <meshStandardMaterial color="#FF4500" />
      </Sphere>
    </group>
  )
}

const PlatterModel = ({ position, rotation, scale = [1, 1, 1] }) => {
  const meshRef = useRef()
  
  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.y += 0.003
    }
  })

  return (
    <group position={position} rotation={rotation} scale={scale} ref={meshRef}>
      {/* Plate */}
      <Cylinder args={[1.5, 1.5, 0.1]} position={[0, -0.5, 0]}>
        <meshStandardMaterial color="#FFFFFF" />
      </Cylinder>
      {/* Rice */}
      <Cylinder args={[1.2, 1.2, 0.2]} position={[0, -0.3, 0]}>
        <meshStandardMaterial color="#F5F5DC" />
      </Cylinder>
      {/* Meat */}
      <Box args={[0.8, 0.3, 0.6]} position={[-0.3, -0.1, 0]}>
        <meshStandardMaterial color="#8B4513" />
      </Box>
      {/* Vegetables */}
      <Sphere args={[0.3]} position={[0.4, -0.1, 0.3]}>
        <meshStandardMaterial color="#FF6347" />
      </Sphere>
      <Sphere args={[0.3]} position={[0.4, -0.1, -0.3]}>
        <meshStandardMaterial color="#90EE90" />
      </Sphere>
    </group>
  )
}

// Menu Component with Add to Cart
const MenuItem = ({ item, ModelComponent, modelProps }) => {
  const [isHovered, setIsHovered] = useState(false)
  const { addToCart } = useCart()

  const handleAddToCart = () => {
    addToCart(item)
    // Add visual feedback
    setIsHovered(false)
  }

  return (
    <motion.div 
      className="menu-item"
      whileHover={{ scale: 1.05 }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
    >
      <div className="menu-3d-container">
        <Canvas>
          <ambientLight intensity={0.5} />
          <pointLight position={[10, 10, 10]} />
          <pointLight position={[-10, -10, -10]} color="#ff0040" intensity={0.3} />
          <ModelComponent 
            {...modelProps}
            scale={isHovered ? [1.2, 1.2, 1.2] : [1, 1, 1]}
          />
          <OrbitControls enableZoom={false} enablePan={false} />
        </Canvas>
      </div>
      <div className="menu-content">
        <h3 className="menu-title">{item.name}</h3>
        <p className="menu-description">{item.description}</p>
        <div className="menu-footer">
          <span className="menu-price">{formatPrice(item.price)}</span>
          <motion.button
            className="add-to-cart-btn"
            onClick={handleAddToCart}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            Add to Cart
          </motion.button>
        </div>
      </div>
    </motion.div>
  )
}

// Cart Button Component
const CartButton = ({ onClick }) => {
  const { getCartItemCount } = useCart()
  const itemCount = getCartItemCount()

  return (
    <motion.button
      className="cart-button"
      onClick={onClick}
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.9 }}
    >
      🛒
      {itemCount > 0 && (
        <span className="cart-badge">{itemCount}</span>
      )}
    </motion.button>
  )
}

// Success notification component
const OrderSuccess = ({ order, onClose }) => {
  return (
    <motion.div
      className="order-success-notification"
      initial={{ opacity: 0, y: -100 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -100 }}
    >
      <div className="success-content">
        <span className="success-icon">🎉</span>
        <div>
          <h4>Order Confirmed!</h4>
          <p>Order #{order.orderId} • {formatPrice(order.total)}</p>
        </div>
        <button onClick={onClose}>×</button>
      </div>
    </motion.div>
  )
}

// Main App Content Component
function AppContent() {
  const [currentSection, setCurrentSection] = useState('home')
  const [isCartOpen, setIsCartOpen] = useState(false)
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false)
  const [orderSuccess, setOrderSuccess] = useState(null)

  const menuItems = [
    {
      id: 'bec',
      name: "Bacon Egg & Cheese",
      description: "Classic NYC bodega sandwich with crispy bacon, fluffy eggs, and melted cheese",
      price: 6.50,
      ModelComponent: SandwichModel,
      modelProps: { position: [0, 0, 0], rotation: [0, 0, 0] }
    },
    {
      id: 'chopped-cheese',
      name: "Chopped Cheese",
      description: "Legendary NYC chopped cheese with ground beef, onions, peppers, and cheese",
      price: 8.00,
      ModelComponent: SandwichModel,
      modelProps: { position: [0, 0, 0], rotation: [0, 0, 0] }
    },
    {
      id: 'wings',
      name: "Buffalo Wings",
      description: "Crispy wings tossed in our signature buffalo sauce",
      price: 12.99,
      ModelComponent: WingsModel,
      modelProps: { position: [0, 0, 0], rotation: [0, 0, 0] }
    },
    {
      id: 'halal-platter',
      name: "Halal Platter",
      description: "Tender chicken or lamb over rice with white sauce and hot sauce",
      price: 10.99,
      ModelComponent: PlatterModel,
      modelProps: { position: [0, 0, 0], rotation: [0, 0, 0] }
    }
  ]

  const handleOrderSuccess = (order) => {
    setOrderSuccess(order)
    setIsCheckoutOpen(false)
    setTimeout(() => setOrderSuccess(null), 5000)
  }

  return (
    <div className="App">
      {/* Order Success Notification */}
      <AnimatePresence>
        {orderSuccess && (
          <OrderSuccess 
            order={orderSuccess} 
            onClose={() => setOrderSuccess(null)} 
          />
        )}
      </AnimatePresence>

      {/* Cart Button */}
      <CartButton onClick={() => setIsCartOpen(true)} />

      {/* Hero Section */}
      <section className="hero">
        <div className="hero-content">
          <motion.div 
            className="logo-container"
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
          >
            <div className="neon-logo">
              <div className="sandwich-icon">🥪</div>
              <h1 className="logo-text">
                <span className="brooklyn">BROOKLYN</span>
                <span className="bodega">BODEGA</span>
              </h1>
              <p className="tagline">DELI & GRILL</p>
            </div>
          </motion.div>
          
          <motion.p 
            className="hero-subtitle"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5, duration: 1 }}
          >
            Authentic Brooklyn flavors. Real bodega culture. Open late.
          </motion.p>
          
          <motion.button 
            className="cta-button"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1, duration: 0.8 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setCurrentSection('menu')}
          >
            ORDER NOW
          </motion.button>
        </div>
        
        {/* 3D Background Elements */}
        <div className="hero-3d">
          <Canvas>
            <ambientLight intensity={0.3} />
            <pointLight position={[10, 10, 10]} />
            <pointLight position={[-10, -10, -10]} color="#ff0040" intensity={0.2} />
            <SandwichModel position={[-3, 1, -2]} rotation={[0.2, 0.5, 0]} scale={[0.5, 0.5, 0.5]} />
            <WingsModel position={[3, -1, -2]} rotation={[-0.2, -0.5, 0]} scale={[0.4, 0.4, 0.4]} />
            <PlatterModel position={[0, -2, -3]} rotation={[0, 0, 0]} scale={[0.3, 0.3, 0.3]} />
          </Canvas>
        </div>
      </section>

      {/* Navigation */}
      <nav className="navbar">
        <button 
          className={currentSection === 'home' ? 'active' : ''}
          onClick={() => setCurrentSection('home')}
        >
          HOME
        </button>
        <button 
          className={currentSection === 'menu' ? 'active' : ''}
          onClick={() => setCurrentSection('menu')}
        >
          MENU
        </button>
        <button 
          className={currentSection === 'story' ? 'active' : ''}
          onClick={() => setCurrentSection('story')}
        >
          OUR STORY
        </button>
        <button 
          className={currentSection === 'location' ? 'active' : ''}
          onClick={() => setCurrentSection('location')}
        >
          LOCATION
        </button>
      </nav>

      {/* Menu Section */}
      <AnimatePresence>
        {currentSection === 'menu' && (
          <motion.section 
            className="menu-section"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -50 }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="section-title">Our Signature Items</h2>
            <div className="menu-grid">
              {menuItems.map((item, index) => (
                <MenuItem 
                  key={item.id} 
                  item={item}
                  ModelComponent={item.ModelComponent}
                  modelProps={item.modelProps}
                />
              ))}
            </div>
          </motion.section>
        )}

        {currentSection === 'story' && (
          <motion.section 
            className="story-section"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -50 }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="section-title">Our Brooklyn Story</h2>
            <div className="story-content">
              <div className="story-text">
                <h3>Family-Run Since Day One</h3>
                <p>
                  In the heart of Brooklyn, our bodega has been serving the community with 
                  authentic flavors and genuine hospitality. From the classic bacon egg & cheese 
                  that starts your morning right to the legendary chopped cheese that defines 
                  New York street food culture.
                </p>
                <p>
                  We're not just a deli – we're a cornerstone of the neighborhood. 
                  Open late, always fresh, and proud to be part of Brooklyn's rich culinary heritage.
                </p>
              </div>
              <div className="story-image">
                <img src="https://images.unsplash.com/photo-1614898983622-f20044c60b30" alt="Brooklyn Bodega" />
              </div>
            </div>
          </motion.section>
        )}

        {currentSection === 'location' && (
          <motion.section 
            className="location-section"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -50 }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="section-title">Find Us</h2>
            <div className="location-content">
              <div className="location-info">
                <h3>📍 Location</h3>
                <p>123 Brooklyn Avenue<br />Brooklyn, NY 11201</p>
                
                <h3>🕐 Hours</h3>
                <p>
                  Monday - Friday: 6:00 AM - 11:00 PM<br />
                  Saturday - Sunday: 7:00 AM - 12:00 AM
                </p>
                
                <h3>📞 Contact</h3>
                <p>(718) 555-DELI</p>
                
                <div className="delivery-info">
                  <h3>🚚 Delivery Available</h3>
                  <p>Order through our website or call us directly</p>
                </div>
              </div>
            </div>
          </motion.section>
        )}
      </AnimatePresence>

      {/* Cart Component */}
      <Cart 
        isOpen={isCartOpen} 
        onClose={() => setIsCartOpen(false)}
        onCheckout={() => {
          console.log("Checkout triggered from Cart component");
          setIsCartOpen(false);
          // Add a small delay before opening checkout
          setTimeout(() => {
            setIsCheckoutOpen(true);
            console.log("Checkout modal should be open now");
          }, 100);
        }}
      />

      {/* Checkout Component */}
      <Checkout 
        isOpen={isCheckoutOpen} 
        onClose={() => setIsCheckoutOpen(false)}
        onSuccess={handleOrderSuccess}
      />

      {/* Footer */}
      <footer className="footer">
        <div className="footer-content">
          <div className="footer-logo">
            <span className="brooklyn">BROOKLYN</span>
            <span className="bodega">BODEGA</span>
          </div>
          <p>&copy; 2025 Brooklyn Bodega Deli & Grill. Authentic Brooklyn Since Day One.</p>
        </div>
      </footer>
    </div>
  )
}

// Main App with Cart Provider
function App() {
  return (
    <CartProvider>
      <AppContent />
    </CartProvider>
  )
}

export default App