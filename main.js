// main.js
        // Mobile Menu Functionality
        const mobileMenu = document.getElementById('mobileMenu');
        const mobileNav = document.getElementById('mobileNav');
        const closeMenu = document.getElementById('closeMenu');
        const overlay = document.getElementById('overlay');

        mobileMenu.addEventListener('click', () => {
            mobileNav.classList.add('active');
            overlay.classList.add('active');
            document.body.style.overflow = 'hidden';
        });

        closeMenu.addEventListener('click', () => {
            mobileNav.classList.remove('active');
            overlay.classList.remove('active');
            document.body.style.overflow = 'auto';
        });

        overlay.addEventListener('click', () => {
            mobileNav.classList.remove('active');
            overlay.classList.remove('active');
            document.body.style.overflow = 'auto';
        });

        // Header scroll effect
        window.addEventListener('scroll', () => {
            const header = document.getElementById('header');
            if (window.scrollY > 50) {
                header.classList.add('scrolled');
            } else {
                header.classList.remove('scrolled');
            }
        });

        // Testimonials carousel
        const testimonialsContainer = document.getElementById('testimonialsContainer');
        const dots = document.querySelectorAll('.carousel-dot');
        let currentSlide = 0;
        
        function showSlide(index) {
            testimonialsContainer.style.transform = `translateX(-${index * 100}%)`;
            
            // Update dots
            dots.forEach(dot => dot.classList.remove('active'));
            dots[index].classList.add('active');
            
            currentSlide = index;
        }
        
        // Add click events to dots
        dots.forEach(dot => {
            dot.addEventListener('click', () => {
                const index = parseInt(dot.getAttribute('data-index'));
                showSlide(index);
            });
        });
        
        // Auto-advance carousel
        setInterval(() => {
            currentSlide = (currentSlide + 1) % dots.length;
            showSlide(currentSlide);
        }, 6000);
        
        // Product filtering
        const filterButtons = document.querySelectorAll('.filter-btn');
        const productCards = document.querySelectorAll('.product-card');
        
        filterButtons.forEach(button => {
            button.addEventListener('click', () => {
                // Update active button
                filterButtons.forEach(btn => btn.classList.remove('active'));
                button.classList.add('active');
                
                const filter = button.getAttribute('data-filter');
                
                // Show/hide products based on filter
                productCards.forEach(card => {
                    if (filter === 'all' || card.getAttribute('data-category') === filter) {
                        card.style.display = 'block';
                    } else {
                        card.style.display = 'none';
                    }
                });
            });
        });
        
        // Simple cart functionality
        const cartIcon = document.getElementById('cartIcon');
        const cartCount = document.querySelector('.cart-count');
        let cartItems = 0;
        
        document.querySelectorAll('.add-to-cart').forEach(button => {
            button.addEventListener('click', (e) => {
                cartItems++;
                cartCount.textContent = cartItems;
                
                // Show confirmation
                const originalText = e.target.textContent;
                e.target.textContent = 'Added!';
                e.target.style.background = 'linear-gradient(135deg, #10b981, #34d399)';
                
                setTimeout(() => {
                    e.target.textContent = originalText;
                    e.target.style.background = 'linear-gradient(135deg, var(--primary), var(--primary-light))';
                }, 2000);
            });
        });
        
        // Scroll animations
        function checkVisibility() {
            const elements = document.querySelectorAll('.service-card, .product-card, .quality-item, .testimonial');
            
            elements.forEach(element => {
                const elementTop = element.getBoundingClientRect().top;
                const elementVisible = 150;
                
                if (elementTop < window.innerHeight - elementVisible) {
                    element.classList.add('visible');
                }
            });
        }
        
        window.addEventListener('scroll', checkVisibility);
        // Initial check
        checkVisibility();
        
        // Smooth scrolling for navigation links
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function (e) {
                e.preventDefault();
                
                const targetId = this.getAttribute('href');
                if (targetId === '#') return;
                
                const targetElement = document.querySelector(targetId);
                if (targetElement) {
                    // Close mobile menu if open
                    mobileNav.classList.remove('active');
                    overlay.classList.remove('active');
                    document.body.style.overflow = 'auto';
                    
                    window.scrollTo({
                        top: targetElement.offsetTop - 100,
                        behavior: 'smooth'
                    });
                }
            });
        });

