/**
 * Production-Grade Encapsulated WhatsApp AI Floating Chat Widget
 * Mizanul Islam — offline automated assistant (no backend required)
 * Update whatsappPhone with your number only (country code, no +)
 */

(function () {
    "use strict";

    if (customElements.get("mizan-chat-widget")) {
        return;
    }

    var CONFIG = Object.freeze({
        whatsappPhone: "8801845366993",
        flaticonUrl: "https://cdn-icons-png.flaticon.com/512/3670/3670051.png"
    });

    var i18n = {
        en: {
            title: "Mizanul Islam",
            subtitle: "Performance Marketing Specialist",
            welcome: "Hello! 👋 I am Mizanul Islam's AI Assistant. How can I help you grow your business today?",
            chip1: "Services Overview",
            chip2: "Pricing & Packages",
            chip3: "Book Consultation",
            placeholder: "Type your question...",
            send: "Send",
            thinking: "Generating answer...",
            networkError: "Connection error. Please try again.",
            toggleBtn: "BN",
            directWA: "Chat on WhatsApp"
        },
        bn: {
            title: "মিজানুল ইসলাম",
            subtitle: "পারফরম্যান্স মার্কেটিং স্পেশালিস্ট",
            welcome: "হ্যালো! 👋 আমি মিজানুল ইসলামের AI অ্যাসিস্ট্যান্ট। আজ কীভাবে আপনার বিজনেসে সাহায্য করতে পারি?",
            chip1: "সার্ভিসসমূহ",
            chip2: "প্রাইসিং",
            chip3: "কল বুক করুন",
            placeholder: "প্রশ্নটি লিখুন...",
            send: "পাঠান",
            thinking: "উত্তর তৈরি হচ্ছে...",
            networkError: "নেটওয়ার্ক সংযোগে সমস্যা হয়েছে।",
            toggleBtn: "EN",
            directWA: "হোয়াটসঅ্যাপে মেসেজ দিন"
        }
    };

    class MizanChatWidget extends HTMLElement {
        constructor() {
            super();
            this.attachShadow({ mode: "open" });
            this.state = {
                currentLang: "en",
                isOpen: false,
                conversationHistory: [],
                isProcessing: false
            };
        }

        connectedCallback() {
            this.render();
            this.bindEvents();
        }

        getEncapsulatedStyles() {
            return [
                ":host {",
                "  --wa-green: #25d366;",
                "  --wa-dark-green: #128c7e;",
                "  --wa-header-bg: #075e54;",
                "  --wa-chat-bg: #efeae2;",
                "  --text-dark: #111b21;",
                "  --chat-width: 370px;",
                "  --chat-height: 530px;",
                "  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;",
                "  font-size: 14px;",
                "  position: fixed;",
                "  bottom: 24px;",
                "  right: 24px;",
                "  z-index: 2147483647;",
                "  box-sizing: border-box;",
                "}",
                "*, *::before, *::after { box-sizing: inherit; margin: 0; padding: 0; }",
                ".chat-launcher-ring {",
                "  width: 68px; height: 68px; border-radius: 50%;",
                "  background: transparent; border: 2px solid rgba(37, 211, 102, 0.45);",
                "  display: flex; align-items: center; justify-content: center;",
                "  margin-left: auto;",
                "  transition: all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);",
                "}",
                ".chat-launcher-ring:hover { border-color: var(--wa-green); transform: scale(1.08); }",
                ".chat-launcher-btn {",
                "  width: 56px; height: 56px; border-radius: 50%;",
                "  background: transparent; border: none; cursor: pointer;",
                "  display: flex; align-items: center; justify-content: center; outline: none;",
                "}",
                ".chat-launcher-btn img {",
                "  width: 52px; height: 52px; object-fit: contain; pointer-events: none;",
                "  filter: drop-shadow(0 4px 10px rgba(0,0,0,0.15));",
                "}",
                ".chat-window {",
                "  display: none; flex-direction: column;",
                "  width: var(--chat-width); height: var(--chat-height);",
                "  max-width: calc(100vw - 40px); max-height: calc(100vh - 100px);",
                "  background: #ffffff; border-radius: 16px;",
                "  box-shadow: 0 12px 32px rgba(0, 0, 0, 0.2);",
                "  overflow: hidden; margin-bottom: 12px; border: 1px solid #e2e8f0;",
                "  animation: slideUp 0.25s ease-out;",
                "}",
                "@keyframes slideUp {",
                "  from { opacity: 0; transform: translateY(16px); }",
                "  to { opacity: 1; transform: translateY(0); }",
                "}",
                ".chat-window.open { display: flex; }",
                ".chat-header {",
                "  background: var(--wa-header-bg); color: #ffffff;",
                "  padding: 14px 16px; display: flex; align-items: center; justify-content: space-between;",
                "}",
                ".chat-header-info { display: flex; align-items: center; gap: 10px; }",
                ".online-dot {",
                "  width: 10px; height: 10px; background-color: var(--wa-green);",
                "  border-radius: 50%; border: 2px solid #ffffff;",
                "}",
                ".chat-title { font-weight: 600; font-size: 15px; }",
                ".chat-subtitle { font-size: 11px; opacity: 0.85; }",
                ".header-actions { display: flex; align-items: center; gap: 6px; }",
                ".action-btn {",
                "  background: rgba(255, 255, 255, 0.2); border: none; color: #ffffff;",
                "  padding: 4px 8px; border-radius: 6px; cursor: pointer;",
                "  font-size: 12px; font-weight: 600;",
                "}",
                ".action-btn:hover { background: rgba(255, 255, 255, 0.3); }",
                ".chat-messages {",
                "  flex: 1; padding: 16px; overflow-y: auto;",
                "  display: flex; flex-direction: column; gap: 10px;",
                "  background-color: var(--wa-chat-bg);",
                "  background-image: radial-gradient(rgba(0,0,0,0.04) 1px, transparent 0);",
                "  background-size: 12px 12px;",
                "}",
                ".chat-msg {",
                "  max-width: 84%; padding: 10px 14px; border-radius: 12px;",
                "  word-break: break-word; line-height: 1.45;",
                "  box-shadow: 0 1px 2px rgba(0,0,0,0.12); font-size: 13.5px;",
                "  white-space: pre-line;",
                "}",
                ".chat-msg.msg-ai {",
                "  align-self: flex-start; background-color: #ffffff;",
                "  color: var(--text-dark); border-top-left-radius: 2px;",
                "}",
                ".chat-msg.msg-user {",
                "  align-self: flex-end; background-color: #d9fdd3;",
                "  color: var(--text-dark); border-top-right-radius: 2px;",
                "}",
                ".chat-chips-container {",
                "  padding: 8px 12px; display: flex; gap: 6px; overflow-x: auto;",
                "  background: #ffffff; border-top: 1px solid #e2e8f0;",
                "}",
                ".chat-chip-btn {",
                "  background-color: #f0f2f5; color: #111b21;",
                "  border: 1px solid #cbd5e1; padding: 6px 12px; border-radius: 16px;",
                "  font-size: 12px; cursor: pointer; white-space: nowrap;",
                "}",
                ".chat-chip-btn:hover { background-color: #e4e6eb; }",
                ".wa-direct-btn {",
                "  background-color: var(--wa-green); color: #ffffff;",
                "  border: none; font-weight: 600;",
                "}",
                ".wa-direct-btn:hover { background-color: var(--wa-dark-green); }",
                ".chat-input-area {",
                "  padding: 10px 12px; background: #f0f2f5;",
                "  border-top: 1px solid #e2e8f0; display: flex; gap: 8px;",
                "}",
                ".chat-input-field {",
                "  flex: 1; border: 1px solid #cbd5e1; border-radius: 20px;",
                "  padding: 9px 14px; outline: none; font-size: 13px; background: #ffffff;",
                "}",
                ".chat-input-field:focus { border-color: var(--wa-green); }",
                ".chat-send-btn {",
                "  background-color: var(--wa-green); color: #ffffff; border: none;",
                "  padding: 8px 16px; border-radius: 20px; cursor: pointer;",
                "  font-weight: 600; font-size: 13px;",
                "}",
                ".chat-send-btn:hover { background-color: var(--wa-dark-green); }"
            ].join("\n");
        }

        render() {
            var dict = i18n[this.state.currentLang];
            this.shadowRoot.innerHTML =
                "<style>" + this.getEncapsulatedStyles() + "</style>" +
                '<div class="chat-window" id="chatWindow">' +
                '<div class="chat-header">' +
                '<div class="chat-header-info">' +
                '<span class="online-dot"></span>' +
                "<div>" +
                '<div class="chat-title" id="chatTitle">' + this.escapeHTML(dict.title) + "</div>" +
                '<div class="chat-subtitle" id="chatSubtitle">' + this.escapeHTML(dict.subtitle) + "</div>" +
                "</div></div>" +
                '<div class="header-actions">' +
                '<button type="button" class="action-btn" id="langBtn">' + this.escapeHTML(dict.toggleBtn) + "</button>" +
                '<button type="button" class="action-btn" id="closeBtn">&times;</button>' +
                "</div></div>" +
                '<div class="chat-messages" id="messagesBox">' +
                '<div class="chat-msg msg-ai">' + this.escapeHTML(dict.welcome) + "</div>" +
                "</div>" +
                '<div class="chat-chips-container" id="chipsBox"></div>' +
                '<form class="chat-input-area" id="chatForm">' +
                '<input type="text" class="chat-input-field" id="inputField" placeholder="' + this.escapeHTML(dict.placeholder) + '" autocomplete="off" required />' +
                '<button type="submit" class="chat-send-btn" id="sendBtn">' + this.escapeHTML(dict.send) + "</button>" +
                "</form></div>" +
                '<div class="chat-launcher-ring">' +
                '<button type="button" class="chat-launcher-btn" id="launcherBtn" aria-label="WhatsApp AI Chat">' +
                '<img src="' + CONFIG.flaticonUrl + '" alt="WhatsApp" id="waImgIcon" />' +
                "</button></div>";
            this.renderChips([dict.chip1, dict.chip2, dict.chip3]);
        }

        escapeHTML(str) {
            if (typeof str !== "string") return "";
            var div = document.createElement("div");
            div.textContent = str;
            return div.innerHTML;
        }

        redirectToWhatsApp(customMessage) {
            var text = customMessage || "Hello Mizanul, I am reaching out from mizanulislam.com regarding your services.";
            var url = "https://wa.me/" + CONFIG.whatsappPhone + "?text=" + encodeURIComponent(text);
            window.open(url, "_blank", "noopener,noreferrer");
        }

        renderChips(chips) {
            var chipsBox = this.shadowRoot.getElementById("chipsBox");
            if (!chipsBox) return;
            chipsBox.innerHTML = "";
            var dict = i18n[this.state.currentLang];
            var waBtn = document.createElement("button");
            waBtn.className = "chat-chip-btn wa-direct-btn";
            waBtn.type = "button";
            waBtn.textContent = "📲 " + dict.directWA;
            var self = this;
            waBtn.addEventListener("click", function () {
                self.redirectToWhatsApp();
            });
            chipsBox.appendChild(waBtn);
            if (Array.isArray(chips)) {
                chips.forEach(function (text) {
                    var btn = document.createElement("button");
                    btn.className = "chat-chip-btn";
                    btn.type = "button";
                    btn.textContent = text;
                    btn.addEventListener("click", function () {
                        self.handleSendMessage(text);
                    });
                    chipsBox.appendChild(btn);
                });
            }
        }

        appendMessage(sender, text) {
            var messagesBox = this.shadowRoot.getElementById("messagesBox");
            var msgEl = document.createElement("div");
            msgEl.className = "chat-msg " + (sender === "user" ? "msg-user" : "msg-ai");
            msgEl.textContent = text;
            messagesBox.appendChild(msgEl);
            messagesBox.scrollTop = messagesBox.scrollHeight;
            return msgEl;
        }

        bindEvents() {
            var self = this;
            var launcherBtn = this.shadowRoot.getElementById("launcherBtn");
            var closeBtn = this.shadowRoot.getElementById("closeBtn");
            var langBtn = this.shadowRoot.getElementById("langBtn");
            var chatForm = this.shadowRoot.getElementById("chatForm");
            var imgIcon = this.shadowRoot.getElementById("waImgIcon");

            imgIcon.addEventListener("error", function () {
                imgIcon.style.display = "none";
                launcherBtn.innerHTML = '<svg width="40" height="40" viewBox="0 0 32 32" fill="#25d366"><path d="M16 2A13 13 0 0 0 4.69 21.25L3 27.5l6.43-1.65A13 13 0 1 0 16 2zm0 23.8a10.74 10.74 0 0 1-5.48-1.5l-.39-.23-4.07 1.05 1.07-3.92-.25-.41A10.78 10.78 0 1 1 16 25.8z"/></svg>';
            });

            launcherBtn.addEventListener("click", function () {
                self.toggleWindow();
            });
            closeBtn.addEventListener("click", function () {
                self.toggleWindow(false);
            });

            langBtn.addEventListener("click", function () {
                self.state.currentLang = self.state.currentLang === "en" ? "bn" : "en";
                var dict = i18n[self.state.currentLang];
                langBtn.textContent = dict.toggleBtn;
                self.shadowRoot.getElementById("chatTitle").textContent = dict.title;
                self.shadowRoot.getElementById("chatSubtitle").textContent = dict.subtitle;
                self.shadowRoot.getElementById("inputField").placeholder = dict.placeholder;
                self.shadowRoot.getElementById("sendBtn").textContent = dict.send;
                self.renderChips([dict.chip1, dict.chip2, dict.chip3]);
            });

            chatForm.addEventListener("submit", function (e) {
                e.preventDefault();
                var input = self.shadowRoot.getElementById("inputField");
                var val = input.value.trim();
                if (val) {
                    self.handleSendMessage(val);
                    input.value = "";
                }
            });
        }

        toggleWindow(force) {
            this.state.isOpen = force !== undefined ? force : !this.state.isOpen;
            var windowEl = this.shadowRoot.getElementById("chatWindow");
            windowEl.classList.toggle("open", this.state.isOpen);
        }

        getBotReply(rawText) {
            var text = (rawText || "").toLowerCase().trim();
            var isBn = this.state.currentLang === "bn";

            var replies = {
                en: {
                    greeting: "Hello! 👋 I'm Mizanul's assistant. I can help with Meta/Google Ads, CAPI tracking, CRO, or booking a strategy call. What do you need?",
                    services: "Main services:\n• Meta Ads buying & creative testing\n• Google Ads (Search / PMax)\n• Meta CAPI & server-side tracking\n• Funnel / landing page CRO\n• WhatsApp automation\n\nWant details on any one of these?",
                    pricing: "Pricing depends on scope:\n• Strategy Call: from $99 (45 min)\n• Full System / CAPI Audit: from $199\n• Monthly retainers: custom after audit\n\nBook a call → consultation.html",
                    consultation: "Book a 1-on-1 strategy call:\n→ consultation.html\n\nOr message on WhatsApp for a quick chat.",
                    meta: "Meta Ads: campaign structure, ABO→CBO testing, creative angles, ROAS-focused scaling.\n\nNeed a Meta account audit?",
                    google: "Google Ads: Search, Performance Max, Shopping — intent-focused, CPA goals.\n\nWant help with Search or PMax?",
                    capi: "CAPI + browser pixel with event_id deduplication improves Event Match Quality and recovers iOS losses.\n\nBook a tracking audit on a strategy call.",
                    cro: "CRO: ad–headline match, one primary CTA, proof near fold, less form friction, mobile speed.",
                    whatsapp: "Tap “Chat on WhatsApp” below to message Mizanul directly.",
                    about: "Mizanul Islam — performance marketer under Grow Up. Paid acquisition, clean tracking, scalable systems. Dhaka.\n\nPortfolio: pm",
                    contact: "Contact: contact.html · Book: consultation.html · WhatsApp: green button below",
                    seo: "Primary focus is performance marketing (Ads + Tracking + CRO), not deep SEO retainers.",
                    audit: "Audit options: ad account, CAPI/tracking, or funnel. Book at consultation.html",
                    fallback: "Thanks! For a tailored answer, book a strategy call or chat on WhatsApp.\n\nTry: Services · Pricing · CAPI · Book Call"
                },
                bn: {
                    greeting: "হ্যালো! 👋 আমি মিজানুলের অ্যাসিস্ট্যান্ট। Meta/Google Ads, CAPI, CRO বা কল বুকিং নিয়ে সাহায্য করতে পারি।",
                    services: "মূল সার্ভিস:\n• Meta Ads\n• Google Ads\n• CAPI / Tracking\n• CRO\n• WhatsApp automation\n\nকোনোটার বিস্তারিত চাই?",
                    pricing: "• স্ট্র্যাটেজি কল: $৯৯ থেকে\n• CAPI অডিট: $১৯৯ থেকে\n• রিটেইনার: কাস্টম\n\nকল বুক: consultation",
                    consultation: "স্ট্র্যাটেজি কল: consultation.html\nঅথবা WhatsApp-এ মেসেজ দিন।",
                    meta: "Meta Ads: স্ট্রাকচার, ABO→CBO টেস্ট, ROAS স্কেলিং।",
                    google: "Google Ads: Search, PMax, Shopping — CPA ফোকাস।",
                    capi: "CAPI + পিক্সেল দিয়ে Event Match Quality বাড়ে। স্ট্র্যাটেজি কলে অডিট করা যায়।",
                    cro: "CRO: হেডলাইন ম্যাচ, একটা CTA, প্রুফ, কম ফ্রিকশন, মোবাইল স্পিড।",
                    whatsapp: "নিচের সবুজ বাটনে ক্লিক করে সরাসরি মেসেজ দিন।",
                    about: "মিজানুল ইসলাম — Grow Up, পারফরম্যান্স মার্কেটার। ঢাকা।\npm.",
                    contact: "contact.html · consultation.html · WhatsApp বাটন",
                    seo: "মূল ফোকাস Ads + Tracking + CRO।",
                    audit: "অডিট: অ্যাড অ্যাকাউন্ট / CAPI / ফানেল। consultation.html",
                    fallback: "ধন্যবাদ। কল বুক করুন বা WhatsApp-এ লিখুন।\nসার্ভিস · প্রাইস · CAPI · কল"
                }
            };

            var R = replies[isBn ? "bn" : "en"];
            var rules = [
                { keys: ["hello", "hi", "hey", "salam", "হ্যালো", "হাই", "সালাম"], reply: R.greeting },
                { keys: ["service", "services", "overview", "সার্ভিস", "অফার"], reply: R.services },
                { keys: ["price", "pricing", "cost", "package", "দাম", "খরচ", "প্রাইস", "প্যাকেজ"], reply: R.pricing },
                { keys: ["consult", "book", "call", "strategy", "কল", "বুক", "পরামর্শ"], reply: R.consultation },
                { keys: ["meta", "facebook", "fb ads", "instagram"], reply: R.meta },
                { keys: ["google ads", "google ad", "ppc", "pmax", "গুগল"], reply: R.google },
                { keys: ["capi", "tracking", "pixel", "gtm", "ট্র্যাকিং", "পিক্সেল"], reply: R.capi },
                { keys: ["cro", "landing", "conversion", "funnel", "ল্যান্ডিং", "কনভার্সন"], reply: R.cro },
                { keys: ["whatsapp", "wa ", "হোয়াটসঅ্যাপ", "হোয়াটসঅ্যাপ"], reply: R.whatsapp },
                { keys: ["about", "mizanul", "grow up", "কে আপনি", "এবাউট"], reply: R.about },
                { keys: ["contact", "email", "phone", "যোগাযোগ"], reply: R.contact },
                { keys: ["seo"], reply: R.seo },
                { keys: ["audit", "অডিট"], reply: R.audit }
            ];

            for (var i = 0; i < rules.length; i++) {
                for (var j = 0; j < rules[i].keys.length; j++) {
                    if (text.indexOf(rules[i].keys[j]) !== -1) {
                        return rules[i].reply;
                    }
                }
            }
            return R.fallback;
        }

        handleSendMessage(text) {
            var self = this;
            if (this.state.isProcessing || !text || !String(text).trim()) return;

            var dict = i18n[this.state.currentLang];
            var clean = String(text).trim();
            this.appendMessage("user", clean);
            this.state.conversationHistory.push({ sender: "user", text: clean });
            this.state.isProcessing = true;
            var loadingMsg = this.appendMessage("ai", dict.thinking);

            setTimeout(function () {
                loadingMsg.remove();
                var reply = self.getBotReply(clean);
                self.appendMessage("ai", reply);
                self.state.conversationHistory.push({ sender: "assistant", text: reply });

                var lower = clean.toLowerCase();
                if (/price|pricing|cost|package|দাম|খরচ|প্রাইস/.test(lower)) {
                    self.renderChips(
                        self.state.currentLang === "bn"
                            ? ["কল বুক করুন", "সার্ভিসসমূহ", "CAPI"]
                            : ["Book Consultation", "Services Overview", "CAPI"]
                    );
                } else if (/service|সার্ভিস|meta|google|capi|overview/.test(lower)) {
                    self.renderChips(
                        self.state.currentLang === "bn"
                            ? ["প্রাইসিং", "কল বুক করুন", "CAPI"]
                            : ["Pricing & Packages", "Book Consultation", "CAPI"]
                    );
                }
                self.state.isProcessing = false;
            }, 500);
        }
    }

    customElements.define("mizan-chat-widget", MizanChatWidget);

    function initWidget() {
        if (!document.querySelector("mizan-chat-widget")) {
            document.body.appendChild(document.createElement("mizan-chat-widget"));
        }
    }

    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", initWidget);
    } else {
        initWidget();
    }
})();
