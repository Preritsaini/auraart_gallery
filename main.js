import { paintings, artists, THEMES, ANIMATION_CONFIG } from './constants.js';

// State Management
let cart = JSON.parse(localStorage.getItem('aura_cart')) || [];
let currentFilter = 'all';
let searchQuery = '';
let currentSort = 'default';
let currentTheme = localStorage.getItem('aura_theme') || THEMES.LIGHT;

// DOM Elements
const artGrid = document.getElementById('art-grid');
const noResults = document.getElementById('no-results');
const artistGrid = document.getElementById('artist-grid');
const artSearch = document.getElementById('art-search');
const artSort = document.getElementById('art-sort');

const cartOverlay = document.getElementById('cart-overlay');
const cartBtn = document.getElementById('cart-btn');
const closeCart = document.getElementById('close-cart');
const cartContent = document.getElementById('cart-content');
const checkoutForm = document.getElementById('checkout-form');
const orderSuccess = document.getElementById('order-success');
const cartItemsContainer = document.getElementById('cart-items');
const cartCount = document.querySelector('.cart-count');
const cartTotal = document.getElementById('cart-total');

const themeToggle = document.getElementById('theme-toggle');
const navbar = document.querySelector('.navbar');
const productModal = document.getElementById('product-modal');
const modalClose = document.querySelector('.modal-close');
const filterBtns = document.querySelectorAll('.filter-btn');
const menuToggle = document.getElementById('menu-toggle');
const navLinks = document.querySelector('.nav-links');

/**
 * Initialize Theme
 */
function initTheme() {
    document.documentElement.setAttribute('data-theme', currentTheme);
}

function toggleTheme() {
    currentTheme = currentTheme === THEMES.LIGHT ? THEMES.DARK : THEMES.LIGHT;
    document.documentElement.setAttribute('data-theme', currentTheme);
    localStorage.setItem('aura_theme', currentTheme);
}

/**
 * Render Gallery
 */
function renderGallery() {
    // 1. Filter by category
    let filtered = currentFilter === 'all' ? paintings : paintings.filter(p => p.category === currentFilter);
    
    // 2. Search by title or artist
    if (searchQuery) {
        const query = searchQuery.toLowerCase();
        filtered = filtered.filter(p => 
            p.title.toLowerCase().includes(query) || 
            p.artist.toLowerCase().includes(query)
        );
    }

    // 3. Sort
    if (currentSort === 'price-low') {
        filtered.sort((a, b) => a.price - b.price);
    } else if (currentSort === 'price-high') {
        filtered.sort((a, b) => b.price - a.price);
    }

    // Toggle no results message
    if (filtered.length === 0) {
        artGrid.classList.add('hidden');
        noResults.classList.remove('hidden');
    } else {
        artGrid.classList.remove('hidden');
        noResults.classList.add('hidden');
        
        artGrid.innerHTML = filtered.map((art, index) => `
            <article class="art-card reveal" style="transition-delay: ${index * 0.05}s" onclick="openProductModal(${art.id})">
                <div class="art-img-container">
                    <img src="${art.image}" alt="${art.title}" loading="lazy">
                </div>
                <div class="art-info">
                    <span class="modal-category" style="font-size: 0.7rem; margin-bottom: 0.5rem; display: block;">${art.category}</span>
                    <h3>${art.title}</h3>
                    <p>by ${art.artist}</p>
                    <div class="art-footer">
                        <span class="price">₹${art.price.toLocaleString('en-IN')}</span>
                        <button class="add-btn" onclick="event.stopPropagation(); addToCart(${art.id})">Add to Collection</button>
                    </div>
                </div>
            </article>
        `).join('');
    }

    // Re-observe new elements
    observeScroll();
}

/**
 * Render Artists
 */
function renderArtists() {
    if (!artistGrid) return;
    artistGrid.innerHTML = artists.map(artist => `
        <div class="artist-card reveal">
            <img src="${artist.image}" alt="${artist.name}" class="artist-img">
            <h3>${artist.name}</h3>
            <span class="modal-category">${artist.role}</span>
            <p style="margin-top: 1rem; color: var(--text-muted); font-size: 0.9rem;">${artist.bio}</p>
        </div>
    `).join('');
}

/**
 * Cart & Checkout Logic
 */