// Testimonials Carousel Functionality
class TestimonialsCarousel {
    constructor() {
        this.container = document.getElementById('testimonialsContainer');
        this.dotsContainer = document.getElementById('testimonialDots');
        this.prevBtn = document.getElementById('testimonialPrev');
        this.nextBtn = document.getElementById('testimonialNext');
        this.slides = document.querySelectorAll('.testimonial-slide');
        this.currentSlide = 0;
        this.isDragging = false;
        this.startPos = 0;
        this.currentTranslate = 0;
        this.prevTranslate = 0;
        this.animationID = null;
        
        this.init();
    }
    
    init() {
        this.createDots();
        this.updateCarousel();
        this.addEventListeners();
        this.startAutoPlay();
    }
    
    createDots() {
        this.dotsContainer.innerHTML = '';
        this.slides.forEach((_, index) => {
            const dot = document.createElement('button');
            dot.className = `testimonial-dot ${index === 0 ? 'active' : ''}`;
            dot.setAttribute('aria-label', `Go to testimonial ${index + 1}`);
            dot.addEventListener('click', () => this.goToSlide(index));
            this.dotsContainer.appendChild(dot);
        });
    }
    
    updateCarousel() {
        this.container.style.transform = `translateX(-${this.currentSlide * 100}%)`;
        
        // Update dots
        document.querySelectorAll('.testimonial-dot').forEach((dot, index) => {
            dot.classList.toggle('active', index === this.currentSlide);
        });
    }
    
    nextSlide() {
        this.currentSlide = (this.currentSlide + 1) % this.slides.length;
        this.updateCarousel();
    }
    
    prevSlide() {
        this.currentSlide = (this.currentSlide - 1 + this.slides.length) % this.slides.length;
        this.updateCarousel();
    }
    
    goToSlide(index) {
        this.currentSlide = index;
        this.updateCarousel();
        this.resetAutoPlay();
    }
    
    addEventListeners() {
        // Button events
        this.prevBtn.addEventListener('click', () => {
            this.prevSlide();
            this.resetAutoPlay();
        });
        
        this.nextBtn.addEventListener('click', () => {
            this.nextSlide();
            this.resetAutoPlay();
        });
        
        // Touch events for mobile
        this.container.addEventListener('touchstart', this.touchStart.bind(this));
        this.container.addEventListener('touchmove', this.touchMove.bind(this));
        this.container.addEventListener('touchend', this.touchEnd.bind(this));
        
        // Mouse events for desktop dragging
        this.container.addEventListener('mousedown', this.touchStart.bind(this));
        this.container.addEventListener('mousemove', this.touchMove.bind(this));
        this.container.addEventListener('mouseup', this.touchEnd.bind(this));
        this.container.addEventListener('mouseleave', this.touchEnd.bind(this));
        
        // Keyboard navigation
        document.addEventListener('keydown', (e) => {
            if (e.key === 'ArrowLeft') this.prevSlide();
            if (e.key === 'ArrowRight') this.nextSlide();
        });
    }
    
    touchStart(event) {
        if (event.type === 'mousedown') event.preventDefault();
        
        this.isDragging = true;
        this.startPos = this.getPositionX(event);
        this.animationID = requestAnimationFrame(this.animation.bind(this));
        this.container.style.cursor = 'grabbing';
        this.container.style.transition = 'none';
    }
    
    touchMove(event) {
        if (!this.isDragging) return;
        
        const currentPosition = this.getPositionX(event);
        this.currentTranslate = this.prevTranslate + currentPosition - this.startPos;
    }
    
    touchEnd() {
        if (!this.isDragging) return;
        
        this.isDragging = false;
        cancelAnimationFrame(this.animationID);
        this.container.style.cursor = 'grab';
        this.container.style.transition = 'transform 0.5s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
        
        const movedBy = this.currentTranslate - this.prevTranslate;
        
        if (movedBy < -100 && this.currentSlide < this.slides.length - 1) {
            this.nextSlide();
        } else if (movedBy > 100 && this.currentSlide > 0) {
            this.prevSlide();
        }
        
        this.resetAutoPlay();
        this.updateCarousel();
    }
    
    getPositionX(event) {
        return event.type.includes('mouse') ? event.pageX : event.touches[0].clientX;
    }
    
    animation() {
        this.container.style.transform = `translateX(calc(-${this.currentSlide * 100}% + ${this.currentTranslate}px))`;
        if (this.isDragging) requestAnimationFrame(this.animation.bind(this));
    }
    
    startAutoPlay() {
        this.autoPlayInterval = setInterval(() => {
            this.nextSlide();
        }, 6000); // Change slide every 6 seconds
    }
    
    resetAutoPlay() {
        clearInterval(this.autoPlayInterval);
        this.startAutoPlay();
    }
}

// Initialize carousel when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new TestimonialsCarousel();
});
