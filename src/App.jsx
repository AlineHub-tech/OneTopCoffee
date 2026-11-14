import { useEffect, useMemo, useState } from 'react'
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import { ArrowDown, ArrowLeft, ArrowRight, ArrowUpRight, Camera, Check, ChevronDown, Clock3, Coffee, Heart, Mail, MapPin, Menu, Minus, Plus, Search, ShoppingBag, Sparkles, X } from 'lucide-react'
import logo from './assets/logo.png'
import { categories, heroSlides, initialProducts } from './data/products'
import './App.css'
import './styles/coffee-store.css'

const money = (value) => `${Number(value).toLocaleString('en-US')} RWF`
const readStored = (key, fallback) => {
  try {
    const stored = localStorage.getItem(key)
    return stored ? JSON.parse(stored) : fallback
  } catch {
    return fallback
  }
}

const readProducts = () => {
  const currentProducts = readStored('otc-products-v3', null)
  if (Array.isArray(currentProducts)) return currentProducts

  const previousProducts = readStored('otc-products-v2', null)
  if (!Array.isArray(previousProducts)) return initialProducts

  const previousById = new Map(previousProducts.map((product) => [product.id, product]))
  return initialProducts.map((product) => {
    const previousProduct = previousById.get(product.id)
    return previousProduct
      ? { ...product, ...previousProduct, image: product.image, images: product.images, cutout: product.cutout }
      : product
  })
}

