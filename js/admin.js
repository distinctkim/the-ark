/**
 * THE ARK — Admin Panel JavaScript
 * Allows non-technical users to:
 *   1. Edit site content (hero, about, services, contact details)
 *   2. Upload images and add gallery entries
 *   3. Commit changes to GitHub via the REST API v3
 *
 * SECURITY NOTE:
 *   A Personal Access Token (PAT) is entered by the user and stored only in
 *   memory (never localStorage/cookies). The page should only be accessed by
 *   the site owner on a trusted private device. Never share this page URL or
 *   token with others.
 */

/* ============================================================
   CONFIG — Update these two values for your GitHub repo
   ============================================================ */
const GITHUB_OWNER = 'distinctkim'; // e.g. 'janedoe'
const GITHUB_REPO  = 'the-ark';              // your repo name
const CONTENT_PATH = 'data/content.json';    // path in repo

/* ============================================================
   STATE
   ============================================================ */
let githubToken = '';    // Set from the token input form
let contentData  = {};   // In-memory copy of content.json
let contentSha   = '';   // GitHub blob SHA — needed to update file

/* ============================================================
   1. TOKEN GATE — User must enter PAT before anything works
   ============================================================ */
document.getElementById('token-form').addEventListener('submit', async e => {
  e.preventDefault();
  const input = document.getElementById('pat-input');
  githubToken = input.value.trim();
  input.value = '';  // Clear from DOM immediately

  if (!githubToken) return showTokenError('Please enter a token.');

  showStatus('token-status', 'Connecting to GitHub…', 'info');
  const ok = await fetchContent();
  if (ok) {
    document.getElementById('token-section').classList.add('hidden');
    document.getElementById('admin-panel').classList.remove('hidden');
    populateForms();
  }
});

/* ============================================================
   2. FETCH content.json FROM GITHUB
   ============================================================ */
async function fetchContent() {
  try {
    const res = await githubRequest('GET', `contents/${CONTENT_PATH}`);
    if (!res.ok) {
      const err = await res.json();
      showStatus('token-status', `GitHub error: ${err.message}`, 'error');
      return false;
    }
    const json = await res.json();
    contentSha  = json.sha;
    contentData = JSON.parse(atob(json.content.replace(/\n/g, '')));
    return true;
  } catch (err) {
    showStatus('token-status', `Error: ${err.message}`, 'error');
    return false;
  }
}

/* ============================================================
   3. POPULATE EDIT FORMS with current content.json values
   ============================================================ */
function populateForms() {
  const s = contentData.site;
  const h = contentData.hero;
  const a = contentData.about;

  // Site info
  setVal('edit-title',     s?.title);
  setVal('edit-phone',     s?.phone);
  setVal('edit-email',     s?.email);
  setVal('edit-address',   s?.address);
  setVal('edit-formspree', s?.formspreeEndpoint);
  setVal('edit-facebook',  s?.social?.facebook);
  setVal('edit-instagram', s?.social?.instagram);
  setVal('edit-whatsapp',  s?.social?.whatsapp);

  // Hero
  setVal('edit-hero-heading', h?.heading);
  setVal('edit-hero-sub',     h?.subheading);
  setVal('edit-hero-cta',     h?.ctaText);

  // About
  setVal('edit-about-heading', a?.heading);
  setVal('edit-about-body',    a?.body);

  // Gallery summary
  renderGallerySummary();
}

function setVal(id, val) {
  const el = document.getElementById(id);
  if (el && val !== undefined) el.value = val;
}

/* ============================================================
   4. SAVE CONTENT FORM — Collects edits and commits content.json
   ============================================================ */
