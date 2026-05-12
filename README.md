# 🏠 The Ark Cleaning Co. — Website

A complete, production-ready static website for a small local cleaning company.
Mobile responsive, accessible, and easy for a non-technical owner to update.

**Live on GitHub Pages — no build tools required.**

---

## Table of Contents

1. [Features](#features)
2. [File Tree](#file-tree)
3. [Quick Start](#quick-start)
4. [Deploy to GitHub Pages](#deploy-to-github-pages)
5. [Admin Panel — Update Content & Photos](#admin-panel)
6. [Set Up the Contact Form (Formspree)](#contact-form)
7. [Connect a Free Custom Domain (Freenom)](#custom-domain)
8. [Roll Back Changes](#roll-back-changes)
9. [Accessibility, SEO & Performance Checklist](#checklist)
10. [Suggested Enhancements](#suggested-enhancements)
11. [Troubleshooting](#troubleshooting)

---

## Features

- Classic, clean responsive design — works on mobile, tablet, and desktop
- All site text, gallery, and contact details managed from a single `data/content.json` file
- **Admin panel** (`admin.html`) for non-technical owners to edit content and upload photos via the browser
- Photo gallery with filter buttons and lightbox viewer
- Three-tier pricing section
- Customer testimonials section
- Contact form via Formspree (free tier, no backend needed)
- Accessible (WCAG 2.1 AA) — skip links, ARIA labels, keyboard navigation, focus styles
- SEO meta tags and Open Graph tags
- Web App Manifest for PWA basics
- No build step — pure HTML, CSS, and vanilla JavaScript
- Zero frameworks — only Google Fonts via CDN

---

## File Tree

```
the-ark/
│
├── index.html              ← Main website (all sections)
├── admin.html              ← Admin panel (edit content, upload photos)
├── 404.html                ← Custom 404 page
├── manifest.json           ← Web App Manifest
├── CNAME                   ← Custom domain (edit or delete if not using one)
├── README.md               ← This file
│
├── css/
│   └── style.css           ← All site styles
│
├── js/
│   ├── main.js             ← Site logic (content rendering, gallery, form, nav)
│   └── admin.js            ← Admin panel logic (GitHub API, file upload)
│
├── data/
│   └── content.json        ← ⭐ All editable site content lives here
│
├── assets/
│   ├── images/             ← All photos (hero, about, gallery)
│   │   ├── hero-bg.svg     ← Replace with your hero photo (.jpg)
│   │   ├── about-team.svg  ← Replace with team photo (.jpg)
│   │   ├── gallery-01.svg  ← Replace with real gallery photos
│   │   └── …
│   └── icons/
│       ├── icon-192.png    ← PWA icon (optional)
│       └── icon-512.png    ← PWA icon (optional)
│
└── scripts/
    └── create-placeholders.py  ← Helper to regenerate placeholder images
```

---

## Quick Start

### Prerequisites

- A [GitHub account](https://github.com) (free)
- Git installed on your computer ([download](https://git-scm.com)) OR use GitHub's web UI

### Option A — Using the GitHub Web UI (easiest, no Git needed)

1. Go to [github.com](https://github.com) and sign in.
2. Click **+** → **New repository**.
3. Name it `the-ark` (or anything you like). Set to **Public**. Do **not** initialise with a README.
4. Click **Create repository**.
5. Click **uploading an existing file** and drag all the files from this project into the upload area.
6. Click **Commit changes**.

### Option B — Using Git (command line)

```bash
# 1. Clone or initialise a new repo
git init the-ark
cd the-ark

# 2. Copy all project files into this folder, then:
git add .
git commit -m "Initial commit: The Ark website"

# 3. Create a repo on GitHub, then push
git remote add origin https://github.com/YOUR_USERNAME/the-ark.git
git branch -M main
git push -u origin main
```

---

## Deploy to GitHub Pages

1. Open your repository on GitHub.
2. Click **Settings** → **Pages** (left sidebar).
3. Under **Source**, select **Deploy from a branch**.
4. Branch: `main` | Folder: `/ (root)`. Click **Save**.
5. Wait 1–2 minutes. GitHub will show:
   > ✅ Your site is live at **https://YOUR_USERNAME.github.io/the-ark/**
6. Open that URL in a browser to see your live site.

> **Tip:** If you want the site at `https://YOUR_USERNAME.github.io` (no `/the-ark/` path),
> rename your repository to `YOUR_USERNAME.github.io`.

---

## Admin Panel

The admin panel (`admin.html`) lets you:

- Edit the site title, hero text, about section, contact details, and social links
- Upload photos and add them to the gallery — all from the browser, no code needed
- All changes are committed directly to your GitHub repository

### Step 1 — Create a GitHub Personal Access Token (PAT)

1. Go to: [github.com/settings/tokens/new](https://github.com/settings/tokens/new)
2. Give it a name, e.g. **the-ark-admin**
3. Set expiration: **90 days** (recommended — you can always generate a new one)
4. Under **Scopes**, tick **repo** (full control of private repositories)
5. Click **Generate token**
6. **Copy the token** — you will only see it once. Store it somewhere safe (a password manager)

> ⚠️ **Security warnings:**
> - Never paste your token into any other website or share it with anyone
> - Only use the admin panel on your own trusted device
> - The token is held in memory only — it is cleared when you close the tab or log out
> - If your token is ever exposed, revoke it immediately at [github.com/settings/tokens](https://github.com/settings/tokens)

### Step 2 — Configure admin.js

Open `js/admin.js` and set your GitHub username and repo name at the top:

```js
const GITHUB_OWNER = 'YOUR_GITHUB_USERNAME'; // e.g. 'janedoe'
const GITHUB_REPO  = 'the-ark';              // your repo name
```

Commit and push this change before using the admin panel.

### Step 3 — Open the Admin Panel

Go to: `https://YOUR_USERNAME.github.io/the-ark/admin.html`
(or open `admin.html` locally in a browser)

1. Paste your PAT when prompted
2. Edit content in the **Edit Content** tab — click **Save & Publish**
3. Upload photos in the **Manage Gallery** tab — drag & drop or browse
4. Click **Log Out** when done

### Example commit messages (auto-generated by admin.js)

- `Update site content via admin panel`
- `Upload image: gallery-1234567890-photo.jpg`
- `Update content.json: gallery +3 image(s)`
- `Update content.json: remove gallery item`

### Fallback — Edit via GitHub Web UI (no admin panel needed)

If the admin panel isn't working, you can edit content manually:

1. Go to your repo on GitHub
2. Click `data/content.json` → click the ✏️ pencil icon to edit
3. Make your changes, write a commit message, click **Commit changes**
4. The site updates automatically within 1–2 minutes

To upload images via GitHub web UI:
1. Navigate to `assets/images/`
2. Click **Add file** → **Upload files**
3. Drag your photos, commit
4. Update `data/content.json` to add the new gallery entry

---

## Contact Form

The contact form uses [Formspree](https://formspree.io) — a free service that receives form submissions and emails them to you. No backend or server needed.

### Setup Steps

1. Go to [formspree.io](https://formspree.io) and create a free account.
2. Click **+ New Form**. Give it a name (e.g. "The Ark Contact Form").
3. Copy your form endpoint — it looks like: `https://formspree.io/f/xabc1234`
4. Open `data/content.json` and paste it in:
   ```json
   "formspreeEndpoint": "https://formspree.io/f/xabc1234"
   ```
5. Also update the `action` attribute in `index.html` as a fallback:
   ```html
   <form id="contact-form" action="https://formspree.io/f/xabc1234" ...>
   ```
6. Commit and push. Test the form on your live site.
7. Check your email (and Formspree dashboard) for submissions.

> **Free tier limit:** 50 submissions/month. More than enough for a small business.
> Upgrade to paid if you need more.

---

## Custom Domain

### Option A — Free domain from Freenom (.tk, .ml, .ga, .cf, .gq)

> **Note (2024):** Freenom has had service interruptions. If Freenom is unavailable,
> see Option B for low-cost alternatives.

**Step 1 — Register a free domain**

1. Go to [freenom.com](https://www.freenom.com)
2. Search for `theark.tk` (or similar — try `.ml`, `.ga`, `.cf`, `.gq` if `.tk` is taken)
3. Select the domain → **Checkout** → Period: **12 months** (free)
4. Complete registration with your email

**Step 2 — Point the domain to GitHub Pages**

In Freenom → **My Domains** → **Manage Domain** → **Manage Freenom DNS**:

Add these DNS records:

| Type  | Name | Value                   | TTL  |
|-------|------|-------------------------|------|
| A     | @    | 185.199.108.153         | 3600 |
| A     | @    | 185.199.109.153         | 3600 |
| A     | @    | 185.199.110.153         | 3600 |
| A     | @    | 185.199.111.153         | 3600 |
| CNAME | www  | YOUR_USERNAME.github.io | 3600 |

**Step 3 — Add the domain to your GitHub repo**

1. Edit the `CNAME` file in your repo — replace `theark.tk` with your actual domain:
   ```
   theark.tk
   ```
2. Go to GitHub → repo **Settings** → **Pages**
3. Under **Custom domain**, type `theark.tk` and click **Save**
4. Tick **Enforce HTTPS** (appears after DNS propagates, ~24 hours)

**Step 4 — Test**

DNS propagation takes up to 48 hours. Test with:
```bash
dig theark.tk +short
# Should return the four GitHub Pages IPs above
```

### Option B — Low-cost paid domain (recommended for reliability)

- [Namecheap](https://namecheap.com) — `.com` from ~$10/year, `.co.ke` from ~$5/year
- [Cloudflare Registrar](https://cloudflare.com/registrar) — at-cost pricing, no markup
- [Google Domains / Squarespace Domains](https://domains.squarespace.com) — ~$12/year

Follow the same A record and CNAME steps above with your registrar's DNS panel.

### Option C — Use the default GitHub Pages URL (no custom domain needed)

Your site is already live at: `https://YOUR_USERNAME.github.io/the-ark/`
Delete the `CNAME` file from your repo if you're not using a custom domain.

---

## Roll Back Changes

Every change through admin.html or the web UI creates a Git commit. You can roll back any time.

**Via GitHub web UI:**
1. Go to your repo → **Commits** tab
2. Find the commit you want to revert to
3. Click **Browse files** at that commit → download or copy the file
4. Edit the current file to restore the old content

**Via Git (command line):**
```bash
# View commit history
git log --oneline

# Revert to a specific commit (creates a new "undo" commit)
git revert abc1234

# Or hard-reset (WARNING: discards all changes after that point)
git reset --hard abc1234
git push --force
```

---

## Checklist

### ✅ Accessibility (WCAG 2.1 AA)
- [x] Skip navigation link for keyboard users
- [x] All images have descriptive `alt` text
- [x] Colour contrast ≥ 4.5:1 for body text
- [x] Focus styles visible on all interactive elements
- [x] ARIA labels on nav, gallery, form, and landmark regions
- [x] Form labels associated with inputs
- [x] Gallery lightbox is keyboard accessible (Enter/Space/Escape)
- [x] Mobile nav toggle has `aria-expanded`

### ✅ SEO
- [x] `<title>` tag populated from content.json
- [x] `<meta name="description">` set
- [x] Open Graph tags for social sharing
- [x] Semantic HTML5 elements (`<nav>`, `<main>`, `<section>`, `<footer>`, `<article>`, `<blockquote>`)
- [x] Heading hierarchy (one `<h1>` per page)
- [x] `loading="lazy"` on gallery images
- [ ] Add `sitemap.xml` (see Enhancements)
- [ ] Add structured data (LocalBusiness schema)

### ✅ Performance
- [x] Google Fonts with `preconnect` hints
- [x] Lazy loading on all non-hero images
- [x] Admin-side image compression (client-side canvas resize to max 1200px, JPEG 85%)
- [x] No jQuery or heavy frameworks
- [x] CSS animations use `transform` and `opacity` (GPU-composited)
- [ ] Add Cloudflare CDN (see Enhancements)
- [ ] Add `<link rel="preload">` for hero image in production

---

## Suggested Enhancements

| Enhancement | Tool / Method | Difficulty |
|---|---|---|
| Better CMS (no PAT needed) | [Netlify CMS](https://decapcms.org) or [Tina CMS](https://tina.io) | Medium |
| CDN + DDoS protection | [Cloudflare](https://cloudflare.com) (free plan) | Easy |
| Analytics | [Plausible](https://plausible.io) or Google Analytics | Easy |
| XML Sitemap | Generate `sitemap.xml` and submit to Google Search Console | Easy |
| Local Business schema | Add JSON-LD `<script type="application/ld+json">` | Easy |
| Progressive Web App | Add service worker for offline support | Medium |
| Booking calendar | [Calendly](https://calendly.com) embed or Tidycal | Easy |
| WhatsApp chat widget | [wa.link](https://wa.link) floating button | Easy |
| Image optimisation | [Squoosh](https://squoosh.app) or [TinyPNG](https://tinypng.com) before upload | Easy |
| Blog / News | Add markdown-based blog using [11ty](https://11ty.dev) (optional build step) | Medium |

---

## Troubleshooting

**Site not showing after enabling GitHub Pages**
- Wait 2–3 minutes and hard-refresh (`Ctrl+Shift+R`)
- Check Settings → Pages — look for any error messages
- Ensure your default branch is `main` (not `master`)

**Content not loading (blank sections)**
- Open browser DevTools (F12) → Console tab — look for errors
- Check that `data/content.json` is valid JSON: paste it at [jsonlint.com](https://jsonlint.com)
- If running locally from a file:// URL, use a local server:
  ```bash
  python3 -m http.server 8000
  # Then open http://localhost:8000
  ```

**Admin panel says "GitHub error: Not Found"**
- Double-check `GITHUB_OWNER` and `GITHUB_REPO` in `js/admin.js`
- Make sure your PAT has the `repo` scope
- If the repo is private, the PAT must have access to it

**Custom domain not working**
- DNS can take up to 48 hours to propagate — wait and re-test
- Use [dnschecker.org](https://dnschecker.org) to verify A records
- Ensure the `CNAME` file contains only the domain name, nothing else
- In GitHub Settings → Pages, the custom domain must be saved

**Contact form submissions not arriving**
- Check your Formspree dashboard for submissions (they may land there even if email fails)
- Verify the form action URL matches your Formspree endpoint exactly
- Check your spam/junk folder
- Confirm you verified your email with Formspree during setup

**Images not showing**
- File names in `content.json` must exactly match files in `assets/images/` (case-sensitive)
- GitHub Pages is case-sensitive — `Hero-BG.jpg` ≠ `hero-bg.jpg`
- Confirm images are committed and pushed to the repo
