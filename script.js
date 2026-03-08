/* ══════════════════════════════════════════════════
   ROMANTIC CINEMATIC STORY — FULL SCRIPT
   Features:
   ✦ Floating heart canvas particles
   ✦ Cinematic page transitions
   ✦ Romantic ambient audio (Web Audio API synth)
   ✦ Interactive SFX: page chime, button tap, swipe,
       dot ping, heart burst sparkle, bloom
   ✦ Preloader with heartbeat
   ✦ Nav dots + keyboard + swipe
   ✦ Cursor trail hearts
   ✦ Begin-button skip to page 1
   ══════════════════════════════════════════════════ */

document.addEventListener('DOMContentLoaded', () => {

    /* ────────────────────────────────────────────────
       0.  STORY CONFIG (Change Name Here)
    ──────────────────────────────────────────────── */
    const STORY_CONFIG = {
        name: 'Sabrina', // Set to 'Afsana', 'Sabrina', etc. 
        typingMessage: 'এই পাতার প্রতিটি শব্দ একেকটি হৃদস্পন্দন, যা শুধু তোমারই জন্য, {name}।'
    };

    /* ────────────────────────────────────────────────
       0.1 PAGE DATA (labels)
    ──────────────────────────────────────────────── */
    const PAGE_LABELS = [
        'আমাদের শুরু',
        '১ম দেখা',
        'অনুসন্ধান',
        'জমানো সময়',
        'তীব্র আসক্তি',
        'নির্ঘুম রাত',
        'রূপের অন্বেষণ',
        'পরম সুখ',
        'একটি দিন',
        'শেষ বাসনা'
    ];

    /* ────────────────────────────────────────────────
       0.5  DYNAMIC NAME INJECTION
    ──────────────────────────────────────────────── */
    function injectDynamicName() {
        const nameElements = document.querySelectorAll('.dynamic-name');
        nameElements.forEach(el => {
            el.textContent = STORY_CONFIG.name;
        });

        // Also update title if needed
        document.title = `Cinematic Love Story — ${STORY_CONFIG.name}`;
    }


    /* ────────────────────────────────────────────────
       1.  FLOATING HEART PARTICLES  (canvas)
    ──────────────────────────────────────────────── */
    const canvas = document.getElementById('heartCanvas');
    const ctx = canvas.getContext('2d');
    let W = canvas.width = window.innerWidth;
    let H = canvas.height = window.innerHeight;

    window.addEventListener('resize', () => {
        W = canvas.width = window.innerWidth;
        H = canvas.height = window.innerHeight;
    });

    const HEART_SHAPES = ['♥', '❤', '💕', '✿'];
    const COLORS = [
        'rgba(255,45,120,', 'rgba(255,150,170,',
        'rgba(255,200,215,', 'rgba(212,137,42,'
    ];

    class HeartParticle {
        constructor() { this.reset(true); }
        reset(init = false) {
            this.x = Math.random() * W;
            this.y = init ? Math.random() * H : H + 20;
            this.size = 10 + Math.random() * 20;
            this.speed = 0.4 + Math.random() * 0.8;
            this.drift = (Math.random() - 0.5) * 0.6;
            this.alpha = 0;
            this.alphaTarget = 0.15 + Math.random() * 0.35;
            this.alphaDir = 1;
            this.alphaDelta = 0.004 + Math.random() * 0.006;
            this.spin = (Math.random() - 0.5) * 0.03;
            this.rot = Math.random() * Math.PI * 2;
            this.char = HEART_SHAPES[Math.floor(Math.random() * HEART_SHAPES.length)];
            this.color = COLORS[Math.floor(Math.random() * COLORS.length)];
        }
        update() {
            this.y -= this.speed;
            this.x += this.drift;
            this.rot += this.spin;
            this.alpha += this.alphaDelta * this.alphaDir;
            if (this.alpha >= this.alphaTarget) this.alphaDir = -1;
            if (this.alpha <= 0 && this.alphaDir === -1) this.reset();
            if (this.y < -30) this.reset();
        }
        draw() {
            ctx.save();
            ctx.translate(this.x, this.y);
            ctx.rotate(this.rot);
            ctx.globalAlpha = Math.max(0, this.alpha);
            ctx.fillStyle = this.color + this.alpha + ')';
            ctx.font = `${this.size}px serif`;
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillText(this.char, 0, 0);
            ctx.restore();
        }
    }

    const PARTICLE_COUNT = 72;
    const particles = Array.from({ length: PARTICLE_COUNT }, () => new HeartParticle());

    function animateParticles() {
        ctx.clearRect(0, 0, W, H);
        particles.forEach(p => { p.update(); p.draw(); });
        requestAnimationFrame(animateParticles);
    }
    animateParticles();

    /* ────────────────────────────────────────────────
       2.  CURSOR HEART TRAIL
    ──────────────────────────────────────────────── */
    const trailEl = document.createElement('div');
    trailEl.style.cssText = `
    position: fixed; pointer-events: none; z-index: 9999;
    font-size: 1.1rem; color: rgba(255,45,120,0.75);
    transition: transform 0.1s ease; will-change: transform;
    filter: drop-shadow(0 0 6px rgba(255,45,120,0.6));
    top: 0; left: 0;
`;
    trailEl.textContent = '♥';
    document.body.appendChild(trailEl);

    let trailHearts = [];
    document.addEventListener('mousemove', (e) => {
        trailEl.style.transform = `translate(${e.clientX - 8}px, ${e.clientY - 8}px)`;

        // spawn mini trail heart occasionally
        if (Math.random() > 0.6) {
            const mini = document.createElement('span');
            const size = 8 + Math.random() * 12;
            mini.style.cssText = `
            position: fixed; pointer-events: none; z-index: 9998;
            font-size: ${size}px; color: rgba(255,45,120,${0.3 + Math.random() * 0.45});
            left: ${e.clientX - size / 2}px; top: ${e.clientY - size / 2}px;
            transition: transform 1.2s ease, opacity 1.2s ease;
            will-change: transform, opacity;
        `;
            mini.textContent = '♥';
            document.body.appendChild(mini);
            trailHearts.push(mini);
            requestAnimationFrame(() => {
                mini.style.transform = `translate(${(Math.random() - 0.5) * 50}px, ${-30 - Math.random() * 40}px) scale(0)`;
                mini.style.opacity = '0';
            });
            setTimeout(() => { mini.remove(); trailHearts = trailHearts.filter(h => h !== mini); }, 1300);
        }
    });

    /* ────────────────────────────────────────────────
       3.  NAVIGATION LOGIC
    ──────────────────────────────────────────────── */
    const pages = document.querySelectorAll('.story-page');
    const prevBtn = document.getElementById('prevBtn');
    const nextBtn = document.getElementById('nextBtn');
    const navDots = document.getElementById('navDots');
    const pageLabel = document.getElementById('pageLabel');
    const storyNav = document.getElementById('storyNav');
    let currentIndex = 0;
    let isAnimating = false;

    // Build dots
    pages.forEach((_, i) => {
        const dot = document.createElement('button');
        dot.className = 'nav-dot' + (i === 0 ? ' active' : '');
        dot.setAttribute('aria-label', `Go to page ${i + 1}`);
        dot.addEventListener('click', () => goTo(i));
        navDots.appendChild(dot);
    });

    function goTo(index, soundType = 'page') {
        if (isAnimating || index === currentIndex) return;
        if (index < 0 || index >= pages.length) return;
        isAnimating = true;

        // ❖ Play the right sound
        if (index > currentIndex) sfx.pageTurnForward();
        else sfx.pageTurnBack();

        const oldPage = pages[currentIndex];
        const newPage = pages[index];

        oldPage.classList.add('exit');
        oldPage.classList.remove('active');

        setTimeout(() => {
            oldPage.classList.remove('exit');
            newPage.classList.add('active');

            currentIndex = index;
            syncUI();

            setTimeout(() => { isAnimating = false; }, 1500);
        }, 200);
    }

    const progressFill = document.getElementById('progressFill');
    const floatingPortraits = document.getElementById('floatingPortraits');

    function updateProgress() {
        const pct = pages.length > 1 ? (currentIndex / (pages.length - 1)) * 100 : 0;
        if (progressFill) progressFill.style.width = pct + '%';
    }

    function syncUI() {
        // buttons
        prevBtn.disabled = currentIndex === 0;
        nextBtn.disabled = currentIndex === pages.length - 1;

        // dots
        document.querySelectorAll('.nav-dot').forEach((d, i) => {
            d.classList.toggle('active', i === currentIndex);
        });

        // label
        if (pageLabel) {
            pageLabel.style.opacity = '0';
            setTimeout(() => {
                pageLabel.textContent = PAGE_LABELS[currentIndex] || '';
                pageLabel.style.opacity = '1';
            }, 400);
            pageLabel.style.transition = 'opacity 0.5s';
        }

        // progress bar
        updateProgress();

        // floating portraits: show when off cover + update images chapter by chapter
        if (floatingPortraits) {
            if (currentIndex > 0) {
                floatingPortraits.classList.add('visible');

                // Update images dynamically chapter by chapter
                const fpImages = floatingPortraits.querySelectorAll('img');
                const allRealImages = [
                    'real_sabrina_1.jpg',
                    'real_sabrina_2.jpg',
                    'real_sabrina_3.jpg',
                    'real_sabrina_4.jpg',
                    'real_sabrina_5.jpg'
                ];

                fpImages.forEach((img, idx) => {
                    // Use a formula to pick a different image for each spot (idx)
                    // that changes based on page (currentIndex)
                    const imgIdx = (currentIndex + idx) % allRealImages.length;
                    img.src = allRealImages[imgIdx];
                });

            } else {
                floatingPortraits.classList.remove('visible');
            }
        }
    }

    prevBtn.addEventListener('click', () => { sfx.buttonTap(); goTo(currentIndex - 1); });
    nextBtn.addEventListener('click', () => { sfx.buttonTap(); goTo(currentIndex + 1); });

    // Begin button (cover page)
    document.getElementById('beginBtn')?.addEventListener('click', () => { sfx.beginBoom(); goTo(1); });

    // Replay button
    document.getElementById('replayBtn')?.addEventListener('click', () => { sfx.beginBoom(); goTo(0); });

    // Keyboard
    document.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowRight' || e.key === 'ArrowDown') goTo(currentIndex + 1);
        if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') goTo(currentIndex - 1);
    });

    // Swipe
    let touchStartX = 0, touchStartY = 0;
    document.addEventListener('touchstart', (e) => {
        touchStartX = e.touches[0].clientX;
        touchStartY = e.touches[0].clientY;
    }, { passive: true });
    document.addEventListener('touchend', (e) => {
        const dx = touchStartX - e.changedTouches[0].clientX;
        const dy = touchStartY - e.changedTouches[0].clientY;
        if (Math.abs(dx) > Math.abs(dy) && Math.abs(dx) > 65) {
            sfx.swipeWhoosh();
            if (dx > 0) goTo(currentIndex + 1);
            else goTo(currentIndex - 1);
        }
    });

    /* ────────────────────────────────────────────────
       3b. INTERACTIVE SOUND FX ENGINE  (Web Audio API)
           All sounds are synthetically generated — no files.
    ──────────────────────────────────────────────── */
    let sfxCtx = null;

    function getSfxCtx() {
        if (!sfxCtx) {
            sfxCtx = new (window.AudioContext || window.webkitAudioContext)();
        }
        if (sfxCtx.state === 'suspended') sfxCtx.resume();
        return sfxCtx;
    }

    /* Generic helper — plays a tone with an ADSR envelope */
    function playTone({ freq = 440, freq2 = null, type = 'sine',
        attack = 0.01, decay = 0.15, release = 0.2,
        peakGain = 0.18, panVal = 0, delayStart = 0 }) {
        const ctx = getSfxCtx();
        const now = ctx.currentTime + delayStart;
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        const pan = ctx.createStereoPanner();

        osc.type = type;
        osc.frequency.setValueAtTime(freq, now);
        if (freq2) osc.frequency.linearRampToValueAtTime(freq2, now + attack + decay + release);

        gain.gain.setValueAtTime(0, now);
        gain.gain.linearRampToValueAtTime(peakGain, now + attack);
        gain.gain.linearRampToValueAtTime(0, now + attack + decay + release);
        pan.pan.value = panVal;

        osc.connect(gain);
        gain.connect(pan);
        pan.connect(ctx.destination);
        osc.start(now);
        osc.stop(now + attack + decay + release + 0.05);
    }

    const sfx = {
        /* ❖ Page turn FORWARD — ascending crystalline chime */
        pageTurnForward() {
            [523.25, 659.25, 783.99].forEach((f, i) => {
                playTone({
                    freq: f, type: 'sine', attack: 0.005, decay: 0.22,
                    release: 0.28, peakGain: 0.11, delayStart: i * 0.065
                });
            });
            playTone({
                freq: 1567.98, type: 'sine', attack: 0.01, decay: 0.10,
                release: 0.22, peakGain: 0.05, delayStart: 0.18
            });
        },

        /* ❖ Page turn BACK — descending soft chime */
        pageTurnBack() {
            [783.99, 659.25, 523.25].forEach((f, i) => {
                playTone({
                    freq: f, type: 'sine', attack: 0.005, decay: 0.20,
                    release: 0.25, peakGain: 0.10, delayStart: i * 0.065
                });
            });
        },

        /* ❖ Arrow button tap — warm soft thud */
        buttonTap() {
            playTone({
                freq: 210, freq2: 105, type: 'triangle',
                attack: 0.003, decay: 0.08, release: 0.06, peakGain: 0.16
            });
        },

        /* ❖ Begin / Replay — romantic warm bloom chord */
        beginBoom() {
            const notes = [[220, 0.14, 0], [277.18, 0.10, 0.03], [329.63, 0.08, 0.06], [1046.50, 0.05, 0.09]];
            notes.forEach(([f, g, d]) =>
                playTone({
                    freq: f, type: 'sine', attack: 0.018, decay: 0.30,
                    release: 0.55, peakGain: g, delayStart: d
                })
            );
        },

        /* ❖ Heart burst (canvas click) — iridescent sparkle */
        heartBurst() {
            [1318.51, 1760, 2093, 2637].forEach((f, i) => {
                playTone({
                    freq: f, freq2: f * 1.04, type: 'sine',
                    attack: 0.003, decay: 0.07, release: 0.22,
                    peakGain: 0.042 - i * 0.007,
                    delayStart: i * 0.028,
                    panVal: i % 2 === 0 ? 0.4 : -0.4
                });
            });
        },

        /* ❖ Nav dot click — crisp single ping */
        dotClick() {
            playTone({
                freq: 880, type: 'sine', attack: 0.004, decay: 0.11,
                release: 0.18, peakGain: 0.09
            });
        },

        /* ❖ Swipe — airy noise whoosh */
        swipeWhoosh() {
            const ctx = getSfxCtx();
            const now = ctx.currentTime;
            const len = Math.floor(ctx.sampleRate * 0.26);
            const buf = ctx.createBuffer(1, len, ctx.sampleRate);
            const data = buf.getChannelData(0);
            for (let i = 0; i < len; i++) {
                data[i] = (Math.random() * 2 - 1) * (1 - i / len);
            }
            const src = ctx.createBufferSource();
            src.buffer = buf;
            const bpf = ctx.createBiquadFilter();
            bpf.type = 'bandpass';
            bpf.frequency.setValueAtTime(700, now);
            bpf.frequency.linearRampToValueAtTime(2500, now + 0.22);
            bpf.Q.value = 2.5;
            const g = ctx.createGain();
            g.gain.setValueAtTime(0.13, now);
            g.gain.linearRampToValueAtTime(0, now + 0.26);
            src.connect(bpf); bpf.connect(g); g.connect(ctx.destination);
            src.start(now);
        }
    };

    // Wire nav dots to sfx after they are built
    document.querySelectorAll('.nav-dot').forEach(dot => {
        dot.addEventListener('click', () => sfx.dotClick());
    });

    /* ────────────────────────────────────────────────
       4.  AMBIENT ROMANTIC AUDIO (Web Audio API)
          Generates a gentle, dreamy piano-like tone
    ──────────────────────────────────────────────── */
    let audioCtx = null;
    let masterGain = null;
    let isPlaying = false;
    let oscillators = [];
    let lfoNodes = [];

    // Romantic chord progression: Am → F → C → G
    const CHORDS = [
        [220.00, 261.63, 329.63],  // Am  (A3-C4-E4)
        [174.61, 220.00, 261.63],  // F   (F3-A3-C4)
        [261.63, 329.63, 392.00],  // C   (C4-E4-G4)
        [196.00, 246.94, 293.66],  // G   (G3-B3-D4)
    ];
    let chordIndex = 0;
    let chordInterval = null;

    function startAudio() {
        if (!audioCtx) {
            audioCtx = new (window.AudioContext || window.webkitAudioContext)();
            masterGain = audioCtx.createGain();
            masterGain.gain.setValueAtTime(0, audioCtx.currentTime);

            // Soft reverb via convolver-like delay
            const delay = audioCtx.createDelay(3);
            const delayGain = audioCtx.createGain();
            delay.delayTime.value = 0.45;
            delayGain.gain.value = 0.32;

            // Filter for warmth
            const filter = audioCtx.createBiquadFilter();
            filter.type = 'lowpass';
            filter.frequency.value = 1200;
            filter.Q.value = 0.5;

            masterGain.connect(filter);
            filter.connect(audioCtx.destination);
            filter.connect(delay);
            delay.connect(delayGain);
            delayGain.connect(audioCtx.destination);
        }

        if (audioCtx.state === 'suspended') audioCtx.resume();

        // Fade in
        masterGain.gain.cancelScheduledValues(audioCtx.currentTime);
        masterGain.gain.setValueAtTime(masterGain.gain.value, audioCtx.currentTime);
        masterGain.gain.linearRampToValueAtTime(0.18, audioCtx.currentTime + 3);

        playChord();
        chordInterval = setInterval(() => {
            chordIndex = (chordIndex + 1) % CHORDS.length;
            playChord();
        }, 4000);

        isPlaying = true;
    }

    function playChord() {
        // Clean old oscillators
        oscillators.forEach(o => {
            try { o.stop(audioCtx.currentTime + 0.8); } catch (e) { }
        });
        lfoNodes.forEach(l => {
            try { l.disconnect(); } catch (e) { }
        });
        oscillators = [];
        lfoNodes = [];

        const freqs = CHORDS[chordIndex];
        freqs.forEach((freq, i) => {
            const osc = audioCtx.createOscillator();
            const gain = audioCtx.createGain();

            osc.type = i % 2 === 0 ? 'sine' : 'triangle';
            osc.frequency.setValueAtTime(freq, audioCtx.currentTime);

            // Soft vibrato LFO
            const lfo = audioCtx.createOscillator();
            const lfoGain = audioCtx.createGain();
            lfo.frequency.value = 4.5;
            lfoGain.gain.value = 1.5;
            lfo.connect(lfoGain);
            lfoGain.connect(osc.frequency);
            lfo.start();
            lfoNodes.push(lfo);

            gain.gain.setValueAtTime(0, audioCtx.currentTime);
            gain.gain.linearRampToValueAtTime(0.22 - i * 0.04, audioCtx.currentTime + 0.6);
            gain.gain.linearRampToValueAtTime(0.10 - i * 0.02, audioCtx.currentTime + 3.5);

            osc.connect(gain);
            gain.connect(masterGain);
            osc.start();
            oscillators.push(osc);
        });

        // Bass drone
        const bass = audioCtx.createOscillator();
        const bassGain = audioCtx.createGain();
        bass.type = 'sine';
        bass.frequency.value = freqs[0] / 2;
        bassGain.gain.setValueAtTime(0, audioCtx.currentTime);
        bassGain.gain.linearRampToValueAtTime(0.12, audioCtx.currentTime + 1);
        bassGain.gain.linearRampToValueAtTime(0.06, audioCtx.currentTime + 3.8);
        bass.connect(bassGain);
        bassGain.connect(masterGain);
        bass.start();
        oscillators.push(bass);
    }

    function stopAudio() {
        if (!audioCtx) return;
        masterGain.gain.cancelScheduledValues(audioCtx.currentTime);
        masterGain.gain.setValueAtTime(masterGain.gain.value, audioCtx.currentTime);
        masterGain.gain.linearRampToValueAtTime(0, audioCtx.currentTime + 2.5);
        clearInterval(chordInterval);
        setTimeout(() => {
            oscillators.forEach(o => { try { o.stop(); } catch (e) { } });
            lfoNodes.forEach(l => { try { l.stop(); } catch (e) { } });
            oscillators = [];
            lfoNodes = [];
        }, 2600);
        isPlaying = false;
    }

    const audioBtn = document.getElementById('audioToggle');
    const audioIcon = document.getElementById('audioIcon');
    const audioLabel = document.getElementById('audioLabel');

    audioBtn?.addEventListener('click', () => {
        if (!isPlaying) {
            startAudio();
            audioIcon.className = 'bi bi-music-note-list';
            audioLabel.textContent = 'Music On';
            audioBtn.classList.add('playing');
        } else {
            stopAudio();
            audioIcon.className = 'bi bi-music-note-beamed';
            audioLabel.textContent = 'Play Music';
            audioBtn.classList.remove('playing');
        }
    });

    /* ────────────────────────────────────────────────
       5.  PRELOADER DISMISS
    ──────────────────────────────────────────────── */
    const preloader = document.getElementById('preloader');

    window.addEventListener('load', () => {
        setTimeout(() => {
            preloader.classList.add('hidden');
            storyNav.classList.add('visible');
            syncUI();
            startTypingEffect();
            initPortraitRipple();
        }, 3200);
    });

    /* ────────────────────────────────────────────────
       6.  TYPING EFFECT ON COVER
    ──────────────────────────────────────────────── */
    const TYPED_TEXT = STORY_CONFIG.typingMessage.replace('{name}', STORY_CONFIG.name);

    function startTypingEffect() {
        const el = document.getElementById('typedSub');
        if (!el) return;
        el.textContent = '';
        let i = 0;
        const iv = setInterval(() => {
            el.textContent = TYPED_TEXT.slice(0, ++i);
            if (i >= TYPED_TEXT.length) clearInterval(iv);
        }, 42);
    }

    /* ────────────────────────────────────────────────
       7.  PORTRAIT CLICK RIPPLE
    ──────────────────────────────────────────────── */
    function initPortraitRipple() {
        document.querySelectorAll('.portrait-card, .cover-portrait-img, .finale-afsana-img').forEach(card => {
            card.addEventListener('click', function (e) {
                sfx.heartBurst();
                spawnBurstHearts(e.clientX, e.clientY, 10);
                const ripple = document.createElement('div');
                ripple.className = 'portrait-ripple';
                const rect = this.getBoundingClientRect();
                const size = Math.max(rect.width, rect.height);
                ripple.style.cssText = `
                    width: ${size}px; height: ${size}px;
                    left: ${rect.left + rect.width / 2 - size / 2}px;
                    top: ${rect.top + rect.height / 2 - size / 2}px;
                    position: fixed; z-index: 9999;
                `;
                document.body.appendChild(ripple);
                setTimeout(() => ripple.remove(), 900);
            });
        });
    }

    /* ────────────────────────────────────────────────
       6.  GLOW ORBS — follow mouse
    ──────────────────────────────────────────────── */
    const orb3 = document.querySelector('.orb-3');
    let mouseX = window.innerWidth / 2, mouseY = window.innerHeight / 2;
    let curOrbX = mouseX, curOrbY = mouseY;

    document.addEventListener('mousemove', (e) => {
        mouseX = e.clientX; mouseY = e.clientY;
    });

    function orbFollow() {
        curOrbX += (mouseX - curOrbX) * 0.025;
        curOrbY += (mouseY - curOrbY) * 0.025;
        if (orb3) {
            orb3.style.left = `${curOrbX - 200}px`;
            orb3.style.top = `${curOrbY - 200}px`;
            orb3.style.transform = 'none'; // remove the % centering when following mouse
        }
        requestAnimationFrame(orbFollow);
    }
    orbFollow();

    /* ────────────────────────────────────────────────
       7.  CLICK BURST HEARTS
    ──────────────────────────────────────────────── */
    document.addEventListener('click', (e) => {
        if (e.target.closest('button')) {
            // Buttons have their own sounds; skip burst
            return;
        }
        sfx.heartBurst();
        spawnBurstHearts(e.clientX, e.clientY, 6);
    });

    function spawnBurstHearts(x, y, count) {
        for (let i = 0; i < count; i++) {
            const el = document.createElement('div');
            const angle = (Math.PI * 2 / count) * i;
            const dist = 40 + Math.random() * 30;
            const size = 12 + Math.random() * 14;
            const dx = Math.cos(angle) * dist;
            const dy = Math.sin(angle) * dist;
            el.style.cssText = `
            position: fixed; pointer-events: none; z-index: 9997;
            font-size: ${size}px; color: rgba(255,45,120,0.85);
            left: ${x}px; top: ${y}px;
            transition: transform 1s cubic-bezier(0.23,1,0.32,1), opacity 1s ease;
            filter: drop-shadow(0 0 5px rgba(255,45,120,0.5));
        `;
            el.textContent = '♥';
            document.body.appendChild(el);
            requestAnimationFrame(() => {
                el.style.transform = `translate(${dx}px, ${dy - 30}px) scale(0)`;
                el.style.opacity = '0';
            });
            setTimeout(() => el.remove(), 1100);
        }
    }

    /* ────────────────────────────────────────────────
       8.  INIT
    ──────────────────────────────────────────────── */
    injectDynamicName(); // Inject name immediately
    syncUI();

}); // end DOMContentLoaded