document.getElementById('content-form').addEventListener('submit', async e => {
  e.preventDefault();
  showStatus('content-status', 'Saving…', 'info');

  // Merge edits into contentData
  contentData.site.title              = getVal('edit-title');
  contentData.site.phone              = getVal('edit-phone');
  contentData.site.email              = getVal('edit-email');
  contentData.site.address            = getVal('edit-address');
  contentData.site.formspreeEndpoint  = getVal('edit-formspree');
  contentData.site.social.facebook    = getVal('edit-facebook');
  contentData.site.social.instagram   = getVal('edit-instagram');
  contentData.site.social.whatsapp    = getVal('edit-whatsapp');
  contentData.hero.heading            = getVal('edit-hero-heading');
  contentData.hero.subheading         = getVal('edit-hero-sub');
  contentData.hero.ctaText            = getVal('edit-hero-cta');
  contentData.about.heading           = getVal('edit-about-heading');
  contentData.about.body              = getVal('edit-about-body');

  const ok = await commitContent('Update site content via admin panel');
  if (ok) {
    showStatus('content-status', '✓ Content saved and committed to GitHub!', 'success');
  }
});

function getVal(id) {
  return document.getElementById(id)?.value ?? '';
}

/* ============================================================
   5. IMAGE UPLOAD — Resize/compress client-side, commit to GitHub
   ============================================================ */
const dropZone   = document.getElementById('drop-zone');
const fileInput  = document.getElementById('image-input');

// Click to open file picker
dropZone.addEventListener('click', () => fileInput.click());

// Drag & drop
dropZone.addEventListener('dragover', e => { e.preventDefault(); dropZone.classList.add('drag-over'); });
dropZone.addEventListener('dragleave', () => dropZone.classList.remove('drag-over'));
dropZone.addEventListener('drop', e => {
  e.preventDefault();
  dropZone.classList.remove('drag-over');
  handleFiles(e.dataTransfer.files);
});

fileInput.addEventListener('change', () => handleFiles(fileInput.files));

async function handleFiles(files) {
  if (!files || files.length === 0) return;
  const queue = Array.from(files).filter(f => f.type.startsWith('image/'));
  if (queue.length === 0) {
    showStatus('gallery-status', 'Please select image files (JPG, PNG, WebP).', 'error');
    return;
  }

  showStatus('gallery-status', `Uploading ${queue.length} image(s)…`, 'info');
  let uploaded = 0;

  for (const file of queue) {
    const altText = document.getElementById('img-alt').value || file.name.replace(/\.[^.]+$/, '');
    const category = document.getElementById('img-category').value || 'residential';
    const filename = `gallery-${Date.now()}-${sanitizeFilename(file.name)}`;
    const path = `assets/images/${filename}`;

    try {
      // Resize/compress client-side using canvas
      const base64 = await resizeAndEncode(file, 1200);

      // Commit image to GitHub
      const imgRes = await githubRequest('PUT', `contents/${path}`, {
        message: `Upload image: ${filename}`,
        content: base64
      });
      if (!imgRes.ok) throw new Error((await imgRes.json()).message);

      // Add gallery entry to contentData
      const entry = {
        id: `g${Date.now()}`,
        src: path,
        alt: altText,
        category: category
      };
      contentData.gallery.push(entry);
      uploaded++;
    } catch (err) {
      showStatus('gallery-status', `Error uploading ${file.name}: ${err.message}`, 'error');
    }
  }

  if (uploaded > 0) {
    // Commit updated content.json with new gallery entries
    const ok = await commitContent(`Update content.json: gallery +${uploaded} image(s)`);
    if (ok) {
      showStatus('gallery-status', `✓ ${uploaded} image(s) uploaded and added to gallery!`, 'success');
      renderGallerySummary();
      document.getElementById('img-alt').value = '';
    }
  }
}

/* ---- Resize image using canvas ---- */
function resizeAndEncode(file, maxWidth) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    const url = URL.createObjectURL(file);
    img.onload = () => {
      URL.revokeObjectURL(url);
      const scale = Math.min(1, maxWidth / img.width);
      const w = Math.round(img.width  * scale);
      const h = Math.round(img.height * scale);
      const canvas = document.createElement('canvas');
      canvas.width = w; canvas.height = h;
      const ctx = canvas.getContext('2d');
      ctx.drawImage(img, 0, 0, w, h);
      // JPEG quality 0.85
      const dataUrl = canvas.toDataURL('image/jpeg', 0.85);
      resolve(dataUrl.split(',')[1]); // Return only base64 part
    };
    img.onerror = () => reject(new Error('Could not load image'));
    img.src = url;
  });
}

