import React, { Suspense, useState, useRef } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { OrbitControls, Text, Box, Sphere, Cylinder } from '@react-three/drei'
import { motion, AnimatePresence } from 'framer-motion'
import { CartProvider, useCart } from './contexts/CartContext'
import Cart from './components/Cart'
import Checkout from './components/Checkout'
import { formatPrice } from './services/orderService'
import { theme } from './theme'
import './App.css'

// =============================================================================
// 🍔 3D FOOD MODELS - ENHANCED FOR AUTHENTIC DELI EXPERIENCE
// =============================================================================

const SandwichModel = ({ position, rotation, scale = [1, 1, 1], isHovered = false }) => {
  const meshRef = useRef()
  
  useFrame((state) => {
    if (meshRef.current && isHovered) {
      // Only rotate on hover for authentic counter-sitting feel
      meshRef.current.rotation.y += 0.01
    }
  })

  return (
    <group position={position} rotation={rotation} scale={scale} ref={meshRef}>
      {/* Bottom bread - more realistic color */}
      <Cylinder args={[1.2, 1.2, 0.3]} position={[0, -0.5, 0]}>
        <meshStandardMaterial 
          color="#C8860D" 
          roughness={0.8} 
          metalness={0.1}
        />
      </Cylinder>
      {/* Lettuce */}
      <Cylinder args={[1.1, 1.1, 0.1]} position={[0, -0.2, 0]}>
        <meshStandardMaterial 
          color="#4A7C59" 
          roughness={0.9}
        />
      </Cylinder>
      {/* Meat */}
      <Cylinder args={[1.0, 1.0, 0.2]} position={[0, 0, 0]}>
        <meshStandardMaterial 
          color="#8B4513" 
          roughness={0.7}
        />
      </Cylinder>
      {/* Cheese */}
      <Cylinder args={[1.1, 1.1, 0.1]} position={[0, 0.2, 0]}>
        <meshStandardMaterial 
          color="#FFA500" 
          roughness={0.6}
        />
      </Cylinder>
      {/* Top bread */}
      <Cylinder args={[1.2, 1.2, 0.3]} position={[0, 0.5, 0]}>
        <meshStandardMaterial 
          color="#C8860D" 
          roughness={0.8} 
          metalness={0.1}
        />
      </Cylinder>
    </group>
  )
}

const WingsModel = ({ position, rotation, scale = [1, 1, 1], isHovered = false }) => {
  const meshRef = useRef()
  
  useFrame((state) => {
    if (meshRef.current && isHovered) {
      meshRef.current.rotation.y += 0.01
    }
  })

  return (
    <group position={position} rotation={rotation} scale={scale} ref={meshRef}>
      {/* Wing pieces - more realistic textures */}
      <Sphere args={[0.4]} position={[-0.5, 0.2, 0]}>
        <meshStandardMaterial 
          color="#B8860B" 
          roughness={0.8}
        />
      </Sphere>
      <Box args={[0.6, 0.3, 0.2]} position={[-0.5, 0, 0]}>
        <meshStandardMaterial 
          color="#CD853F" 
          roughness={0.7}
        />
      </Box>
      <Sphere args={[0.4]} position={[0.5, 0.2, 0]}>
        <meshStandardMaterial 
          color="#B8860B" 
          roughness={0.8}
        />
      </Sphere>
      <Box args={[0.6, 0.3, 0.2]} position={[0.5, 0, 0]}>
        <meshStandardMaterial 
          color="#CD853F" 
          roughness={0.7}
        />
      </Box>
      {/* Hot sauce */}
      <Sphere args={[0.1]} position={[0, -0.2, 0]}>
        <meshStandardMaterial 
          color="#FF4500" 
          emissive="#FF2D00" 
          emissiveIntensity={0.2}
        />
      </Sphere>
    </group>
  )
}

