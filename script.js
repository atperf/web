// DOM Content Loaded
document.addEventListener('DOMContentLoaded', function() {
    // Initialize all functionality
    initMobileMenu();
    initSmoothScrolling();
    initScrollAnimations();
    initFormHandling();
    initTestToolButtons();
    initNavbarScroll();
});

// Mobile Menu Toggle
function initMobileMenu() {
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');

    if (hamburger && navMenu) {
        hamburger.addEventListener('click', function() {
            hamburger.classList.toggle('active');
            navMenu.classList.toggle('active');
        });

        // Close menu when clicking on nav links
        const menuLinks = document.querySelectorAll('.nav-link, .language-link');
        menuLinks.forEach(link => {
            link.addEventListener('click', function() {
                hamburger.classList.remove('active');
                navMenu.classList.remove('active');
            });
        });

        // Close menu when clicking outside
        document.addEventListener('click', function(e) {
            if (!hamburger.contains(e.target) && !navMenu.contains(e.target)) {
                hamburger.classList.remove('active');
                navMenu.classList.remove('active');
            }
        });
    }
}

// Smooth Scrolling for Navigation Links
function initSmoothScrolling() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const targetSelector = this.getAttribute('href');

            if (!targetSelector) {
                return;
            }

            if (targetSelector.trim() === '#') {
                e.preventDefault();
                return;
            }

            let target = null;
            try {
                target = document.querySelector(targetSelector);
            } catch (error) {
                console.warn('Invalid smooth scroll target selector:', targetSelector, error);
            }

            if (target) {
                e.preventDefault();
                const headerOffset = 80;
                const elementPosition = target.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
}

// Scroll Animations
function initScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('fade-in');
            }
        });
    }, observerOptions);

    // Observe elements for animation
    const animateElements = document.querySelectorAll('.service-card, .use-case-card, .section-header');
    animateElements.forEach(el => observer.observe(el));
}

// Active Navigation Link Update
function initNavbarScroll() {
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-link');

    function updateActiveNav() {
        const scrollPos = window.scrollY + 100;

        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            const sectionId = section.getAttribute('id');

            if (scrollPos >= sectionTop && scrollPos < sectionTop + sectionHeight) {
                navLinks.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === `#${sectionId}`) {
                        link.classList.add('active');
                    }
                });
            }
        });
    }

    window.addEventListener('scroll', updateActiveNav);
    updateActiveNav(); // Initial call
}

// Form Handling
function initFormHandling() {
    const contactForm = document.querySelector('.form');
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();

            // Get form data
            const formData = new FormData(this);
            const formObject = {};
            formData.forEach((value, key) => {
                formObject[key] = value;
            });

            console.log('Form submission data:', formObject);

            const locale = document.documentElement.lang || 'en';
            const formMessages = {
                en: {
                    sending: 'Sending...',
                    success: 'Message sent successfully!'
                },
                fr: {
                    sending: 'Envoi...',
                    success: 'Message envoyé avec succès !'
                }
            };

            const messages = formMessages[locale] || formMessages.en;

            // Show loading state
            const submitBtn = this.querySelector('button[type="submit"]');
            const originalText = submitBtn.textContent;
            submitBtn.textContent = messages.sending;
            submitBtn.disabled = true;

            // Simulate form submission (replace with actual API call)
            setTimeout(() => {
                showNotification(messages.success, 'success');
                this.reset();
                submitBtn.textContent = originalText;
                submitBtn.disabled = false;
            }, 2000);
        });
    }
}

// Test Tool Button Functionality
function initTestToolButtons() {
    const testButtons = document.querySelectorAll('.btn-test, .test-tool-link');

    testButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault();

            // Add click animation
            this.style.transform = 'scale(0.95)';
            setTimeout(() => {
                this.style.transform = '';
            }, 150);

            // Show modal or redirect to tool
            showTestToolModal();
        });
    });
}