window.addToCart = (id) => {
    const painting = paintings.find(p => p.id === id);
    if (!cart.find(item => item.id === id)) {
        cart.push(painting);
        saveCart();
        updateCartUI();
        openCart();
    }
};

window.removeFromCart = (id) => {
    cart = cart.filter(item => item.id !== id);
    saveCart();
    updateCartUI();
};

function saveCart() {
    localStorage.setItem('aura_cart', JSON.stringify(cart));
}

function updateCartUI() {
    cartCount.innerText = cart.length;
    cartItemsContainer.innerHTML = cart.length === 0 
        ? '<p style="text-align: center; color: var(--text-muted); padding: 2rem;">Your collection is empty.</p>'
        : cart.map(item => `
            <div class="cart-item">
                <img src="${item.image}" alt="${item.title}">
                <div class="cart-item-info">
                    <h4>${item.title}</h4>
                    <p>₹${item.price.toLocaleString('en-IN')}</p>
                    <span class="remove-btn" onclick="removeFromCart(${item.id})">Remove</span>
                </div>
            </div>
        `).join('');
    
    const total = cart.reduce((sum, item) => sum + item.price, 0);
    if (cartTotal) cartTotal.innerText = `₹${total.toLocaleString('en-IN')}`;
}

// Checkout Navigation
function resetCheckout() {
    cartContent.classList.remove('hidden');
    checkoutForm.classList.add('hidden');
    orderSuccess.classList.add('hidden');
    document.querySelectorAll('.step-content').forEach(s => s.classList.add('hidden'));
    document.getElementById('step-1').classList.remove('hidden');
    document.querySelectorAll('.step').forEach(s => s.classList.remove('active'));
    document.querySelector('.step[data-step="1"]').classList.add('active');
}

document.getElementById('start-checkout')?.addEventListener('click', () => {
    if (cart.length === 0) return alert('Your collection is empty.');
    cartContent.classList.add('hidden');
    checkoutForm.classList.remove('hidden');
});

document.getElementById('back-to-cart')?.addEventListener('click', resetCheckout);

document.querySelectorAll('.next-step').forEach(btn => {
    btn.addEventListener('click', () => {
        const next = btn.dataset.next;
        document.querySelectorAll('.step-content').forEach(s => s.classList.add('hidden'));
        document.getElementById(`step-${next}`).classList.remove('hidden');
        document.querySelectorAll('.step').forEach(s => s.classList.remove('active'));
        document.querySelector(`.step[data-step="${next}"]`).classList.add('active');
    });
});

document.getElementById('complete-purchase')?.addEventListener('click', () => {
    checkoutForm.classList.add('hidden');
    orderSuccess.classList.remove('hidden');
    cart = [];
    saveCart();
    updateCartUI();
});

document.getElementById('close-after-success')?.addEventListener('click', () => {
    cartOverlay.classList.remove('active');
    setTimeout(resetCheckout, 500);
});

/**
 * Modal Logic
 */
window.openProductModal = (id) => {
    const art = paintings.find(p => p.id === id);
    if (!art) return;

    document.getElementById('modal-img').src = art.image;
    document.getElementById('modal-category').innerText = art.category;
    document.getElementById('modal-title').innerText = art.title;
    document.getElementById('modal-artist').innerText = art.artist;
    document.getElementById('modal-desc').innerText = art.description;
    document.getElementById('modal-price').innerText = `₹${art.price.toLocaleString('en-IN')}`;
    
    const addBtn = document.getElementById('modal-add-btn');
    addBtn.onclick = () => {
        addToCart(art.id);
        closeProductModal();
    };

    productModal.classList.add('active');
    document.body.style.overflow = 'hidden';
};

function closeProductModal() {
    productModal.classList.remove('active');
    document.body.style.overflow = '';
}

/**
 * Animations & Transitions
 */
function observeScroll() {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
            }
        });
    }, { threshold: ANIMATION_CONFIG.THRESHOLD });

    document.querySelectorAll('.reveal, .hero-content, .about-content').forEach(el => {
        if (!el.classList.contains('reveal')) el.classList.add('reveal');
        observer.observe(el);
    });
}

function handleNavbarScroll() {
    if (window.scrollY > 50) {
        navbar.style.padding = '0.8rem 5%';
        navbar.style.boxShadow = 'var(--shadow-md)';
    } else {
        navbar.style.padding = '1.25rem 5%';
        navbar.style.boxShadow = 'none';
    }
}