const PlatterModel = ({ position, rotation, scale = [1, 1, 1], isHovered = false }) => {
  const meshRef = useRef()
  
  useFrame((state) => {
    if (meshRef.current && isHovered) {
      meshRef.current.rotation.y += 0.008
    }
  })

  return (
    <group position={position} rotation={rotation} scale={scale} ref={meshRef}>
      {/* Plate */}
      <Cylinder args={[1.5, 1.5, 0.1]} position={[0, -0.5, 0]}>
        <meshStandardMaterial 
          color="#F5F5F5" 
          roughness={0.9}
        />
      </Cylinder>
      {/* Rice */}
      <Cylinder args={[1.2, 1.2, 0.2]} position={[0, -0.3, 0]}>
        <meshStandardMaterial 
          color="#F5F5DC" 
          roughness={0.9}
        />
      </Cylinder>
      {/* Meat */}
      <Box args={[0.8, 0.3, 0.6]} position={[-0.3, -0.1, 0]}>
        <meshStandardMaterial 
          color="#8B4513" 
          roughness={0.7}
        />
      </Box>
      {/* Vegetables */}
      <Sphere args={[0.3]} position={[0.4, -0.1, 0.3]}>
        <meshStandardMaterial 
          color="#FF6347" 
          roughness={0.8}
        />
      </Sphere>
      <Sphere args={[0.3]} position={[0.4, -0.1, -0.3]}>
        <meshStandardMaterial 
          color="#90EE90" 
          roughness={0.8}
        />
      </Sphere>
    </group>
  )
}

// =============================================================================
// 🎯 ENHANCED MENU ITEM COMPONENT
// =============================================================================

const MenuItem = ({ item, ModelComponent, modelProps }) => {
  const [isHovered, setIsHovered] = useState(false)
  const { addToCart } = useCart()

  const handleAddToCart = () => {
    addToCart(item)
  }

  return (
    <motion.div 
      className="menu-item"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -4 }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      transition={{ duration: 0.3 }}
    >
      <div className="menu-3d-container">
        <Canvas camera={{ position: [0, 0, 5] }}>
          <ambientLight intensity={0.6} />
          <directionalLight position={[5, 5, 5]} intensity={0.8} />
          <pointLight position={[-5, -5, -5]} color="#FF2D55" intensity={0.3} />
          <ModelComponent 
            {...modelProps}
            isHovered={isHovered}
            scale={isHovered ? [1.1, 1.1, 1.1] : [1, 1, 1]}
          />
          <OrbitControls 
            enableZoom={false} 
            enablePan={false}
            autoRotate={false}
            enableDamping={true}
            dampingFactor={0.05}
          />
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
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Add to Cart
          </motion.button>
        </div>
      </div>
    </motion.div>
  )
}

// =============================================================================
// 🛒 CART BUTTON COMPONENT
// =============================================================================

const CartButton = ({ onClick }) => {
  const { getCartItemCount } = useCart()
  const itemCount = getCartItemCount()

  return (
    <motion.button
      className="cart-button"
      onClick={onClick}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
    >
      <span className="cart-icon">🛒</span>
      {itemCount > 0 && (
        <motion.span 
          className="cart-badge"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          key={itemCount}
        >
          {itemCount}
        </motion.span>
      )}
    </motion.button>
  )
}

// =============================================================================
// 🎉 ORDER SUCCESS NOTIFICATION
// =============================================================================

const OrderSuccess = ({ order, onClose }) => {
  return (
    <motion.div
      className="order-success-notification"
      initial={{ opacity: 0, y: -100, scale: 0.8 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -100, scale: 0.8 }}
      transition={{ type: "spring", damping: 20, stiffness: 300 }}
    >
      <div className="success-content">
        <span className="success-icon">✅</span>
        <div className="success-text">
          <h4>Order Confirmed!</h4>
          <p>Order #{order.orderId} • {formatPrice(order.total)}</p>
        </div>
        <button className="success-close" onClick={onClose}>×</button>
      </div>
    </motion.div>
  )
}

// =============================================================================
// 🏠 PAGE COMPONENTS - CLEAN SEPARATION
// =============================================================================