// Test Tool Modal
function showTestToolModal() {
    // Create modal if it doesn't exist
    let modal = document.getElementById('testToolModal');
    if (!modal) {
        modal = createTestToolModal();
        document.body.appendChild(modal);
    }
    
    modal.style.display = 'flex';
    document.body.style.overflow = 'hidden';
    
    // Add animation
    setTimeout(() => {
        modal.classList.add('show');
    }, 10);
}

function createTestToolModal() {
    const modal = document.createElement('div');
    modal.id = 'testToolModal';
    modal.className = 'modal';
    modal.innerHTML = `
        <div class="modal-content">
            <div class="modal-header">
                <h2>Tester notre outil ATPERF</h2>
                <span class="modal-close">&times;</span>
            </div>
            <div class="modal-body">
                <p>Découvrez la puissance de notre plateforme de monitoring de performance !</p>
                <div class="demo-features">
                    <div class="feature-item">
                        <span class="feature-icon">📊</span>
                        <span>Monitoring en temps réel</span>
                    </div>
                    <div class="feature-item">
                        <span class="feature-icon">⚡</span>
                        <span>Optimisation automatique</span>
                    </div>
                    <div class="feature-item">
                        <span class="feature-icon">🔍</span>
                        <span>Analyses approfondies</span>
                    </div>
                </div>
                <div class="demo-form">
                    <input type="email" placeholder="Votre email professionnel" class="demo-input" required>
                    <input type="text" placeholder="Nom de votre entreprise" class="demo-input" required>
                    <button class="btn btn-primary btn-large demo-submit">Commencer l'essai gratuit</button>
                </div>
            </div>
        </div>
    `;

    // Add modal styles
    const modalStyles = document.createElement('style');
    modalStyles.textContent = `
        .modal {
            display: none;
            position: fixed;
            z-index: 10000;
            left: 0;
            top: 0;
            width: 100%;
            height: 100%;
            background-color: rgba(0, 0, 0, 0.8);
            justify-content: center;
            align-items: center;
            opacity: 0;
            transition: opacity 0.3s ease;
        }
        
        .modal.show {
            opacity: 1;
        }
        
        .modal-content {
            background: white;
            border-radius: 20px;
            max-width: 500px;
            width: 90%;
            max-height: 90vh;
            overflow-y: auto;
            transform: scale(0.7);
            transition: transform 0.3s ease;
        }
        
        .modal.show .modal-content {
            transform: scale(1);
        }
        
        .modal-header {
            padding: 2rem 2rem 1rem;
            display: flex;
            justify-content: space-between;
            align-items: center;
            border-bottom: 1px solid #eee;
        }
        
        .modal-header h2 {
            color: #1a1a1a;
            font-size: 1.5rem;
            margin: 0;
        }
        
        .modal-close {
            font-size: 2rem;
            cursor: pointer;
            color: #999;
            transition: color 0.3s ease;
        }
        
        .modal-close:hover {
            color: #FF6B35;
        }
        
        .modal-body {
            padding: 2rem;
        }
        
        .modal-body p {
            color: #666;
            margin-bottom: 2rem;
            font-size: 1.1rem;
        }
        
        .demo-features {
            margin-bottom: 2rem;
        }
        
        .feature-item {
            display: flex;
            align-items: center;
            gap: 1rem;
            margin-bottom: 1rem;
            padding: 0.5rem;
        }
        
        .feature-icon {
            font-size: 1.5rem;
        }
        
        .demo-form {
            display: flex;
            flex-direction: column;
            gap: 1rem;
        }
        
        .demo-input {
            padding: 1rem;
            border: 2px solid #eee;
            border-radius: 10px;
            font-size: 1rem;
            transition: border-color 0.3s ease;
        }
        
        .demo-input:focus {
            outline: none;
            border-color: #FF6B35;
        }
        
        .demo-submit {
            margin-top: 1rem;
        }
    `;
    document.head.appendChild(modalStyles);

    // Add event listeners
    const closeBtn = modal.querySelector('.modal-close');
    const demoSubmit = modal.querySelector('.demo-submit');
    
    closeBtn.addEventListener('click', closeModal);
    modal.addEventListener('click', function(e) {
        if (e.target === modal) {
            closeModal();
        }
    });
    
    demoSubmit.addEventListener('click', function(e) {
        e.preventDefault();
        const email = modal.querySelector('input[type="email"]').value;
        const company = modal.querySelector('input[type="text"]').value;
        
        if (email && company) {
            this.textContent = 'Préparation de votre démo...';
            this.disabled = true;
            
            setTimeout(() => {
                showNotification('Démo préparée ! Vous recevrez un email avec les instructions.', 'success');
                closeModal();
            }, 2000);
        } else {
            showNotification('Veuillez remplir tous les champs', 'error');
        }
    });

    function closeModal() {
        modal.classList.remove('show');
        setTimeout(() => {
            modal.style.display = 'none';
            document.body.style.overflow = '';
        }, 300);
    }

    return modal;
}

