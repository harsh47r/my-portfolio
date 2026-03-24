// Preloader & Initialize libraries
window.addEventListener('load', () => {
    // Hide Preloader
    const preloader = document.getElementById('preloader');
    if (preloader) {
        preloader.style.opacity = '0';
        preloader.style.visibility = 'hidden';
        setTimeout(() => {
            preloader.remove();
        }, 600);
    }
    
    // Initialize AOS
    if (typeof AOS !== 'undefined') {
        AOS.init({
            once: true, // whether animation should happen only once - while scrolling down
            offset: 50, // offset (in px) from the original trigger point
            duration: 800, // values from 0 to 3000, with step 50ms
            easing: 'ease-out-cubic', // default easing for AOS animations
        });
    }
});

// Initialize Lucide Icons
lucide.createIcons();

// Custom Cursor
const cursorDot = document.querySelector('.cursor-dot');
const cursorOutline = document.querySelector('.cursor-outline');

window.addEventListener('mousemove', (e) => {
    const posX = e.clientX;
    const posY = e.clientY;

    if(cursorDot) {
        cursorDot.style.left = `${posX}px`;
        cursorDot.style.top = `${posY}px`;
    }

    if(cursorOutline) {
        // Slight delay for outline
        cursorOutline.style.left = `${posX}px`;
        cursorOutline.style.top = `${posY}px`;
    }
});

// Cursor Hover Effects
document.querySelectorAll('a, button, input, textarea, .hover-lift, .icon-link').forEach(el => {
    el.addEventListener('mouseenter', () => {
        if(cursorOutline) {
            cursorOutline.style.transform = 'translate(-50%, -50%) scale(1.5)';
            cursorOutline.style.backgroundColor = 'rgba(168, 85, 247, 0.1)';
        }
    });
    el.addEventListener('mouseleave', () => {
        if(cursorOutline) {
            cursorOutline.style.transform = 'translate(-50%, -50%) scale(1)';
            cursorOutline.style.backgroundColor = 'transparent';
        }
    });
});

// Theme Toggle
const themeToggle = document.getElementById('theme-toggle');
const htmlTag = document.documentElement;

themeToggle.addEventListener('click', () => {
    const currentTheme = htmlTag.getAttribute('data-theme');
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    htmlTag.setAttribute('data-theme', newTheme);
    // Re-initialize particles to match theme colors better if desired
    initParticles(newTheme);
});

// Scroll Progress Bar
window.addEventListener('scroll', () => {
    const scrollProgress = document.getElementById('scroll-progress');
    const scrollableH = document.documentElement.scrollHeight - window.innerHeight;
    const scrolled = window.scrollY;
    
    if(scrollableH > 0 && scrollProgress) {
        const progress = Math.min((scrolled / scrollableH) * 100, 100);
        scrollProgress.style.width = `${progress}%`;
    }
});

// Typing Animation
const typedTextSpan = document.getElementById('typed-text');
const textsToType = [
    "Software Developer", 
    "UI/UX Enthusiast", 
    "Problem Solver", 
    "Creative Coder"
];
let textIndex = 0;
let charIndex = 0;
let isDeleting = false;

function typeAnimation() {
    const currentText = textsToType[textIndex];
    let typeSpeed = isDeleting ? 50 : 100;

    if (!isDeleting && charIndex <= currentText.length) {
        typedTextSpan.textContent = currentText.substring(0, charIndex);
        charIndex++;
    } else if (isDeleting && charIndex > 0) {
        typedTextSpan.textContent = currentText.substring(0, charIndex - 1);
        charIndex--;
    } else {
        isDeleting = !isDeleting;
        if (!isDeleting) {
            textIndex = (textIndex + 1) % textsToType.length;
        }
        typeSpeed = isDeleting ? 2000 : 500; // Pause at end/start
    }
    
    setTimeout(typeAnimation, typeSpeed);
}

// Start Typing Animation
if(typedTextSpan) {
    setTimeout(typeAnimation, 1000);
}

// Year in Footer
const yearSpan = document.getElementById('year');
if(yearSpan) {
    yearSpan.textContent = new Date().getFullYear();
}

// Smooth Scrolling for Nav Links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        e.preventDefault();
        const targetId = this.getAttribute('href');
        if(targetId === '#') return;
        
        const targetElement = document.querySelector(targetId);
        if(targetElement) {
            targetElement.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
            // Update active state
            document.querySelectorAll('.nav-links a').forEach(a => a.classList.remove('active'));
            if(this.classList.contains('nav-link')) {
                this.classList.add('active');
            }
        }
    });
});