const HomePage = () => (
  <motion.div
    className="page-container"
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    exit={{ opacity: 0 }}
    transition={{ duration: 0.3 }}
  >
    <section className="hero">
      <div className="hero-content">
        <motion.div 
          className="logo-container"
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <div className="bodega-logo">
            <span className="logo-icon">🥪</span>
            <h1 className="logo-text">
              <span className="brooklyn">BROOKLYN</span>
              <span className="bodega">BODEGA</span>
            </h1>
            <p className="tagline">Deli & Grill</p>
          </div>
        </motion.div>
        
        <motion.p 
          className="hero-subtitle"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6, duration: 0.8 }}
        >
          Authentic Brooklyn flavors since day one.<br />
          Real bodega culture. Open late.
        </motion.p>
        
        <motion.div
          className="hero-cta"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1, duration: 0.8 }}
        >
          <button className="cta-primary">
            Order Now
          </button>
          <button className="cta-secondary">
            View Menu
          </button>
        </motion.div>
      </div>
      
      {/* Parallax Background Elements */}
      <div className="hero-background">
        <div className="street-lights"></div>
        <div className="fridge-glow"></div>
      </div>
    </section>
  </motion.div>
)

const MenuPage = ({ menuItems }) => (
  <motion.div
    className="page-container"
    initial={{ opacity: 0, x: 20 }}
    animate={{ opacity: 1, x: 0 }}
    exit={{ opacity: 0, x: -20 }}
    transition={{ duration: 0.3 }}
  >
    <section className="menu-section">
      <div className="section-header">
        <h2 className="section-title">Our Signature Items</h2>
        <p className="section-subtitle">
          Handcrafted with authentic Brooklyn flavors
        </p>
      </div>
      
      <div className="menu-grid">
        {menuItems.map((item, index) => (
          <motion.div
            key={item.id}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <MenuItem 
              item={item}
              ModelComponent={item.ModelComponent}
              modelProps={item.modelProps}
            />
          </motion.div>
        ))}
      </div>
    </section>
  </motion.div>
)

const StoryPage = () => (
  <motion.div
    className="page-container"
    initial={{ opacity: 0, x: 20 }}
    animate={{ opacity: 1, x: 0 }}
    exit={{ opacity: 0, x: -20 }}
    transition={{ duration: 0.3 }}
  >
    <section className="story-section">
      <div className="section-header">
        <h2 className="section-title">Our Brooklyn Story</h2>
        <p className="section-subtitle">
          Three generations of authentic neighborhood flavor
        </p>
      </div>
      
      <div className="story-content">
        <div className="story-timeline">
          <div className="timeline-item">
            <div className="timeline-year">1987</div>
            <div className="timeline-content">
              <h3>The Beginning</h3>
              <p>
                Started as a small corner store serving the neighborhood with 
                fresh sandwiches and late-night essentials.
              </p>
            </div>
          </div>
          
          <div className="timeline-item">
            <div className="timeline-year">2003</div>
            <div className="timeline-content">
              <h3>The Expansion</h3>
              <p>
                Added our signature grill and became the go-to spot for 
                authentic chopped cheese and bacon egg & cheese.
              </p>
            </div>
          </div>
          
          <div className="timeline-item">
            <div className="timeline-year">2025</div>
            <div className="timeline-content">
              <h3>Today</h3>
              <p>
                Still family-run, still authentic, now serving Brooklyn 
                flavors with modern convenience.
              </p>
            </div>
          </div>
        </div>
        
        <div className="story-image">
          <img 
            src="https://images.unsplash.com/photo-1614898983622-f20044c60b30" 
            alt="Brooklyn Bodega Storefront" 
          />
        </div>
      </div>
    </section>
  </motion.div>
)

const LocationPage = () => (
  <motion.div
    className="page-container"
    initial={{ opacity: 0, x: 20 }}
    animate={{ opacity: 1, x: 0 }}
    exit={{ opacity: 0, x: -20 }}
    transition={{ duration: 0.3 }}
  >
    <section className="location-section">
      <div className="section-header">
        <h2 className="section-title">Find Us</h2>
        <p className="section-subtitle">
          Right in the heart of Brooklyn
        </p>
      </div>
      
      <div className="location-grid">
        <div className="location-info">
          <div className="info-block">
            <h3>📍 Address</h3>
            <p>123 Brooklyn Avenue<br />Brooklyn, NY 11201</p>
          </div>
          
          <div className="info-block">
            <h3>🕐 Hours</h3>
            <div className="hours-list">
              <div className="hours-item">
                <span>Mon - Fri</span>
                <span>6:00 AM - 11:00 PM</span>
              </div>
              <div className="hours-item">
                <span>Sat - Sun</span>
                <span>7:00 AM - 12:00 AM</span>
              </div>
            </div>
          </div>
          
          <div className="info-block">
            <h3>📞 Contact</h3>
            <p>(718) 555-DELI</p>
          </div>
          
          <div className="info-block delivery-info">
            <h3>🚚 Delivery</h3>
            <p>Free delivery on orders over $15<br />
               Usually 25-35 minutes</p>
          </div>
        </div>
      </div>
    </section>
  </motion.div>
)