function App() {
  const reducedMotion = useReducedMotion()
  const [products, setProducts] = useState(readProducts)
  const [cart, setCart] = useState(() => readStored('otc-cart-v2', []))
  const [orders, setOrders] = useState(() => readStored('otc-orders', []))
  const [drawer, setDrawer] = useState('')
  const [mobileMenu, setMobileMenu] = useState(false)
  const [toast, setToast] = useState('')
  const [order, setOrder] = useState(null)
  const [delivery, setDelivery] = useState('delivery')
  const [form, setForm] = useState({ name: '', phone: '', address: '' })
  const [heroIndex, setHeroIndex] = useState(0)
  const [heroDirection, setHeroDirection] = useState(1)
  const [selectedCategory, setSelectedCategory] = useState('All Products')
  const [filterMode, setFilterMode] = useState('all')
  const [search, setSearch] = useState('')
  const [selectedSizes, setSelectedSizes] = useState({})
  const [detailSize, setDetailSize] = useState('')

  useEffect(() => { localStorage.setItem('otc-cart-v2', JSON.stringify(cart)) }, [cart])
  useEffect(() => { localStorage.setItem('otc-products-v3', JSON.stringify(products)) }, [products])
  useEffect(() => { localStorage.setItem('otc-orders', JSON.stringify(orders)) }, [orders])
  useEffect(() => {
    if (!toast) return undefined
    const timer = setTimeout(() => setToast(''), 2600)
    return () => clearTimeout(timer)
  }, [toast])
  useEffect(() => {
    if (reducedMotion) return undefined
    const timer = setInterval(() => {
      setHeroDirection((direction) => direction * -1)
      setHeroIndex((index) => (index + 1) % heroSlides.length)
    }, 4200)
    return () => clearInterval(timer)
  }, [reducedMotion])

  const itemCount = cart.reduce((sum, item) => sum + item.quantity, 0)
  const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0)
  const deliveryFee = delivery === 'delivery' && cart.length && subtotal <= 25000 ? 1500 : 0
  const total = subtotal + deliveryFee
  const activeHeroSlide = heroSlides[heroIndex]
  const detailProduct = drawer.startsWith('product-')
    ? products.find((product) => product.id === drawer.slice('product-'.length))
    : null
  const displayedProducts = useMemo(() => {
    const query = search.trim().toLowerCase()
    return products.filter((product) => {
      const matchesCategory = selectedCategory === 'All Products' || product.category === selectedCategory
      const matchesMode = filterMode === 'all' || (filterMode === 'bestSeller' ? product.bestSeller : product.featured)
      const matchesSearch = !query || [product.name, product.category, product.description, ...(product.includes || [])]
        .join(' ')
        .toLowerCase()
        .includes(query)
      return matchesCategory && matchesMode && matchesSearch
    })
  }, [filterMode, products, search, selectedCategory])

  const selectedSizeFor = (product) => product.sizes.find((size) => size.name === selectedSizes[product.id]) || product.sizes[0]
  const priceFor = (product, sizeName) => product.price + (product.sizes.find((size) => size.name === sizeName)?.price || 0)
  const addToCart = (product, sizeName = product.sizes[0].name) => {
    if (!product.available) {
      setToast(`${product.name} is currently sold out`)
      return
    }
    const price = priceFor(product, sizeName)
    setCart((items) => {
      const found = items.find((item) => item.id === product.id && item.size === sizeName)
      return found
        ? items.map((item) => item.id === product.id && item.size === sizeName ? { ...item, quantity: item.quantity + 1 } : item)
        : [...items, { ...product, price, quantity: 1, size: sizeName }]
    })
    setToast(`${product.name} added to your bag`)
  }
  const changeQuantity = (id, size, delta) => setCart((items) => items
    .map((item) => item.id === id && item.size === size ? { ...item, quantity: item.quantity + delta } : item)
    .filter((item) => item.quantity > 0))
  const viewProduct = (product) => {
    setDetailSize(product.sizes[0].name)
    setDrawer(`product-${product.id}`)
  }
  const showHeroProduct = () => {
    const product = products.find((item) => item.id === activeHeroSlide.productId)
    if (product) viewProduct(product)
  }
  const changeHeroSlide = (direction) => {
    setHeroDirection(direction)
    setHeroIndex((index) => (index + direction + heroSlides.length) % heroSlides.length)
  }
  const checkout = (event) => {
    event.preventDefault()
    if (!cart.length || !form.name.trim() || !form.phone.trim() || (delivery === 'delivery' && !form.address.trim())) {
      setToast('Please complete the required details')
      return
    }
    const placed = {
      id: `OTC-${Date.now().toString().slice(-6)}`,
      customer: form.name.trim(),
      phone: form.phone.trim(),
      address: delivery === 'delivery' ? form.address.trim() : 'Pickup at OneTopCoffee',
      delivery,
      items: cart,
      total,
      status: 'Received',
      createdAt: new Date().toLocaleString(),
    }
    setOrders((items) => [placed, ...items])
    setOrder(placed)
    setCart([])
    setDrawer('confirmation')
  }
  const updateProduct = (id, updates) => setProducts((items) => items.map((item) => item.id === id ? { ...item, ...updates } : item))
  const updateOrderStatus = (id, status) => setOrders((items) => items.map((item) => item.id === id ? { ...item, status } : item))
  const openCart = () => {
    setDrawer('cart')
    setMobileMenu(false)
  }
  const resetFilters = () => {
    setSelectedCategory('All Products')
    setFilterMode('all')
    setSearch('')
  }

  return (
    <main>
      <div className="announcement"><Sparkles size={14} /> Fresh coffee, made in Kigali <span>Free delivery on orders over 25,000 RWF</span></div>
      <header className="nav">
        <a href="#home" className="brand" aria-label="OneTopCoffee home">
          <img src={logo} alt="" />
          <span>OneTopCoffee<small>GOOD COFFEE · BETTER DAYS</small></span>
        </a>
        <nav className={mobileMenu ? 'nav-links open' : 'nav-links'} aria-label="Main navigation">
          <a href="#home" onClick={() => setMobileMenu(false)}>Home</a>
          <a href="#coffee" onClick={() => setMobileMenu(false)}>Menu</a>
          <a href="#about" onClick={() => setMobileMenu(false)}>Our Story</a>
          <a href="#contact" onClick={() => setMobileMenu(false)}>Contact</a>
        </nav>
        <div className="nav-actions">
          <button className="icon-btn cart-button" onClick={openCart} aria-label={`Open cart, ${itemCount} items`}><ShoppingBag size={20} /><span>Bag</span><b>{itemCount}</b></button>
          <a className="button button-dark nav-cta" href="#coffee">Order now <ArrowUpRight size={16} /></a>
          <button className="icon-btn menu-button" onClick={() => setMobileMenu(!mobileMenu)} aria-label={mobileMenu ? 'Close menu' : 'Open menu'}>{mobileMenu ? <X /> : <Menu />}</button>
        </div>
      </header>

      <section className="hero hero-reworked" id="home">
        <div className="hero-copy">
          <span className="eyebrow"><span className="eyebrow-line" /> A GOOD DAY STARTS HERE</span>
          <h1>Your daily cup<br />of <em>happy.</em></h1>
          <p>Thoughtful coffee, fresh smoothies and little treats, made with love right here in Kigali.</p>
          <div className="hero-ctas">
            <a className="button button-cream" href="#coffee">Explore the menu <ArrowRight size={17} /></a>
            <button className="button button-outline" onClick={openCart}>Your bag <ShoppingBag size={16} /></button>
          </div>
          <div className="hero-footnote"><span className="hero-footnote-icon"><Heart size={16} /></span> Freshly made. Always worth the pause.</div>
        </div>
        <div className="hero-showcase" aria-label="Featured menu carousel">
          <div className="hero-orbit hero-orbit-one" />
          <div className="hero-orbit hero-orbit-two" />
          <AnimatePresence mode="wait" initial={false} custom={heroDirection}>
            <motion.button
              className="hero-slide"
              key={activeHeroSlide.name}
              onClick={showHeroProduct}
              aria-label={`View ${activeHeroSlide.name}`}
              initial={{ opacity: 0, x: heroDirection * 280, rotate: heroDirection * 8, scale: 0.88 }}
              animate={{ opacity: 1, x: 0, rotate: 0, scale: 1 }}
              exit={{ opacity: 0, x: heroDirection * -280, rotate: heroDirection * -8, scale: 0.88 }}
              transition={{ duration: 0.72, ease: [0.22, 1, 0.36, 1] }}
            >
              <span className={`hero-slide-photo ${activeHeroSlide.images ? 'hero-slide-pair' : ''} ${activeHeroSlide.cutout ? 'hero-slide-cutout' : ''}`}>
                {activeHeroSlide.images
                  ? activeHeroSlide.images.map((image, index) => <img key={index} src={image} alt={`${activeHeroSlide.name} item ${index + 1}`} />)
                  : <img src={activeHeroSlide.image} alt={activeHeroSlide.name} />}
              </span>
              <span className="hero-slide-caption"><span>{activeHeroSlide.category}</span><strong>{activeHeroSlide.name}</strong><i>{String(heroIndex + 1).padStart(2, '0')} / {String(heroSlides.length).padStart(2, '0')}</i></span>
            </motion.button>
          </AnimatePresence>
          <div className="hero-stamp">GOOD COFFEE<br />BETTER DAYS <span>✳</span></div>
          <div className="hero-carousel-controls">
            <button aria-label="Previous featured product" onClick={() => changeHeroSlide(-1)}><ArrowLeft size={17} /></button>
            <button aria-label="Next featured product" onClick={() => changeHeroSlide(1)}><ArrowRight size={17} /></button>
          </div>
        </div>
        <a href="#coffee" className="hero-scroll"><ArrowDown size={16} /> THE GOOD STUFF</a>
        <div className="hero-bottom"><span>CRAFTED IN KIGALI, RWANDA</span><span>FRESHLY MADE · ALWAYS</span><span>GOOD COFFEE · BETTER DAYS</span></div>
      </section>

      <div className="ticker" aria-label="Good coffee, better days"><div className="ticker-track">{Array.from({ length: 4 }, (_, index) => <span key={index}>GOOD COFFEE <b>✳</b> BETTER DAYS <b>✳</b> MADE WITH LOVE <b>✳</b> EVERYDAY JOY <b>✳</b></span>)}</div></div>

      <section className="products section-wrap catalog-section" id="coffee">
        <div className="section-heading catalog-heading">
          <div><span className="eyebrow"><span className="eyebrow-line" /> YOUR NEW LITTLE RITUAL</span><h2>Find your <em>happy place.</em></h2></div>
          <p>Good things, freshly made and ready when you are.</p>
        </div>
        <div className="catalog-tools">
          <label className="product-search"><Search size={19} /><input type="search" value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search coffee, treats and more" aria-label="Search products" />{search && <button onClick={() => setSearch('')} aria-label="Clear search"><X size={17} /></button>}</label>
          <div className="feature-filters" aria-label="Special product filters">
            <button className={filterMode === 'all' ? 'active' : ''} onClick={() => setFilterMode('all')}>All products</button>
            <button className={filterMode === 'bestSeller' ? 'active' : ''} onClick={() => setFilterMode(filterMode === 'bestSeller' ? 'all' : 'bestSeller')}><Sparkles size={14} /> Best sellers</button>
            <button className={filterMode === 'featured' ? 'active' : ''} onClick={() => setFilterMode(filterMode === 'featured' ? 'all' : 'featured')}><Heart size={14} /> Featured</button>
          </div>
        </div>
        <div className="category-tabs" role="group" aria-label="Filter products by category">
          {['All Products', ...categories].map((category) => <button key={category} className={selectedCategory === category ? 'active' : ''} onClick={() => setSelectedCategory(category)}>{category}</button>)}
        </div>
        <div className="product-grid catalog-grid">
          {displayedProducts.map((product, index) => {
            const size = selectedSizeFor(product)
            return (
              <motion.article className={`product-card catalog-card ${product.color || ''} ${product.available ? '' : 'sold-out'}`} key={product.id} initial={{ opacity: 0, y: 18 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.08 }} transition={{ delay: Math.min(index % 4, 3) * 0.04, duration: 0.4 }}>
                <div className={`product-visual catalog-visual ${product.cutout ? 'product-cutout' : ''}`}>
                  {product.images ? <div className="combo-images">{product.images.map((image, imageIndex) => <img key={imageIndex} src={image} alt="" loading="lazy" />)}</div> : <button className="product-image-button" aria-label={`View ${product.name}`} onClick={() => viewProduct(product)}><img src={product.image} alt={product.name} loading="lazy" /></button>}
                  {!product.images && <button className="product-image-overlay" aria-label={`View details for ${product.name}`} onClick={() => viewProduct(product)} />}
                  {product.badge && <span className="product-badge">{product.badge}</span>}
                  <span className={`availability ${product.available ? 'available' : 'unavailable'}`}><i />{product.available ? 'Available' : 'Sold out'}</span>
                </div>
                <div className="catalog-card-content">
                  <span className="product-category">{product.category}</span>
                  <div className="product-info catalog-product-info"><h3>{product.name}</h3><span className="product-price">{money(priceFor(product, size.name))}</span></div>
                  <p className="catalog-description">{product.description}</p>
                  {product.includes && <div className="combo-includes"><strong>COMBO INCLUDES</strong><span>{product.includes.join(' + ')}</span></div>}
                  <div className="catalog-card-actions">
                    <label className="size-select-label"><span>{product.sizes.length > 1 ? 'Size' : 'Serving'}</span><span className="size-select-wrap"><select aria-label={`${product.name} size`} value={size.name} onChange={(event) => setSelectedSizes((sizes) => ({ ...sizes, [product.id]: event.target.value }))}>{product.sizes.map((option) => <option key={option.name} value={option.name}>{option.name}</option>)}</select><ChevronDown size={14} /></span></label>
                    <button className="button button-dark add-product" disabled={!product.available} onClick={() => addToCart(product, size.name)}>{product.available ? <>Add to bag <Plus size={16} /></> : 'Sold out'}</button>
                  </div>
                </div>
              </motion.article>
            )
          })}
        </div>
        {!displayedProducts.length && <div className="empty-results"><Search size={25} /><h3>No products found</h3><p>Try a different search or clear the filters.</p><button className="button button-dark" onClick={resetFilters}>Show all products</button></div>}
        <div className="products-note"><span>✳</span> Everything is made fresh, just for you. <a href="#contact">Have a question? Say hello <ArrowRight size={15} /></a></div>
      </section>

      <section className="story story-refresh" id="about">
        <motion.div className="story-visual" initial={{ opacity: 0, x: -42 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true, amount: 0.24 }} transition={{ duration: 0.75, ease: 'easeOut' }}>
          <div className="story-visual-orbit story-visual-orbit-one" />
          <div className="story-visual-orbit story-visual-orbit-two" />
          <motion.img className="story-hero-drink" src={heroSlides[1].image} alt="Iced coffee made fresh at OneTopCoffee" loading="lazy" animate={reducedMotion ? undefined : { y: [0, -10, 0], rotate: [-2, 1, -2] }} transition={{ duration: 5.2, repeat: Infinity, ease: 'easeInOut' }} />
          <motion.div className="story-floating-note story-note-top" animate={reducedMotion ? undefined : { y: [0, -5, 0] }} transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}><span>01</span> A LITTLE PAUSE</motion.div>
          <motion.div className="story-floating-note story-note-bottom" animate={reducedMotion ? undefined : { y: [0, 5, 0] }} transition={{ duration: 4.8, repeat: Infinity, ease: 'easeInOut' }}><Coffee size={17} /> CRAFTED IN KIGALI</motion.div>
          <span className="story-visual-spark story-spark-a">✳</span><span className="story-visual-spark story-spark-b">✦</span>
        </motion.div>
        <motion.div className="story-copy story-copy-refresh" initial={{ opacity: 0, x: 38 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true, amount: 0.24 }} transition={{ duration: 0.7, delay: 0.12, ease: 'easeOut' }}>
          <span className="eyebrow"><span className="eyebrow-line" /> OUR STORY · OUR SPIRIT</span>
          <h2>Made for the<br /><em>in-between.</em></h2>
          <p>Between the rush and the next big thing, there is a little moment that belongs to you. We make coffee, fresh blends and thoughtful treats to help you find it.</p>
          <p>OneTopCoffee started with a simple Kigali idea: make good things with care, welcome everyone in, and leave the day a little brighter than we found it.</p>
          <a className="button button-dark story-link" href="#coffee">Find your little ritual <ArrowRight size={16} /></a>
          <div className="story-values"><span><strong>01</strong> Made with care</span><span><strong>02</strong> Rooted in Kigali</span><span><strong>03</strong> Always room for you</span></div>
        </motion.div>
      </section>

      <section className="experience section-wrap" id="experience"><div className="experience-top"><span className="eyebrow"><span className="eyebrow-line" /> THE ONETOP WAY</span><span className="experience-note">A little extra care makes all the difference.</span></div><h2>Good things take<br />a <em>little intention.</em></h2><div className="values-grid"><article><span className="value-index">01</span><Coffee size={23} strokeWidth={1.6} /><h3>Made fresh, always.</h3><p>Every cup is made to order with ingredients we feel good about.</p></article><article><span className="value-index">02</span><Heart size={23} strokeWidth={1.6} /><h3>Good from the start.</h3><p>Thoughtful sourcing, better beans, and the people behind every pour.</p></article><article><span className="value-index">03</span><Sparkles size={23} strokeWidth={1.6} /><h3>Room for everyone.</h3><p>Your usual, your new thing, your moment. There is always a seat for you.</p></article></div></section>
      <section className="quote-band"><div className="quote-mark">“</div><blockquote>Good coffee. Better days.<br /><em>That’s the whole idea.</em></blockquote><div className="quote-byline"><span /> THE ONETOPCOFFEE PROMISE <span /></div></section>
      <section className="newsletter section-wrap"><div><span className="eyebrow"><span className="eyebrow-line" /> A LITTLE NOTE FROM US</span><h2>Good things in<br />your <em>inbox.</em></h2><p>New sips, happy offers, and the occasional reminder to slow down.</p></div><form onSubmit={(event) => { event.preventDefault(); setToast('You’re on the list. Look out for a little good news!'); event.currentTarget.reset() }}><label htmlFor="newsletter-email">Your email address</label><div className="newsletter-field"><input id="newsletter-email" type="email" placeholder="you@somewhere.com" required /><button type="submit" aria-label="Subscribe to newsletter"><ArrowRight size={19} /></button></div><small>No spam. Just the good stuff, promise.</small></form><span className="newsletter-star">✳</span></section>

      <section className="contact-section" id="contact">
        <motion.div className="contact-heading" initial={{ opacity: 0, y: 22 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.35 }} transition={{ duration: 0.6 }}>
          <span className="eyebrow"><span className="eyebrow-line" /> COME ON IN</span>
          <h2>Good days start<br />with <em>hello.</em></h2>
          <p>Questions, a coffee date, or just want to say hi? We would love to hear from you.</p>
          <a className="button button-dark" href="mailto:hello@onetopcoffee.com">Say hello <ArrowUpRight size={16} /></a>
        </motion.div>
        <div className="contact-details">
          <motion.a className="contact-card" href="https://maps.google.com/?q=Kigali%2C+Rwanda" target="_blank" rel="noreferrer" initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.3 }} transition={{ duration: 0.5 }}>
            <span className="contact-icon"><MapPin size={20} /></span><span className="contact-card-label">COME FIND US</span><strong>Kigali, Rwanda</strong><span className="contact-card-note">Find us in the heart of the city <ArrowUpRight size={14} /></span>
          </motion.a>
          <motion.div className="contact-card" initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.3 }} transition={{ duration: 0.5, delay: 0.12 }}>
            <span className="contact-icon"><Clock3 size={20} /></span><span className="contact-card-label">WHEN WE ARE HERE</span><strong>Mon – Sat · 8am – 7pm</strong><span className="contact-card-note">Fresh coffee, all day long.</span>
          </motion.div>
          <motion.a className="contact-card" href="mailto:hello@onetopcoffee.com" initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.3 }} transition={{ duration: 0.5, delay: 0.24 }}>
            <span className="contact-icon"><Mail size={20} /></span><span className="contact-card-label">DROP US A NOTE</span><strong>hello@onetopcoffee.com</strong><span className="contact-card-note">We would love to hear from you <ArrowUpRight size={14} /></span>
          </motion.a>
        </div>
      </section>

      <footer><div className="footer-main"><div className="footer-brand"><img src={logo} alt="OneTopCoffee" /><p>Good coffee.<br />Better days.</p><a href="https://instagram.com" className="social-link" aria-label="Instagram"><Camera size={17} /> Come say hi</a></div><div className="footer-column"><span className="footer-label">A LITTLE LOOK AROUND</span><a href="#coffee">Full menu</a><a href="#about">Our story</a><button onClick={() => setDrawer('admin')}>Team dashboard <ArrowUpRight size={14} /></button></div><div className="footer-note">Wherever you are,<br /><em>make it a good day.</em><span>✳</span></div></div><div className="footer-bottom"><span>© 2026 OneTopCoffee. Made with love in Kigali.</span><span>GOOD COFFEE <b>·</b> BETTER DAYS</span><a href="#home">Back to the top ↑</a></div></footer>

      <AnimatePresence>
        {drawer && <motion.div className="drawer-scrim" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onMouseDown={(event) => { if (event.target === event.currentTarget) setDrawer('') }}>
          <motion.aside className="drawer" initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }} transition={{ type: 'tween', duration: 0.28 }} aria-modal="true" role="dialog" aria-label={drawer === 'cart' ? 'Shopping bag' : 'OneTopCoffee panel'}>
            <div className="drawer-head"><div><span className="eyebrow"><span className="eyebrow-line" /> ONETOPCOFFEE</span><h2>{drawer === 'cart' ? 'Your little bag.' : drawer === 'admin' ? 'Team dashboard.' : drawer === 'confirmation' ? 'It’s a good day.' : 'Say hello to your new favourite.'}</h2></div><button className="icon-btn close-drawer" onClick={() => setDrawer('')} aria-label="Close panel"><X /></button></div>
            {drawer === 'cart' && <div className="drawer-content">{!cart.length ? <div className="empty-cart"><span>☕</span><h3>Nothing in your bag. Yet.</h3><p>There’s a little happy place waiting for you.</p><button className="button button-dark" onClick={() => setDrawer('')}>Find your favourite <ArrowRight size={16} /></button></div> : <>{cart.map((item) => <div className="cart-item" key={`${item.id}-${item.size}`}><div className={`cart-thumb ${item.color || ''}`}>{item.images ? item.images.map((image, index) => <img key={index} src={image} alt="" />) : <img src={item.image} alt="" />}</div><div className="cart-item-info"><span>{item.category} · {item.size}</span><h3>{item.name}</h3><b>{money(item.price)}</b><div className="quantity"><button aria-label={`Remove one ${item.name}`} onClick={() => changeQuantity(item.id, item.size, -1)}><Minus size={14} /></button><span>{item.quantity}</span><button aria-label={`Add one ${item.name}`} onClick={() => changeQuantity(item.id, item.size, 1)}><Plus size={14} /></button></div></div></div>)}<div className="delivery-choice"><span>HOW WOULD YOU LIKE IT?</span><div><button className={delivery === 'delivery' ? 'selected' : ''} onClick={() => setDelivery('delivery')}>Deliver to me</button><button className={delivery === 'pickup' ? 'selected' : ''} onClick={() => setDelivery('pickup')}>I’ll pick it up</button></div></div><form className="checkout-form" onSubmit={checkout}><label>Full name<input value={form.name} onChange={(event) => setForm({ ...form, name: event.target.value })} placeholder="Your name" autoComplete="name" required /></label><label>Phone number<input type="tel" value={form.phone} onChange={(event) => setForm({ ...form, phone: event.target.value })} placeholder="+250 7XX XXX XXX" autoComplete="tel" required /></label>{delivery === 'delivery' && <label>Delivery address<input value={form.address} onChange={(event) => setForm({ ...form, address: event.target.value })} placeholder="Neighbourhood, street, landmark" autoComplete="street-address" required /></label>}<div className="order-totals"><div><span>Subtotal</span><b>{money(subtotal)}</b></div><div><span>{delivery === 'delivery' ? 'Delivery' : 'Pickup'}</span><b>{deliveryFee ? money(deliveryFee) : 'On us'}</b></div><div className="grand-total"><span>Total</span><b>{money(total)}</b></div></div><button className="button button-dark place-order" type="submit">Place my order <ArrowRight size={16} /></button><p className="payment-note">Payment arranged on delivery or pickup. Simple and easy.</p></form></>}</div>}
            {detailProduct && <div className="detail-panel"><div className={`detail-image ${detailProduct.color || ''}`}>{detailProduct.images ? detailProduct.images.map((image, index) => <img key={index} src={image} alt="" />) : <img src={detailProduct.image} alt={detailProduct.name} />}</div><span className="product-category">{detailProduct.category}</span><h2>{detailProduct.name}</h2><p>{detailProduct.description}</p>{detailProduct.includes && <div className="combo-includes detail-includes"><strong>COMBO INCLUDES</strong><span>{detailProduct.includes.join(' + ')}</span></div>}<label className="size-label">Choose size <span className="detail-size-wrap"><select aria-label="Product size" value={detailSize} onChange={(event) => setDetailSize(event.target.value)}>{detailProduct.sizes.map((size) => <option key={size.name} value={size.name}>{size.name}</option>)}</select><ChevronDown size={15} /></span></label><div className="detail-bottom"><strong>{money(priceFor(detailProduct, detailSize))}</strong><button className="button button-dark" disabled={!detailProduct.available} onClick={() => { addToCart(detailProduct, detailSize); if (detailProduct.available) setDrawer('cart') }}>{detailProduct.available ? <>Add to your bag <Plus size={17} /></> : 'Sold out'}</button></div></div>}
            {drawer === 'confirmation' && order && <div className="confirmation"><div className="check-circle"><Check /></div><span className="eyebrow"><span className="eyebrow-line" /> ORDER {order.id}</span><h2>We’ve got<br />the <em>good stuff.</em></h2><p>Thanks, {order.customer}! Your order is in good hands. We’ll be in touch at <strong>{order.phone}</strong> with the details.</p><div className="confirm-card"><span>{order.delivery === 'delivery' ? 'DELIVERING TO' : 'PICKING UP'}</span><p>{order.address}</p><span>YOUR TOTAL</span><strong>{money(order.total)}</strong></div><button className="button button-dark" onClick={() => setDrawer('')}>That’s lovely <Check size={16} /></button></div>}
            {drawer === 'admin' && <div className="admin-panel"><div className="admin-notice"><Sparkles size={17} /> Demo dashboard · changes are saved on this device.</div><h3>Menu availability <span>{products.filter((product) => product.available).length} of {products.length} available</span></h3>{products.map((product) => <div className="admin-product" key={product.id}><div><strong>{product.name}</strong><span>{product.category}</span></div><label className="admin-price">Starting price<input type="number" min="1" value={product.price} aria-label={`${product.name} price in RWF`} onChange={(event) => updateProduct(product.id, { price: Number(event.target.value) || product.price })} /></label><button className={`availability-toggle ${product.available ? 'is-available' : ''}`} onClick={() => updateProduct(product.id, { available: !product.available })}>{product.available ? 'Available' : 'Sold out'}</button></div>)}<h3 className="admin-orders-heading">Orders <span>{orders.length} total</span></h3>{!orders.length ? <p className="no-orders">No orders just yet. They’ll show up here.</p> : orders.map((placedOrder) => <div className="admin-order" key={placedOrder.id}><div className="admin-order-top"><strong>{placedOrder.id}</strong><strong>{money(placedOrder.total)}</strong></div><p>{placedOrder.customer} · {placedOrder.phone}</p><p>{placedOrder.address}</p><label>Status<select value={placedOrder.status} onChange={(event) => updateOrderStatus(placedOrder.id, event.target.value)}><option>Received</option><option>Preparing</option><option>On the way</option><option>Ready for pickup</option><option>Complete</option><option>Cancelled</option></select></label></div>)}</div>}
          </motion.aside>
        </motion.div>}
      </AnimatePresence>
      <AnimatePresence>{toast && <motion.div className="toast" initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 12 }}><Check size={17} />{toast}</motion.div>}</AnimatePresence>
    </main>
  )
}

export default App
