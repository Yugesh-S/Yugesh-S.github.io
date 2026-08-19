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
    const bgGrid = document.querySelector('.pcb-grid');
    if (bgGrid) {
        window.addEventListener('scroll', () => {
            const scrolled = window.scrollY;
            bgGrid.style.transform = `translateY(${scrolled * 0.1}px) translateX(${scrolled * 0.05}px)`;
        });
    }

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
        const textToType = subtitle.textContent;
        subtitle.textContent = '';
        
        let charIndex = 0;
        const typeInterval = setInterval(() => {
            if(charIndex < textToType.length) {
                subtitle.textContent += textToType.charAt(charIndex);
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

    // ================================================
    // ENHANCEMENT 1: INTERACTIVE HACKER TERMINAL
    // ================================================
    const terminalInput = document.getElementById('terminal-input');
    const terminalOutput = document.getElementById('terminal-output');

    if (terminalInput && terminalOutput) {
        const commands = {
            help: () => {
                return `<span class="highlight">Available commands:</span>
  about      — Who is Yugesh?
  skills     — Technical competencies
  projects   — Engineering projects
  experience — Work history
  education  — Academic background
  contact    — Get in touch
  resume     — Download resume
  whoami     — About you
  clear      — Clear terminal
  sudo hire yugesh — 😏`;
            },
            about: () => {
                return `<span class="highlight">⚡ YUGESH S</span>
Electrical and Electronics Engineer
Specializing in circuit design, power electronics,
control systems, and automated hardware.
📍 Coimbatore, India | 🎓 B.E EEE (CGPA: 8.90)
🏆 Department Rank 1 Holder (Sem 1-6)`;
            },
            skills: () => {
                return `<span class="highlight">⚙️ Hardware:</span> Circuit Design, Power Electronics, Control Systems, MCU, HAL, Sensor Fusion
<span class="highlight">💻 Programming:</span> C, Embedded C, Java, MATLAB
<span class="highlight">🔌 Protocols:</span> IoT, I2C, SPI, UART, PWM, ADC
<span class="highlight">🛠️ Tools:</span> Arduino IDE, VS Code, JTAG, Logic Analyzers`;
            },
            projects: () => {
                return `<span class="highlight">📂 Engineering Projects (6):</span>
  [1] Smart Temperature & Gas Detection System (2026)
  [2] Smart Stick & Glasses for Visually Impaired (2025)
  [3] Environment-Responsive Street Lighting (2025)
  [4] Autonomous Fire Fighting Bot (2024)
  [5] Line-Following Bot (2024)
  [6] Smart Irrigation System (2024)

Type <span class="highlight">project [number]</span> for details.`;
            },
            experience: () => {
                return `<span class="highlight">💼 Embedded Systems Dev Intern</span>
VVDN Technologies | Pollachi, India
Sept 2024 – Oct 2024
• Managed 3 commercial product prototypes
• Developed HAL for 5 peripherals
• Engineered I2C, SPI, UART drivers
• Reduced testing time by 30% via JTAG debugging`;
            },
            education: () => {
                return `<span class="highlight">🎓 V S B College of Engineering</span>
B.E in Electrical and Electronics Engineering
Expected 2027 | CGPA: 8.90

<span class="highlight">📜 Certifications:</span>
• NPTEL Elite+Silver: IoT, Industrial IoT, Soft Skills
• Infosys Springboard: Python Basics`;
            },
            contact: () => {
                const email = 'sivayugesh90@gmail.com';
                navigator.clipboard.writeText(email).catch(() => {});
                return `<span class="highlight">📧 Email:</span> sivayugesh90@gmail.com (copied!)
<span class="highlight">🔗 LinkedIn:</span> linkedin.com/in/yugesh-s-5b5b79280
<span class="highlight">🐙 GitHub:</span> github.com/Yugesh-S`;
            },
            resume: () => {
                // Trigger the resume download button animation
                const resumeBtn = document.getElementById('resume-btn');
                if (resumeBtn) resumeBtn.click();
                return `<span class="highlight">📄 Compiling schematics...</span> Check the download button above!`;
            },
            whoami: () => {
                return `You are a <span class="highlight">visitor</span> exploring Yugesh's portfolio.
Session started: ${new Date().toLocaleTimeString()}
User-Agent: ${navigator.userAgent.split(' ').slice(-1)[0]}`;
            },
            clear: () => {
                terminalOutput.innerHTML = '';
                return null;
            },
            'sudo hire yugesh': () => {
                return `<span class="highlight">⚡ ACCESS GRANTED ⚡</span>
Excellent decision! Yugesh is available for:
• Full-time positions
• Internships
• Project collaborations
📧 Contact: sivayugesh90@gmail.com`;
            }
        };

        // Project details sub-commands
        const projectDetails = {
            1: `<span class="highlight">Smart Temperature & Gas Detection System (2026)</span>
Arduino UNO | DHT11 | MQ Sensor | I2C LCD
Real-time monitoring with automated LED/buzzer alerts.
🔗 github.com/Yugesh-S/Smart-Temperature-Gas-Detection-System`,
            2: `<span class="highlight">Smart Stick & Glasses for Visually Impaired (Oct 2025)</span>
ATmega328P | IoT | PWM | HC-SR04
Low-latency assistive mobility with 4 ultrasonic sensors.
🔗 github.com/Yugesh-S/Smart-Glasses-and-Stick-for-the-Visually-Impaired`,
            3: `<span class="highlight">Automated Street Lighting (Mar 2025)</span>
ADC | Relays | LDR | Power Mgmt
35% reduction in grid power consumption.
🔗 github.com/Yugesh-S/LDR-based-Street-light`,
            4: `<span class="highlight">Autonomous Fire Fighting Bot (Nov 2024)</span>
Sensor Fusion | IR | L298N | Robotics
95% navigation success rate with 5-second detection.
🔗 github.com/Yugesh-S/Fire-Fighting-Bot`,
            5: `<span class="highlight">Line-Following Bot (2024)</span>
IR Sensors | L298N | Robotics | Control Logic
IR sensor array with differential drive steering.
🔗 github.com/Yugesh-S/Line-Following-Bot`,
            6: `<span class="highlight">Smart Irrigation System (2024)</span>
IoT | Soil Moisture | Relays | Automation
Threshold-based automated water pump control.
🔗 github.com/Yugesh-S/Smart-Irrigation-System`
        };

        function typeResponse(html, container) {
            const div = document.createElement('div');
            div.className = 'term-line';
            div.innerHTML = `<span class="term-response">${html}</span>`;
            container.appendChild(div);
            container.scrollTop = container.scrollHeight;
        }

        function addCommandLine(cmd) {
            const div = document.createElement('div');
            div.className = 'term-line';
            div.innerHTML = `<span class="term-prompt">❯</span> <span class="term-command">${cmd}</span>`;
            terminalOutput.appendChild(div);
        }

        terminalInput.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') {
                const cmd = terminalInput.value.trim().toLowerCase();
                if (!cmd) return;

                addCommandLine(terminalInput.value.trim());
                terminalInput.value = '';

                // Check for project detail command
                const projectMatch = cmd.match(/^project\s+(\d)$/);
                if (projectMatch && projectDetails[projectMatch[1]]) {
                    typeResponse(projectDetails[projectMatch[1]], terminalOutput);
                } else if (commands[cmd]) {
                    const response = commands[cmd]();
                    if (response !== null) {
                        typeResponse(response, terminalOutput);
                    }
                } else {
                    typeResponse(`<span style="color:#ff5f57;">Command not found:</span> ${cmd}. Type <span class="highlight">help</span> for available commands.`, terminalOutput);
                }
            }
        });
    }

    // ================================================
    // ENHANCEMENT 3: INTERACTIVE SKILLS RADAR CHART
    // ================================================
    const radarCanvas = document.getElementById('radar-chart');
    if (radarCanvas) {
        const rCtx = radarCanvas.getContext('2d');
        let radarAnimated = false;
        let animProgress = 0;

        const skillData = [
            { label: 'Circuit\nDesign', value: 0.9 },
            { label: 'Embedded\nSystems', value: 0.85 },
            { label: 'IoT &\nProtocols', value: 0.88 },
            { label: 'Power\nElectronics', value: 0.82 },
            { label: 'Sensor\nFusion', value: 0.8 },
            { label: 'Programming', value: 0.75 }
        ];

        function resizeRadar() {
            const container = radarCanvas.parentElement;
            const size = Math.min(container.offsetWidth, 320);
            radarCanvas.width = size * 2; // 2x for retina
            radarCanvas.height = size * 2;
            radarCanvas.style.width = size + 'px';
            radarCanvas.style.height = size + 'px';
        }

        function drawRadar(progress) {
            resizeRadar();
            const w = radarCanvas.width;
            const h = radarCanvas.height;
            const cx = w / 2;
            const cy = h / 2;
            const maxR = Math.min(cx, cy) * 0.7;
            const sides = skillData.length;
            const angleStep = (Math.PI * 2) / sides;
            const startAngle = -Math.PI / 2;

            rCtx.clearRect(0, 0, w, h);

            // Draw concentric rings
            for (let ring = 1; ring <= 4; ring++) {
                const r = maxR * (ring / 4);
                rCtx.beginPath();
                for (let i = 0; i <= sides; i++) {
                    const angle = startAngle + angleStep * i;
                    const x = cx + Math.cos(angle) * r;
                    const y = cy + Math.sin(angle) * r;
                    i === 0 ? rCtx.moveTo(x, y) : rCtx.lineTo(x, y);
                }
                rCtx.closePath();
                rCtx.strokeStyle = `rgba(0, 229, 255, ${0.1 + ring * 0.05})`;
                rCtx.lineWidth = 1;
                rCtx.stroke();
            }

            // Draw axes
            for (let i = 0; i < sides; i++) {
                const angle = startAngle + angleStep * i;
                rCtx.beginPath();
                rCtx.moveTo(cx, cy);
                rCtx.lineTo(cx + Math.cos(angle) * maxR, cy + Math.sin(angle) * maxR);
                rCtx.strokeStyle = 'rgba(0, 229, 255, 0.15)';
                rCtx.lineWidth = 1;
                rCtx.stroke();
            }

            // Draw data polygon
            rCtx.beginPath();
            for (let i = 0; i <= sides; i++) {
                const idx = i % sides;
                const angle = startAngle + angleStep * idx;
                const r = maxR * skillData[idx].value * progress;
                const x = cx + Math.cos(angle) * r;
                const y = cy + Math.sin(angle) * r;
                i === 0 ? rCtx.moveTo(x, y) : rCtx.lineTo(x, y);
            }
            rCtx.closePath();
            rCtx.fillStyle = 'rgba(0, 229, 255, 0.15)';
            rCtx.fill();
            rCtx.strokeStyle = 'rgba(0, 229, 255, 0.8)';
            rCtx.lineWidth = 2;
            rCtx.stroke();

            // Draw data points
            for (let i = 0; i < sides; i++) {
                const angle = startAngle + angleStep * i;
                const r = maxR * skillData[i].value * progress;
                const x = cx + Math.cos(angle) * r;
                const y = cy + Math.sin(angle) * r;

                rCtx.beginPath();
                rCtx.arc(x, y, 5, 0, Math.PI * 2);
                rCtx.fillStyle = 'rgba(255, 204, 0, 0.9)';
                rCtx.fill();
                rCtx.strokeStyle = 'rgba(255, 204, 0, 0.3)';
                rCtx.lineWidth = 8;
                rCtx.stroke();
            }

            // Draw labels
            rCtx.fillStyle = '#8b9bb4';
            rCtx.font = `${radarCanvas.width > 400 ? 11 : 10}px JetBrains Mono, monospace`;
            rCtx.textAlign = 'center';
            rCtx.textBaseline = 'middle';
            for (let i = 0; i < sides; i++) {
                const angle = startAngle + angleStep * i;
                const labelR = maxR + 30;
                const x = cx + Math.cos(angle) * labelR;
                const y = cy + Math.sin(angle) * labelR;
                const lines = skillData[i].label.split('\n');
                lines.forEach((line, li) => {
                    rCtx.fillText(line, x, y + (li - (lines.length - 1) / 2) * 14);
                });
            }
        }

        function animateRadar() {
            if (animProgress < 1) {
                animProgress += 0.03;
                drawRadar(Math.min(animProgress, 1));
                requestAnimationFrame(animateRadar);
            }
        }

        // Trigger on scroll into view
        const radarObserver = new IntersectionObserver((entries) => {
            if (entries[0].isIntersecting && !radarAnimated) {
                radarAnimated = true;
                animateRadar();
            }
        }, { threshold: 0.3 });
        radarObserver.observe(radarCanvas);

        // Redraw on resize
        window.addEventListener('resize', () => { if (radarAnimated) drawRadar(1); });
    }

    // ================================================
    // ENHANCEMENT 4: CIRCUIT BREAKER THEME TOGGLE
    // ================================================
    const themeToggle = document.getElementById('theme-toggle');
    if (themeToggle) {
        // Load saved theme
        const savedTheme = localStorage.getItem('portfolio-theme');
        if (savedTheme === 'light') {
            document.body.classList.add('light-theme');
            document.documentElement.classList.add('light-theme');
            themeToggle.classList.add('active');
        }

        themeToggle.addEventListener('click', () => {
            themeToggle.classList.toggle('active');
            document.body.classList.toggle('light-theme');
            document.documentElement.classList.toggle('light-theme');
            
            // Save preference
            const isLight = document.body.classList.contains('light-theme');
            localStorage.setItem('portfolio-theme', isLight ? 'light' : 'dark');
        });
    }

    // ================================================
    // ENHANCEMENT 5: OSCILLOSCOPE CONTACT SECTION
    // ================================================
    const scopeCanvas = document.getElementById('scope-canvas');
    if (scopeCanvas) {
        const sCtx = scopeCanvas.getContext('2d');
        let scopeTime = 0;
        let scopeActive = false;

        function resizeScope() {
            const parent = scopeCanvas.parentElement;
            scopeCanvas.width = parent.offsetWidth;
            scopeCanvas.height = parent.offsetHeight;
        }

        function drawScope() {
            if (!scopeActive) return;
            resizeScope();
            const w = scopeCanvas.width;
            const h = scopeCanvas.height;
            sCtx.clearRect(0, 0, w, h);

            // Draw grid
            sCtx.strokeStyle = 'rgba(0, 229, 255, 0.08)';
            sCtx.lineWidth = 1;
            const gridSize = 30;
            for (let x = 0; x < w; x += gridSize) {
                sCtx.beginPath();
                sCtx.moveTo(x, 0);
                sCtx.lineTo(x, h);
                sCtx.stroke();
            }
            for (let y = 0; y < h; y += gridSize) {
                sCtx.beginPath();
                sCtx.moveTo(0, y);
                sCtx.lineTo(w, y);
                sCtx.stroke();
            }

            // Center lines
            sCtx.strokeStyle = 'rgba(0, 229, 255, 0.15)';
            sCtx.beginPath();
            sCtx.moveTo(0, h / 2);
            sCtx.lineTo(w, h / 2);
            sCtx.stroke();
            sCtx.beginPath();
            sCtx.moveTo(w / 2, 0);
            sCtx.lineTo(w / 2, h);
            sCtx.stroke();

            // Draw sine wave (Channel 1 - cyan)
            sCtx.beginPath();
            sCtx.strokeStyle = 'rgba(0, 229, 255, 0.8)';
            sCtx.lineWidth = 2;
            sCtx.shadowColor = 'rgba(0, 229, 255, 0.5)';
            sCtx.shadowBlur = 10;
            for (let x = 0; x < w; x++) {
                const y = h / 2 + Math.sin((x * 0.02) + scopeTime) * (h * 0.25) 
                         + Math.sin((x * 0.005) + scopeTime * 0.5) * (h * 0.1);
                x === 0 ? sCtx.moveTo(x, y) : sCtx.lineTo(x, y);
            }
            sCtx.stroke();
            sCtx.shadowBlur = 0;

            // Draw second wave (Channel 2 - yellow/gold)
            sCtx.beginPath();
            sCtx.strokeStyle = 'rgba(255, 204, 0, 0.5)';
            sCtx.lineWidth = 1.5;
            sCtx.shadowColor = 'rgba(255, 204, 0, 0.3)';
            sCtx.shadowBlur = 8;
            for (let x = 0; x < w; x++) {
                const y = h / 2 + Math.cos((x * 0.03) + scopeTime * 1.3) * (h * 0.15);
                x === 0 ? sCtx.moveTo(x, y) : sCtx.lineTo(x, y);
            }
            sCtx.stroke();
            sCtx.shadowBlur = 0;

            scopeTime += 0.04;
            requestAnimationFrame(drawScope);
        }

        // Start when visible
        const scopeObserver = new IntersectionObserver((entries) => {
            if (entries[0].isIntersecting) {
                scopeActive = true;
                drawScope();
            } else {
                scopeActive = false;
            }
        }, { threshold: 0.1 });
        scopeObserver.observe(scopeCanvas.parentElement);

        window.addEventListener('resize', resizeScope);
    }

    // Oscilloscope email copy button
    const scopeEmailBtn = document.getElementById('scope-email-btn');
    if (scopeEmailBtn) {
        scopeEmailBtn.addEventListener('click', () => {
            const email = scopeEmailBtn.getAttribute('data-email');
            navigator.clipboard.writeText(email).then(() => {
                scopeEmailBtn.classList.add('copied');
                setTimeout(() => scopeEmailBtn.classList.remove('copied'), 2000);
            });
        });
    }

    // ================================================
    // ENHANCEMENT 6: SCHEMATIC RESUME DOWNLOAD BUTTON
    // ================================================
    const resumeBtn = document.getElementById('resume-btn');
    if (resumeBtn) {
        resumeBtn.addEventListener('click', () => {
            if (resumeBtn.classList.contains('downloading') || resumeBtn.classList.contains('complete')) return;

            resumeBtn.classList.add('downloading');
            const fill = resumeBtn.querySelector('.voltage-fill');
            const text = resumeBtn.querySelector('.btn-schematic-text');
            let progress = 0;

            text.textContent = '⚡ Compiling Schematics...';
            text.style.opacity = '1';

            const interval = setInterval(() => {
                progress += Math.random() * 8 + 2;
                if (progress >= 100) {
                    progress = 100;
                    clearInterval(interval);
                    fill.style.width = '100%';
                    
                    setTimeout(() => {
                        resumeBtn.classList.remove('downloading');
                        resumeBtn.classList.add('complete');
                        text.textContent = '✓ Schematics Compiled!';
                        text.style.opacity = '1';
                        
                        // Flash effect
                        resumeBtn.style.boxShadow = '0 0 40px rgba(0, 229, 255, 0.6)';
                        setTimeout(() => {
                            resumeBtn.style.boxShadow = '';
                        }, 500);

                        // Actually download the resume PDF
                        const link = document.createElement('a');
                        link.href = '723723105022_YUGESH_RESUME.pdf';
                        link.download = 'Yugesh_S_Resume.pdf';
                        document.body.appendChild(link);
                        link.click();
                        document.body.removeChild(link);

                        // Reset after 3 seconds
                        setTimeout(() => {
                            resumeBtn.classList.remove('complete');
                            fill.style.width = '0%';
                            text.textContent = '⬇ Download Schematics';
                        }, 3000);
                    }, 400);
                }
                fill.style.width = progress + '%';
            }, 60);
        });
    }

    // ================================================
    // ENHANCEMENT 7: EASTER EGGS
    // ================================================

    // 7a. Konami Code → Matrix Rain
    const konamiSequence = ['ArrowUp','ArrowUp','ArrowDown','ArrowDown','ArrowLeft','ArrowRight','ArrowLeft','ArrowRight','b','a'];
    let konamiIndex = 0;
    const matrixCanvas = document.getElementById('matrix-canvas');

    document.addEventListener('keydown', (e) => {
        if (e.key === konamiSequence[konamiIndex]) {
            konamiIndex++;
            if (konamiIndex === konamiSequence.length) {
                konamiIndex = 0;
                triggerMatrixRain();
            }
        } else {
            konamiIndex = 0;
        }
    });

    function triggerMatrixRain() {
        if (!matrixCanvas) return;
        matrixCanvas.style.display = 'block';
        const mCtx = matrixCanvas.getContext('2d');
        matrixCanvas.width = window.innerWidth;
        matrixCanvas.height = window.innerHeight;

        const chars = 'YUGESH01アイウエオカキクケコ⚡🔌⚙️10';
        const fontSize = 14;
        const columns = matrixCanvas.width / fontSize;
        const drops = Array(Math.floor(columns)).fill(1);

        let matrixFrameId;
        function drawMatrix() {
            mCtx.fillStyle = 'rgba(0, 0, 0, 0.05)';
            mCtx.fillRect(0, 0, matrixCanvas.width, matrixCanvas.height);

            mCtx.fillStyle = '#00e5ff';
            mCtx.font = fontSize + 'px JetBrains Mono';

            for (let i = 0; i < drops.length; i++) {
                const text = chars[Math.floor(Math.random() * chars.length)];
                // Alternate colors
                mCtx.fillStyle = Math.random() > 0.5 ? '#00e5ff' : '#ffcc00';
                mCtx.fillText(text, i * fontSize, drops[i] * fontSize);

                if (drops[i] * fontSize > matrixCanvas.height && Math.random() > 0.975) {
                    drops[i] = 0;
                }
                drops[i]++;
            }
            matrixFrameId = requestAnimationFrame(drawMatrix);
        }

        drawMatrix();

        // Stop after 5 seconds
        setTimeout(() => {
            cancelAnimationFrame(matrixFrameId);
            matrixCanvas.style.display = 'none';
            mCtx.clearRect(0, 0, matrixCanvas.width, matrixCanvas.height);
        }, 5000);
    }

    // 7b. Triple-click on name → Glitch Party
    const heroName = document.getElementById('hero-name');
    if (heroName) {
        let clickCount = 0;
        let clickTimer = null;

        heroName.addEventListener('click', () => {
            clickCount++;
            clearTimeout(clickTimer);
            
            clickTimer = setTimeout(() => {
                if (clickCount >= 3) {
                    document.body.classList.add('glitch-party');
                    setTimeout(() => {
                        document.body.classList.remove('glitch-party');
                    }, 2000);
                }
                clickCount = 0;
            }, 400);
        });
    }

    // 7c. LED Visit Counter
    const visitCounter = document.getElementById('visit-counter');
    if (visitCounter) {
        let count = parseInt(localStorage.getItem('portfolio-visits') || '0') + 1;
        localStorage.setItem('portfolio-visits', count.toString());
        
        // Animate the counter
        let displayCount = 0;
        const counterInterval = setInterval(() => {
            displayCount++;
            if (displayCount >= count) {
                displayCount = count;
                clearInterval(counterInterval);
            }
            visitCounter.textContent = displayCount.toString().padStart(4, '0');
        }, 50);
    }

});
