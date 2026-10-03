/**
 * Theme (Dark/Light) & Language (EN/BN) Toggle System
 * Works across all pages that include this script
 */

(function () {
    'use strict';

    // ========== TRANSLATIONS ==========
    const translations = {
        en: {
            "nav-services": "Services",
            "nav-tools": "Tools",
            "nav-about": "About",
            "nav-portfolio": "Portfolio",
            "nav-cases": "Case Studies",
            "nav-blog": "Blog",
            "nav-book": "Book Strategy Call",
            "hero-badge": "Building Real Systems",
            "hero-title-1": 'Meta Ads & CAPI Tracking <br><span class="highlight">Built On Real Foundations</span>',
            "hero-desc": "I build performance marketing systems for e-commerce brands — Meta Ads, server-side CAPI tracking, and conversion-focused funnels. Based in Dhaka, Bangladesh. Working with clients globally.",
            "hero-cta-1": "Work With Me",
            "hero-cta-2": "Explore Free Tools",
            "stat-1": "Schema Types",
            "stat-2": "Marketing Tools",
            "stat-3": "Pages Built",
            "stat-4": "Client Projects",
            "services-title": "Services & Systems I've Built",
            "services-desc": "Real implementations across paid media, tracking, and conversion",
            "service-1-title": "Meta & Google Ads",
            "service-1-desc": "Campaign structure, creative testing, ABO → CBO scaling, and ROAS-focused optimization.",
            "service-2-title": "CAPI & Tracking Setup",
            "service-2-desc": "Server-side Conversions API, sGTM containers, event deduplication, and iOS signal recovery.",
            "service-3-title": "Funnels & CRO",
            "service-3-desc": "Landing page clarity, offer framing, form friction reduction, and mobile speed optimization.",
            "work-title": "Recent Work & Technical Builds",
            "work-desc": "Real projects — client campaigns and self-built infrastructure",
            "work-1-tag": "Client Work · Meta Ads",
            "work-1-title": "Meta Ads — Rizq Fashion",
            "work-1-desc": "Set up and managed Meta Ads campaigns for a women's clothing brand — campaign structure, audience targeting, creative testing, and pixel tracking.",
            "work-2-tag": "Client Work · Google Ads",
            "work-2-title": "Google Ads — Rizq Fashion",
            "work-2-desc": "Built Search and Performance Max campaigns to complement Meta Ads, with keyword research and conversion tracking.",
            "work-3-tag": "Technical · This Website",
            "work-3-title": "Complete Analytics Stack",
            "work-3-desc": "Server-side analytics setup with Cloudflare Zaraz + GTM v4 + GA4 — verified live on this site.",
            "work-view": "View Case Study →",
            "work-cta": "View All Case Studies →",
            "tools-title": "Free Marketing Tools",
            "tools-desc": "Client-side tools I built — no signup, no tracking",
            "tool-1-title": "WhatsApp Link Builder",
            "tool-1-desc": "Generate instant direct WhatsApp chat links with customized pre-filled messages.",
            "tool-1-btn": "Generate & Copy Link",
            "tool-2-title": "UTM Link Generator",
            "tool-2-desc": "Create clean, trackable campaign links for analytics platforms.",
            "tool-2-btn": "Generate UTM Link",
            "tool-3-title": "A/B Test Significance Evaluator",
            "tool-3-desc": "Calculate statistical significance, conversion rate lift, and confidence interval between two variants.",
            "tool-3-varA": "Variant A (Control)",
            "tool-3-varB": "Variant B (Variation)",
            "tool-3-btn": "Evaluate Significance",
            "tool-4-title": "Ad Budget ROI Calculator",
            "tool-4-desc": "Calculate your expected Return on Ad Spend (ROAS) and revenue instantly.",
            "tool-4-btn": "Calculate ROI",
            "booking-title": "📅 Book Your Free 15-Min Discovery Call",
            "booking-desc": "Fill out the form below to schedule a discovery call about your Meta Ads, tracking, or funnel challenges.",
            "booking-benefit-1": "15-Minute Free Discovery Call",
            "booking-benefit-2": "Ad Account & Funnel Review",
            "booking-benefit-3": "Honest Feedback — Not Sales Pitch",
            "form-name": "Full Name *",
            "form-email": "Email Address *",
            "form-phone": "Phone Number *",
            "form-website": "Website / Page Link",
            "form-budget": "Monthly Ad Budget *",
            "form-budget-placeholder": "Select Budget Range",
            "form-date": "Preferred Date *",
            "form-time": "Preferred Time Slot *",
            "form-time-placeholder": "Select Time Slot",
            "form-notes": "Briefly Describe Your Goal",
            "form-submit": "Request Discovery Call",
            "faq-title": "Frequently Asked Questions",
            "faq-desc": "Quick answers about services, pricing, and how I work",
            "faq-q1": "What services does Mizanul Islam offer?",
            "faq-a1": "Mizanul Islam offers Meta Ads management, Google Ads campaigns, Meta CAPI tracking setup, conversion rate optimization (CRO), and WhatsApp Cloud API automation. Currently open to new client collaborations — based in Dhaka, Bangladesh, working with clients globally.",
            "faq-q2": "How much does a discovery call cost?",
            "faq-a2": "The 15-minute discovery call is free. Intro strategy calls (45 minutes) are $49, and full system audits (90 minutes) are $149. Monthly retainers are custom-quoted after the audit based on scope and channels.",
            "faq-q3": "How long does a Meta CAPI tracking setup take?",
            "faq-a3": "A standard Meta CAPI + server-side tracking setup takes 5-10 business days. Meta Ads management runs monthly with weekly optimization. Funnel and CRO projects typically take 2-4 weeks depending on scope.",
            "faq-q4": "Does Mizanul Islam work with international clients?",
            "faq-a4": "Yes. Mizanul works with clients globally, including Bangladesh, UAE, and other markets. All communication is in English or Bengali.",
            "faq-q5": "What tools and platforms does Mizanul Islam use?",
            "faq-a5": "Meta Ads Manager, Google Ads, GA4, Google Tag Manager, Meta CAPI, Cloudflare Zaraz, Looker Studio, WhatsApp Cloud API, Microsoft Clarity, and custom tracking infrastructure built on Cloudflare Pages."
        },
        bn: {
            "nav-services": "সার্ভিস",
            "nav-tools": "টুলস",
            "nav-about": "পরিচিতি",
            "nav-portfolio": "পোর্টফোলিও",
            "nav-cases": "কেস স্টাডি",
            "nav-blog": "ব্লগ",
            "nav-book": "কল বুক করুন",
            "hero-badge": "বাস্তব সিস্টেম তৈরি করছি",
            "hero-title-1": 'Meta Ads & CAPI Tracking <br><span class="highlight">বাস্তব ভিত্তির উপর তৈরি</span>',
            "hero-desc": "আমি ই-কমার্স ব্র্যান্ডের জন্য পারফরম্যান্স মার্কেটিং সিস্টেম তৈরি করি — Meta Ads, server-side CAPI tracking, এবং conversion-focused funnels। ঢাকা, বাংলাদেশ থেকে। গ্লোবালি ক্লায়েন্টদের সাথে কাজ করি।",
            "hero-cta-1": "আমার সাথে কাজ করুন",
            "hero-cta-2": "ফ্রি টুলস দেখুন",
            "stat-1": "Schema Types",
            "stat-2": "মার্কেটিং টুলস",
            "stat-3": "পেজ তৈরি",
            "stat-4": "ক্লায়েন্ট প্রজেক্ট",
            "services-title": "যে সার্ভিস ও সিস্টেম তৈরি করেছি",
            "services-desc": "Paid media, tracking, এবং conversion-এ বাস্তব বাস্তবায়ন",
            "service-1-title": "Meta & Google Ads",
            "service-1-desc": "ক্যাম্পেইন স্ট্রাকচার, ক্রিয়েটিভ টেস্টিং, ABO → CBO scaling, এবং ROAS-ফোকাসড অপটিমাইজেশন।",
            "service-2-title": "CAPI & Tracking Setup",
            "service-2-desc": "Server-side Conversions API, sGTM containers, event deduplication, এবং iOS signal recovery।",
            "service-3-title": "Funnels & CRO",
            "service-3-desc": "ল্যান্ডিং পেজ ক্ল্যারিটি, অফার ফ্রেমিং, ফর্ম ফ্রিকশন কমানো, এবং মোবাইল স্পিড অপটিমাইজেশন।",
            "work-title": "সাম্প্রতিক কাজ ও টেকনিক্যাল বিল্ড",
            "work-desc": "বাস্তব প্রজেক্ট — ক্লায়েন্ট ক্যাম্পেইন এবং নিজের তৈরি ইনফ্রাস্ট্রাকচার",
            "work-1-tag": "ক্লায়েন্ট কাজ · Meta Ads",
            "work-1-title": "Meta Ads — Rizq Fashion",
            "work-1-desc": "একটি নারীদের ক্লোদিং ব্র্যান্ডের জন্য Meta Ads ক্যাম্পেইন সেটআপ ও ম্যানেজমেন্ট — ক্যাম্পেইন স্ট্রাকচার, অডিয়েন্স টার্গেটিং, ক্রিয়েটিভ টেস্টিং, এবং পিক্সেল ট্র্যাকিং।",
            "work-2-tag": "ক্লায়েন্ট কাজ · Google Ads",
            "work-2-title": "Google Ads — Rizq Fashion",
            "work-2-desc": "Meta Ads-এর সাথে সম্পূরক হিসেবে Search এবং Performance Max ক্যাম্পেইন তৈরি — কীওয়ার্ড রিসার্চ ও কনভার্সন ট্র্যাকিং সহ।",
            "work-3-tag": "টেকনিক্যাল · এই ওয়েবসাইট",
            "work-3-title": "সম্পূর্ণ Analytics Stack",
            "work-3-desc": "Cloudflare Zaraz + GTM v4 + GA4 দিয়ে server-side analytics সেটআপ — এই সাইটে লাইভ ভেরিফাইড।",
            "work-view": "কেস স্টাডি দেখুন →",
            "work-cta": "সব কেস স্টাডি দেখুন →",
            "tools-title": "ফ্রি মার্কেটিং টুলস",
            "tools-desc": "আমার তৈরি client-side টুলস — কোনো সাইনআপ নেই, ট্র্যাকিং নেই",
            "tool-1-title": "WhatsApp Link Builder",
            "tool-1-desc": "কাস্টমাইজড pre-filled মেসেজ সহ তাৎক্ষণিক সরাসরি WhatsApp চ্যাট লিংক তৈরি করুন।",
            "tool-1-btn": "লিংক তৈরি ও কপি করুন",
            "tool-2-title": "UTM Link Generator",
            "tool-2-desc": "Analytics প্ল্যাটফর্মের জন্য পরিষ্কার, ট্র্যাকযোগ্য ক্যাম্পেইন লিংক তৈরি করুন।",
            "tool-2-btn": "UTM লিংক তৈরি করুন",
            "tool-3-title": "A/B Test Significance Evaluator",
            "tool-3-desc": "দুটি ভ্যারিয়েন্টের মধ্যে statistical significance, conversion rate lift, এবং confidence interval হিসাব করুন।",
            "tool-3-varA": "ভ্যারিয়েন্ট A (কন্ট্রোল)",
            "tool-3-varB": "ভ্যারিয়েন্ট B (ভ্যারিয়েশন)",
            "tool-3-btn": "সিগনিফিকেন্স মূল্যায়ন করুন",
            "tool-4-title": "Ad Budget ROI Calculator",
            "tool-4-desc": "আপনার প্রত্যাশিত Return on Ad Spend (ROAS) এবং রেভিনিউ তাৎক্ষণিক হিসাব করুন।",
            "tool-4-btn": "ROI হিসাব করুন",
            "booking-title": "📅 আপনার ফ্রি ১৫-মিনিট ডিসকভারি কল বুক করুন",
            "booking-desc": "আপনার Meta Ads, tracking, বা funnel চ্যালেঞ্জ নিয়ে ডিসকভারি কল শিডিউল করতে নিচের ফর্মটি পূরণ করুন।",
            "booking-benefit-1": "১৫-মিনিট ফ্রি ডিসকভারি কল",
            "booking-benefit-2": "Ad Account ও Funnel রিভিউ",
            "booking-benefit-3": "সৎ ফিডব্যাক — সেলস পিচ নয়",
            "form-name": "পুরো নাম *",
            "form-email": "ইমেইল ঠিকানা *",
            "form-phone": "ফোন নম্বর *",
            "form-website": "ওয়েবসাইট / পেজ লিংক",
            "form-budget": "মাসিক অ্যাড বাজেট *",
            "form-budget-placeholder": "বাজেট রেঞ্জ নির্বাচন করুন",
            "form-date": "পছন্দের তারিখ *",
            "form-time": "পছন্দের সময় *",
            "form-time-placeholder": "সময় নির্বাচন করুন",
            "form-notes": "সংক্ষেপে আপনার লক্ষ্য লিখুন",
            "form-submit": "ডিসকভারি কল রিকোয়েস্ট করুন",
            "faq-title": "সচরাচর জিজ্ঞাসিত প্রশ্ন",
            "faq-desc": "সার্ভিস, প্রাইসিং এবং আমার কাজের পদ্ধতি নিয়ে দ্রুত উত্তর",
            "faq-q1": "Mizanul Islam কী কী সার্ভিস দেন?",
            "faq-a1": "Mizanul Islam Meta Ads ম্যানেজমেন্ট, Google Ads ক্যাম্পেইন, Meta CAPI tracking সেটআপ, conversion rate optimization (CRO), এবং WhatsApp Cloud API automation দেন। বর্তমানে নতুন ক্লায়েন্ট সহযোগিতার জন্য উন্মুক্ত — ঢাকা, বাংলাদেশ থেকে, গ্লোবালি ক্লায়েন্টদের সাথে কাজ করেন।",
            "faq-q2": "ডিসকভারি কলে খরচ কত?",
            "faq-a2": "১৫-মিনিটের ডিসকভারি কল ফ্রি। Intro strategy কল (৪৫ মিনিট) $৪৯, এবং full system audit (৯০ মিনিট) $১৪৯। মাসিক রিটেইনার অডিটের পরে কাস্টম-কোট করা হয়।",
            "faq-q3": "Meta CAPI tracking সেটআপে কত সময় লাগে?",
            "faq-a3": "একটি স্ট্যান্ডার্ড Meta CAPI + server-side tracking সেটআপে ৫-১০ ব্যবসায়িক দিন লাগে। Meta Ads ম্যানেজমেন্ট মাসিক চলে, সাপ্তাহিক অপটিমাইজেশন সহ। Funnel এবং CRO প্রজেক্ট সাধারণত ২-৪ সপ্তাহ লাগে।",
            "faq-q4": "Mizanul Islam কি আন্তর্জাতিক ক্লায়েন্টদের সাথে কাজ করেন?",
            "faq-a4": "হ্যাঁ। Mizanul গ্লোবালি ক্লায়েন্টদের সাথে কাজ করেন, বাংলাদেশ, UAE, এবং অন্যান্য মার্কেট সহ। সব যোগাযোগ ইংরেজি বা বাংলায়।",
            "faq-q5": "Mizanul Islam কী কী টুলস ও প্ল্যাটফর্ম ব্যবহার করেন?",
            "faq-a5": "Meta Ads Manager, Google Ads, GA4, Google Tag Manager, Meta CAPI, Cloudflare Zaraz, Looker Studio, WhatsApp Cloud API, Microsoft Clarity, এবং Cloudflare Pages-এ তৈরি custom tracking infrastructure।"
        }
    };

    // ========== THEME SYSTEM ==========
    function initTheme() {
        const savedTheme = localStorage.getItem('site-theme') || 'dark';
        applyTheme(savedTheme);
    }

    function applyTheme(theme) {
        const html = document.documentElement;
        const icon = document.getElementById('themeIcon');
        
        if (theme === 'light') {
            html.classList.add('theme-light');
            html.classList.remove('theme-dark');
            if (icon) icon.textContent = '☀️';
        } else {
            html.classList.add('theme-dark');
            html.classList.remove('theme-light');
            if (icon) icon.textContent = '🌙';
        }
        localStorage.setItem('site-theme', theme);
    }

    function toggleTheme() {
        const current = localStorage.getItem('site-theme') || 'dark';
        const next = current === 'dark' ? 'light' : 'dark';
        applyTheme(next);
        trackEvent('theme_toggle', { theme: next });
    }

    // ========== LANGUAGE SYSTEM ==========
    function initLanguage() {
        const savedLang = localStorage.getItem('site-lang') || 'en';
        applyLanguage(savedLang);
    }

    function applyLanguage(lang) {
        const html = document.documentElement;
        const label = document.getElementById('langLabel');
        
        html.setAttribute('lang', lang);
        
        // Apply translations
        document.querySelectorAll('[data-i18n]').forEach(el => {
            const key = el.getAttribute('data-i18n');
            if (translations[lang] && translations[lang][key]) {
                // Preserve HTML for keys that contain HTML
                if (translations[lang][key].includes('<')) {
                    el.innerHTML = translations[lang][key];
                } else {
                    el.textContent = translations[lang][key];
                }
            }
        });

        // Update button label
        if (label) {
            label.textContent = lang === 'en' ? 'বাং' : 'EN';
        }

        localStorage.setItem('site-lang', lang);
        document.documentElement.setAttribute('data-current-lang', lang);
    }

    function toggleLanguage() {
        const current = localStorage.getItem('site-lang') || 'en';
        const next = current === 'en' ? 'bn' : 'en';
        applyLanguage(next);
        trackEvent('language_toggle', { lang: next });
    }

    // ========== TRACKING HELPER ==========
    function trackEvent(name, params) {
        try {
            if (window.zaraz && typeof window.zaraz.track === 'function') {
                window.zaraz.track(name, params || {});
            } else if (typeof window.gtag === 'function') {
                window.gtag('event', name, params || {});
            }
        } catch (e) { /* silent */ }
    }

    // ========== INIT ==========
    function init() {
        initTheme();
        initLanguage();

        const themeBtn = document.getElementById('themeToggle');
        const langBtn = document.getElementById('langToggle');

        if (themeBtn) themeBtn.addEventListener('click', toggleTheme);
        if (langBtn) langBtn.addEventListener('click', toggleLanguage);
    }

    // Run immediately to prevent flash
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

    // Early theme application to prevent flash
    (function earlyTheme() {
        const savedTheme = localStorage.getItem('site-theme') || 'dark';
        document.documentElement.classList.add('theme-' + savedTheme);
    })();

})();
