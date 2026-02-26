// ============================================
// MORAN TOMER — CLASSIFIED AUTHOR WEBSITE
// Cinematic Intelligence System Experience
// ============================================

(() => {
    'use strict';

    // ─── SHARED STATE ────────────────────────────────
    const App = {
        state: {
            bootComplete: false,
            audioEnabled: false,
            mouseX: 0,
            mouseY: 0,
            isMobile: false,
            reducedMotion: false
        },

        init() {
            this.state.isMobile = window.matchMedia('(max-width: 640px)').matches;
            this.state.reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
            document.body.classList.add('boot-active');

            BootSequence.start(() => {
                this.state.bootComplete = true;
                document.body.classList.remove('boot-active');
                Navigation.init();
                ScrollReveal.init();
                TypedText.init();
                TextScramble.init();
                if (!this.state.isMobile && !this.state.reducedMotion) {
                    Particles.init();
                    CursorGlow.init();
                }
                AudioSystem.init();
                InteractiveMoments.init();
                DynamicReadouts.init();
                ContactForm.init();
            });
        }
    };

    // ─── BOOT SEQUENCE ───────────────────────────────
    const BootSequence = {
        timeouts: [],
        cancelled: false,

        lines: [
            { text: '> INITIALIZING SECURE CONNECTION...', delay: 400, hasOk: false },
            { text: '> LOADING ENCRYPTION PROTOCOLS...', delay: 600, hasOk: true },
            { text: '> VERIFYING CLEARANCE LEVEL...', delay: 500, hasOk: true },
            { text: '> ACCESSING CLASSIFIED DATABASE...', delay: 700, hasOk: true },
            { text: '> DECRYPTING MISSION FILES...', delay: 600, hasOk: true },
            { text: '> ESTABLISHING SECURE UPLINK...', delay: 400, hasOk: true },
            { text: '> LOADING OPERATIVE DOSSIERS...', delay: 500, hasOk: true }
        ],

        start(onComplete) {
            const terminal = document.getElementById('bootTerminal');
            const access = document.getElementById('bootAccess');
            const bootScreen = document.getElementById('bootScreen');
            const mainSite = document.getElementById('mainSite');
            const skipBtn = document.getElementById('bootSkip');

            const finish = () => {
                if (this.cancelled) return;
                this.cancelled = true;
                access.classList.add('show');

                const t = setTimeout(() => {
                    bootScreen.classList.add('done');
                    mainSite.classList.add('visible');
                    onComplete();
                }, 1500);
                this.timeouts.push(t);
            };

            const skip = () => {
                this.cancelled = true;
                this.timeouts.forEach(clearTimeout);
                this.timeouts = [];
                bootScreen.classList.add('done');
                mainSite.classList.add('visible');
                onComplete();
            };

            skipBtn.addEventListener('click', skip);

            this.typeLine(terminal, 0, finish);
        },

        typeLine(terminal, lineIndex, onAllDone) {
            if (this.cancelled || lineIndex >= this.lines.length) {
                if (!this.cancelled) onAllDone();
                return;
            }

            const line = this.lines[lineIndex];
            const el = document.createElement('div');
            el.className = 'boot-line';
            terminal.appendChild(el);

            let charIndex = 0;

            const typeChar = () => {
                if (this.cancelled) return;

                if (charIndex < line.text.length) {
                    el.textContent = line.text.substring(0, charIndex + 1);
                    charIndex++;
                    AudioSystem.playKeyClick();
                    const t = setTimeout(typeChar, 25 + Math.random() * 20);
                    this.timeouts.push(t);
                } else {
                    if (line.hasOk) {
                        const t1 = setTimeout(() => {
                            if (this.cancelled) return;
                            const ok = document.createElement('span');
                            ok.className = 'ok-tag';
                            ok.textContent = ' [OK]';
                            el.appendChild(ok);
                            AudioSystem.playRevealSound();

                            const t2 = setTimeout(() => {
                                this.typeLine(terminal, lineIndex + 1, onAllDone);
                            }, line.delay);
                            this.timeouts.push(t2);
                        }, 200);
                        this.timeouts.push(t1);
                    } else {
                        const t = setTimeout(() => {
                            this.typeLine(terminal, lineIndex + 1, onAllDone);
                        }, line.delay);
                        this.timeouts.push(t);
                    }
                }
            };

            typeChar();
        }
    };

    // ─── TYPED TEXT (Hero) ───────────────────────────
    const TypedText = {
        phrases: [
            'Former special forces. Current storyteller.',
            'The mission is the story.',
            'Some jobs come with a dental plan. His came with a kill list.',
            'Trust no one. Read everyone.',
            'Forged in combat. Published by choice.'
        ],
        el: null,
        phraseIndex: 0,
        charIndex: 0,
        state: 'TYPING', // TYPING, PAUSING, DELETING, WAITING
        timeout: null,

        init() {
            this.el = document.getElementById('heroTyped');
            if (!this.el) return;
            this.tick();
        },

        tick() {
            const phrase = this.phrases[this.phraseIndex];

            switch (this.state) {
                case 'TYPING':
                    if (this.charIndex < phrase.length) {
                        this.charIndex++;
                        this.el.textContent = phrase.substring(0, this.charIndex);
                        this.timeout = setTimeout(() => this.tick(), 55 + Math.random() * 30);
                    } else {
                        this.state = 'PAUSING';
                        this.timeout = setTimeout(() => this.tick(), 2500);
                    }
                    break;

                case 'PAUSING':
                    this.state = 'DELETING';
                    this.tick();
                    break;

                case 'DELETING':
                    if (this.charIndex > 0) {
                        this.charIndex--;
                        this.el.textContent = phrase.substring(0, this.charIndex);
                        this.timeout = setTimeout(() => this.tick(), 25);
                    } else {
                        this.state = 'WAITING';
                        this.timeout = setTimeout(() => this.tick(), 400);
                    }
                    break;

                case 'WAITING':
                    this.phraseIndex = (this.phraseIndex + 1) % this.phrases.length;
                    this.charIndex = 0;
                    this.state = 'TYPING';
                    this.tick();
                    break;
            }
        }
    };

    // ─── TEXT SCRAMBLE ───────────────────────────────
    const TextScramble = {
        chars: '!<>-_\\/[]{}=+*^?#________',
        elements: [],

        init() {
            document.querySelectorAll('.scramble-text').forEach(el => {
                this.elements.push({
                    el,
                    original: el.textContent,
                    scrambled: false
                });
            });
        },

        trigger(el) {
            const item = this.elements.find(e => e.el === el);
            if (!item || item.scrambled) return;
            item.scrambled = true;

            const original = item.original;
            const length = original.length;
            const totalFrames = 20;
            let frame = 0;

            const animate = () => {
                let output = '';
                for (let i = 0; i < length; i++) {
                    if (original[i] === ' ') {
                        output += ' ';
                    } else if (frame / totalFrames > i / length + Math.random() * 0.3) {
                        output += original[i];
                    } else {
                        output += this.chars[Math.floor(Math.random() * this.chars.length)];
                    }
                }
                el.textContent = output;
                frame++;

                if (frame <= totalFrames) {
                    setTimeout(animate, 40);
                } else {
                    el.textContent = original;
                }
            };

            // Start with all scrambled
            el.textContent = Array.from(original).map(c =>
                c === ' ' ? ' ' : this.chars[Math.floor(Math.random() * this.chars.length)]
            ).join('');

            setTimeout(animate, 100);
        }
    };

    // ─── PARTICLES ───────────────────────────────────
    const Particles = {
        canvas: null,
        ctx: null,
        particles: [],
        animId: null,
        count: 60,

        init() {
            this.canvas = document.getElementById('particleCanvas');
            if (!this.canvas) return;
            this.ctx = this.canvas.getContext('2d');
            this.resize();
            this.createParticles();
            this.animate();

            let resizeTimer;
            window.addEventListener('resize', () => {
                clearTimeout(resizeTimer);
                resizeTimer = setTimeout(() => this.resize(), 250);
            });
        },

        resize() {
            const dpr = window.devicePixelRatio || 1;
            this.canvas.width = window.innerWidth * dpr;
            this.canvas.height = window.innerHeight * dpr;
            this.canvas.style.width = window.innerWidth + 'px';
            this.canvas.style.height = window.innerHeight + 'px';
            this.ctx.scale(dpr, dpr);
        },

        createParticles() {
            this.particles = [];
            const w = window.innerWidth;
            const h = window.innerHeight;
            for (let i = 0; i < this.count; i++) {
                this.particles.push({
                    x: Math.random() * w,
                    y: Math.random() * h,
                    vx: (Math.random() - 0.5) * 0.4,
                    vy: (Math.random() - 0.5) * 0.4,
                    radius: 1 + Math.random() * 1,
                    opacity: 0.2 + Math.random() * 0.4
                });
            }
        },

        animate() {
            const w = window.innerWidth;
            const h = window.innerHeight;
            this.ctx.clearRect(0, 0, w, h);

            // Update and draw particles
            for (let i = 0; i < this.particles.length; i++) {
                const p = this.particles[i];

                // Mouse repulsion
                const dx = p.x - App.state.mouseX;
                const dy = p.y - App.state.mouseY;
                const distSq = dx * dx + dy * dy;
                if (distSq < 22500 && distSq > 0) { // 150px radius
                    const dist = Math.sqrt(distSq);
                    const force = (150 - dist) / 150 * 0.5;
                    p.vx += (dx / dist) * force;
                    p.vy += (dy / dist) * force;
                }

                // Damping
                p.vx *= 0.99;
                p.vy *= 0.99;

                // Enforce min speed
                const speed = Math.sqrt(p.vx * p.vx + p.vy * p.vy);
                if (speed < 0.1) {
                    p.vx += (Math.random() - 0.5) * 0.1;
                    p.vy += (Math.random() - 0.5) * 0.1;
                }

                p.x += p.vx;
                p.y += p.vy;

                // Wrap edges
                if (p.x < 0) p.x = w;
                if (p.x > w) p.x = 0;
                if (p.y < 0) p.y = h;
                if (p.y > h) p.y = 0;

                // Draw particle
                this.ctx.beginPath();
                this.ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
                this.ctx.fillStyle = `rgba(212, 160, 49, ${p.opacity})`;
                this.ctx.fill();

                // Draw connections
                for (let j = i + 1; j < this.particles.length; j++) {
                    const p2 = this.particles[j];
                    const cx = p.x - p2.x;
                    const cy = p.y - p2.y;
                    const cdist = cx * cx + cy * cy;
                    if (cdist < 14400) { // 120px
                        const alpha = (1 - Math.sqrt(cdist) / 120) * 0.15;
                        this.ctx.beginPath();
                        this.ctx.moveTo(p.x, p.y);
                        this.ctx.lineTo(p2.x, p2.y);
                        this.ctx.strokeStyle = `rgba(212, 160, 49, ${alpha})`;
                        this.ctx.lineWidth = 0.5;
                        this.ctx.stroke();
                    }
                }
            }

            this.animId = requestAnimationFrame(() => this.animate());
        }
    };

    // ─── CURSOR GLOW ─────────────────────────────────
    const CursorGlow = {
        el: null,
        idleTimeout: null,
        rafId: null,
        targetX: 0,
        targetY: 0,
        currentX: 0,
        currentY: 0,

        init() {
            this.el = document.getElementById('cursorGlow');
            if (!this.el) return;

            document.addEventListener('mousemove', (e) => {
                App.state.mouseX = e.clientX;
                App.state.mouseY = e.clientY;
                this.targetX = e.clientX;
                this.targetY = e.clientY;

                this.el.classList.add('active');

                clearTimeout(this.idleTimeout);
                this.idleTimeout = setTimeout(() => {
                    this.el.classList.remove('active');
                }, 3000);
            });

            this.currentX = window.innerWidth / 2;
            this.currentY = window.innerHeight / 2;
            this.update();
        },

        update() {
            // Smooth follow with lerp
            this.currentX += (this.targetX - this.currentX) * 0.1;
            this.currentY += (this.targetY - this.currentY) * 0.1;
            this.el.style.left = this.currentX + 'px';
            this.el.style.top = this.currentY + 'px';
            this.rafId = requestAnimationFrame(() => this.update());
        }
    };

    // ─── SCROLL REVEAL ───────────────────────────────
    const ScrollReveal = {
        init() {
            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('visible');
                        observer.unobserve(entry.target);

                        // Trigger text scramble for any child scramble-text
                        const scrambleEl = entry.target.querySelector('.scramble-text');
                        if (scrambleEl) {
                            TextScramble.trigger(scrambleEl);
                        }
                        // Also check if the element itself is a scramble-text
                        if (entry.target.classList.contains('scramble-text')) {
                            TextScramble.trigger(entry.target);
                        }

                        AudioSystem.playRevealSound();
                    }
                });
            }, {
                threshold: 0.15,
                rootMargin: '0px 0px -50px 0px'
            });

            document.querySelectorAll('.reveal-element').forEach((el, i) => {
                // Stagger delay for siblings
                el.style.transitionDelay = (i * 0.08) + 's';
                observer.observe(el);
            });
        }
    };

    // ─── NAVIGATION ──────────────────────────────────
    const Navigation = {
        init() {
            const nav = document.getElementById('nav');
            const navToggle = document.getElementById('navToggle');
            const navLinks = document.getElementById('navLinks');
            const sections = document.querySelectorAll('section[id]');

            // Scroll detection
            window.addEventListener('scroll', () => {
                if (window.scrollY > 50) {
                    nav.classList.add('scrolled');
                } else {
                    nav.classList.remove('scrolled');
                }
            }, { passive: true });

            // Mobile toggle
            navToggle.addEventListener('click', () => {
                navToggle.classList.toggle('open');
                navLinks.classList.toggle('open');
                document.body.style.overflow = navLinks.classList.contains('open') ? 'hidden' : '';
            });

            // Close mobile menu on link click
            navLinks.querySelectorAll('a').forEach(link => {
                link.addEventListener('click', () => {
                    navToggle.classList.remove('open');
                    navLinks.classList.remove('open');
                    document.body.style.overflow = '';
                });
            });

            // Active link highlighting
            const updateActive = () => {
                const scrollPos = window.scrollY + 100;
                sections.forEach(section => {
                    const top = section.offsetTop;
                    const height = section.offsetHeight;
                    const id = section.getAttribute('id');
                    const link = navLinks.querySelector(`a[href="#${id}"]`);
                    if (link) {
                        if (scrollPos >= top && scrollPos < top + height) {
                            link.classList.add('active');
                        } else {
                            link.classList.remove('active');
                        }
                    }
                });
            };

            window.addEventListener('scroll', updateActive, { passive: true });
            updateActive();

            // Smooth scroll for anchor links
            document.querySelectorAll('a[href^="#"]').forEach(anchor => {
                anchor.addEventListener('click', function (e) {
                    e.preventDefault();
                    const target = document.querySelector(this.getAttribute('href'));
                    if (target) {
                        const offset = 80;
                        const top = target.getBoundingClientRect().top + window.pageYOffset - offset;
                        window.scrollTo({ top, behavior: 'smooth' });
                    }
                });
            });
        }
    };

    // ─── AUDIO SYSTEM ────────────────────────────────
    const AudioSystem = {
        ctx: null,
        masterGain: null,
        isEnabled: false,
        ambientNodes: [],

        init() {
            const toggle = document.getElementById('audioToggle');
            if (!toggle) return;

            toggle.addEventListener('click', () => {
                this.toggle(toggle);
            });
        },

        createContext() {
            if (this.ctx) return;
            try {
                this.ctx = new (window.AudioContext || window.webkitAudioContext)();
                this.masterGain = this.ctx.createGain();
                this.masterGain.gain.value = 0.5;
                this.masterGain.connect(this.ctx.destination);
            } catch (e) {
                // Web Audio not supported
            }
        },

        toggle(btn) {
            if (!this.isEnabled) {
                this.createContext();
                if (!this.ctx) return;
                this.isEnabled = true;
                btn.setAttribute('data-audio', 'on');
                this.startAmbientHum();
            } else {
                this.isEnabled = false;
                btn.removeAttribute('data-audio');
                this.stopAmbientHum();
            }
        },

        startAmbientHum() {
            if (!this.ctx) return;
            this.stopAmbientHum();

            // Two detuned oscillators for a slow-beating hum
            const osc1 = this.ctx.createOscillator();
            const osc2 = this.ctx.createOscillator();
            const gain = this.ctx.createGain();
            const filter = this.ctx.createBiquadFilter();

            osc1.type = 'sine';
            osc1.frequency.value = 80;
            osc2.type = 'sine';
            osc2.frequency.value = 83;

            filter.type = 'lowpass';
            filter.frequency.value = 200;

            gain.gain.value = 0.04;

            osc1.connect(filter);
            osc2.connect(filter);
            filter.connect(gain);
            gain.connect(this.masterGain);

            osc1.start();
            osc2.start();

            this.ambientNodes = [osc1, osc2, gain, filter];
        },

        stopAmbientHum() {
            this.ambientNodes.forEach(node => {
                try { node.disconnect(); } catch (e) {}
                if (node.stop) try { node.stop(); } catch (e) {}
            });
            this.ambientNodes = [];
        },

        playKeyClick() {
            if (!this.isEnabled || !this.ctx) return;
            try {
                const bufferSize = this.ctx.sampleRate * 0.03;
                const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
                const data = buffer.getChannelData(0);
                for (let i = 0; i < bufferSize; i++) {
                    data[i] = (Math.random() * 2 - 1) * Math.exp(-i / (bufferSize * 0.15));
                }

                const source = this.ctx.createBufferSource();
                source.buffer = buffer;

                const gain = this.ctx.createGain();
                gain.gain.value = 0.06;

                const filter = this.ctx.createBiquadFilter();
                filter.type = 'highpass';
                filter.frequency.value = 1800 + Math.random() * 800;

                source.connect(filter);
                filter.connect(gain);
                gain.connect(this.masterGain);

                source.start();
            } catch (e) {}
        },

        playRevealSound() {
            if (!this.isEnabled || !this.ctx) return;
            try {
                const osc = this.ctx.createOscillator();
                const gain = this.ctx.createGain();

                osc.type = 'sine';
                osc.frequency.setValueAtTime(400, this.ctx.currentTime);
                osc.frequency.exponentialRampToValueAtTime(800, this.ctx.currentTime + 0.1);

                gain.gain.setValueAtTime(0.06, this.ctx.currentTime);
                gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.15);

                osc.connect(gain);
                gain.connect(this.masterGain);

                osc.start();
                osc.stop(this.ctx.currentTime + 0.15);
            } catch (e) {}
        },

        playHoverSound() {
            if (!this.isEnabled || !this.ctx) return;
            try {
                const osc = this.ctx.createOscillator();
                const gain = this.ctx.createGain();

                osc.type = 'square';
                osc.frequency.value = 1200;

                gain.gain.setValueAtTime(0.03, this.ctx.currentTime);
                gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.02);

                osc.connect(gain);
                gain.connect(this.masterGain);

                osc.start();
                osc.stop(this.ctx.currentTime + 0.02);
            } catch (e) {}
        }
    };

    // ─── INTERACTIVE MOMENTS ─────────────────────────
    const InteractiveMoments = {
        init() {
            this.setupRedactedHover();
            this.setupHoverSounds();
            if (!App.state.isMobile && !App.state.reducedMotion) {
                this.setupBookParallax();
                this.setupScreenGlitch();
            }
        },

        setupRedactedHover() {
            document.querySelectorAll('.redacted').forEach(el => {
                if (App.state.isMobile) {
                    el.addEventListener('click', () => {
                        el.classList.toggle('revealed');
                        AudioSystem.playHoverSound();
                    });
                } else {
                    el.addEventListener('mouseenter', () => {
                        el.classList.add('revealed');
                        AudioSystem.playHoverSound();
                    });
                    el.addEventListener('mouseleave', () => {
                        el.classList.remove('revealed');
                    });
                }
            });
        },

        setupHoverSounds() {
            const selectors = '.btn-classified, .btn-outline, .social-btn, .nav-links a';
            document.querySelectorAll(selectors).forEach(el => {
                el.addEventListener('mouseenter', () => {
                    AudioSystem.playHoverSound();
                });
            });
        },

        setupBookParallax() {
            const bookImg = document.querySelector('.book-mockup-img');
            if (!bookImg) return;

            let ticking = false;
            window.addEventListener('scroll', () => {
                if (!ticking) {
                    requestAnimationFrame(() => {
                        const rect = bookImg.getBoundingClientRect();
                        const center = window.innerHeight / 2;
                        const offset = (rect.top + rect.height / 2 - center) * 0.03;
                        bookImg.style.transform = `translateY(${-offset}px)`;
                        ticking = false;
                    });
                    ticking = true;
                }
            }, { passive: true });
        },

        setupScreenGlitch() {
            const glitchEl = document.getElementById('screenGlitch');
            if (!glitchEl) return;

            const triggerGlitch = () => {
                glitchEl.classList.add('active');
                setTimeout(() => {
                    glitchEl.classList.remove('active');
                }, 150);

                // Schedule next glitch at random interval
                const nextDelay = 25000 + Math.random() * 15000;
                setTimeout(triggerGlitch, nextDelay);
            };

            // First glitch after 20-40 seconds
            setTimeout(triggerGlitch, 20000 + Math.random() * 20000);
        }
    };

    // ─── DYNAMIC READOUTS ────────────────────────────
    const DynamicReadouts = {
        lat: 1.3521,
        lng: 103.8198,
        signals: ['STRONG', 'NOMINAL', 'STRONG', 'ACTIVE', 'SCANNING...'],
        signalIndex: 0,

        init() {
            setInterval(() => this.update(), 6000);
        },

        update() {
            // Drift coordinates
            this.lat += (Math.random() - 0.5) * 0.0002;
            this.lng += (Math.random() - 0.5) * 0.0002;

            const latEl = document.querySelector('[data-dynamic="lat"]');
            const lngEl = document.querySelector('[data-dynamic="lng"]');
            const signalEl = document.querySelector('[data-dynamic="signal"]');
            const statusEl = document.querySelector('[data-dynamic="status"]');
            const protocolEl = document.querySelector('[data-dynamic="protocol"]');

            if (latEl) latEl.textContent = this.lat.toFixed(4);
            if (lngEl) lngEl.textContent = this.lng.toFixed(4);

            // Cycle signal
            if (signalEl && Math.random() > 0.5) {
                this.signalIndex = (this.signalIndex + 1) % this.signals.length;
                signalEl.textContent = this.signals[this.signalIndex];
            }

            // Occasional status flash
            if (statusEl && Math.random() > 0.85) {
                statusEl.textContent = 'VERIFYING...';
                statusEl.style.color = '#38bdf8';
                setTimeout(() => {
                    statusEl.textContent = 'ACTIVE';
                    statusEl.style.color = '';
                }, 800);
            }

            // Rare protocol flash
            if (protocolEl && Math.random() > 0.95) {
                protocolEl.textContent = 'TYPHON';
                protocolEl.style.color = '#ef4444';
                setTimeout(() => {
                    protocolEl.textContent = 'BREWSTER';
                    protocolEl.style.color = '';
                }, 1000);
            }
        }
    };

    // ─── CONTACT FORM ────────────────────────────────
    const ContactForm = {
        init() {
            const form = document.getElementById('contactForm');
            if (!form) return;

            form.addEventListener('submit', (e) => {
                e.preventDefault();
                this.handleSubmit(form);
            });
        },

        handleSubmit(form) {
            const btn = form.querySelector('button[type="submit"]');
            if (btn.disabled) return;

            btn.disabled = true;
            btn.innerHTML = '<span class="btn-icon">&#9654;</span> TRANSMITTING...';

            // Collect form data
            const data = new FormData(form);

            // POST to Formspree
            fetch('https://formspree.io/f/xdalbgpj', {
                method: 'POST',
                body: data,
                headers: { 'Accept': 'application/json' }
            })
            .then(res => {
                if (res.ok) {
                    return this.showSuccess(form, btn);
                }
                return res.json().then(json => {
                    throw new Error(json.errors ? json.errors.map(e => e.message).join(', ') : 'Transmission failed');
                });
            })
            .catch(err => {
                this.showError(form, btn, err.message);
            });
        },

        showSuccess(form, btn) {
            form.reset();
            AudioSystem.playRevealSound();

            const response = document.createElement('div');
            response.className = 'form-response';
            response.style.opacity = '0';
            response.style.transition = 'opacity 0.4s ease';

            const lines = [
                '> TRANSMISSION RECEIVED',
                '> ENCRYPTION: VERIFIED',
                '> STATUS: DELIVERED',
                '> OPERATOR WILL RESPOND VIA SECURE CHANNEL'
            ];

            form.style.display = 'none';
            form.parentNode.appendChild(response);

            // Type out response lines
            let lineIndex = 0;
            const typeLine = () => {
                if (lineIndex < lines.length) {
                    response.innerHTML += (lineIndex > 0 ? '<br>' : '') + lines[lineIndex];
                    lineIndex++;
                    AudioSystem.playKeyClick();
                    setTimeout(typeLine, 300);
                }
            };

            requestAnimationFrame(() => {
                response.style.opacity = '1';
                typeLine();
            });

            // Restore form after delay
            setTimeout(() => {
                response.style.opacity = '0';
                setTimeout(() => {
                    response.remove();
                    form.style.display = '';
                    btn.disabled = false;
                    btn.innerHTML = '<span class="btn-icon">&#9654;</span> TRANSMIT';
                }, 400);
            }, 5000);
        },

        showError(form, btn, message) {
            AudioSystem.playRevealSound();

            const response = document.createElement('div');
            response.className = 'form-response';
            response.style.opacity = '0';
            response.style.transition = 'opacity 0.4s ease';

            const lines = [
                '> TRANSMISSION FAILED',
                '> ERROR: ' + (message || 'SECURE CHANNEL UNAVAILABLE').toUpperCase(),
                '> RETRY RECOMMENDED'
            ];

            form.style.display = 'none';
            form.parentNode.appendChild(response);

            let lineIndex = 0;
            const typeLine = () => {
                if (lineIndex < lines.length) {
                    response.innerHTML += (lineIndex > 0 ? '<br>' : '') +
                        '<span style="color: #ef4444;">' + lines[lineIndex] + '</span>';
                    lineIndex++;
                    AudioSystem.playKeyClick();
                    setTimeout(typeLine, 300);
                }
            };

            requestAnimationFrame(() => {
                response.style.opacity = '1';
                typeLine();
            });

            // Restore form after delay so they can retry
            setTimeout(() => {
                response.style.opacity = '0';
                setTimeout(() => {
                    response.remove();
                    form.style.display = '';
                    btn.disabled = false;
                    btn.innerHTML = '<span class="btn-icon">&#9654;</span> TRANSMIT';
                }, 400);
            }, 4000);
        }
    };

    // ─── INIT ────────────────────────────────────────
    document.addEventListener('DOMContentLoaded', () => App.init());

})();
