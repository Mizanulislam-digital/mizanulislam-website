/**
 * Main Application Interactive Controller & UI Engine
 * Target Entity: Mizanul Islam (mizanulislam.com)
 * Handles: Navigation, Tools, Consultation Form, Home Form, Contact Form
 */

(function () {
    'use strict';

    /* ==========================================================================
       1. UTILITIES
       ========================================================================== */

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
     * Universal GA4 event tracker
     * Uses window.gtag (Zaraz auto-captures gtag events)
     * Safe fallback if gtag unavailable
     */
    function trackEvent(eventName, params) {
        try {
            if (typeof window.gtag === 'function') {
                window.gtag('event', eventName, params || {});
                console.log('[Track]', eventName, params);
            } else {
                console.log('[Track-skip] gtag not available:', eventName);
            }
        } catch (err) {
            console.warn('[Track error]', err);
        }
    }

    function validateEmail(email) {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(String(email).toLowerCase().trim());
    }

    function validatePhone(phone) {
        const re = /^[+]?[(]?[0-9]{3}[)]?[-\s.]?[0-9]{3}[-\s.]?[0-9]{4,6}$/;
        return re.test(String(phone).trim());
    }

    function validateUrl(url) {
        try {
            const u = new URL(String(url).trim());
            return u.protocol === 'http:' || u.protocol === 'https:';
        } catch (_) {
            return false;
        }
    }

    function tomorrowISO() {
        const t = new Date();
        t.setDate(t.getDate() + 1);
        const yyyy = t.getFullYear();
        const mm = String(t.getMonth() + 1).padStart(2, '0');
        const dd = String(t.getDate()).padStart(2, '0');
        return `${yyyy}-${mm}-${dd}`;
    }

    /* ==========================================================================
       2. NAVIGATION CONTROLLER
       ========================================================================== */
    function setupNavigationController() {
        const header = document.getElementById('siteHeader');
        const menuToggle = document.getElementById('menuToggle');
        const mobileDrawer = document.getElementById('mobileDrawer');
        const drawerBackdrop = document.getElementById('drawerBackdrop');
        const drawerClose = document.getElementById('drawerClose');
        const drawerLinks = document.querySelectorAll('.drawer-link');

        window.addEventListener('scroll', () => {
            if (window.scrollY > 30) {
                header?.classList.add('scrolled');
            } else {
                header?.classList.remove('scrolled');
            }
        }, { passive: true });

        function openDrawer() {
            mobileDrawer?.classList.add('active');
            drawerBackdrop?.classList.add('active');
            document.body.classList.add('drawer-open');
            menuToggle?.setAttribute('aria-expanded', 'true');
            mobileDrawer?.setAttribute('aria-hidden', 'false');
            drawerBackdrop?.setAttribute('aria-hidden', 'false');
        }

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

        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && mobileDrawer?.classList.contains('active')) {
                closeDrawer();
            }
        });

        /* --------------------------------------------------------------------
           CTA Click Tracking (event delegation)
           -------------------------------------------------------------------- */
        document.addEventListener('click', function (e) {
            const target = e.target.closest('a, button');
            if (!target) return;

            const href = target.getAttribute('href') || '';
            const text = (target.textContent || '').trim().toLowerCase();

            if (href === '/consultation' || text.includes('book') || text.includes('work with me')) {
                trackEvent('cta_click', {
                    cta_text: text.slice(0, 50),
                    cta_location: window.location.pathname
                });
            }
        });
    }

    /* ==========================================================================
       3. MARKETING TOOLS
       ========================================================================== */

    function setupWhatsAppGenerator() {
        const btn = document.getElementById('btnGenerateWA');
        if (!btn) return;

        btn.addEventListener('click', function () {
            const phoneInput = document.getElementById('waPhone');
            const msgInput = document.getElementById('waMessage');
            if (!phoneInput) return;

            const cleanPhone = phoneInput.value.trim().replace(/[^0-9]/g, '');
            const rawMsg = msgInput ? msgInput.value.trim() : '';

            if (!cleanPhone || cleanPhone.length < 8) {
                showToast('Please enter a valid WhatsApp phone number with country code.');
                return;
            }

            const encodedMsg = encodeURIComponent(rawMsg);
            const waUrl = `https://wa.me/${cleanPhone}${encodedMsg ? '?text=' + encodedMsg : ''}`;

            trackEvent('tool_used', { tool_name: 'whatsapp_generator' });

            navigator.clipboard.writeText(waUrl).then(() => {
                showToast('WhatsApp Link Copied to Clipboard!');
            }).catch(() => {
                showToast('Link generated: ' + waUrl);
            });
        });
    }

    function setupUtmGenerator() {
        const btn = document.getElementById('btnGenerateUTM');
        if (!btn) return;

        btn.addEventListener('click', function () {
            const urlInput = document.getElementById('utmUrl');
            const sourceInput = document.getElementById('utmSource');
            const mediumInput = document.getElementById('utmMedium');
            const campaignInput = document.getElementById('utmCampaign');

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

                trackEvent('tool_used', { tool_name: 'utm_builder' });

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
            const vA = parseFloat(document.getElementById('abVisitorsA').value);
            const cA = parseFloat(document.getElementById('abConvA').value);
            const vB = parseFloat(document.getElementById('abVisitorsB').value);
            const cB = parseFloat(document.getElementById('abConvB').value);
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

            trackEvent('tool_used', { tool_name: 'ab_evaluator' });

            resDiv.innerHTML = `
                Variant A CR: <strong>${cr1}%</strong> | Variant B CR: <strong>${cr2}%</strong><br>
                ${resultLabel}
            `;
            resDiv.classList.add('active');
        });
    }

    function setupRoiCalculator() {
        const btn = document.getElementById('btnCalcROI');
        if (!btn) return;

        btn.addEventListener('click', function () {
            const budget = parseFloat(document.getElementById('roiBudget').value);
            const cpc = parseFloat(document.getElementById('roiCpc').value);
            const convRate = parseFloat(document.getElementById('roiConvRate').value);
            const aov = parseFloat(document.getElementById('roiAov').value);
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

            trackEvent('tool_used', { tool_name: 'roi_calculator' });

            resDiv.innerHTML = `
                Est. Revenue: <strong>$${estimatedRevenue.toFixed(2)}</strong> | ROAS: <strong>${roas}x</strong><br>
                Est. Profit: <strong>$${netProfit}</strong> (Est. Conversions: ${Math.floor(conversions)})
            `;
            resDiv.classList.add('active');
        });
    }

    /* ==========================================================================
       4. CONSULTATION PAGE FORM
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

        if (dateInput) dateInput.min = tomorrowISO();

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

                if (summaryPlan && title) summaryPlan.textContent = `${title.textContent} (${duration})`;
                if (summaryPrice) summaryPrice.textContent = `$${price} USD`;
            });
        });

        const timeButtons = form.querySelectorAll('.time-slot-btn');
        timeButtons.forEach(function (b) {
            b.addEventListener('click', function () {
                timeButtons.forEach(x => x.classList.remove('active'));
                b.classList.add('active');
                if (timeInput) timeInput.value = b.getAttribute('data-time') || '';
                clearError('selectedTime');
            });
        });

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

        ['clientName', 'clientEmail', 'websiteUrl', 'preferredDate', 'businessChallenge'].forEach(function (id) {
            const el = document.getElementById(id);
            if (el) {
                el.addEventListener('input', function () { clearError(id); });
                el.addEventListener('change', function () { clearError(id); });
            }
        });

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

            if (!name || name.length < 2) { setError('clientName', 'Full name is required.'); valid = false; } else clearError('clientName');
            if (!email) { setError('clientEmail', 'Email is required.'); valid = false; }
            else if (!validateEmail(email)) { setError('clientEmail', 'Enter a valid email address.'); valid = false; }
            else clearError('clientEmail');

            if (!website) { setError('websiteUrl', 'Website URL is required.'); valid = false; }
            else if (!validateUrl(website)) { setError('websiteUrl', 'Enter a valid URL.'); valid = false; }
            else clearError('websiteUrl');

            if (!date) { setError('preferredDate', 'Preferred date is required.'); valid = false; }
            else {
                const picked = new Date(date + 'T00:00:00');
                const today = new Date(); today.setHours(0, 0, 0, 0);
                if (picked <= today) { setError('preferredDate', 'Please pick a future date.'); valid = false; }
                else clearError('preferredDate');
            }

            if (!time) { setError('selectedTime', 'Please select a time slot.'); valid = false; }
            else clearError('selectedTime');

            if (!challenge || challenge.length < 10) { setError('businessChallenge', 'Please write at least 10 characters.'); valid = false; }
            else clearError('businessChallenge');

            if (!valid) {
                showToast('Please fix the highlighted fields.');
                const firstInvalid = form.querySelector('.invalid');
                if (firstInvalid) firstInvalid.scrollIntoView({ behavior: 'smooth', block: 'center' });
                return;
            }

            if (btn) btn.disabled = true;
            if (btnText) btnText.textContent = 'Sending...';
            if (spinner) spinner.classList.remove('hidden');

            try {
                const res = await fetch('/api/consultation', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        name, email, website, session,
                        preferred_date: date,
                        preferred_time: time,
                        challenge,
                        source: 'Consultation Page'
                    })
                });

                const data = await res.json().catch(() => ({ success: false }));

                if (res.ok && data && data.success) {
                    trackEvent('form_submit', { form_type: 'consultation' });

                    showToast('✅ Request sent! I will reply by email shortly.');
                    form.reset();
                    if (timeInput) timeInput.value = '10:00 AM';
                    if (summaryPlan) summaryPlan.textContent = 'Free Discovery (15 Mins)';
                    if (summaryPrice) summaryPrice.textContent = 'Free';
                    sessionOptions.forEach((o, i) => o.classList.toggle('active', i === 0));
                    timeButtons.forEach((b, i) => b.classList.toggle('active', i === 0));
                } else {
                    showToast('❌ Could not send. Email mail.mizanulislam@gmail.com');
                }
            } catch (err) {
                console.error('[Consultation] Submit error:', err);
                showToast('⚠️ Network error. Please try again.');
            } finally {
                if (btn) btn.disabled = false;
                if (btnText) btnText.textContent = 'Request Discovery Call';
                if (spinner) spinner.classList.add('hidden');
            }
        });
    }

    /* ==========================================================================
       5. HOME PAGE FORM
       ========================================================================== */
    function setupHomeConsultationForm() {
        const form = document.getElementById('homeConsultationForm');
        if (!form) return;

        const btn = document.getElementById('btnSubmit');
        const btnText = btn ? btn.querySelector('.btn-text') : null;
        const spinner = btn ? btn.querySelector('.btn-spinner') : null;
        const dateInput = document.getElementById('preferredDate');

        if (dateInput) dateInput.min = tomorrowISO();

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

        ['fullName', 'email', 'phone', 'businessWebsite', 'monthlyBudget', 'preferredDate', 'preferredTime'].forEach(function (id) {
            const el = document.getElementById(id);
            if (el) {
                el.addEventListener('input', function () { clearError(id); });
                el.addEventListener('change', function () { clearError(id); });
            }
        });

        form.addEventListener('submit', async function (e) {
            e.preventDefault();

            let valid = true;
            const fullName = (document.getElementById('fullName')?.value || '').trim();
            const email = (document.getElementById('email')?.value || '').trim();
            const phone = (document.getElementById('phone')?.value || '').trim();
            const businessWebsite = (document.getElementById('businessWebsite')?.value || '').trim();
            const monthlyBudget = (document.getElementById('monthlyBudget')?.value || '').trim();
            const preferredDate = (document.getElementById('preferredDate')?.value || '').trim();
            const preferredTime = (document.getElementById('preferredTime')?.value || '').trim();
            const notes = (document.getElementById('notes')?.value || '').trim();

            if (!fullName || fullName.length < 2) { setError('fullName', 'Full name is required.'); valid = false; }
            else clearError('fullName');

            if (!email) { setError('email', 'Email is required.'); valid = false; }
            else if (!validateEmail(email)) { setError('email', 'Enter a valid email address.'); valid = false; }
            else clearError('email');

            if (!phone) { setError('phone', 'Phone number is required.'); valid = false; }
            else if (!validatePhone(phone)) { setError('phone', 'Enter a valid phone number.'); valid = false; }
            else clearError('phone');

            if (businessWebsite && !validateUrl(businessWebsite)) {
                setError('businessWebsite', 'Enter a valid URL.');
                valid = false;
            } else clearError('businessWebsite');

            if (!monthlyBudget) { setError('monthlyBudget', 'Please select a budget range.'); valid = false; }
            else clearError('monthlyBudget');

            if (!preferredDate) { setError('preferredDate', 'Preferred date is required.'); valid = false; }
            else {
                const picked = new Date(preferredDate + 'T00:00:00');
                const today = new Date(); today.setHours(0, 0, 0, 0);
                if (picked <= today) { setError('preferredDate', 'Please pick a future date.'); valid = false; }
                else clearError('preferredDate');
            }

            if (!preferredTime) { setError('preferredTime', 'Please select a time slot.'); valid = false; }
            else clearError('preferredTime');

            if (!valid) {
                showToast('Please fix the highlighted fields.');
                const firstInvalid = form.querySelector('.invalid');
                if (firstInvalid) firstInvalid.scrollIntoView({ behavior: 'smooth', block: 'center' });
                return;
            }

            if (btn) btn.disabled = true;
            if (btnText) btnText.textContent = 'Sending...';
            if (spinner) spinner.classList.remove('hidden');

            try {
                const res = await fetch('/api/consultation', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        name: fullName,
                        email: email,
                        phone: phone,
                        website: businessWebsite || 'N/A',
                        session: 'Home Page Consultation',
                        preferred_date: preferredDate,
                        preferred_time: preferredTime,
                        challenge: notes || 'N/A',
                        monthly_budget: monthlyBudget,
                        source: 'Home Page'
                    })
                });

                const data = await res.json().catch(() => ({ success: false }));

                if (res.ok && data && data.success) {
                    trackEvent('form_submit', { form_type: 'home' });

                    showToast('✅ Request sent! I will reply by email shortly.');
                    form.reset();
                    if (dateInput) dateInput.min = tomorrowISO();
                } else {
                    showToast('❌ Could not send. Email mail.mizanulislam@gmail.com');
                }
            } catch (err) {
                console.error('[Home Consultation] Submit error:', err);
                showToast('⚠️ Network error. Please try again.');
            } finally {
                if (btn) btn.disabled = false;
                if (btnText) btnText.textContent = 'Submit Consultation Request';
                if (spinner) spinner.classList.add('hidden');
            }
        });
    }

    /* ==========================================================================
       6. CONTACT FORM
       ========================================================================== */
    function setupContactForm() {
        const form = document.getElementById('contactInquiryForm');
        if (!form) return;

        const btn = document.getElementById('btnSendInquiry');
        const btnText = btn ? btn.querySelector('.btn-text') : null;
        const spinner = btn ? btn.querySelector('.btn-spinner') : null;

        form.addEventListener('submit', async function (e) {
            e.preventDefault();

            const name = (document.getElementById('senderName')?.value || '').trim();
            const email = (document.getElementById('senderEmail')?.value || '').trim();
            const subject = (document.getElementById('inquirySubject')?.value || '').trim();
            const message = (document.getElementById('senderMessage')?.value || '').trim();

            let valid = true;

            if (!name || name.length < 2) {
                showToast('Please enter your name.');
                valid = false;
            }
            if (!email || !validateEmail(email)) {
                showToast('Please enter a valid email.');
                valid = false;
            }
            if (!subject) {
                showToast('Please select an inquiry category.');
                valid = false;
            }
            if (!message || message.length < 10) {
                showToast('Please write at least 10 characters.');
                valid = false;
            }

            if (!valid) return;

            if (btn) btn.disabled = true;
            if (btnText) btnText.textContent = 'Sending...';
            if (spinner) spinner.classList.remove('hidden');

            try {
                const res = await fetch('/api/consultation', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        name: name,
                        email: email,
                        website: 'N/A',
                        session: 'Contact Form: ' + subject,
                        preferred_date: 'N/A',
                        preferred_time: 'N/A',
                        challenge: message,
                        source: 'Contact Form'
                    })
                });

                const data = await res.json().catch(() => ({ success: false }));

                if (res.ok && data && data.success) {
                    trackEvent('form_submit', { form_type: 'contact' });

                    showToast('✅ Message sent! I will reply within 12 hours.');
                    form.reset();
                } else {
                    showToast('❌ Could not send. Email mail.mizanulislam@gmail.com');
                }
            } catch (err) {
                console.error('[Contact] Submit error:', err);
                showToast('⚠️ Network error. Please try again.');
            } finally {
                if (btn) btn.disabled = false;
                if (btnText) btnText.textContent = 'Send Message Direct';
                if (spinner) spinner.classList.add('hidden');
            }
        });
    }

    /* ==========================================================================
       7. INIT
       ========================================================================== */
    function init() {
        setupNavigationController();
        setupWhatsAppGenerator();
        setupUtmGenerator();
        setupAbEvaluator();
        setupRoiCalculator();
        setupConsultationForm();
        setupHomeConsultationForm();
        setupContactForm();
        console.log('[Mizan DevStudio Pro]: Core Architecture Engine Loaded Successfully.');
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
