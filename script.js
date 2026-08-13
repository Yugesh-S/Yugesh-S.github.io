document.addEventListener('DOMContentLoaded', () => {
    // 0. Cinematic Intro Sequence
    const introOverlay = document.getElementById('intro-overlay');
    const introProgress = document.querySelector('.intro-progress');
    const introText = document.getElementById('intro-text');
    const navbar = document.querySelector('.navbar');
    const heroContent = document.querySelector('.hero-content');
    const pCanvas = document.getElementById('particle-canvas');

    if (introOverlay) {
        // Disable scroll during intro
        document.body.style.overflow = 'hidden';

        setTimeout(() => {
            introOverlay.style.display = 'none';
            
            // Trigger entry animations
            if (navbar) navbar.classList.add('nav-enter');
            if (heroContent) heroContent.classList.add('hero-enter');
            if (pCanvas) pCanvas.classList.add('canvas-enter');
            
            // Restore scroll
            document.body.style.overflow = 'auto';
            document.body.style.overflowX = 'hidden';
        }, 4500); // 4.5 seconds to let the flash and cinematic reveal happen
    }

    // 1. Custom Cursor Glow
    const cursorGlow = document.querySelector('.cursor-glow');
    
    document.addEventListener('mousemove', (e) => {
        cursorGlow.style.left = e.clientX + 'px';
        cursorGlow.style.top = e.clientY + 'px';
    });

    // Interactive hover states for cursor
    const interactiveElements = document.querySelectorAll('a, button, .glass-card');
    interactiveElements.forEach(el => {
        el.addEventListener('mouseenter', () => {
            cursorGlow.style.transform = 'translate(-50%, -50%) scale(1.5)';
            cursorGlow.style.background = 'radial-gradient(circle, rgba(0,229,255,0.15) 0%, rgba(0,0,0,0) 70%)';
        });
        el.addEventListener('mouseleave', () => {
            cursorGlow.style.transform = 'translate(-50%, -50%) scale(1)';
            cursorGlow.style.background = 'radial-gradient(circle, rgba(255,204,0,0.15) 0%, rgba(0,0,0,0) 70%)';
        });
    });

    // 2. Parallax Background Grid
    const bgGrid = document.querySelector('.bg-grid');
    window.addEventListener('scroll', () => {
        const scrolled = window.scrollY;
        bgGrid.style.transform = `translateY(${scrolled * 0.1}px) translateX(${scrolled * 0.05}px)`;
    });

    // 3. Scroll Circuit Path Drawing
    const circuitPath = document.getElementById('circuit-path');
    if (circuitPath) {
        const pathLength = circuitPath.getTotalLength();
        
        circuitPath.style.strokeDasharray = pathLength + ' ' + pathLength;
        circuitPath.style.strokeDashoffset = pathLength;
        circuitPath.getBoundingClientRect(); // Trigger reflow
        
        window.addEventListener('scroll', () => {
            const scrollPercentage = (document.documentElement.scrollTop + document.body.scrollTop) / (document.documentElement.scrollHeight - document.documentElement.clientHeight);
            
            // Draw path based on scroll %
            const drawLength = pathLength * scrollPercentage;
            
            // Start drawing from top
            circuitPath.style.strokeDashoffset = pathLength - drawLength;
        });
    }

    // 4. Reveal Animations on Scroll
    const reveals = document.querySelectorAll('.reveal');

    const revealOnScroll = () => {
        const windowHeight = window.innerHeight;
        const elementVisible = 100;

        reveals.forEach((reveal) => {
            const elementTop = reveal.getBoundingClientRect().top;
            if (elementTop < windowHeight - elementVisible) {
                reveal.classList.add('active');
            }
        });
    };
    
    // Initial check
    revealOnScroll();
    window.addEventListener('scroll', revealOnScroll);

    // 5. Update Active Nav Link
    const sections = document.querySelectorAll('section');
    const navLinks = document.querySelectorAll('.nav-link');

    window.addEventListener('scroll', () => {
        let current = '';
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            if (scrollY >= (sectionTop - sectionHeight / 3)) {
                current = section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href').includes(current)) {
                link.classList.add('active');
            }
        });
    });

    // 6. Typing effect for subtitle
    const subtitle = document.querySelector('.type-wrap');
    if (subtitle) {
        const textToType = subtitle.innerText;
        subtitle.innerText = '';
        
        let charIndex = 0;
        const typeInterval = setInterval(() => {
            if(charIndex < textToType.length) {
                subtitle.innerText += textToType.charAt(charIndex);
                charIndex++;
            } else {
                clearInterval(typeInterval);
            }
        }, 50);
    }

    // 7. 3D Tilt Effect on Cards
    const tiltCards = document.querySelectorAll('[data-tilt]');
    tiltCards.forEach(card => {
        card.addEventListener('mousemove', e => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            
            const rotateX = ((y - centerY) / centerY) * -10; // Max rotation 10deg
            const rotateY = ((x - centerX) / centerX) * 10;
            
            card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`;
            card.style.transition = 'none';
        });
        
        card.addEventListener('mouseleave', () => {
            card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)';
            card.style.transition = 'transform 0.5s ease';
        });
    });

    // 8. Particle Network Canvas (Neural/Electrical nodes)
    const canvas = document.getElementById('particle-canvas');
    if (canvas) {
        const ctx = canvas.getContext('2d');
        let width = canvas.width = window.innerWidth;
        let height = canvas.height = window.innerHeight;
        let particles = [];
        
        window.addEventListener('resize', () => {
            width = canvas.width = window.innerWidth;
            height = canvas.height = window.innerHeight;
            initParticles();
        });

        class Particle {
            constructor() {
                this.x = Math.random() * width;
                this.y = Math.random() * height;
                this.vx = (Math.random() - 0.5) * 1;
                this.vy = (Math.random() - 0.5) * 1;
                this.radius = Math.random() * 2 + 1;
            }
            update() {
                this.x += this.vx;
                this.y += this.vy;
                if (this.x < 0 || this.x > width) this.vx *= -1;
                if (this.y < 0 || this.y > height) this.vy *= -1;
            }
            draw() {
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
                ctx.fillStyle = 'rgba(255, 204, 0, 0.8)';
                ctx.fill();
            }
        }

        function initParticles() {
            particles = [];
            const count = Math.floor((width * height) / 15000); // Responsive particle count
            for (let i = 0; i < count; i++) {
                particles.push(new Particle());
            }
        }

        function animateParticles() {
            ctx.clearRect(0, 0, width, height);
            
            for (let i = 0; i < particles.length; i++) {
                particles[i].update();
                particles[i].draw();
                
                // Draw connections
                for (let j = i + 1; j < particles.length; j++) {
                    const dx = particles[i].x - particles[j].x;
                    const dy = particles[i].y - particles[j].y;
                    const dist = Math.sqrt(dx * dx + dy * dy);
                    
                    if (dist < 120) {
                        ctx.beginPath();
                        ctx.strokeStyle = `rgba(0, 229, 255, ${1 - dist/120})`;
                        ctx.lineWidth = 0.8;
                        
                        // Small electric jitter to the line
                        const midX = (particles[i].x + particles[j].x) / 2 + (Math.random() - 0.5) * 5;
                        const midY = (particles[i].y + particles[j].y) / 2 + (Math.random() - 0.5) * 5;

                        ctx.moveTo(particles[i].x, particles[i].y);
                        ctx.lineTo(midX, midY);
                        ctx.lineTo(particles[j].x, particles[j].y);
                        ctx.stroke();
                    }
                }
            }
            requestAnimationFrame(animateParticles);
        }

        initParticles();
        animateParticles();
    }

    // 9. Contact button copy to clipboard
    const contactBtn = document.getElementById('contact-btn');
    if (contactBtn) {
        contactBtn.addEventListener('click', () => {
            const email = contactBtn.getAttribute('data-email');
            navigator.clipboard.writeText(email).then(() => {
                const originalText = contactBtn.innerText;
                contactBtn.innerText = 'Email Copied!';
                contactBtn.style.color = 'var(--accent-green)';
                contactBtn.style.borderColor = 'var(--accent-green)';
                setTimeout(() => {
                    contactBtn.innerText = originalText;
                    contactBtn.style.color = '';
                    contactBtn.style.borderColor = '';
                }, 2500);
            }).catch(err => {
                console.error('Failed to copy email: ', err);
                contactBtn.innerText = email;
            });
        });
    }

    // 10. Hacker Text Scramble Effect
    const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@#$%&*";
    const scrambleElements = document.querySelectorAll('.nav-link');
    
    scrambleElements.forEach(elem => {
        elem.dataset.original = elem.innerText;
        elem.addEventListener('mouseover', event => {
            let iterations = 0;
            const originalText = event.target.dataset.original;
            clearInterval(elem.scrambleInterval);
            
            elem.scrambleInterval = setInterval(() => {
                event.target.innerText = originalText.split("").map((letter, index) => {
                    if(index < iterations) {
                        return originalText[index];
                    }
                    return letters[Math.floor(Math.random() * letters.length)];
                }).join("");
                
                if(iterations >= originalText.length) {
                    clearInterval(elem.scrambleInterval);
                }
                
                iterations += 1 / 3;
            }, 30);
        });
    });

    // 11. Magnetic Buttons
    const magneticElements = document.querySelectorAll('.btn-primary, .icon-link, .repo-link');
    magneticElements.forEach(elem => {
        elem.addEventListener('mousemove', (e) => {
            const rect = elem.getBoundingClientRect();
            const x = e.clientX - rect.left - rect.width / 2;
            const y = e.clientY - rect.top - rect.height / 2;
            
            // Move element towards mouse gently
            elem.style.transform = `translate(${x * 0.3}px, ${y * 0.3}px)`;
        });
        
        elem.addEventListener('mouseleave', () => {
            elem.style.transform = `translate(0px, 0px)`;
        });
    });

    // 12. Electrical Spark Mouse Trail
    let lastSparkTime = 0;
    document.addEventListener('mousemove', (e) => {
        const now = Date.now();
        // Create sparks every 30ms to prevent flooding the DOM
        if (now - lastSparkTime > 30) {
            lastSparkTime = now;
            const spark = document.createElement('div');
            spark.className = 'mouse-spark';
            spark.style.left = e.clientX + 'px';
            spark.style.top = e.clientY + 'px';
            
            // Randomize drift direction
            spark.style.setProperty('--rx', (Math.random() - 0.5) * 2);
            spark.style.setProperty('--ry', (Math.random() - 0.5) * 2);
            
            // Randomize color between yellow and blue
            if(Math.random() > 0.5) {
                spark.style.background = 'var(--accent-green)';
                spark.style.boxShadow = '0 0 10px var(--accent-green)';
            }
            
            document.body.appendChild(spark);
            
            setTimeout(() => {
                if(spark.parentNode) spark.parentNode.removeChild(spark);
            }, 600);
        }
    });

    // 13. Quantum Space Entering Transition (Spray of Lines)
    const enterBtns = document.querySelectorAll('#projects-nav-link, .enter-world-btn');
    const scrollContainer = document.getElementById('scroll-container');
    const transitionCanvas = document.getElementById('transition-canvas');
    let quantumAnimationFrameId; 
    const returnLink = document.getElementById('return-btn');

    enterBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            const targetUrl = btn.getAttribute('href');
            
            if (transitionCanvas && scrollContainer) {
                // Fade out main content and navbar
                scrollContainer.classList.add('fade-out');
                const navbar = document.querySelector('.navbar');
                if (navbar) {
                    navbar.style.animation = 'none'; // Overrides the dropDown animation that forces opacity to 1!
                    // Force reflow so transition applies
                    void navbar.offsetWidth;
                    navbar.style.transition = 'opacity 0.5s ease';
                    navbar.style.opacity = '0';
                    navbar.style.pointerEvents = 'none';
                }
                
                transitionCanvas.style.opacity = '1';
                
                // Run the quantum spray effect
                const ctx = transitionCanvas.getContext('2d');
                let width = transitionCanvas.width = window.innerWidth;
                let height = transitionCanvas.height = window.innerHeight;
                let stars = [];
                for(let i=0; i<600; i++) {
                    stars.push({
                        x: (Math.random() - 0.5) * width,
                        y: (Math.random() - 0.5) * height,
                        z: Math.random() * width,
                        pz: 0 
                    });
                }
                stars.forEach(s => s.pz = s.z);

                let speed = 0; // Starts slow, accelerates rapidly
                let maxSpeed = 150; // Cap during transition
                
                function drawSpray() {
                    ctx.clearRect(0, 0, width, height);
                    
                    if (speed < maxSpeed) {
                        speed += 1.5; // Accelerate up to max
                    }

                    
                    stars.forEach(star => {
                        star.z -= speed;
                        if(star.z < 1) {
                            star.z = width;
                            star.x = (Math.random() - 0.5) * width;
                            star.y = (Math.random() - 0.5) * height;
                            star.pz = star.z;
                        }
                        
                        const sx = (star.x / star.z) * width + width / 2;
                        const sy = (star.y / star.z) * height + height / 2;
                        const r = (1 - star.z / width) * 4;
                        
                        const px = (star.x / star.pz) * width + width / 2;
                        const py = (star.y / star.pz) * height + height / 2;
                        star.pz = star.z;

                        ctx.beginPath();
                        ctx.moveTo(px, py);
                        ctx.lineTo(sx, sy);
                        // Quantum spray colors
                        ctx.strokeStyle = Math.random() > 0.8 ? `rgba(255, 204, 0, ${1 - star.z/width})` : `rgba(0, 229, 255, ${1 - star.z/width})`;
                        ctx.lineWidth = r;
                        ctx.stroke();
                    });
                    
                    quantumAnimationFrameId = requestAnimationFrame(drawSpray);
                }
                drawSpray();
                
                // Show the Projects World SPA overlay without redirecting!
                setTimeout(() => { 
                    const projectsWorld = document.getElementById('projects-world');
                    if(projectsWorld) {
                        projectsWorld.style.display = 'block';
                        // Force reflow
                        void projectsWorld.offsetWidth;
                        projectsWorld.style.opacity = '1';
                        
                        // Limit speed so it doesn't get infinitely fast, but keeps running
                        maxSpeed = 40;
                        speed = 40; 
                    }
                }, 1300);
            }
        });
    });

    if (returnLink) {
        returnLink.addEventListener('click', (e) => {
            e.preventDefault();
            const projectsWorld = document.getElementById('projects-world');
            if(projectsWorld) {
                projectsWorld.style.opacity = '0';
                transitionCanvas.style.opacity = '0';
                
                setTimeout(() => {
                    projectsWorld.style.display = 'none';
                    scrollContainer.classList.remove('fade-out');
                    
                    const navbar = document.querySelector('.navbar');
                    if (navbar) {
                        navbar.style.opacity = '1';
                        navbar.style.pointerEvents = 'auto';
                    }
                    
                    cancelAnimationFrame(quantumAnimationFrameId);
                    const ctx = transitionCanvas.getContext('2d');
                    ctx.clearRect(0, 0, transitionCanvas.width, transitionCanvas.height);
                }, 1000);
            }
        });
    }

    // 14. Carousel Intersections for New World
    const carouselItems = document.querySelectorAll('.carousel-item');
    if (carouselItems.length > 0) {
        const carouselObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if(entry.isIntersecting) {
                    entry.target.classList.add('in-view');
                } else {
                    entry.target.classList.remove('in-view');
                }
            });
        }, {
            root: document.getElementById('projects-carousel'),
            threshold: 0.6
        });
        
        carouselItems.forEach(item => carouselObserver.observe(item));
    }

    // 15. Map vertical mouse wheel to horizontal scrolling in Projects World
    const carouselContainer = document.getElementById('projects-carousel');
    if (carouselContainer) {
        let isScrolling = false;
        carouselContainer.addEventListener('wheel', (e) => {
            if (e.deltaY !== 0) {
                e.preventDefault();
                if (isScrolling) return; // Prevent multiple fires
                isScrolling = true;
                
                if (e.deltaY > 0) {
                    carouselContainer.scrollBy({ left: window.innerWidth, behavior: 'smooth' });
                } else {
                    carouselContainer.scrollBy({ left: -window.innerWidth, behavior: 'smooth' });
                }
                
                // Unlock scrolling after the snap finishes
                setTimeout(() => {
                    isScrolling = false;
                }, 600);
            }
        }, { passive: false });
    }

});