// Intersection Observer for Animations (Fade in, Progress bars, Counters)
const observerOptions = {
    threshold: 0.1,
    rootMargin: "0px 0px -50px 0px"
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            
            // Trigger Progress Bars
            if (entry.target.id === 'skills') {
                const progressBars = entry.target.querySelectorAll('.progress');
                progressBars.forEach(bar => {
                    const width = bar.getAttribute('data-width');
                    bar.style.width = width;
                });
            }
            
            // Trigger Counters
            if (entry.target.id === 'about' && !entry.target.dataset.counted) {
                entry.target.dataset.counted = "true";
                const counters = entry.target.querySelectorAll('.counter');
                counters.forEach(counter => {
                    const target = +counter.getAttribute('data-target');
                    const duration = 2000; // ms
                    const increment = target / (duration / 16); // 60fps
                    let current = 0;
                    
                    const updateCounter = () => {
                        current += increment;
                        if(current < target) {
                            counter.innerText = Math.ceil(current);
                            requestAnimationFrame(updateCounter);
                        } else {
                            counter.innerText = target + (target > 50 ? '+' : '');
                        }
                    };
                    updateCounter();
                });
            }
            // Stop observing once animated if we only want it once
            // observer.unobserve(entry.target);
        }
    });
}, observerOptions);

document.querySelectorAll('.skills, .about').forEach(section => {
    observer.observe(section);
});

// Form Submission Prevention (Demo only)
const contactForm = document.getElementById('contact-form');
if(contactForm) {
    contactForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const btn = contactForm.querySelector('button');
        const originalText = btn.innerHTML;
        btn.innerHTML = '<span>Sent Successfully!</span> <i data-lucide="check"></i>';
        lucide.createIcons();
        btn.style.background = '#10b981';
        
        setTimeout(() => {
            contactForm.reset();
            btn.innerHTML = originalText;
            btn.style.background = '';
            lucide.createIcons();
        }, 3000);
    });
}

// Particle Canvas Background
function initParticles(theme) {
    const canvas = document.getElementById('particle-canvas');
    if(!canvas) return;
    const ctx = canvas.getContext('2d');
    
    let particles = [];
    const particleCount = 60;
    
    // Resize
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    
    window.addEventListener('resize', () => {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        createParticles();
    });

    // Particle object
    class Particle {
        constructor() {
            this.x = Math.random() * canvas.width;
            this.y = Math.random() * canvas.height;
            this.size = Math.random() * 2 + 0.5;
            this.speedX = Math.random() * 1 - 0.5;
            this.speedY = Math.random() * 1 - 0.5;
            
            // Colors based on theme
            const isLight = theme === 'light';
            const colors = isLight 
                ? ['rgba(99, 102, 241, 0.2)', 'rgba(168, 85, 247, 0.2)']
                : ['rgba(99, 102, 241, 0.4)', 'rgba(168, 85, 247, 0.4)', 'rgba(255, 255, 255, 0.1)'];
            this.color = colors[Math.floor(Math.random() * colors.length)];
        }
        
        update() {
            this.x += this.speedX;
            this.y += this.speedY;
            
            // Bounce on edges
            if (this.x > canvas.width || this.x < 0) this.speedX *= -1;
            if (this.y > canvas.height || this.y < 0) this.speedY *= -1;
        }
        
        draw() {
            ctx.fillStyle = this.color;
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.fill();
        }
    }

    function createParticles() {
        particles = [];
        for (let i = 0; i < particleCount; i++) {
            particles.push(new Particle());
        }
    }

    function animateParticles() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        for (let i = 0; i < particles.length; i++) {
            particles[i].update();
            particles[i].draw();
            
            // Optional: Draw lines between nearby particles
            for (let j = i; j < particles.length; j++) {
                const dx = particles[i].x - particles[j].x;
                const dy = particles[i].y - particles[j].y;
                const distance = Math.sqrt(dx * dx + dy * dy);
                
                if (distance < 120) {
                    ctx.beginPath();
                    const isLight = theme === 'light';
                    ctx.strokeStyle = isLight 
                        ? `rgba(99, 102, 241, ${0.1 - distance/1200})` 
                        : `rgba(168, 85, 247, ${0.15 - distance/800})`;
                    ctx.lineWidth = 0.5;
                    ctx.moveTo(particles[i].x, particles[i].y);
                    ctx.lineTo(particles[j].x, particles[j].y);
                    ctx.stroke();
                }
            }
        }
        requestAnimationFrame(animateParticles);
    }
    
    // Initialize
    createParticles();
    animateParticles();
}

// Start particles on load
initParticles(typeof htmlTag !== 'undefined' ? htmlTag.getAttribute('data-theme') : 'dark');

// Email Link Handler (Web vs Mobile)
const emailLink = document.getElementById('email-link');
if (emailLink) {
    emailLink.addEventListener('click', function(e) {
        e.preventDefault();
        const email = "harshranjan5824@gmail.com";
        const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
        
        if (isMobile) {
            // Opens default mail app on mobile
            window.location.href = `mailto:${email}`;
        } else {
            // Opens Gmail compose in web on desktop
            window.open(`https://mail.google.com/mail/?view=cm&fs=1&to=${email}`, '_blank');
        }
    });
}