// Cart Visibility
function openCart() {
    cartOverlay.classList.add('active');
}

function toggleCart() {
    cartOverlay.classList.toggle('active');
}

// Event Listeners
cartBtn?.addEventListener('click', toggleCart);
closeCart?.addEventListener('click', () => {
    cartOverlay.classList.remove('active');
    setTimeout(resetCheckout, 500);
});
modalClose?.addEventListener('click', closeProductModal);
themeToggle?.addEventListener('click', toggleTheme);
window.addEventListener('scroll', handleNavbarScroll);

// Mobile Menu
function toggleMenu() {
    console.log('Toggling menu');
    menuToggle.classList.toggle('active');
    navLinks.classList.toggle('active');
    document.body.style.overflow = navLinks.classList.contains('active') ? 'hidden' : '';
}

menuToggle?.addEventListener('click', toggleMenu);

// Close menu when clicking links
navLinks?.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
        console.log('Link clicked, closing menu');
        menuToggle.classList.remove('active');
        navLinks.classList.remove('active');
        document.body.style.overflow = '';
    });
});

artSearch?.addEventListener('input', (e) => {
    searchQuery = e.target.value;
    renderGallery();
});

artSort?.addEventListener('change', (e) => {
    currentSort = e.target.value;
    renderGallery();
});

// Close modals on overlay click
[productModal, cartOverlay].forEach(overlay => {
    overlay?.addEventListener('click', (e) => {
        if (e.target === overlay) {
            closeProductModal();
            cartOverlay.classList.remove('active');
            if (overlay === cartOverlay) setTimeout(resetCheckout, 500);
        }
    });
});

filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        filterBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        currentFilter = btn.dataset.category;
        renderGallery();
    });
});

// Parallax effect for "About" image
document.addEventListener('mousemove', (e) => {
    const img = document.querySelector('.parallax-img');
    if (!img) return;
    const moveX = (e.clientX - window.innerWidth / 2) * 0.012;
    const moveY = (e.clientY - window.innerHeight / 2) * 0.012;
    img.style.transform = `scale(1.1) translate(${moveX}px, ${moveY}px)`;
});

// Hero Carousel Logic
let currentSlide = 0;
const carouselTrack = document.querySelector('.carousel-track');
const carouselDots = document.getElementById('carousel-dots');
const heroTitle = document.getElementById('hero-title');
const heroSubtitle = document.getElementById('hero-subtitle');

function initHeroCarousel() {
    if (!carouselTrack) return;
    
    // Use paintings for slides
    const carouselPaintings = paintings.slice(0, 3); // Take first 3 for carousel
    
    carouselTrack.innerHTML = carouselPaintings.map((p, i) => `
        <div class="carousel-slide ${i === 0 ? 'active' : ''}">
            <img src="${p.image}" alt="${p.title}">
        </div>
    `).join('');
    
    carouselDots.innerHTML = carouselPaintings.map((_, i) => `
        <div class="dot ${i === 0 ? 'active' : ''}" onclick="goToSlide(${i})"></div>
    `).join('');
    
    setInterval(nextSlide, 5000);
}

function nextSlide() {
    currentSlide = (currentSlide + 1) % 3;
    updateCarousel();
}

window.goToSlide = (index) => {
    currentSlide = index;
    updateCarousel();
};

function updateCarousel() {
    const slides = document.querySelectorAll('.carousel-slide');
    const dots = document.querySelectorAll('.dot');
    const carouselPaintings = paintings.slice(0, 3);
    const activePainting = carouselPaintings[currentSlide];

    carouselTrack.style.transform = `translateX(-${currentSlide * 100}%)`;
    
    slides.forEach((s, i) => s.classList.toggle('active', i === currentSlide));
    dots.forEach((d, i) => d.classList.toggle('active', i === currentSlide));
    
    // Update text content with fade effect
    heroTitle.style.opacity = '0';
    heroSubtitle.style.opacity = '0';
    
    setTimeout(() => {
        heroTitle.innerHTML = `Exquisite <span>${activePainting.title}</span>`;
        heroSubtitle.innerText = activePainting.description.substring(0, 100) + '...';
        heroTitle.style.opacity = '1';
        heroSubtitle.style.opacity = '1';
    }, 400);
}

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    initTheme();
    renderGallery();
    renderArtists();
    updateCartUI();
    observeScroll();
    initHeroCarousel();
});
