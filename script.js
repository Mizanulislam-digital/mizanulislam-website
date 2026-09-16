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
        });

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
       4. SECURE FORM VALIDATION CONTROLLER
       ========================================================================== */
    function setupConsultationForm() {
        const form = document.getElementById('consultationForm');
        if (!form) return;
        if (document.getElementById('clientName')) return;

        form.addEventListener('submit', function (e) {
            e.preventDefault();

            let isValid = true;
            const fields = ['fullName', 'email', 'phone', 'monthlyBudget', 'preferredDate', 'preferredTime'];

            fields.forEach(fieldId => {
                const input = document.getElementById(fieldId);
                const errSpan = document.getElementById(`err-${fieldId}`);
                if (!input || !errSpan) return;

                input.classList.remove('invalid');
                errSpan.textContent = '';

                if (!input.value.trim()) {
                    input.classList.add('invalid');
                    errSpan.textContent = 'This field is required.';
                    isValid = false;
                }
            });

            const emailInput = /** @type {HTMLInputElement} */ (document.getElementById('email'));
            if (emailInput && emailInput.value && !validateEmail(emailInput.value)) {
                emailInput.classList.add('invalid');
                document.getElementById('err-email').textContent = 'Enter a valid email address.';
                isValid = false;
            }

            const phoneInput = /** @type {HTMLInputElement} */ (document.getElementById('phone'));
            if (phoneInput && phoneInput.value && !validatePhone(phoneInput.value)) {
                phoneInput.classList.add('invalid');
                document.getElementById('err-phone').textContent = 'Enter a valid phone number.';
                isValid = false;
            }

            if (isValid) {
                const btnSubmit = document.getElementById('btnSubmit');
                const btnText = btnSubmit?.querySelector('.btn-text');
                const spinner = btnSubmit?.querySelector('.btn-spinner');

                if (btnText && spinner) {
                    btnText.textContent = 'Submitting Request...';
                    spinner.classList.remove('hidden');
                }

                setTimeout(() => {
                    showToast('Consultation Strategy Request Submitted Successfully!');
                    form.reset();
                    if (btnText && spinner) {
                        btnText.textContent = 'Submit Consultation Request';
                        spinner.classList.add('hidden');
                    }
                }, 1500);
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
