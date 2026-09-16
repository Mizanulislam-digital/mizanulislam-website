/**
 * Main Application Interactive Controller & UI Engine (Zero Warnings)
 * Target Entity: Mizanul Islam (mizanulislam.com)
 * Architecture: Enterprise Modular Event Controller & Security Hardened
 */

(function () {
    'use strict';

    /* ==========================================================================
       1. SECURITY, TOAST & UI UTILITIES
       ========================================================================== */

    /**
     * Escapes input string for XSS Prevention
     * @param {string} str
     * @returns {string}
     */
    function sanitizeInputString(str) {
        if (typeof str !== 'string') return '';
        return str.replace(/[&<>"']/g, function (m) {
            const map = {
                '&': '&amp;',
                '<': '&lt;',
                '>': '&gt;',
                '"': '&quot;',
                "'": '&#039;'
            };
            return map[m] || m;
        });
    }

    /**
     * Triggers dynamic Toast notification
     * @param {string} message 
     */
    function showToast(message) {
        const container = document.getElementById('toastContainer');
        if (!container) return;

        const toast = document.createElement('div');
        toast.className = 'toast';
        toast.textContent = message;
        container.appendChild(toast);

        setTimeout(() => {
            toast.style.opacity = '0';
            toast.style.transition = 'opacity 0.3s ease';
            setTimeout(() => toast.remove(), 300);
        }, 3000);
    }

    /**
     * Validates User Email Field
     * @param {string} email
     * @returns {boolean}
     */
    function validateEmail(email) {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(String(email).toLowerCase().trim());
    }

    /**
     * Validates User Phone Field
     * @param {string} phone
     * @returns {boolean}
     */
    function validatePhone(phone) {
        const re = /^[+]?[(]?[0-9]{3}[)]?[-\s.]?[0-9]{3}[-\s.]?[0-9]{4,6}$/;
        return re.test(String(phone).trim());
    }

    /**
     * Validates URL Field
     * @param {string} url
     * @returns {boolean}
     */
    function validateUrl(url) {
        try {
            const u = new URL(String(url).trim());
            return u.protocol === 'http:' || u.protocol === 'https:';
        } catch (_) {
            return false;
        }
    }

    /* ==========================================================================
       2. MOBILE DRAWER & HEADER SCROLL CONTROLLER
       ========================================================================== */
    function setupNavigationController() {
        const header = document.getElementById('siteHeader');
        const menuToggle = document.getElementById('menuToggle');
        const mobileDrawer = document.getElementById('mobileDrawer');
        const drawerBackdrop = document.getElementById('drawerBackdrop');
        const drawerClose = document.getElementById('drawerClose');
        const drawerLinks = document.querySelectorAll('.drawer-link');

        // Sticky Header Effect
        window.addEventListener('scroll', () => {
            if (window.scrollY > 30) {
                header?.classList.add('scrolled');
            } else {
                header?.classList.remove('scrolled');
            }
        }, { passive: true });

        // Open Mobile Drawer
        function openDrawer() {
            mobileDrawer?.classList.add('active');
            drawerBackdrop?.classList.add('active');
            document.body.classList.add('drawer-open');
            menuToggle?.setAttribute('aria-expanded', 'true');
            mobileDrawer?.setAttribute('aria-hidden', 'false');
            drawerBackdrop?.setAttribute('aria-hidden', 'false');
        }

        // Close Mobile Drawer
        function closeDrawer() {
            mobileDrawer?.classList.remove('active');
            drawerBackdrop?.classList.remove('active');
            document.body.classList.remove('drawer-open');
            menuToggle?.setAttribute('aria-expanded', 'false');
            mobileDrawer?.setAttribute('aria-hidden', 'true');
            drawerBackdrop?.setAttribute('aria-hidden', 'true');
        }

        menuToggle?.addEventListener('click', openDrawer);
        drawerClose?.addEventListener('click', closeDrawer);
        drawerBackdrop?.addEventListener('click', closeDrawer);

        drawerLinks.forEach(link => {
            link.addEventListener('click', closeDrawer);
        });

        // Escape key closes drawer
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && mobileDrawer?.classList.contains('active')) {
                closeDrawer();
            }
        });
    }

    /* ==========================================================================
       3. INTERACTIVE MARKETING UTILITIES (SYNCHRONIZED WITH HTML)
       ========================================================================== */

    /**
     * Tool 1: WhatsApp Link Builder Controller
     */
    function setupWhatsAppGenerator() {
        const btn = document.getElementById('btnGenerateWA');
        if (!btn) return;

        btn.addEventListener('click', function () {
            const phoneInput = /** @type {HTMLInputElement} */ (document.getElementById('waPhone'));
            const msgInput = /** @type {HTMLTextAreaElement} */ (document.getElementById('waMessage'));

            if (!phoneInput) return;

            const cleanPhone = phoneInput.value.trim().replace(/[^0-9]/g, '');
            const rawMsg = msgInput ? msgInput.value.trim() : '';

            if (!cleanPhone || cleanPhone.length < 8) {
                showToast('Please enter a valid WhatsApp phone number with country code.');
                return;
            }

            const encodedMsg = encodeURIComponent(rawMsg);
            const waUrl = `https://wa.me/${cleanPhone}${encodedMsg ? '?text=' + encodedMsg : ''}`;

            navigator.clipboard.writeText(waUrl).then(() => {
                showToast('WhatsApp Link Copied to Clipboard!');
            }).catch(() => {
                showToast('Link generated: ' + waUrl);
            });
        });
    }

    /**
     * Tool 2: UTM Campaign Link Builder Controller
     */
    function setupUtmGenerator() {
        const btn = document.getElementById('btnGenerateUTM');
        if (!btn) return;

        btn.addEventListener('click', function () {
            const urlInput = /** @type {HTMLInputElement} */ (document.getElementById('utmUrl'));
            const sourceInput = /** @type {HTMLInputElement} */ (document.getElementById('utmSource'));
            const mediumInput = /** @type {HTMLInputElement} */ (document.getElementById('utmMedium'));
            const campaignInput = /** @type {HTMLInputElement} */ (document.getElementById('utmCampaign'));

            if (!urlInput || !sourceInput) return;

            let baseUrl = urlInput.value.trim();
            const source = sourceInput.value.trim();
            const medium = mediumInput ? mediumInput.value.trim() : '';
            const campaign = campaignInput ? campaignInput.value.trim() : '';

            if (!baseUrl || !source) {
                showToast('Target URL and Source fields are required.');
                return;
            }

            if (!baseUrl.startsWith('http://') && !baseUrl.startsWith('https://')) {
                baseUrl = 'https://' + baseUrl;
            }

            try {
                const parsedUrl = new URL(baseUrl);
                parsedUrl.searchParams.set('utm_source', source);
                if (medium) parsedUrl.searchParams.set('utm_medium', medium);
                if (campaign) parsedUrl.searchParams.set('utm_campaign', campaign);

                const finalUtmUrl = parsedUrl.href;

                navigator.clipboard.writeText(finalUtmUrl).then(() => {
                    showToast('UTM Link generated & copied to clipboard!');
                }).catch(() => {
                    showToast('UTM Generated: ' + finalUtmUrl);
                });
            } catch (e) {
                showToast('Invalid Target URL format.');
            }
        });
    }

    /**
     * Tool 3: A/B Test Significance Evaluator (Z-Score & Normal CDF)
     */
    function setupAbEvaluator() {
        const btn = document.getElementById('btnCalcAB');
        if (!btn) return;

        function calculateNormalCdf(x) {
            const t = 1 / (1 + 0.2316419 * Math.abs(x));
            const d = 0.3989423 * Math.exp(-x * x / 2);
            const p = d * t * (0.3193815 + t * (-0.3565638 + t * (1.781478 + t * (-1.821256 + t * 1.330274))));
            return x >= 0 ? 1 - p : p;
        }

        btn.addEventListener('click', function () {
            const vA = parseFloat((/** @type {HTMLInputElement} */ (document.getElementById('abVisitorsA'))).value);
            const cA = parseFloat((/** @type {HTMLInputElement} */ (document.getElementById('abConvA'))).value);
            const vB = parseFloat((/** @type {HTMLInputElement} */ (document.getElementById('abVisitorsB'))).value);
            const cB = parseFloat((/** @type {HTMLInputElement} */ (document.getElementById('abConvB'))).value);
            const resDiv = document.getElementById('abResult');

            if (!resDiv || isNaN(vA) || isNaN(cA) || isNaN(vB) || isNaN(cB) || vA <= 0 || vB <= 0) {
                showToast('Provide valid numeric values for visitors and conversions.');
                return;
            }

            const p1 = cA / vA;
            const p2 = cB / vB;
            const cr1 = (p1 * 100).toFixed(2);
            const cr2 = (p2 * 100).toFixed(2);

            const pPooled = (cA + cB) / (vA + vB);
            const se = Math.sqrt(pPooled * (1 - pPooled) * ((1 / vA) + (1 / vB)));

            if (se === 0) {
                resDiv.innerHTML = 'Insufficient variance to evaluate statistical model.';
                resDiv.classList.add('active');
                return;
            }

            const zScore = (p2 - p1) / se;
            const pValue = 2 * (1 - calculateNormalCdf(Math.abs(zScore)));
            const confidence = ((1 - pValue) * 100).toFixed(1);

            let resultLabel = parseFloat(confidence) >= 95
                ? `<span style="color: #10b981;"><strong>Statistically Significant!</strong> (${confidence}% Confidence)</span>`
                : `<span><strong>Not Statistically Significant</strong> (${confidence}% Confidence - Aim for ≥95%)</span>`;

            resDiv.innerHTML = `
                Variant A CR: <strong>${cr1}%</strong> | Variant B CR: <strong>${cr2}%</strong><br>
                ${resultLabel}
            `;
            resDiv.classList.add('active');
        });
    }

    /**
     * Tool 4: Ad Budget ROI/ROAS Calculator
     */
    function setupRoiCalculator() {
        const btn = document.getElementById('btnCalcROI');
        if (!btn) return;

        btn.addEventListener('click', function () {
            const budget = parseFloat((/** @type {HTMLInputElement} */ (document.getElementById('roiBudget'))).value);
            const cpc = parseFloat((/** @type {HTMLInputElement} */ (document.getElementById('roiCpc'))).value);
            const convRate = parseFloat((/** @type {HTMLInputElement} */ (document.getElementById('roiConvRate'))).value);
            const aov = parseFloat((/** @type {HTMLInputElement} */ (document.getElementById('roiAov'))).value);
            const resDiv = document.getElementById('roiResult');

            if (!resDiv || isNaN(budget) || isNaN(cpc) || isNaN(convRate) || isNaN(aov) || cpc <= 0) {
                showToast('Please fill out all ROI fields with positive numbers.');
                return;
            }

            const clicks = budget / cpc;
            const conversions = clicks * (convRate / 100);
            const estimatedRevenue = conversions * aov;
            const roas = (estimatedRevenue / budget).toFixed(2);
            const netProfit = (estimatedRevenue - budget).toFixed(2);

            resDiv.innerHTML = `
                Est. Revenue: <strong>$${estimatedRevenue.toFixed(2)}</strong> | ROAS: <strong>${roas}x</strong><br>
                Est. Profit: <strong>$${netProfit}</strong> (Est. Conversions: ${Math.floor(conversions)})
            `;
            resDiv.classList.add('active');
        });
    }

    /* ==========================================================================
       4. CONSULTATION FORM CONTROLLER (Self-Contained)
       ========================================================================== */
    function setupConsultationForm() {
        const form = document.getElementById('consultationForm');
        if (!form) return;

        const btn = document.getElementById('btnBookCall');
        const btnText = btn ? btn.querySelector('.btn-text') : null;
        const spinner = btn ? btn.querySelector('.btn-spinner') : null;
        const dateInput = document.getElementById('preferredDate');
        const timeInput = document.getElementById('selectedTime');
        const summaryPlan = document.getElementById('summaryPlan');
        const summaryPrice = document.getElementById('summaryPrice');

        /* ---------- 1. Minimum date = tomorrow ---------- */
        if (dateInput) {
            const tomorrow = new Date();
            tomorrow.setDate(tomorrow.getDate() + 1);
            const yyyy = tomorrow.getFullYear();
            const mm = String(tomorrow.getMonth() + 1).padStart(2, '0');
            const dd = String(tomorrow.getDate()).padStart(2, '0');
            dateInput.min = `${yyyy}-${mm}-${dd}`;
        }

        /* ---------- 2. Session type selector ---------- */
        const sessionOptions = form.querySelectorAll('.session-option');
        sessionOptions.forEach(function (opt) {
            opt.addEventListener('click', function () {
                sessionOptions.forEach(o => o.classList.remove('active'));
                opt.classList.add('active');

                const radio = opt.querySelector('input[type="radio"]');
                if (radio) radio.checked = true;

                const title = opt.querySelector('h5');
                const duration = opt.getAttribute('data-duration') || '';
                const price = opt.getAttribute('data-price') || '0';

                if (summaryPlan && title) {
                    summaryPlan.textContent = `${title.textContent} (${duration})`;
                }
                if (summaryPrice) {
                    summaryPrice.textContent = `$${price} USD`;
                }
            });
        });

        /* ---------- 3. Time slot selector ---------- */
        const timeButtons = form.querySelectorAll('.time-slot-btn');
        timeButtons.forEach(function (b) {
            b.addEventListener('click', function () {
                timeButtons.forEach(x => x.classList.remove('active'));
                b.classList.add('active');
                if (timeInput) timeInput.value = b.getAttribute('data-time') || '';
                clearError('selectedTime');
            });
        });

        /* ---------- 4. Validation helpers ---------- */
        function setError(fieldId, message) {
            const input = document.getElementById(fieldId);
            const err = document.getElementById('err-' + fieldId);
            if (input) input.classList.add('invalid');
            if (err) err.textContent = message;
        }

        function clearError(fieldId) {
            const input = document.getElementById(fieldId);
            const err = document.getElementById('err-' + fieldId);
            if (input) input.classList.remove('invalid');
            if (err) err.textContent = '';
        }

        /* ---------- 5. Live error clearing ---------- */
        ['clientName', 'clientEmail', 'websiteUrl', 'preferredDate', 'businessChallenge'].forEach(function (id) {
            const el = document.getElementById(id);
            if (el) {
                el.addEventListener('input', function () { clearError(id); });
                el.addEventListener('change', function () { clearError(id); });
            }
        });

        /* ---------- 6. Submit handler ---------- */
        form.addEventListener('submit', async function (e) {
            e.preventDefault();

            let valid = true;

            const name = (document.getElementById('clientName')?.value || '').trim();
            const email = (document.getElementById('clientEmail')?.value || '').trim();
            const website = (document.getElementById('websiteUrl')?.value || '').trim();
            const date = (document.getElementById('preferredDate')?.value || '').trim();
            const challenge = (document.getElementById('businessChallenge')?.value || '').trim();
            const time = timeInput ? timeInput.value : '';
            const sessionRadio = form.querySelector('input[name="sessionType"]:checked');
            const session = sessionRadio ? sessionRadio.value : '';

            // Name
            if (!name) { setError('clientName', 'Full name is required.'); valid = false; }
            else if (name.length < 2) { setError('clientName', 'Name is too short.'); valid = false; }
            else clearError('clientName');

            // Email
            if (!email) { setError('clientEmail', 'Email is required.'); valid = false; }
            else if (!validateEmail(email)) { setError('clientEmail', 'Enter a valid email address.'); valid = false; }
            else clearError('clientEmail');

            // Website
            if (!website) { setError('websiteUrl', 'Website URL is required.'); valid = false; }
            else if (!validateUrl(website)) { setError('websiteUrl', 'Enter a valid URL (e.g., https://yourbrand.com).'); valid = false; }
            else clearError('websiteUrl');

            // Date
            if (!date) {
                setError('preferredDate', 'Preferred date is required.');
                valid = false;
            } else {
                const picked = new Date(date + 'T00:00:00');
                const today = new Date();
                today.setHours(0, 0, 0, 0);
                if (picked <= today) {
                    setError('preferredDate', 'Please pick a future date.');
                    valid = false;
                } else {
                    clearError('preferredDate');
                }
            }

            // Time
            if (!time) { setError('selectedTime', 'Please select a time slot.'); valid = false; }
            else clearError('selectedTime');

            // Challenge
            if (!challenge) { setError('businessChallenge', 'Please describe your goal.'); valid = false; }
            else if (challenge.length < 10) { setError('businessChallenge', 'Please write at least 10 characters.'); valid = false; }
            else clearError('businessChallenge');

            if (!valid) {
                showToast('Please fix the highlighted fields.');
                const firstInvalid = form.querySelector('.invalid');
                if (firstInvalid && typeof firstInvalid.scrollIntoView === 'function') {
                    firstInvalid.scrollIntoView({ behavior: 'smooth', block: 'center' });
                    firstInvalid.focus({ preventScroll: true });
                }
                return;
            }

            /* ---------- 7. UI loading state ---------- */
            if (btn) btn.disabled = true;
            if (btnText) btnText.textContent = 'Sending...';
            if (spinner) spinner.classList.remove('hidden');

            try {
                const payload = {
                    name: name,
                    email: email,
                    website: website,
                    session: session,
                    preferred_date: date,
                    preferred_time: time,
                    challenge: challenge
                };

                const res = await fetch('/api/consultation', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(payload)
                });

                const data = await res.json().catch(() => ({ success: false }));

                if (res.ok && data && data.success) {
                    showToast('✅ Request sent! I will reply by email shortly.');
                    form.reset();
                    if (timeInput) timeInput.value = '10:00 AM';
                    if (summaryPlan) summaryPlan.textContent = 'Strategy Call (45 Mins)';
                    if (summaryPrice) summaryPrice.textContent = '$99 USD';

                    sessionOptions.forEach((o, i) => o.classList.toggle('active', i === 0));
                    timeButtons.forEach((b, i) => b.classList.toggle('active', i === 0));

                    // Reset date min for next submission
                    if (dateInput) {
                        const tomorrow = new Date();
                        tomorrow.setDate(tomorrow.getDate() + 1);
                        const yyyy = tomorrow.getFullYear();
                        const mm = String(tomorrow.getMonth() + 1).padStart(2, '0');
                        const dd = String(tomorrow.getDate()).padStart(2, '0');
                        dateInput.min = `${yyyy}-${mm}-${dd}`;
                    }
                } else {
                    showToast('❌ Could not send. Email mail.mizanulislam@gmail.com');
                }
            } catch (err) {
                console.error('[Consultation] Submit error:', err);
                showToast('⚠️ Network error. Please try again.');
            } finally {
                if (btn) btn.disabled = false;
                if (btnText) btnText.textContent = 'Confirm & Proceed to Booking';
                if (spinner) spinner.classList.add('hidden');
            }
        });
    }

    /* ==========================================================================
       5. INITIALIZATION HOOK
       ========================================================================== */
    function init() {
        setupNavigationController();
        setupWhatsAppGenerator();
        setupUtmGenerator();
        setupAbEvaluator();
        setupRoiCalculator();
        setupConsultationForm();
        console.log('[Mizan DevStudio Pro]: Core Architecture Engine Loaded Successfully.');
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