// =============================================================================
// 🎯 MAIN APP COMPONENT - CLEAN ROUTING
// =============================================================================

function AppContent() {
  const [currentSection, setCurrentSection] = useState('home')
  const [isCartOpen, setIsCartOpen] = useState(false)
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false)
  const [orderSuccess, setOrderSuccess] = useState(null)

  const menuItems = [
    {
      id: 'bec',
      name: "Bacon Egg & Cheese",
      description: "Classic NYC bodega sandwich with crispy bacon, fluffy eggs, and melted cheese on a fresh roll",
      price: 6.50,
      ModelComponent: SandwichModel,
      modelProps: { position: [0, 0, 0], rotation: [0, 0, 0] }
    },
    {
      id: 'chopped-cheese',
      name: "Chopped Cheese",
      description: "Legendary NYC sandwich with seasoned ground beef, onions, peppers, and melted cheese",
      price: 8.00,
      ModelComponent: SandwichModel,
      modelProps: { position: [0, 0, 0], rotation: [0, 0, 0] }
    },
    {
      id: 'wings',
      name: "Buffalo Wings",
      description: "Crispy chicken wings tossed in our signature buffalo sauce with celery and blue cheese",
      price: 12.99,
      ModelComponent: WingsModel,
      modelProps: { position: [0, 0, 0], rotation: [0, 0, 0] }
    },
    {
      id: 'halal-platter',
      name: "Halal Platter",
      description: "Tender grilled chicken or lamb over seasoned rice with white sauce and hot sauce",
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

  // Handle navigation with proper cleanup
  const handleNavigation = (section) => {
    if (section === 'menu' && currentSection === 'home') {
      // Add slight delay when transitioning from home to allow cleanup
      setTimeout(() => setCurrentSection(section), 100)
    } else {
      setCurrentSection(section)
    }
  }

  return (
    <div className="app">
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

      {/* Navigation */}
      <nav className="navbar">
        <div className="nav-container">
          <button 
            className={`nav-item ${currentSection === 'home' ? 'active' : ''}`}
            onClick={() => handleNavigation('home')}
          >
            Home
          </button>
          <button 
            className={`nav-item ${currentSection === 'menu' ? 'active' : ''}`}
            onClick={() => handleNavigation('menu')}
          >
            Menu
          </button>
          <button 
            className={`nav-item ${currentSection === 'story' ? 'active' : ''}`}
            onClick={() => handleNavigation('story')}
          >
            Our Story
          </button>
          <button 
            className={`nav-item ${currentSection === 'location' ? 'active' : ''}`}
            onClick={() => handleNavigation('location')}
          >
            Location
          </button>
        </div>
      </nav>

      {/* Page Content - Strict Conditional Rendering */}
      <main className="main-content">
        <AnimatePresence mode="wait">
          {currentSection === 'home' && (
            <HomePage key="home" />
          )}
          {currentSection === 'menu' && (
            <MenuPage key="menu" menuItems={menuItems} />
          )}
          {currentSection === 'story' && (
            <StoryPage key="story" />
          )}
          {currentSection === 'location' && (
            <LocationPage key="location" />
          )}
        </AnimatePresence>
      </main>

      {/* Cart Component */}
      <Cart 
        isOpen={isCartOpen} 
        onClose={() => setIsCartOpen(false)}
        onCheckout={() => {
          setIsCartOpen(false)
          setTimeout(() => setIsCheckoutOpen(true), 100)
        }}
      />

      {/* Checkout Component */}
      <Checkout 
        isOpen={isCheckoutOpen} 
        onClose={() => setIsCheckoutOpen(false)}
        onSuccess={handleOrderSuccess}
      />
    </div>
  )
}

// =============================================================================
// 🚀 MAIN APP WITH PROVIDERS
// =============================================================================

function App() {
  return (
    <CartProvider>
      <AppContent />
    </CartProvider>
  )
}

export default App