// Notification System
function showNotification(message, type = 'info') {
    // Remove existing notifications
    const existingNotifications = document.querySelectorAll('.notification');
    existingNotifications.forEach(notif => notif.remove());

    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.textContent = message;

    // Add notification styles if not already added
    if (!document.querySelector('#notification-styles')) {
        const notificationStyles = document.createElement('style');
        notificationStyles.id = 'notification-styles';
        notificationStyles.textContent = `
            .notification {
                position: fixed;
                top: 100px;
                right: 20px;
                padding: 1rem 1.5rem;
                border-radius: 10px;
                color: white;
                font-weight: 600;
                z-index: 10001;
                transform: translateX(400px);
                transition: transform 0.3s ease;
                max-width: 300px;
                box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
            }
            
            .notification-success {
                background: linear-gradient(135deg, #4CAF50, #45a049);
            }
            
            .notification-error {
                background: linear-gradient(135deg, #f44336, #da190b);
            }
            
            .notification-info {
                background: linear-gradient(135deg, #FF6B35, #e55a2b);
            }
            
            .notification.show {
                transform: translateX(0);
            }
        `;
        document.head.appendChild(notificationStyles);
    }

    document.body.appendChild(notification);

    // Show notification
    setTimeout(() => {
        notification.classList.add('show');
    }, 100);

    // Hide notification after 4 seconds
    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => {
            notification.remove();
        }, 300);
    }, 4000);
}

// Keyboard Navigation
document.addEventListener('keydown', function(e) {
    // Close modal with Escape key
    if (e.key === 'Escape') {
        const modal = document.getElementById('testToolModal');
        if (modal && modal.style.display === 'flex') {
            modal.classList.remove('show');
            setTimeout(() => {
                modal.style.display = 'none';
                document.body.style.overflow = '';
            }, 300);
        }
    }
});

// Performance optimization: Debounce scroll events
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Apply debounce to scroll events
const debouncedScrollHandler = debounce(function() {
    // Any scroll-based functionality can be added here
}, 10);

window.addEventListener('scroll', debouncedScrollHandler);

// Add loading animation to page
window.addEventListener('load', function() {
    document.body.classList.add('loaded');
    
    // Add loaded styles
    const loadedStyles = document.createElement('style');
    loadedStyles.textContent = `
        body {
            opacity: 0;
            transition: opacity 0.5s ease;
        }
        
        body.loaded {
            opacity: 1;
        }
    `;
    document.head.appendChild(loadedStyles);
});

// Console welcome message
console.log(`
🚀 ATPERF Website Loaded Successfully!
📊 Performance monitoring at your fingertips
⚡ Built with modern web technologies
🔍 Ready to optimize your systems

Visit: https://atperf.com
Contact: contact@atperf.com
`);