function sanitizeFilename(name) {
  return name.toLowerCase().replace(/[^a-z0-9.\-_]/g, '-');
}

/* ============================================================
   6. GALLERY SUMMARY — Shows current gallery entries with delete
   ============================================================ */
function renderGallerySummary() {
  const container = document.getElementById('gallery-list');
  if (!container) return;
  const items = contentData.gallery || [];

  if (items.length === 0) {
    container.innerHTML = '<p class="muted-text">No gallery images yet.</p>';
    return;
  }

  container.innerHTML = items.map((item, idx) => `
    <div class="gallery-admin-item">
      <img src="${item.src}" alt="${item.alt}"
           onerror="this.src='data:image/svg+xml,%3Csvg xmlns=\\'http://www.w3.org/2000/svg\\' width=\\'60\\' height=\\'60\\'%3E%3Crect fill=\\'%23dde3ee\\' width=\\'60\\' height=\\'60\\'/%3E%3C/svg%3E'">
      <div class="gallery-item-info">
        <strong>${item.alt}</strong>
        <span class="badge">${item.category}</span>
      </div>
      <button class="btn-delete" onclick="deleteGalleryItem(${idx})"
              title="Remove from gallery" aria-label="Remove ${item.alt}">✕</button>
    </div>
  `).join('');
}

window.deleteGalleryItem = async function(idx) {
  if (!confirm('Remove this image from the gallery? (The image file remains in the repo.)')) return;
  contentData.gallery.splice(idx, 1);
  const ok = await commitContent('Update content.json: remove gallery item');
  if (ok) {
    showStatus('gallery-status', '✓ Gallery item removed.', 'success');
    renderGallerySummary();
  }
};

/* ============================================================
   7. GITHUB API HELPERS
   ============================================================ */
function githubRequest(method, endpoint, body) {
  const opts = {
    method,
    headers: {
      'Authorization': `token ${githubToken}`,
      'Accept': 'application/vnd.github.v3+json',
      'Content-Type': 'application/json'
    }
  };
  if (body) opts.body = JSON.stringify(body);
  return fetch(`https://api.github.com/repos/${GITHUB_OWNER}/${GITHUB_REPO}/${endpoint}`, opts);
}

async function commitContent(message) {
  try {
    const newContent = btoa(unescape(encodeURIComponent(
      JSON.stringify(contentData, null, 2)
    )));
    const body = { message, content: newContent };
    if (contentSha) body.sha = contentSha;

    const res = await githubRequest('PUT', `contents/${CONTENT_PATH}`, body);
    const json = await res.json();
    if (!res.ok) throw new Error(json.message);

    contentSha = json.content.sha; // Update SHA for next commit
    return true;
  } catch (err) {
    showStatus('content-status', `✗ Commit failed: ${err.message}`, 'error');
    return false;
  }
}

/* ============================================================
   8. UI HELPERS
   ============================================================ */
function showStatus(elId, message, type) {
  const el = document.getElementById(elId);
  if (!el) return;
  el.textContent = message;
  el.className = `status-msg status-${type}`;
}

function showTokenError(msg) {
  showStatus('token-status', msg, 'error');
}

/* ============================================================
   9. TABS — Switch between Content / Gallery panels
   ============================================================ */
document.querySelectorAll('.tab-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    const target = btn.dataset.tab;
    document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
    document.querySelectorAll('.tab-panel').forEach(p => p.classList.add('hidden'));
    btn.classList.add('active');
    document.getElementById(`tab-${target}`)?.classList.remove('hidden');
  });
});

/* ============================================================
   10. LOGOUT — Clear token from memory
   ============================================================ */
document.getElementById('logout-btn')?.addEventListener('click', () => {
  githubToken = '';
  contentData = {};
  contentSha  = '';
  document.getElementById('admin-panel').classList.add('hidden');
  document.getElementById('token-section').classList.remove('hidden');
  showStatus('token-status', 'Logged out. Token cleared from memory.', 'info');
});
