/*
    ============================================================
    📝 কিভাবে নতুন ব্লগ যোগ করবেন (খুব সহজ)
    ============================================================
    ১. নিচের posts অ্যারেতে নতুন একটা অবজেক্ট কপি-পেস্ট করুন
    ২. id, title, tag, date, readTime, excerpt, content পূরণ করুন
    ৩. featured: true দিলে সেটা বড় করে উপরে দেখাবে (শুধু ১টা রাখুন)
    ৪. ফাইল সেভ করুন — ব্লগ অটো দেখাবে

    content-এ HTML লিখতে পারবেন: <p>, <h3>, <ul>, <li>, <strong>
    ============================================================
    */

    const posts = [
        {
            id: 'post-5',
            featured: true,
            title: 'Why I Built This Website from Scratch (Instead of Using WordPress)',
            tag: 'Learning Journal',
            date: 'Sep 2026',
            readTime: '7 min',
            excerpt: 'Building this site from scratch taught me more about technical SEO, schema markup, and growth infrastructure than any course could. Here is what I learned.',
            content: `
                <p>When I decided to start learning digital marketing seriously, I had a choice: spin up a WordPress site in an hour, or build everything from scratch. I chose scratch — and it turned out to be the best decision of my learning journey.</p>
                
                <h3>What "From Scratch" Actually Means</h3>
                <p>I coded the HTML, CSS, and JavaScript by hand. I deployed on Cloudflare Pages. I set up 9 types of Schema markup, clean URLs, 301 redirects, and a serverless API endpoint for form handling.</p>
                
                <h3>Why This Mattered for Learning</h3>
                <ul>
                    <li><strong>Schema Markup:</strong> I learned how Google actually reads entity relationships — Person ↔ Organization ↔ Service.</li>
                    <li><strong>Technical SEO:</strong> Clean URLs, canonical tags, sitemaps — I did all of it manually.</li>
                    <li><strong>Tracking:</strong> Setting up first-party conversion paths taught me what "clean data" means.</li>
                    <li><strong>Serverless:</strong> I built a Cloudflare Function that handles form submissions via Resend API.</li>
                </ul>
                
                <h3>What I Would Do Differently</h3>
                <p>Next time, I'd add analytics from day one. I'd also test mobile first instead of retrofitting responsiveness. But the core lesson stands: building teaches faster than consuming.</p>
                
                <p>If you're learning marketing, try building something small — a landing page, a tracker, anything. You'll learn more in a week than in a month of tutorials.</p>
            `
        },
        {
            id: 'post-6',
            featured: false,
            title: 'What I Learned from Stanford\\'s Code in Place (Python for Marketers)',
            tag: 'Learning Journal',
            date: 'Aug 2026',
            readTime: '6 min',
            excerpt: 'Code in Place is a free Stanford program that teaches Python fundamentals. Here is why every marketer should consider learning to code.',
            content: `
                <p>I recently completed Stanford University's <strong>Code in Place</strong> program — a free, live-taught introduction to Python. It's designed for beginners, and it changed how I think about marketing technology.</p>
                
                <h3>Why Marketers Should Learn Python</h3>
                <p>Modern marketing runs on APIs, webhooks, and server-side tracking. You don't need to be a developer, but understanding how code works makes you dramatically more effective.</p>
                
                <ul>
                    <li>Read and modify tracking scripts (not just copy-paste)</li>
                    <li>Understand CAPI payloads and event parameters</li>
                    <li>Debug server-side GTM issues faster</li>
                    <li>Automate repetitive reporting tasks</li>
                </ul>
                
                <h3>What Code in Place Taught Me</h3>
                <p>The program covers variables, loops, functions, and basic data structures over 6 weeks. Section leaders guide small groups through weekly problems.</p>
                
                <p>More importantly, it taught me <strong>how to think in code</strong> — breaking problems into small, testable steps. That mindset applies directly to marketing: test, measure, iterate.</p>
                
                <h3>Should You Do It?</h3>
                <p>If you're a marketer who wants to stand out, yes. Code in Place runs once a year and is competitive to get into. But even free alternatives (CS50, freeCodeCamp) give you a similar foundation.</p>
                
                <p>The goal isn't to become a developer — it's to become a marketer who can work with developers and understand tracking at the code level.</p>
            `
        },
        {
            id: 'post-1',
            featured: false,
            title: 'Building High-Throughput WhatsApp Automation with Cloud API',
            tag: 'WhatsApp API',
            date: 'Sep 2026',
            readTime: '8 min',
            excerpt: 'How to design non-blocking WhatsApp automation pipelines that survive rate limits, webhook timeouts, and high traffic without losing events.',
            content: `
                <p>Scaling WhatsApp automation for thousands of concurrent users requires a non-blocking, event-driven backend. Simple synchronous HTTP calls to Meta's Cloud API will hit rate limits and drop webhooks under traffic spikes.</p>
                
                <h3>1. Use a Queue (Redis / Bull)</h3>
                <p>When Meta sends a webhook, return <strong>HTTP 200 within 3 seconds</strong>. Push the payload into a queue and process it in a worker — never do heavy work inside the webhook handler.</p>
                
                <h3>2. Respect Rate Limits</h3>
                <p>Cloud API has messaging and conversation limits. Implement retry with exponential backoff for HTTP 429 responses.</p>
                
                <h3>3. First-Party Event Logging</h3>
                <p>Log every sent, delivered, read, and failed event to your own database. This becomes your source of truth for campaigns and support.</p>
                
                <p>Start small: one template, one queue, one worker. Then scale the workers horizontally as volume grows.</p>
            `
        },
        {
            id: 'post-2',
            featured: false,
            title: 'Meta CAPI Setup: Stop Losing iOS Conversions',
            tag: 'Tracking',
            date: 'Aug 2026',
            readTime: '6 min',
            excerpt: 'Server-side Conversions API (CAPI) recovers signals lost to iOS privacy and ad blockers — and improves Event Match Quality.',
            content: `
                <p>Browser pixels alone are no longer enough. iOS ATT and ad blockers block a large share of client-side events. Meta CAPI sends events from your server so Facebook still gets purchase and lead data.</p>
                
                <h3>What to send</h3>
                <ul>
                    <li>Purchase / Lead / CompleteRegistration events</li>
                    <li>Hashed email, phone, and external_id when available</li>
                    <li>Event ID for deduplication with the browser pixel</li>
                </ul>
                
                <h3>Quick win</h3>
                <p>Use a server-side GTM (sGTM) or a simple Node/PHP endpoint that receives your thank-you page hit and forwards a CAPI event. Aim for Event Match Quality 6.0+.</p>
            `
        },
        {
            id: 'post-3',
            featured: false,
            title: 'A Simple CRO Checklist for Landing Pages',
            tag: 'CRO',
            date: 'Aug 2026',
            readTime: '5 min',
            excerpt: 'Five checks that often lift conversion rate without a full redesign — clarity, speed, proof, friction, and mobile.',
            content: `
                <p>Before running complex A/B tests, fix the basics. Most landing pages lose conversions on clarity and friction, not on fancy design.</p>
                
                <h3>Checklist</h3>
                <ol>
                    <li><strong>Headline match:</strong> Does the page say the same thing as the ad?</li>
                    <li><strong>One primary CTA:</strong> One clear action above the fold.</li>
                    <li><strong>Social proof:</strong> Reviews, logos, or results near the CTA.</li>
                    <li><strong>Form friction:</strong> Only ask for fields you need right now.</li>
                    <li><strong>Mobile speed:</strong> Under 3 seconds on 4G; no layout shifts.</li>
                </ol>
                
                <p>Use Microsoft Clarity or Hotjar for 1–2 weeks, then fix the top drop-off points before testing new creatives.</p>
            `
        },
        {
            id: 'post-4',
            featured: false,
            title: 'How I Structure Meta Ads for Scalable ROAS',
            tag: 'Media Buying',
            date: 'Jul 2026',
            readTime: '7 min',
            excerpt: 'A practical ABO → CBO framework for testing creatives, finding winners, and scaling without burning budget.',
            content: `
                <p>Random campaign structures waste budget. A clear testing → scaling pipeline keeps learning and spend under control.</p>
                
                <h3>Phase 1 — Test (ABO)</h3>
                <p>Small budgets per ad set. 3–5 creatives, one audience each. Kill losers after enough spend (e.g. 2–3x target CPA with no conversion).</p>
                
                <h3>Phase 2 — Scale (CBO)</h3>
                <p>Move winners into a CBO campaign. Let Meta allocate budget. Duplicate and raise budget gradually (e.g. 20–30% every few days) instead of sudden big jumps.</p>
                
                <h3>Creative > Audience</h3>
                <p>In most accounts, creative angle and hook matter more than micro-targeting. Refresh creatives weekly; keep audiences broad once you have signal.</p>
            `
        }
        /*
        ============================================================
        ➕ নতুন পোস্ট এখানে যোগ করুন (উপরের ফরম্যাট কপি করুন)
        ============================================================
        ,
        {
            id: 'post-7',
            featured: false,
            title: 'আপনার ব্লগের শিরোনাম',
            tag: 'Category',
            date: 'Sep 2026',
            readTime: '5 min',
            excerpt: 'সংক্ষিপ্ত বর্ণনা — কার্ডে দেখাবে।',
            content: `
                <p>এখানে পুরো আর্টিকেল লিখুন।</p>
                <h3>সাবহেডিং</h3>
                <p>আরো প্যারাগ্রাফ...</p>
            `
        }
        ============================================================
        */
    ];

    // ========== Render cards ==========
    function renderBlog() {
        const grid = document.getElementById('blogGrid');
        if (!grid) return;

        // Featured first, then rest
        const sorted = [...posts].sort((a, b) => (b.featured ? 1 : 0) - (a.featured ? 1 : 0));

        grid.innerHTML = sorted.map(post => `
            <article class="blog-card ${post.featured ? 'featured' : ''}" data-id="${post.id}" role="button" tabindex="0">
                <div>
                    <span class="tag">${escapeHtml(post.tag)}</span>
                    ${post.featured ? `<h2>${escapeHtml(post.title)}</h2>` : `<h3>${escapeHtml(post.title)}</h3>`}
                    <div class="meta">${escapeHtml(post.date)} · ${escapeHtml(post.readTime)} read</div>
                    <p class="excerpt">${escapeHtml(post.excerpt)}</p>
                    <span class="read-more">Read article →</span>
                </div>
            </article>
        `).join('');

        grid.querySelectorAll('.blog-card').forEach(card => {
            card.addEventListener('click', () => openArticle(card.dataset.id));
            card.addEventListener('keydown', (e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    openArticle(card.dataset.id);
                }
            });
        });
    }

    function escapeHtml(str) {
        const d = document.createElement('div');
        d.textContent = str || '';
        return d.innerHTML;
    }

    function openArticle(id) {
        const post = posts.find(p => p.id === id);
        if (!post) return;

        document.getElementById('modalTag').textContent = post.tag;
        document.getElementById('modalTitle').textContent = post.title;
        document.getElementById('modalMeta').textContent = post.date + ' · ' + post.readTime + ' read';
        document.getElementById('modalBody').innerHTML = post.content;
        document.getElementById('articleModal').classList.add('open');
        document.body.style.overflow = 'hidden';
    }

    function closeArticle() {
        document.getElementById('articleModal').classList.remove('open');
        document.body.style.overflow = '';
    }

    document.getElementById('modalClose').addEventListener('click', closeArticle);
    document.getElementById('articleModal').addEventListener('click', function(e) {
        if (e.target === this) closeArticle();
    });
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') closeArticle();
    });

    renderBlog();
