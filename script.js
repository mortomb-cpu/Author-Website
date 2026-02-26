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
                ScrollProgress.init();
                TypedText.init();
                TextScramble.init();
                if (!this.state.isMobile && !this.state.reducedMotion) {
                    Particles.init();
                    CursorGlow.init();
                }
                AudioSystem.init();
                InteractiveMoments.init();
                DynamicReadouts.init();
                Countdown.init();
                IntelTicker.init();
                ActivityIndicators.init();
                if (!this.state.isMobile && !this.state.reducedMotion) {
                    OpsMap.init();
                }
                ContactForm.init();
                if (!this.state.isMobile) {
                    BookTilt.init();
                    IntelToasts.init();
                }
                KonamiCode.init();
                VisibilityHandler.init();
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
            const progressBar = document.getElementById('bootProgressBar');

            const finish = () => {
                if (this.cancelled) return;
                this.cancelled = true;
                if (progressBar) progressBar.style.width = '100%';
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

            this.typeLine(terminal, 0, finish, progressBar);
        },

        typeLine(terminal, lineIndex, onAllDone, progressBar) {
            if (this.cancelled || lineIndex >= this.lines.length) {
                if (!this.cancelled) onAllDone();
                return;
            }

            // Update progress bar
            if (progressBar) {
                const pct = ((lineIndex + 1) / this.lines.length) * 90;
                progressBar.style.width = pct + '%';
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
                                this.typeLine(terminal, lineIndex + 1, onAllDone, progressBar);
                            }, line.delay);
                            this.timeouts.push(t2);
                        }, 200);
                        this.timeouts.push(t1);
                    } else {
                        const t = setTimeout(() => {
                            this.typeLine(terminal, lineIndex + 1, onAllDone, progressBar);
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
        state: 'TYPING',
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
            // Reset transform before scaling to prevent stacking
            this.ctx.setTransform(1, 0, 0, 1, 0, 0);
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

            for (let i = 0; i < this.particles.length; i++) {
                const p = this.particles[i];

                const dx = p.x - App.state.mouseX;
                const dy = p.y - App.state.mouseY;
                const distSq = dx * dx + dy * dy;
                if (distSq < 22500 && distSq > 0) {
                    const dist = Math.sqrt(distSq);
                    const force = (150 - dist) / 150 * 0.5;
                    p.vx += (dx / dist) * force;
                    p.vy += (dy / dist) * force;
                }

                p.vx *= 0.99;
                p.vy *= 0.99;

                const speed = Math.sqrt(p.vx * p.vx + p.vy * p.vy);
                if (speed < 0.1) {
                    p.vx += (Math.random() - 0.5) * 0.1;
                    p.vy += (Math.random() - 0.5) * 0.1;
                }

                p.x += p.vx;
                p.y += p.vy;

                if (p.x < 0) p.x = w;
                if (p.x > w) p.x = 0;
                if (p.y < 0) p.y = h;
                if (p.y > h) p.y = 0;

                this.ctx.beginPath();
                this.ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
                this.ctx.fillStyle = `rgba(212, 160, 49, ${p.opacity})`;
                this.ctx.fill();

                for (let j = i + 1; j < this.particles.length; j++) {
                    const p2 = this.particles[j];
                    const cx = p.x - p2.x;
                    const cy = p.y - p2.y;
                    const cdist = cx * cx + cy * cy;
                    if (cdist < 14400) {
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
            // Group elements by parent section for per-section stagger
            const sectionMap = new Map();

            document.querySelectorAll('.reveal-element').forEach(el => {
                const section = el.closest('section, .intel-section') || el.parentElement;
                if (!sectionMap.has(section)) {
                    sectionMap.set(section, []);
                }
                sectionMap.get(section).push(el);
            });

            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('visible');
                        observer.unobserve(entry.target);

                        const scrambleEl = entry.target.querySelector('.scramble-text');
                        if (scrambleEl) {
                            TextScramble.trigger(scrambleEl);
                        }
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

            // Apply stagger per section group
            sectionMap.forEach((elements) => {
                elements.forEach((el, i) => {
                    el.style.transitionDelay = (i * 0.08) + 's';
                    observer.observe(el);
                });
            });
        }
    };

    // ─── SCROLL PROGRESS BAR ─────────────────────────
    const ScrollProgress = {
        bar: null,
        text: null,
        container: null,

        init() {
            this.container = document.getElementById('scrollProgress');
            this.bar = document.getElementById('scrollProgressBar');
            this.text = document.getElementById('scrollProgressText');
            if (!this.bar) return;

            window.addEventListener('scroll', () => this.update(), { passive: true });
            this.update();
        },

        update() {
            const scrollTop = window.scrollY;
            const docHeight = document.documentElement.scrollHeight - window.innerHeight;
            const pct = docHeight > 0 ? Math.min((scrollTop / docHeight) * 100, 100) : 0;

            this.bar.style.width = pct + '%';
            this.text.textContent = 'DECRYPTION: ' + Math.round(pct) + '%';

            if (scrollTop > 100) {
                this.container.classList.add('visible');
            } else {
                this.container.classList.remove('visible');
            }
        }
    };

    // ─── NAVIGATION ──────────────────────────────────
    const Navigation = {
        init() {
            const nav = document.getElementById('nav');
            const navToggle = document.getElementById('navToggle');
            const navLinks = document.getElementById('navLinks');
            const sections = document.querySelectorAll('section[id]');

            window.addEventListener('scroll', () => {
                if (window.scrollY > 50) {
                    nav.classList.add('scrolled');
                } else {
                    nav.classList.remove('scrolled');
                }
            }, { passive: true });

            navToggle.addEventListener('click', () => {
                navToggle.classList.toggle('open');
                navLinks.classList.toggle('open');
                document.body.style.overflow = navLinks.classList.contains('open') ? 'hidden' : '';
            });

            navLinks.querySelectorAll('a').forEach(link => {
                link.addEventListener('click', () => {
                    navToggle.classList.remove('open');
                    navLinks.classList.remove('open');
                    document.body.style.overflow = '';
                });
            });

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

    // ─── COUNTDOWN (April 11, 2026) ─────────────────
    const Countdown = {
        targetDate: new Date('2026-04-11T00:00:00').getTime(),
        timerEl: null,
        interval: null,

        init() {
            this.timerEl = document.getElementById('countdownTimer');
            if (!this.timerEl) return;

            this.update();
            this.interval = setInterval(() => this.update(), 1000);
        },

        update() {
            const now = Date.now();
            const diff = this.targetDate - now;

            if (diff <= 0) {
                this.timerEl.textContent = 'DEPLOYED';
                this.timerEl.classList.add('deployed');
                if (this.interval) clearInterval(this.interval);
                return;
            }

            const d = Math.floor(diff / (1000 * 60 * 60 * 24));
            const h = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
            const m = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
            const s = Math.floor((diff % (1000 * 60)) / 1000);

            this.timerEl.textContent =
                String(d).padStart(2, '0') + 'D ' +
                String(h).padStart(2, '0') + 'H ' +
                String(m).padStart(2, '0') + 'M ' +
                String(s).padStart(2, '0') + 'S';
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
            } catch (e) {}
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
        },

        playAlarm() {
            if (!this.isEnabled || !this.ctx) return;
            try {
                const osc = this.ctx.createOscillator();
                const gain = this.ctx.createGain();

                osc.type = 'sawtooth';
                osc.frequency.setValueAtTime(200, this.ctx.currentTime);
                osc.frequency.exponentialRampToValueAtTime(800, this.ctx.currentTime + 0.2);
                osc.frequency.exponentialRampToValueAtTime(200, this.ctx.currentTime + 0.4);

                gain.gain.setValueAtTime(0.1, this.ctx.currentTime);
                gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.5);

                osc.connect(gain);
                gain.connect(this.masterGain);
                osc.start();
                osc.stop(this.ctx.currentTime + 0.5);
            } catch (e) {}
        },

        playBlip() {
            if (!this.isEnabled || !this.ctx) return;
            try {
                const osc = this.ctx.createOscillator();
                const gain = this.ctx.createGain();
                osc.type = 'sine';
                osc.frequency.setValueAtTime(600 + Math.random() * 200, this.ctx.currentTime);
                osc.frequency.exponentialRampToValueAtTime(400, this.ctx.currentTime + 0.08);
                gain.gain.setValueAtTime(0.04, this.ctx.currentTime);
                gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.1);
                osc.connect(gain);
                gain.connect(this.masterGain);
                osc.start();
                osc.stop(this.ctx.currentTime + 0.1);
            } catch (e) {}
        },

        playTickSound() {
            if (!this.isEnabled || !this.ctx) return;
            try {
                const bufferSize = this.ctx.sampleRate * 0.015;
                const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
                const data = buffer.getChannelData(0);
                for (let i = 0; i < bufferSize; i++) {
                    data[i] = (Math.random() * 2 - 1) * Math.exp(-i / (bufferSize * 0.08));
                }
                const source = this.ctx.createBufferSource();
                source.buffer = buffer;
                const gain = this.ctx.createGain();
                gain.gain.value = 0.025;
                const filter = this.ctx.createBiquadFilter();
                filter.type = 'bandpass';
                filter.frequency.value = 2500;
                filter.Q.value = 5;
                source.connect(filter);
                filter.connect(gain);
                gain.connect(this.masterGain);
                source.start();
            } catch (e) {}
        },

        playAlertTone() {
            if (!this.isEnabled || !this.ctx) return;
            try {
                const osc = this.ctx.createOscillator();
                const gain = this.ctx.createGain();
                osc.type = 'sine';
                osc.frequency.setValueAtTime(300, this.ctx.currentTime);
                osc.frequency.linearRampToValueAtTime(250, this.ctx.currentTime + 0.3);
                gain.gain.setValueAtTime(0.06, this.ctx.currentTime);
                gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.4);
                osc.connect(gain);
                gain.connect(this.masterGain);
                osc.start();
                osc.stop(this.ctx.currentTime + 0.4);
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
                        // Only apply parallax when not being tilted
                        if (!BookTilt.isTilting) {
                            bookImg.style.transform = `translateY(${-offset}px)`;
                        }
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

                const nextDelay = 25000 + Math.random() * 15000;
                setTimeout(triggerGlitch, nextDelay);
            };

            setTimeout(triggerGlitch, 20000 + Math.random() * 20000);
        }
    };

    // ─── 3D BOOK TILT ────────────────────────────────
    const BookTilt = {
        isTilting: false,
        mockup: null,
        img: null,

        init() {
            this.mockup = document.querySelector('.book-mockup');
            this.img = document.querySelector('.book-mockup-img');
            if (!this.mockup || !this.img) return;

            this.mockup.addEventListener('mousemove', (e) => {
                this.isTilting = true;
                const rect = this.mockup.getBoundingClientRect();
                const x = (e.clientX - rect.left) / rect.width;
                const y = (e.clientY - rect.top) / rect.height;

                const tiltX = (y - 0.5) * -15;
                const tiltY = (x - 0.5) * 15;

                this.img.style.transform =
                    `perspective(800px) rotateX(${tiltX}deg) rotateY(${tiltY}deg) scale(1.05)`;
                this.img.style.filter =
                    `drop-shadow(${-tiltY * 2}px ${tiltX * 2}px 40px rgba(0, 0, 0, 0.5))`;
            });

            this.mockup.addEventListener('mouseleave', () => {
                this.isTilting = false;
                this.img.style.transform = '';
                this.img.style.filter = 'drop-shadow(0 20px 40px rgba(0, 0, 0, 0.5))';
            });
        }
    };

    // ─── INTEL TOAST NOTIFICATIONS ───────────────────
    const IntelToasts = {
        container: null,
        messages: [
            { label: 'INTERCEPT', text: 'ENCRYPTED SIGNAL — SECTOR 7G' },
            { label: 'NETWORK', text: 'AGENT ONLINE — SINGAPORE NODE' },
            { label: 'INTEL', text: 'NEW FIELD REPORT AVAILABLE' },
            { label: 'UPLINK', text: 'SATELLITE HANDSHAKE CONFIRMED' },
            { label: 'ALERT', text: 'PERIMETER SCAN COMPLETE — ALL CLEAR' },
            { label: 'COMMS', text: 'SECURE CHANNEL VERIFIED — STANDBY' },
            { label: 'RECON', text: 'SURVEILLANCE FEED ACTIVE — MARINA BAY' },
            { label: 'CRYPTO', text: 'KEY ROTATION COMPLETE — AES-256' },
            { label: 'OPS', text: 'MISSION BRIEFING UPDATED — CHECK FILES' },
            { label: 'SIGNAL', text: 'BURST TRANSMISSION DECODED — ORIGIN: TEL AVIV' }
        ],
        usedIndices: [],
        timeout: null,

        init() {
            this.container = document.getElementById('toastContainer');
            if (!this.container) return;

            // First toast after 15-30 seconds
            this.schedule(15000 + Math.random() * 15000);
        },

        schedule(delay) {
            this.timeout = setTimeout(() => {
                this.show();
                // Next toast every 35-70 seconds
                this.schedule(35000 + Math.random() * 35000);
            }, delay);
        },

        show() {
            // Pick a random message we haven't used recently
            let idx;
            do {
                idx = Math.floor(Math.random() * this.messages.length);
            } while (this.usedIndices.includes(idx) && this.usedIndices.length < this.messages.length);

            this.usedIndices.push(idx);
            if (this.usedIndices.length > this.messages.length / 2) {
                this.usedIndices.shift();
            }

            const msg = this.messages[idx];

            const toast = document.createElement('div');
            toast.className = 'toast';
            toast.innerHTML =
                '<div class="toast-header">' +
                    '<span class="toast-dot"></span>' +
                    '<span class="toast-label">' + msg.label + '</span>' +
                '</div>' +
                '<div class="toast-message">' + msg.text + '</div>';

            this.container.appendChild(toast);
            AudioSystem.playHoverSound();

            // Animate in
            requestAnimationFrame(() => {
                toast.classList.add('show');
            });

            // Animate out after 4s
            setTimeout(() => {
                toast.classList.remove('show');
                toast.classList.add('hide');
                setTimeout(() => toast.remove(), 500);
            }, 4000);
        }
    };

    // ─── KONAMI CODE EASTER EGG ──────────────────────
    const KonamiCode = {
        sequence: ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight'],
        current: 0,
        breachEl: null,
        active: false,

        init() {
            this.breachEl = document.getElementById('securityBreach');
            if (!this.breachEl) return;

            document.addEventListener('keydown', (e) => {
                if (this.active) return;

                if (e.key === this.sequence[this.current]) {
                    this.current++;
                    if (this.current === this.sequence.length) {
                        this.trigger();
                        this.current = 0;
                    }
                } else {
                    this.current = 0;
                    // Check if current key starts the sequence
                    if (e.key === this.sequence[0]) {
                        this.current = 1;
                    }
                }
            });
        },

        trigger() {
            this.active = true;

            // Play alarm sound
            AudioSystem.playAlarm();
            setTimeout(() => AudioSystem.playAlarm(), 300);
            setTimeout(() => AudioSystem.playAlarm(), 600);

            this.breachEl.classList.add('active');

            // Resolve after 3 seconds
            setTimeout(() => {
                this.breachEl.classList.remove('active');
                this.active = false;

                // Show a "resolved" toast
                if (IntelToasts.container) {
                    const toast = document.createElement('div');
                    toast.className = 'toast';
                    toast.innerHTML =
                        '<div class="toast-header">' +
                            '<span class="toast-dot"></span>' +
                            '<span class="toast-label">RESOLVED</span>' +
                        '</div>' +
                        '<div class="toast-message">BREACH CONTAINED — COUNTERMEASURES ACTIVE</div>';
                    IntelToasts.container.appendChild(toast);
                    requestAnimationFrame(() => toast.classList.add('show'));
                    setTimeout(() => {
                        toast.classList.remove('show');
                        toast.classList.add('hide');
                        setTimeout(() => toast.remove(), 500);
                    }, 5000);
                }
            }, 3000);
        }
    };

    // ─── DYNAMIC READOUTS ────────────────────────────
    const DynamicReadouts = {
        lat: 1.3521,
        lng: 103.8198,
        signals: ['STRONG', 'NOMINAL', 'STRONG', 'ACTIVE', 'SCANNING...'],
        signalIndex: 0,
        agents: 47,
        intercepts: 2847,
        threatLevels: ['LOW', 'MEDIUM', 'ELEVATED'],
        threatColors: ['#22c55e', '#d4a031', '#ef4444'],
        threatIndex: 0,
        uplinkStates: ['STABLE', 'SYNCING', 'BUFFERING', 'STABLE', 'STABLE'],
        uplinkIndex: 0,
        sparkThreatData: [1, 1, 1, 2, 1, 1, 1, 1],
        sparkInterceptsData: [3, 5, 2, 4, 3, 5, 2, 4],

        init() {
            this.drawSparkline('sparkThreat', this.sparkThreatData, false);
            this.drawSparkline('sparkIntercepts', this.sparkInterceptsData, true);
            setInterval(() => this.update(), 6000);
            setTimeout(() => this.triggerAlert(), 20000 + Math.random() * 20000);
        },

        update() {
            this.lat += (Math.random() - 0.5) * 0.0002;
            this.lng += (Math.random() - 0.5) * 0.0002;

            const latEl = document.querySelector('[data-dynamic="lat"]');
            const lngEl = document.querySelector('[data-dynamic="lng"]');
            const signalEl = document.querySelector('[data-dynamic="signal"]');
            const statusEl = document.querySelector('[data-dynamic="status"]');
            const protocolEl = document.querySelector('[data-dynamic="protocol"]');
            const threatEl = document.querySelector('[data-dynamic="threat"]');
            const agentsEl = document.querySelector('[data-dynamic="agents"]');
            const interceptsEl = document.querySelector('[data-dynamic="intercepts"]');
            const uplinkEl = document.querySelector('[data-dynamic="uplink"]');

            if (latEl) latEl.textContent = this.lat.toFixed(4);
            if (lngEl) lngEl.textContent = this.lng.toFixed(4);

            if (signalEl && Math.random() > 0.5) {
                this.signalIndex = (this.signalIndex + 1) % this.signals.length;
                signalEl.textContent = this.signals[this.signalIndex];
            }

            if (statusEl && Math.random() > 0.85) {
                statusEl.textContent = 'VERIFYING...';
                statusEl.style.color = '#38bdf8';
                setTimeout(() => {
                    statusEl.textContent = 'ACTIVE';
                    statusEl.style.color = '';
                }, 800);
            }

            if (protocolEl && Math.random() > 0.95) {
                protocolEl.textContent = 'TYPHON';
                protocolEl.style.color = '#ef4444';
                setTimeout(() => {
                    protocolEl.textContent = 'BREWSTER';
                    protocolEl.style.color = '';
                }, 1000);
            }

            // Threat level
            if (threatEl && Math.random() > 0.7) {
                this.threatIndex = Math.floor(Math.random() * this.threatLevels.length);
                threatEl.textContent = this.threatLevels[this.threatIndex];
                threatEl.style.color = this.threatColors[this.threatIndex];
                this.sparkThreatData.push(this.threatIndex + 1);
                this.sparkThreatData.shift();
                this.drawSparkline('sparkThreat', this.sparkThreatData, false);
            }

            // Agents count — tick smoothly
            if (agentsEl) {
                const newAgents = Math.max(42, Math.min(54, this.agents + Math.floor((Math.random() - 0.5) * 5)));
                this.tickNumber(agentsEl, this.agents, newAgents, 800);
                this.agents = newAgents;
            }

            // Intercepts — always goes up
            if (interceptsEl) {
                const newIntercepts = this.intercepts + Math.floor(1 + Math.random() * 5);
                this.tickNumber(interceptsEl, this.intercepts, newIntercepts, 800);
                this.intercepts = newIntercepts;
                this.sparkInterceptsData.push(newIntercepts - this.intercepts + Math.floor(1 + Math.random() * 5));
                this.sparkInterceptsData.shift();
                this.drawSparkline('sparkIntercepts', this.sparkInterceptsData, true);
            }

            // Uplink status
            if (uplinkEl && Math.random() > 0.6) {
                this.uplinkIndex = (this.uplinkIndex + 1) % this.uplinkStates.length;
                const state = this.uplinkStates[this.uplinkIndex];
                uplinkEl.textContent = state;
                uplinkEl.style.color = state === 'STABLE' ? '#22c55e' : '#38bdf8';
            }
        },

        tickNumber(el, from, to, duration) {
            const startTime = performance.now();
            const animate = (now) => {
                const progress = Math.min((now - startTime) / duration, 1);
                const current = Math.round(from + (to - from) * progress);
                el.textContent = current.toLocaleString();
                if (progress < 1) requestAnimationFrame(animate);
            };
            requestAnimationFrame(animate);
        },

        drawSparkline(canvasId, data, isAmber) {
            const canvas = document.getElementById(canvasId);
            if (!canvas) return;
            const ctx = canvas.getContext('2d');
            const w = canvas.width;
            const h = canvas.height;
            ctx.clearRect(0, 0, w, h);
            const barW = w / data.length;
            const max = Math.max(...data, 1);
            const r = isAmber ? 212 : 34;
            const g = isAmber ? 160 : 197;
            const b = isAmber ? 49 : 94;
            data.forEach((val, i) => {
                const barH = (val / max) * h;
                ctx.fillStyle = `rgba(${r}, ${g}, ${b}, ${0.3 + (i / data.length) * 0.5})`;
                ctx.fillRect(i * barW + 1, h - barH, barW - 2, barH);
            });
        },

        triggerAlert() {
            const readouts = document.querySelectorAll('.hero-data .data-line');
            if (!readouts.length) return;
            const target = readouts[Math.floor(Math.random() * readouts.length)];
            target.classList.add('data-alert');
            AudioSystem.playAlertTone();
            setTimeout(() => target.classList.remove('data-alert'), 2000);
            setTimeout(() => this.triggerAlert(), 30000 + Math.random() * 30000);
        }
    };

    // ─── INTEL TICKER (Live Feed) ────────────────────
    const IntelTicker = {
        track: null,
        container: null,
        counter: 4471,
        isPaused: false,
        intervalId: null,

        callsigns: ['ECHO-7', 'RAVEN-3', 'GHOST-12', 'VIPER-5', 'PHOENIX-9', 'SHADOW-2', 'FALCON-8', 'WOLF-11', 'COBRA-6', 'HAWK-4'],

        templates: [
            function() { return 'INTERCEPT #' + (IntelTicker.counter++) + ': Signal detected \u2014 Freq ' + (10 + Math.random() * 20).toFixed(1) + 'MHz \u2014 Origin: [CLASSIFIED]'; },
            function() { return 'INTERCEPT #' + (IntelTicker.counter++) + ': Burst transmission \u2014 Duration ' + (0.1 + Math.random() * 3).toFixed(1) + 's \u2014 Decryption: PENDING'; },
            function() { return 'INTERCEPT #' + (IntelTicker.counter++) + ': Pattern match \u2014 Codename TYPHON \u2014 Confidence: ' + (70 + Math.random() * 29).toFixed(0) + '%'; },
            function() { return 'ASSET RELOCATION: ' + IntelTicker.callsigns[Math.floor(Math.random() * IntelTicker.callsigns.length)] + ' confirmed en route \u2014 ETA ' + String(Math.floor(Math.random() * 12)).padStart(2, '0') + ':' + String(Math.floor(Math.random() * 60)).padStart(2, '0') + ':00'; },
            function() { return 'ASSET CHECK-IN: ' + IntelTicker.callsigns[Math.floor(Math.random() * IntelTicker.callsigns.length)] + ' \u2014 Status: NOMINAL \u2014 Location: [REDACTED]'; },
            function() { return 'ASSET DEPLOYED: ' + IntelTicker.callsigns[Math.floor(Math.random() * IntelTicker.callsigns.length)] + ' operational \u2014 Cover intact \u2014 Next contact: ' + (2 + Math.floor(Math.random() * 22)) + ':00 UTC'; },
            function() { return 'SYS_STATUS: Uplink ' + (Math.floor(Math.random() * 12) + 1) + ' \u2014 Latency: ' + Math.floor(5 + Math.random() * 45) + 'ms \u2014 NOMINAL'; },
            function() { return 'SYS_STATUS: Network scan complete \u2014 ' + Math.floor(40 + Math.random() * 80) + ' nodes active \u2014 0 anomalies'; },
            function() { return 'CRYPTO UPDATE: Cipher rotation complete \u2014 AES-256 \u2192 AES-' + [256, 512][Math.floor(Math.random() * 2)]; },
            function() { return 'CRYPTO UPDATE: Key exchange with node ' + Math.floor(Math.random() * 50) + ' \u2014 Protocol: ECDH \u2014 Status: SECURE'; },
            function() { return 'INTEL BRIEF: Field report #' + Math.floor(1000 + Math.random() * 9000) + ' received \u2014 Priority: ' + ['LOW', 'MEDIUM', 'HIGH'][Math.floor(Math.random() * 3)]; },
            function() { return 'SIGINT: New frequency cluster detected \u2014 Bearing: ' + Math.floor(Math.random() * 360) + '\u00b0 \u2014 Analysis: IN PROGRESS'; },
            function() { return 'GEOINT: Satellite pass #' + Math.floor(100 + Math.random() * 900) + ' \u2014 Coverage: ' + ['SE Asia', 'Middle East', 'Eastern Europe', 'North Africa'][Math.floor(Math.random() * 4)]; },
            function() { return 'SYS_STATUS: Database sync \u2014 ' + Math.floor(1000 + Math.random() * 9000) + ' records updated \u2014 Integrity: VERIFIED'; },
            function() { return 'CRYPTO ALERT: Certificate renewal \u2014 SHA-' + [256, 384, 512][Math.floor(Math.random() * 3)] + ' \u2014 Expiry: ' + Math.floor(10 + Math.random() * 350) + 'd'; }
        ],

        init() {
            this.container = document.getElementById('intelTicker');
            this.track = document.getElementById('tickerTrack');
            if (!this.container || !this.track) return;

            this.container.addEventListener('mouseenter', () => { this.isPaused = true; });
            this.container.addEventListener('mouseleave', () => { this.isPaused = false; });

            // Seed initial entry
            this.addEntry(false);

            this.intervalId = setInterval(() => {
                if (!this.isPaused) this.addEntry(true);
            }, 3500 + Math.random() * 1500);
        },

        addEntry(animate) {
            const template = this.templates[Math.floor(Math.random() * this.templates.length)];
            const text = template();
            const now = new Date();
            const ts = String(now.getHours()).padStart(2, '0') + ':' +
                       String(now.getMinutes()).padStart(2, '0') + ':' +
                       String(now.getSeconds()).padStart(2, '0');

            const entry = document.createElement('div');
            entry.className = 'ticker-entry' + (animate ? ' ticker-entry--new' : '');
            entry.innerHTML = '<span class="ticker-time">' + ts + '</span>' +
                '<span class="ticker-sep"> // </span>' +
                '<span class="ticker-text">' + text + '</span>';

            // Crossfade: remove old, add new
            const old = this.track.querySelector('.ticker-entry');
            if (old && animate) {
                old.classList.add('ticker-entry--out');
                setTimeout(() => old.remove(), 400);
            } else if (old) {
                old.remove();
            }

            this.track.appendChild(entry);
            if (animate) AudioSystem.playTickSound();
        }
    };

    // ─── ACTIVITY INDICATORS ──────────────────────────
    const ActivityIndicators = {
        timestamps: [],
        stampsShown: new Set(),

        init() {
            this.timestamps = document.querySelectorAll('[data-timestamp]');
            this.updateTimestamps();
            setInterval(() => this.updateTimestamps(), 10000);

            if (!App.state.reducedMotion) {
                this.scheduleSpinner();
                if (!App.state.isMobile) {
                    this.setupClassifiedStamps();
                }
            }
        },

        updateTimestamps() {
            const now = Date.now();
            this.timestamps.forEach(el => {
                if (!el._startTime) el._startTime = now - Math.floor(Math.random() * 30000);
                const elapsed = Math.floor((now - el._startTime) / 1000);
                el.textContent = 'LAST SYNC: ' + elapsed + 's AGO';

                if (elapsed > 45 + Math.random() * 30) {
                    el._startTime = now;
                    el.classList.add('timestamp-refresh');
                    setTimeout(() => el.classList.remove('timestamp-refresh'), 500);
                }
            });
        },

        scheduleSpinner() {
            const run = () => {
                const headers = document.querySelectorAll('.section-header');
                if (headers.length) {
                    const header = headers[Math.floor(Math.random() * headers.length)];
                    const spinner = document.createElement('span');
                    spinner.className = 'processing-spinner';
                    spinner.textContent = 'PROCESSING...';
                    header.appendChild(spinner);

                    setTimeout(() => {
                        spinner.classList.add('processing-done');
                        spinner.textContent = 'SYNCED';
                        setTimeout(() => spinner.remove(), 800);
                    }, 2000 + Math.random() * 2000);
                }
                setTimeout(run, 10000 + Math.random() * 10000);
            };
            setTimeout(run, 8000);
        },

        setupClassifiedStamps() {
            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting && !this.stampsShown.has(entry.target)) {
                        this.stampsShown.add(entry.target);
                        this.flashClassifiedStamp(entry.target);
                    }
                });
            }, { threshold: 0.3 });

            document.querySelectorAll('.section').forEach(section => {
                observer.observe(section);
            });
        },

        flashClassifiedStamp(section) {
            const stamp = document.createElement('div');
            stamp.className = 'flash-classified-stamp';
            stamp.textContent = 'CLASSIFIED';
            section.style.position = 'relative';
            section.appendChild(stamp);

            requestAnimationFrame(() => stamp.classList.add('visible'));
            setTimeout(() => {
                stamp.classList.remove('visible');
                setTimeout(() => stamp.remove(), 500);
            }, 1500);
        }
    };

    // ─── OPS MAP (SVG World Map) ─────────────────────
    const OpsMap = {
        svg: null,
        citiesGroup: null,
        connectionsGroup: null,
        cities: [
            { name: 'SINGAPORE', x: 759, y: 295 },
            { name: 'TEL AVIV', x: 575, y: 220 },
            { name: 'LONDON', x: 490, y: 150 },
            { name: 'WASHINGTON', x: 250, y: 195 },
            { name: 'TOKYO', x: 870, y: 205 },
            { name: 'MOSCOW', x: 610, y: 145 },
            { name: 'BERLIN', x: 520, y: 155 },
            { name: 'SYDNEY', x: 880, y: 395 },
            { name: 'CAIRO', x: 565, y: 240 },
            { name: 'MUMBAI', x: 680, y: 265 },
            { name: 'BEIJING', x: 800, y: 200 },
            { name: 'PARIS', x: 500, y: 162 },
            { name: 'DUBAI', x: 630, y: 248 },
            { name: 'NEW YORK', x: 270, y: 195 },
            { name: 'SAO PAULO', x: 320, y: 365 },
            { name: 'LAGOS', x: 498, y: 295 },
            { name: 'NAIROBI', x: 575, y: 310 },
            { name: 'HONG KONG', x: 810, y: 248 },
            { name: 'SEOUL', x: 840, y: 200 },
            { name: 'BANGKOK', x: 765, y: 270 }
        ],

        init() {
            this.svg = document.querySelector('.ops-map-svg');
            if (!this.svg) return;
            this.citiesGroup = document.getElementById('mapCities');
            this.connectionsGroup = document.getElementById('mapConnections');
            if (!this.citiesGroup || !this.connectionsGroup) return;

            this.renderCityDots();
            this.scheduleActivity();
            this.scheduleHotspot();
        },

        renderCityDots() {
            const ns = 'http://www.w3.org/2000/svg';
            this.cities.forEach((city, i) => {
                const circle = document.createElementNS(ns, 'circle');
                circle.setAttribute('cx', city.x);
                circle.setAttribute('cy', city.y);
                circle.setAttribute('r', '2');
                circle.setAttribute('class', 'map-dot');
                circle.setAttribute('data-index', i);
                this.citiesGroup.appendChild(circle);

                const text = document.createElementNS(ns, 'text');
                text.setAttribute('x', city.x);
                text.setAttribute('y', city.y - 8);
                text.setAttribute('class', 'map-label');
                text.setAttribute('text-anchor', 'middle');
                text.textContent = city.name;
                text.setAttribute('data-index', i);
                this.citiesGroup.appendChild(text);
            });
        },

        activateCity(index) {
            const ns = 'http://www.w3.org/2000/svg';
            const city = this.cities[index];
            const dot = this.citiesGroup.querySelector('.map-dot[data-index="' + index + '"]');
            const label = this.citiesGroup.querySelector('.map-label[data-index="' + index + '"]');
            if (!dot) return;

            dot.classList.add('active');
            if (label) label.classList.add('visible');
            AudioSystem.playBlip();

            // Pulse ring
            const ring = document.createElementNS(ns, 'circle');
            ring.setAttribute('cx', city.x);
            ring.setAttribute('cy', city.y);
            ring.setAttribute('r', '3');
            ring.setAttribute('class', 'map-pulse-ring active');
            this.citiesGroup.appendChild(ring);

            setTimeout(() => {
                dot.classList.remove('active');
                if (label) label.classList.remove('visible');
                ring.remove();
            }, 3000);
        },

        drawConnection(fromIdx, toIdx) {
            const ns = 'http://www.w3.org/2000/svg';
            const from = this.cities[fromIdx];
            const to = this.cities[toIdx];

            const line = document.createElementNS(ns, 'line');
            line.setAttribute('x1', from.x);
            line.setAttribute('y1', from.y);
            line.setAttribute('x2', to.x);
            line.setAttribute('y2', to.y);
            line.setAttribute('class', 'map-connection');

            const dx = to.x - from.x;
            const dy = to.y - from.y;
            const length = Math.sqrt(dx * dx + dy * dy);
            line.style.strokeDasharray = length;
            line.style.strokeDashoffset = length;

            this.connectionsGroup.appendChild(line);

            requestAnimationFrame(() => {
                line.classList.add('drawing');
                line.style.strokeDashoffset = '0';
            });

            setTimeout(() => {
                line.classList.remove('drawing');
                line.classList.add('fading');
                setTimeout(() => line.remove(), 800);
            }, 2500);
        },

        triggerHotspot(index) {
            const dot = this.citiesGroup.querySelector('.map-dot[data-index="' + index + '"]');
            const label = this.citiesGroup.querySelector('.map-label[data-index="' + index + '"]');
            if (!dot) return;

            dot.classList.add('hotspot');
            if (label) { label.classList.add('visible'); label.classList.add('hotspot'); }
            AudioSystem.playAlertTone();

            setTimeout(() => {
                dot.classList.remove('hotspot');
                if (label) { label.classList.remove('visible'); label.classList.remove('hotspot'); }
            }, 2500);
        },

        scheduleActivity() {
            const run = () => {
                const idx = Math.floor(Math.random() * this.cities.length);
                this.activateCity(idx);

                if (Math.random() > 0.6) {
                    const fromIdx = Math.floor(Math.random() * this.cities.length);
                    let toIdx;
                    do { toIdx = Math.floor(Math.random() * this.cities.length); } while (toIdx === fromIdx);
                    this.drawConnection(fromIdx, toIdx);
                }

                setTimeout(run, 4000 + Math.random() * 4000);
            };
            setTimeout(run, 3000);
        },

        scheduleHotspot() {
            const run = () => {
                const idx = Math.floor(Math.random() * this.cities.length);
                this.triggerHotspot(idx);
                setTimeout(run, 20000 + Math.random() * 20000);
            };
            setTimeout(run, 15000);
        }
    };

    // ─── VISIBILITY HANDLER (pause when tab hidden) ──
    const VisibilityHandler = {
        timers: [],

        init() {
            document.addEventListener('visibilitychange', () => {
                if (document.hidden) {
                    // Pause particles
                    if (Particles.animId) {
                        cancelAnimationFrame(Particles.animId);
                        Particles.animId = null;
                    }
                    if (CursorGlow.rafId) {
                        cancelAnimationFrame(CursorGlow.rafId);
                        CursorGlow.rafId = null;
                    }
                } else {
                    // Resume particles
                    if (Particles.canvas && !Particles.animId && !App.state.isMobile && !App.state.reducedMotion) {
                        Particles.animate();
                    }
                    if (CursorGlow.el && !CursorGlow.rafId && !App.state.isMobile && !App.state.reducedMotion) {
                        CursorGlow.update();
                    }
                }
            });
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

            const data = new FormData(form);

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
