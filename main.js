import './style.css';
import * as pdfjsLib from 'pdfjs-dist';
import pdfWorkerUrl from 'pdfjs-dist/build/pdf.worker.mjs?url';
import { PDFDocument, degrees } from 'pdf-lib';

// i18n Dictionary
const i18n = {
  en: {
    app_title: "Doc Signer — Sign & Stamp PDFs & Images",
    app_name: "Doc Signer",
    download_btn: "Download File",
    new_document: "New Document",
    step_1: "1. Choose Files",
    select_pdf: "Select your PDF or image file",
    select_stamp: "Stamp/Signature Image (PNG or JPG)",
    stamp_preview_alt: "Stamp preview",
    start_stamping: "Start Stamping",
    instruction_add: "Click on pages to add stamps.",
    page: "Page",
    of: "of",
    zoom_out: "Zoom Out",
    zoom_in: "Zoom In",
    success_toast: "Operation Successful",
    toast_stamp_added: "Stamp Added — Drag to move, use handles to resize/rotate",
    toast_stamp_removed: "Stamp Removed",
    toast_loading_doc: "Loading Document...",
    error_loading_pdf: "Error loading document",
    toast_no_stamp: "Please add a stamp to a page first",
    toast_exporting: "Generating final document...",
    toast_saved: "Document saved successfully",
    error_exporting: "Error generating file",
    default_doc_name: "Document",
    default_image_doc_name: "Image",
    // Landing page
    hero_badge: "Free Online Tool",
    hero_title_1: "Sign & Stamp",
    hero_title_2: "PDFs & Images",
    hero_title_3: "in Seconds",
    hero_subtitle: "Upload your document, place your stamp or signature, and download the result instantly. No account needed, no server upload — 100% private.",
    hero_cta: "Get Started — It's Free",
    hero_learn_more: "Learn More",
    stat_free: "Free",
    stat_browser: "Browser",
    stat_no_upload: "No Upload",
    stat_secure: "Secure",
    stat_private: "Your files never leave your device",
    features_title: "Why Choose Doc Signer?",
    features_subtitle: "Everything you need to sign documents quickly and securely",
    feature_1_title: "100% Private & Secure",
    feature_1_desc: "Your files never leave your browser. All processing happens locally on your device.",
    feature_2_title: "Fast & Easy to Use",
    feature_2_desc: "Upload, stamp, download — three simple steps. No registration or installation required.",
    feature_3_title: "Works with PDFs & Images",
    feature_3_desc: "Stamp both PDF documents and image files (JPG, PNG) with the same easy interface.",
    feature_4_title: "Drag, Resize & Rotate",
    feature_4_desc: "Full control over stamp placement. Move, resize, and rotate stamps exactly where you need them.",
    feature_5_title: "Multi-Page PDF Support",
    feature_5_desc: "Navigate through all pages of your PDF and place stamps on any or all pages.",
    feature_6_title: "Instant Download",
    feature_6_desc: "Get your signed document immediately as a PDF or PNG, ready to share or print.",
    howto_title: "How It Works",
    howto_subtitle: "Three simple steps to sign your document",
    step_1_title: "Upload Your Document",
    step_1_desc: "Drop a PDF file or an image (JPG, PNG) into the upload area.",
    step_2_title: "Place Your Stamp",
    step_2_desc: "Click anywhere on the document to add your stamp. Drag, resize, and rotate it.",
    step_3_title: "Download Result",
    step_3_desc: "Click download to get your stamped PDF or image instantly.",
    tool_title: "Try It Now",
    tool_subtitle: "Upload your document and start stamping in seconds",
    footer_tagline: "Sign and stamp documents directly in your browser. Fast, free, and private.",
    footer_github: "View on GitHub",
    footer_copyright: "Your files never leave your device — 100% private.",
    // Image doc
    toast_image_loaded: "Image loaded successfully",
    error_loading_image: "Error loading image",
    remove_stamp: "Remove Stamp",
    prev_page: "Previous Page",
    next_page: "Next Page",
    // Navigation
    page_of: "of",
    // Background removal
    bg_removal_color: "Background Color:",
    bg_tolerance: "Tolerance:",
    remove_bg: "Remove Background",
    // Stamp library
    stamp_library: "Stamp Library",
    confirm_stamp: "Confirm",
    cancel_stamp: "Cancel",
    toast_bg_removed: "Background removed successfully",
    toast_stamp_saved: "Stamp saved to library",
    toast_stamp_deleted: "Stamp removed from library",
    toast_confirm_first: "Please confirm stamp location or move it",
    empty_library: "Library is empty",
    stamp_settings_title: "Stamp Settings",
    preview_bg: "Preview",
    reset_bg: "Reset",
    change_stamp: "Select Stamp",
    add_new_stamp: "Add New Stamp",
    auto_remove_bg: "Auto Remove Background",
    processing: "Processing..."
  },
  fa: {
    app_title: "سند یار — امضا و مُهر زدن روی PDF و تصاویر",
    app_name: "سند یار",
    download_btn: "دانلود فایل نهایی",
    new_document: "سند جدید",
    step_1: "۱. انتخاب فایل‌ها",
    select_pdf: "فایل PDF یا تصویر خود را انتخاب کنید",
    select_stamp: "فایل تصویر مُهر (PNG یا JPG)",
    stamp_preview_alt: "پیش‌نمایش مُهر",
    start_stamping: "شروع افزودن مُهر",
    instruction_add: "روی صفحات کلیک کنید تا مهر اضافه شود.",
    page: "صفحه",
    of: "از",
    zoom_out: "کوچک نمایی",
    zoom_in: "بزرگ نمایی",
    success_toast: "عملیات با موفقیت انجام شد",
    toast_stamp_added: "مُهر اضافه شد — جابجا کنید یا زاویه و سایز را تغییر دهید",
    toast_stamp_removed: "مُهر حذف شد",
    toast_loading_doc: "در حال بارگذاری سند...",
    error_loading_pdf: "خطا در بارگذاری سند",
    toast_no_stamp: "ابتدا مُهری روی صفحات قرار دهید",
    toast_exporting: "در حال صدور سند نهایی...",
    toast_saved: "سند با موفقیت ذخیره شد",
    error_exporting: "خطا در صدور فایل",
    default_doc_name: "سند",
    default_image_doc_name: "تصویر",
    // Landing page
    hero_badge: "ابزار آنلاین رایگان",
    hero_title_1: "امضا و مُهر زدن",
    hero_title_2: "روی PDF و تصاویر",
    hero_title_3: "در چند ثانیه",
    hero_subtitle: "سند خود را آپلود کنید، مُهر یا امضای خود را قرار دهید و فوراً دانلود کنید. بدون نیاز به ثبت‌نام و آپلود در سرور — کاملاً خصوصی.",
    hero_cta: "شروع کنید — رایگان است",
    hero_learn_more: "بیشتر بدانید",
    stat_free: "رایگان",
    stat_browser: "مرورگر",
    stat_no_upload: "بدون آپلود",
    stat_secure: "امن",
    stat_private: "فایل‌های شما هرگز دستگاهتان را ترک نمی‌کنند",
    features_title: "چرا سند یار؟",
    features_subtitle: "همه چیزی که برای امضای سریع و امن اسناد نیاز دارید",
    feature_1_title: "کاملاً خصوصی و امن",
    feature_1_desc: "فایل‌های شما هرگز مرورگر را ترک نمی‌کنند. تمام پردازش‌ها روی دستگاه شما انجام می‌شود.",
    feature_2_title: "سریع و آسان",
    feature_2_desc: "آپلود، مُهر زدن، دانلود — سه مرحله ساده. بدون نیاز به ثبت‌نام یا نصب.",
    feature_3_title: "سازگار با PDF و تصاویر",
    feature_3_desc: "هم روی فایل‌های PDF و هم روی تصاویر (JPG، PNG) با همین رابط آسان مُهر بزنید.",
    feature_4_title: "جابجایی، تغییر اندازه و چرخش",
    feature_4_desc: "کنترل کامل بر جایگذاری مُهر. مُهر را دقیقاً همانجا که نیاز دارید قرار دهید.",
    feature_5_title: "پشتیبانی از PDF چندصفحه‌ای",
    feature_5_desc: "بین تمام صفحات PDF حرکت کنید و روی هر صفحه که خواستید مُهر بزنید.",
    feature_6_title: "دانلود فوری",
    feature_6_desc: "سند امضا شده خود را فوراً به صورت PDF یا PNG دریافت کنید.",
    howto_title: "نحوه کار",
    howto_subtitle: "سه مرحله ساده برای امضای سند شما",
    step_1_title: "سند خود را آپلود کنید",
    step_1_desc: "یک فایل PDF یا تصویر (JPG، PNG) را در area آپلود رها کنید.",
    step_2_title: "مُهر خود را قرار دهید",
    step_2_desc: "در هر جای سند کلیک کنید تا مُهر اضافه شود. آن را بکشید، تغییر اندازه و چرخش دهید.",
    step_3_title: "نتیجه را دانلود کنید",
    step_3_desc: "برای دریافت فوری سند مُهردار کلیک کنید.",
    tool_title: "همین الان امتحان کنید",
    tool_subtitle: "سند خود را آپلود کنید و در چند ثانیه شروع به مُهر زدن کنید",
    footer_tagline: "اسناد را مستقیماً در مرورگر خود امضا و مُهر بزنید. سریع، رایگان و خصوصی.",
    footer_github: "مشاهده در GitHub",
    footer_copyright: "فایل‌های شما هرگز دستگاهتان را ترک نمی‌کنند — کاملاً خصوصی.",
    // Image doc
    toast_image_loaded: "تصویر با موفقیت بارگذاری شد",
    error_loading_image: "خطا در بارگذاری تصویر",
    remove_stamp: "حذف مهر",
    prev_page: "صفحه قبل",
    next_page: "صفحه بعد",
    // Navigation
    page_of: "از",
    // Background removal
    bg_removal_color: "رنگ پس‌زمینه:",
    bg_tolerance: "تلرانس:",
    remove_bg: "حذف پس‌زمینه",
    // Stamp library
    stamp_library: "کتابخانه مُهرها",
    confirm_stamp: "تأیید",
    cancel_stamp: "لغو",
    toast_bg_removed: "پس‌زمینه با موفقیت حذف شد",
    toast_stamp_saved: "مُهر در کتابخانه ذخیره شد",
    toast_stamp_deleted: "مُهر از کتابخانه حذف شد",
    toast_confirm_first: "جای مُهر را تأیید کنید یا جابجا شوید",
    empty_library: "کتابخانه خالی است",
    stamp_settings_title: "تنظیمات مُهر",
    preview_bg: "پیش‌نمایش",
    reset_bg: "بازنشانی",
    change_stamp: "انتخاب مُهر",
    add_new_stamp: "افزودن مُهر جدید",
    auto_remove_bg: "حذف خودکار پس‌زمینه",
    processing: "در حال پردازش..."
  }
};

let currentLang = localStorage.getItem('app_lang') || 'en';
let currentTheme = localStorage.getItem('app_theme') || 'dark';

function setTheme(theme) {
  currentTheme = theme;
  document.documentElement.setAttribute('data-theme', theme);
  localStorage.setItem('app_theme', theme);

  const darkIcon = document.querySelector('.theme-icon-dark');
  const lightIcon = document.querySelector('.theme-icon-light');

  if (theme === 'light') {
    darkIcon.style.display = 'none';
    lightIcon.style.display = 'block';
  } else {
    darkIcon.style.display = 'block';
    lightIcon.style.display = 'none';
  }
}

function toggleTheme() {
  const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
  setTheme(newTheme);
}

function setLanguage(lang) {
  currentLang = lang;
  document.documentElement.lang = lang;
  document.documentElement.dir = lang === 'fa' ? 'rtl' : 'ltr';

  const elements = document.querySelectorAll('[data-i18n]');
  elements.forEach(el => {
    const key = el.getAttribute('data-i18n');
    if (i18n[lang][key]) {
      el.textContent = i18n[lang][key];
    }
  });

  const titleElements = document.querySelectorAll('[data-i18n-title]');
  titleElements.forEach(el => {
    const key = el.getAttribute('data-i18n-title');
    if (i18n[lang][key]) {
      el.title = i18n[lang][key];
    }
  });

  const altElements = document.querySelectorAll('[data-i18n-alt]');
  altElements.forEach(el => {
    const key = el.getAttribute('data-i18n-alt');
    if (i18n[lang][key]) {
      el.alt = i18n[lang][key];
    }
  });

  const pdfFn = document.getElementById('pdf-filename');
  if (pdfFn) {
    pdfFn.textContent = pdfFileNameStr || i18n[lang].select_pdf;
  }

  const stampFn = document.getElementById('stamp-filename');
  if (stampFn) {
    stampFn.textContent = stampFileNameStr || i18n[lang].select_stamp;
  }

  // Update page info for image docs
  updatePageInfo();

  localStorage.setItem('app_lang', lang);
}

function t(key) {
  return i18n[currentLang][key] || key;
}

// Set worker
pdfjsLib.GlobalWorkerOptions.workerSrc = pdfWorkerUrl;

// Application State
let pdfDoc = null;
let currentNum = 1;
let totalNum = 0;
let renderTask = null;
let zoom = 1.0;
const STAMP_BASE_WIDTH = 150;

let pdfBytes = null;
let pdfFileNameStr = null;

// Document type: 'pdf' or 'image'
let docType = null;

// Image document state
let imageDoc = null; // { img: HTMLImageElement, width, height, canvas: OffscreenCanvas }
let imageCanvas = null; // visible canvas for image rendering

let stampType = null;
let stampImageBytes = null;
let stampSrc = null;
let stampFileNameStr = null;
let stampAspectRatio = 1;

// Array of { pageNum, x, y, width, height, rotation, id }
let stamps = [];

// Stamp library stored in localStorage
const MAX_STAMP_LIBRARY = 20;
let stampLibrary = [];

// Background removal settings
let bgRemovalColor = '#ffffff';
let bgRemovalTolerance = 30;

// DOM Reference Function
const el = (id) => document.getElementById(id);

function init() {
  setLanguage(currentLang);
  setTheme(currentTheme);
  loadStampFromMemory();
  loadStampLibrary();
  attachEventListeners();
}

function showToast(message, duration = 3000) {
  const toast = el('toast');
  if (!toast) return;
  toast.textContent = message;
  toast.classList.remove('hidden');
  setTimeout(() => toast.classList.add('hidden'), duration);
}

function updateStampAspect(src) {
  const img = new Image();
  img.onload = () => {
    stampAspectRatio = img.height / img.width;
  };
  img.src = src;
}

function dataUrlToBytes(dataUrl) {
  const base64str = dataUrl.split(',')[1];
  const binary = atob(base64str);
  const len = binary.length;
  const bytes = new Uint8Array(len);
  for (let i = 0; i < len; i++) {
    bytes[i] = binary.charCodeAt(i);
  }
  return bytes;
}

function activateStamp(dataUrl, name) {
  stampSrc = dataUrl;
  stampFileNameStr = name || stampFileNameStr;
  stampImageBytes = dataUrlToBytes(dataUrl);
  const mimeMatch = dataUrl.split(',')[0].match(/:(.*?);/);
  if (mimeMatch) {
    stampType = mimeMatch[1];
  }

  const fn = el('stamp-filename');
  if (fn) fn.textContent = stampFileNameStr || t('select_stamp');
  const preview = el('stamp-preview');
  if (preview) {
    preview.src = stampSrc;
    preview.classList.remove('hidden');
  }

  updateStampAspect(stampSrc);
  checkReady();
}

// ==================== BACKGROUND REMOVAL ====================
async function removeBackground(color, tolerance) {
  if (!stampImageBytes) return;

  return new Promise((resolve, reject) => {
    const blob = new Blob([stampImageBytes], { type: stampType });
    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = img.naturalWidth;
      canvas.height = img.naturalHeight;
      const ctx = canvas.getContext('2d');
      ctx.drawImage(img, 0, 0);

      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const data = imageData.data;

      // Parse target color
      const r = parseInt(color.slice(1, 3), 16);
      const g = parseInt(color.slice(3, 5), 16);
      const b = parseInt(color.slice(5, 7), 16);

      const maxDist = Math.sqrt(3 * 255 * 255);
      const tolerancePercent = tolerance / 100;
      const threshold = tolerancePercent * maxDist;

      for (let i = 0; i < data.length; i += 4) {
        const dr = data[i] - r;
        const dg = data[i + 1] - g;
        const db = data[i + 2] - b;
        const dist = Math.sqrt(dr * dr + dg * dg + db * db);

        if (dist <= threshold) {
          data[i + 3] = 0; // Set alpha to 0 (transparent)
        }
      }

      ctx.putImageData(imageData, 0, 0);

      canvas.toBlob((blob) => {
        if (!blob) {
          reject(new Error('Failed to create blob'));
          return;
        }
        const reader = new FileReader();
        reader.onload = (e) => {
          const newDataUrl = e.target.result;
          stampSrc = newDataUrl;
          stampType = 'image/png';

          blob.arrayBuffer().then(ab => {
            stampImageBytes = new Uint8Array(ab);

            // Update preview
            const preview = el('stamp-preview');
            if (preview) {
              preview.src = newDataUrl;
            }

            resolve();
          });
        };
        reader.onerror = reject;
        reader.readAsDataURL(blob);
      }, 'image/png');
    };
    img.onerror = reject;
    img.src = URL.createObjectURL(blob);
  });
}

// ==================== STAMP LIBRARY ====================
function loadStampLibrary() {
  try {
    const data = localStorage.getItem('stamp_library');
    if (data) {
      stampLibrary = JSON.parse(data);
    }
  } catch (e) {
    stampLibrary = [];
  }
  renderStampLibrary();
}

function saveStampLibrary() {
  try {
    // Limit library size
    if (stampLibrary.length > MAX_STAMP_LIBRARY) {
      stampLibrary = stampLibrary.slice(-MAX_STAMP_LIBRARY);
    }
    localStorage.setItem('stamp_library', JSON.stringify(stampLibrary));
  } catch (e) {
    console.error('Failed to save stamp library:', e);
  }
}

function addToStampLibrary(dataUrl, name) {
  // Check if already exists (by name)
  const exists = stampLibrary.find(s => s.name === name);
  if (exists) {
    // Move to top
    stampLibrary = stampLibrary.filter(s => s.name !== name);
  }

  stampLibrary.unshift({ dataUrl, name });
  saveStampLibrary();
  renderStampLibrary();
}

function deleteFromStampLibrary(index) {
  stampLibrary.splice(index, 1);
  saveStampLibrary();
  renderStampLibrary();
}

function selectStampFromLibrary(dataUrl, name) {
  activateStamp(dataUrl, name);
}

function renderStampLibrary() {
  const container = el('stamp-library-grid');
  const librarySection = el('stamp-library');
  if (!container) return;

  if (stampLibrary.length === 0) {
    librarySection?.classList.add('hidden');
    return;
  }

  librarySection?.classList.remove('hidden');
  container.innerHTML = '';

  stampLibrary.forEach((stamp, index) => {
    const item = document.createElement('div');
    item.className = 'library-stamp-item';

    const img = document.createElement('img');
    img.src = stamp.dataUrl;
    img.alt = stamp.name;
    img.title = stamp.name;
    img.onclick = () => selectStampFromLibrary(stamp.dataUrl, stamp.name);

    const delBtn = document.createElement('button');
    delBtn.className = 'library-stamp-delete';
    delBtn.innerHTML = '×';
    delBtn.title = t('toast_stamp_deleted');
    delBtn.onclick = (e) => {
      e.stopPropagation();
      deleteFromStampLibrary(index);
      showToast(t('toast_stamp_deleted'));
    };

    item.appendChild(img);
    item.appendChild(delBtn);
    container.appendChild(item);
  });
}

function renderWorkspaceStampList() {
  const container = el('workspace-stamp-list');
  const emptyMsg = el('workspace-stamp-empty');
  if (!container) return;

  if (stampLibrary.length === 0) {
    container.innerHTML = '';
    emptyMsg?.classList.remove('hidden');
    return;
  }

  emptyMsg?.classList.add('hidden');
  container.innerHTML = '';

  stampLibrary.forEach((stamp) => {
    const item = document.createElement('div');
    item.className = 'workspace-stamp-item';
    if (stampSrc === stamp.dataUrl) {
      item.classList.add('active');
    }
    item.title = stamp.name;

    const img = document.createElement('img');
    img.src = stamp.dataUrl;
    img.alt = stamp.name;
    item.appendChild(img);

    item.addEventListener('click', () => {
      selectStampFromLibrary(stamp.dataUrl, stamp.name);
      el('stamp-selector-dropdown')?.classList.add('hidden');
      // Redraw existing stamps with new stamp image
      drawVirtualStamps();
    });

    container.appendChild(item);
  });
}

function loadStampFromMemory() {
  const dataUrl = localStorage.getItem('saved_stamp_data');
  const name = localStorage.getItem('saved_stamp_name');
  if (dataUrl) {
    try {
      activateStamp(dataUrl, name || 'Saved Stamp [Memory]');
    } catch (e) {
      console.error("Failed to load saved stamp:", e);
    }
  }
}

function saveStampToMemory(file) {
  const reader = new FileReader();
  reader.onload = function (e) {
    const dataUrl = e.target.result;
    localStorage.setItem('saved_stamp_data', dataUrl);
    localStorage.setItem('saved_stamp_name', file.name);
  };
  reader.readAsDataURL(file);
}

function saveCurrentStampToMemory() {
  if (!stampSrc) return;
  localStorage.setItem('saved_stamp_data', stampSrc);
  localStorage.setItem('saved_stamp_name', stampFileNameStr || 'Stamp');
}

function resetWorkspace() {
  pdfBytes = null;
  pdfFileNameStr = null;
  docType = null;
  imageDoc = null;
  imageCanvas = null;

  const upload = el('pdf-upload');
  if (upload) upload.value = '';

  const fn = el('pdf-filename');
  if (fn) fn.textContent = t('select_pdf');

  stamps = [];
  currentNum = 1;
  totalNum = 0;
  zoom = 1.0;

  const zl = el('zoom-level');
  if (zl) zl.textContent = '100%';

  el('workspace-section')?.classList.add('hidden');
  el('setup-section')?.classList.remove('hidden');
  el('landing-page')?.classList.remove('hidden');
  el('app')?.classList.remove('workspace-active');
  el('reset-btn')?.classList.add('hidden');

  const downBtn = el('download-btn');
  if (downBtn) {
    downBtn.classList.add('disabled');
    downBtn.disabled = true;
  }

  const stBtn = el('start-stamping-btn');
  if (stBtn) {
    stBtn.classList.add('disabled');
    stBtn.disabled = true;
  }

  if (renderTask) renderTask.cancel();
  const canvas = el('pdf-render');
  if (canvas) {
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);
  }

  document.querySelectorAll('.stamp-overlay').forEach(el => el.remove());
  checkReady();
}

function updatePageInfo() {
  const pn = el('page-num');
  const pc = el('page-count');
  if (pn) pn.textContent = currentNum;
  if (pc) pc.textContent = totalNum;
}

function attachEventListeners() {
  el('lang-btn')?.addEventListener('click', () => {
    const newLang = currentLang === 'en' ? 'fa' : 'en';
    setLanguage(newLang);
  });

  el('theme-btn')?.addEventListener('click', () => {
    toggleTheme();
  });

  el('reset-btn')?.addEventListener('click', resetWorkspace);

  async function handleSelectedStampFile(file, { openModal = false } = {}) {
    if (!file) return;
    stampType = file.type;
    stampFileNameStr = file.name;
    const fn = el('stamp-filename');
    if (fn) fn.textContent = file.name;

    const preview = el('stamp-preview');
    if (preview) preview.classList.remove('hidden');

    const buffer = await file.arrayBuffer();
    stampImageBytes = new Uint8Array(buffer);

    const blob = new Blob([stampImageBytes], { type: stampType });
    const tempUrl = URL.createObjectURL(blob);
    if (preview) preview.src = tempUrl;

    saveStampToMemory(file);
    const dataUrl = await new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (evt) => resolve(evt.target.result);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });

    activateStamp(dataUrl, file.name);
    if (!openModal) {
      addToStampLibrary(dataUrl, file.name);
      renderWorkspaceStampList();
    }
    checkReady();

    if (openModal) {
      openStampModal();
    }

    URL.revokeObjectURL(tempUrl);
  }

  el('pdf-upload')?.addEventListener('change', async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    pdfFileNameStr = file.name;
    const fn = el('pdf-filename');
    if (fn) fn.textContent = file.name;

    const fileType = file.type;

    if (fileType === 'application/pdf') {
      docType = 'pdf';
      pdfBytes = await file.arrayBuffer();
    } else if (fileType.startsWith('image/')) {
      docType = 'image';
      await loadImageDocument(file);
    } else {
      showToast(t('error_loading_pdf'));
      return;
    }

    checkReady();
  });

  el('stamp-upload')?.addEventListener('change', async (e) => {
    try {
      const file = e.target.files[0];
      if (!file) return;
      await handleSelectedStampFile(file, { openModal: true });
    } finally {
      if (e.target) e.target.value = '';
    }
  });

  // Modal event listeners
  el('close-stamp-modal')?.addEventListener('click', closeStampModal);

  el('modal-backdrop')?.addEventListener('click', (e) => {
    if (e.target.classList.contains('modal-backdrop')) {
      closeStampModal();
    }
  });

  el('modal-confirm-btn')?.addEventListener('click', () => {
    saveCurrentStampToMemory();
    addToStampLibrary(stampSrc, stampFileNameStr || 'Stamp');
    renderWorkspaceStampList();
    drawVirtualStamps();
    closeStampModal();
  });

  el('modal-remove-bg-btn')?.addEventListener('click', async () => {
    if (!stampImageBytes) return;
    try {
      await removeBackground(bgRemovalColor, bgRemovalTolerance);
      saveCurrentStampToMemory();
      addToStampLibrary(stampSrc, stampFileNameStr || 'Stamp');
      renderWorkspaceStampList();
      showToast(t('toast_bg_removed'));
      // Update modal preview
      const modalPreview = el('modal-stamp-preview');
      if (modalPreview) modalPreview.src = stampSrc;
      // Show reset button
      el('modal-reset-bg-btn')?.classList.remove('hidden');
    } catch (e) {
      console.error('Background removal failed:', e);
    }
  });

  el('modal-preview-bg-btn')?.addEventListener('click', () => {
    previewBackgroundRemoval();
  });

  el('modal-reset-bg-btn')?.addEventListener('click', () => {
    resetToOriginalStamp();
  });

  // Modal bg controls
  el('modal-bg-color-picker')?.addEventListener('input', (e) => {
    bgRemovalColor = e.target.value;
    const hex = el('modal-bg-color-hex');
    if (hex) hex.textContent = e.target.value;
  });

  el('modal-bg-tolerance')?.addEventListener('input', (e) => {
    bgRemovalTolerance = parseInt(e.target.value);
    const val = el('modal-bg-tolerance-val');
    if (val) val.textContent = e.target.value;
  });

  el('modal-bg-color-picker')?.addEventListener('change', async (e) => {
    await applyBackgroundRemoval();
  });

  el('modal-bg-tolerance')?.addEventListener('change', async (e) => {
    await applyBackgroundRemoval();
  });

  el('modal-auto-bg-toggle')?.addEventListener('change', async (e) => {
    if (e.target.checked) {
      await applyBackgroundRemoval();
    } else {
      resetToOriginalStamp();
    }
  });

  // Modal functions
  let originalStampSrc = null; // Store original stamp for reset
  let originalStampBytes = null; // Store original bytes for reset
  let originalStampType = null;
  let isProcessingBg = false;

  async function applyBackgroundRemoval() {
    if (isProcessingBg) return;
    const autoToggle = el('modal-auto-bg-toggle');
    if (!autoToggle || !autoToggle.checked) return;
    if (!originalStampBytes) return;

    stampImageBytes = new Uint8Array(originalStampBytes);
    stampType = originalStampType; 
    
    isProcessingBg = true;
    const spinner = el('modal-loading-spinner');
    const preview = el('modal-stamp-preview');
    if(spinner) spinner.classList.remove('hidden');

    try {
      await removeBackground(bgRemovalColor, bgRemovalTolerance);
      if (preview && stampSrc) {
        preview.src = stampSrc;
      }
    } catch (e) {
      console.error('BG removal failed:', e);
    } finally {
      if(spinner) spinner.classList.add('hidden');
      isProcessingBg = false;
    }
  }

  async function openStampModal() {
    const modal = el('stamp-settings-modal');
    const preview = el('modal-stamp-preview');
    originalStampSrc = stampSrc; // Save original
    originalStampBytes = stampImageBytes ? new Uint8Array(stampImageBytes) : null;
    originalStampType = stampType;
    if (preview && stampSrc) {
      preview.src = stampSrc;
    }
    // Hide reset button initially
    el('modal-reset-bg-btn')?.classList.add('hidden');
    modal?.classList.remove('hidden');

    const autoToggle = el('modal-auto-bg-toggle');
    if (autoToggle && autoToggle.checked) {
      await applyBackgroundRemoval();
    }
  }

  function closeStampModal() {
    const modal = el('stamp-settings-modal');
    modal?.classList.add('hidden');
  }

  // Preview background removal (temporary - without saving)
  async function previewBackgroundRemoval() {
    if (!stampImageBytes) return;

    return new Promise((resolve, reject) => {
      const blob = new Blob([stampImageBytes], { type: stampType });
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        canvas.width = img.naturalWidth;
        canvas.height = img.naturalHeight;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0);

        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const data = imageData.data;

        const r = parseInt(bgRemovalColor.slice(1, 3), 16);
        const g = parseInt(bgRemovalColor.slice(3, 5), 16);
        const b = parseInt(bgRemovalColor.slice(5, 7), 16);

        const maxDist = Math.sqrt(3 * 255 * 255);
        const tolerancePercent = bgRemovalTolerance / 100;
        const threshold = tolerancePercent * maxDist;

        for (let i = 0; i < data.length; i += 4) {
          const dr = data[i] - r;
          const dg = data[i + 1] - g;
          const db = data[i + 2] - b;
          const dist = Math.sqrt(dr * dr + dg * dg + db * db);

          if (dist <= threshold) {
            data[i + 3] = 0;
          }
        }

        ctx.putImageData(imageData, 0, 0);

        const preview = el('modal-stamp-preview');
        if (preview) {
          preview.src = canvas.toDataURL('image/png');
        }
        resolve();
      };
      img.onerror = reject;
      img.src = URL.createObjectURL(blob);
    });
  }

  // Reset to original stamp
  function resetToOriginalStamp() {
    if (!originalStampSrc) return;
    stampSrc = originalStampSrc;
    if (originalStampBytes) {
      stampImageBytes = new Uint8Array(originalStampBytes);
    }
    if (originalStampType) {
      stampType = originalStampType;
    }
    const preview = el('modal-stamp-preview');
    if (preview) preview.src = originalStampSrc;
    // Hide reset button
    el('modal-reset-bg-btn')?.classList.add('hidden');
  }

  el('start-stamping-btn')?.addEventListener('click', () => {
    if ((pdfBytes || imageDoc) && stampImageBytes) {
      el('landing-page')?.classList.add('hidden');
      el('setup-section')?.classList.add('hidden');
      el('workspace-section')?.classList.remove('hidden');
      el('reset-btn')?.classList.remove('hidden');
      el('app')?.classList.add('workspace-active');

      const downBtn = el('download-btn');
      if (downBtn) {
        downBtn.classList.remove('disabled');
        downBtn.disabled = false;
      }

      renderWorkspaceStampList();

      if (docType === 'image') {
        loadImagePage(currentNum);
      } else {
        loadPDF();
      }
    }
  });

  el('prev-page-btn')?.addEventListener('click', () => {
    if (currentNum <= 1) return;
    currentNum--;
    if (docType === 'image') {
      loadImagePage(currentNum);
    } else {
      renderPage(currentNum);
    }
  });

  el('next-page-btn')?.addEventListener('click', () => {
    if (currentNum >= totalNum) return;
    currentNum++;
    if (docType === 'image') {
      loadImagePage(currentNum);
    } else {
      renderPage(currentNum);
    }
  });

  el('zoom-in-btn')?.addEventListener('click', () => {
    zoom += 0.2;
    const zl = el('zoom-level');
    if (zl) zl.textContent = `${Math.round(zoom * 100)}%`;
    if (docType === 'image') {
      loadImagePage(currentNum);
    } else {
      renderPage(currentNum);
    }
  });

  el('zoom-out-btn')?.addEventListener('click', () => {
    if (zoom <= 0.4) return;
    zoom -= 0.2;
    const zl = el('zoom-level');
    if (zl) zl.textContent = `${Math.round(zoom * 100)}%`;
    if (docType === 'image') {
      loadImagePage(currentNum);
    } else {
      renderPage(currentNum);
    }
  });

  // Workspace stamp upload
  el('workspace-add-stamp-btn')?.addEventListener('click', () => {
    el('workspace-stamp-upload')?.click();
  });

  el('workspace-stamp-upload')?.addEventListener('change', async (e) => {
    try {
      const file = e.target.files[0];
      if (!file) return;
      await handleSelectedStampFile(file, { openModal: true });
      el('stamp-selector-dropdown')?.classList.add('hidden');
      drawVirtualStamps();
    } finally {
      if (e.target) e.target.value = '';
    }
  });

  // Stamp selector dropdown
  el('stamp-selector-btn')?.addEventListener('click', (e) => {
    e.stopPropagation();
    const dropdown = el('stamp-selector-dropdown');
    if (dropdown) dropdown.classList.toggle('hidden');
    renderWorkspaceStampList();
  });

  document.addEventListener('click', (e) => {
    if (!e.target.closest('#stamp-selector')) {
      el('stamp-selector-dropdown')?.classList.add('hidden');
    }
  });

  el('canvas-container')?.addEventListener('click', (e) => {
    if (e.target.closest('.stamp-overlay')) return; // Ignore clicks on existing stamps
    
    // Check if click was inside bounding box but just bubbling, but usually it hits stamp-overlay
    const canvas = el('pdf-render');
    const container = el('canvas-container');
    if (!canvas || !container) return;

    const rect = container.getBoundingClientRect();
    const x = (e.clientX - rect.left) / zoom;
    const y = (e.clientY - rect.top) / zoom;

    if (x < 0 || x > canvas.width / zoom || y < 0 || y > canvas.height / zoom) return;

    const width = STAMP_BASE_WIDTH;
    const height = STAMP_BASE_WIDTH * stampAspectRatio;

    stamps.push({
      pageNum: currentNum,
      x: x,
      y: y,
      width: width,
      height: height,
      rotation: 0,
      id: Date.now()
    });

    drawVirtualStamps();
    showToast(t('toast_stamp_added'));
  });

  // Swipe to change pages
  let touchStartX = 0;
  let touchEndX = 0;
  let touchStartY = 0;
  let touchEndY = 0;
  
  el('canvas-wrapper')?.addEventListener('touchstart', e => {
    touchStartX = e.changedTouches[0].screenX;
    touchStartY = e.changedTouches[0].screenY;
  }, { passive: true });

  el('canvas-wrapper')?.addEventListener('touchend', e => {
    touchEndX = e.changedTouches[0].screenX;
    touchEndY = e.changedTouches[0].screenY;
    handleSwipe();
  }, { passive: true });

  function handleSwipe() {
    const wrapper = el('canvas-wrapper');
    if (!wrapper) return;
    
    // Avoid swipe if the user zoomed in and can scroll horizontally
    if (wrapper.scrollWidth > wrapper.clientWidth + 10) return;

    const swipeThreshold = 50;
    const verticalThreshold = 50;
    
    // Ensure the swipe is mostly horizontal
    if (Math.abs(touchEndY - touchStartY) > verticalThreshold) return;

    if (touchEndX < touchStartX - swipeThreshold) {
      // Swipe Left => Next Page
      if (currentNum < totalNum) {
        currentNum++;
        if (docType === 'image') loadImagePage(currentNum);
        else renderPage(currentNum);
      }
    }
    if (touchEndX > touchStartX + swipeThreshold) {
      // Swipe Right => Prev Page
      if (currentNum > 1) {
        currentNum--;
        if (docType === 'image') loadImagePage(currentNum);
        else renderPage(currentNum);
      }
    }
  }

  el('download-btn')?.addEventListener('click', () => {
    if (docType === 'image') {
      processFinalImage();
    } else {
      processFinalPDF();
    }
  });
}

async function loadImageDocument(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const dataUrl = e.target.result;
      const img = new Image();
      img.onload = () => {
        // Create offscreen canvas at full resolution
        const offscreen = document.createElement('canvas');
        offscreen.width = img.naturalWidth;
        offscreen.height = img.naturalHeight;
        const ctx = offscreen.getContext('2d');
        ctx.drawImage(img, 0, 0);

        imageDoc = {
          img: img,
          width: img.naturalWidth,
          height: img.naturalHeight,
          canvas: offscreen,
          dataUrl: dataUrl
        };

        // Single "page" for images
        totalNum = 1;
        currentNum = 1;
        showToast(t('toast_image_loaded'));
        resolve();
      };
      img.onerror = () => {
        showToast(t('error_loading_image'));
        reject(new Error('Failed to load image'));
      };
      img.src = dataUrl;
    };
    reader.onerror = () => {
      showToast(t('error_loading_image'));
      reject(new Error('Failed to read image file'));
    };
    reader.readAsDataURL(file);
  });
}

function loadImagePage(num) {
  if (!imageDoc) return;

  const canvas = el('pdf-render');
  const container = el('canvas-container');
  if (!canvas || !container) return;

  // For image docs, totalNum is always 1
  // Use num as zoom level index (but actual zoom comes from zoom variable)
  const displayWidth = imageDoc.width * zoom;
  const displayHeight = imageDoc.height * zoom;

  canvas.width = displayWidth;
  canvas.height = displayHeight;
  container.style.width = `${displayWidth}px`;
  container.style.height = `${displayHeight}px`;

  const ctx = canvas.getContext('2d');
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.drawImage(imageDoc.canvas, 0, 0, displayWidth, displayHeight);

  // Update page info
  const prevBtn = el('prev-page-btn');
  const nextBtn = el('next-page-btn');
  if (prevBtn) prevBtn.disabled = true;
  if (nextBtn) nextBtn.disabled = true;
  updatePageInfo();

  drawVirtualStamps();
}

function checkReady() {
  const hasDoc = (pdfBytes && docType === 'pdf') || (imageDoc && docType === 'image');
  if (hasDoc && stampImageBytes) {
    const stBtn = el('start-stamping-btn');
    if (stBtn) {
      stBtn.classList.remove('disabled');
      stBtn.disabled = false;
    }
  }
}

async function loadPDF() {
  showToast(t('toast_loading_doc'));
  if (!pdfBytes) return;
  const loadingTask = pdfjsLib.getDocument({ data: pdfBytes.slice(0) });
  try {
    pdfDoc = await loadingTask.promise;
    totalNum = pdfDoc.numPages;
    const pc = el('page-count');
    if (pc) pc.textContent = totalNum;
    renderPage(currentNum);
  } catch (err) {
    console.error(err);
    alert(t('error_loading_pdf'));
  }
}

async function renderPage(num) {
  if (!pdfDoc) return;
  const prevBtn = el('prev-page-btn');
  const nextBtn = el('next-page-btn');
  if (prevBtn) prevBtn.disabled = (num <= 1);
  if (nextBtn) nextBtn.disabled = (num >= totalNum);

  const page = await pdfDoc.getPage(num);
  const viewport = page.getViewport({ scale: zoom });

  const canvas = el('pdf-render');
  const container = el('canvas-container');
  if (!canvas || !container) return;

  canvas.width = viewport.width;
  canvas.height = viewport.height;

  container.style.width = `${viewport.width}px`;
  container.style.height = `${viewport.height}px`;

  const ctx = canvas.getContext('2d');
  const renderContext = { canvasContext: ctx, viewport: viewport };

  if (renderTask) await renderTask.cancel();

  renderTask = page.render(renderContext);
  try {
    await renderTask.promise;
    updatePageInfo();
    drawVirtualStamps();
  } catch (err) {
    if (err.name !== 'RenderingCancelledException') {
      console.error(err);
    }
  }
}

function drawVirtualStamps() {
  document.querySelectorAll('.stamp-overlay').forEach(el => el.remove());
  const container = el('canvas-container');
  if (!container) return;

  stamps.filter(s => s.pageNum === currentNum).forEach(s => {
    const wrapper = document.createElement('div');
    wrapper.className = 'stamp-overlay';
    wrapper.style.width = `${s.width * zoom}px`;
    wrapper.style.height = `${s.height * zoom}px`;
    wrapper.style.left = `${(s.x - s.width / 2) * zoom}px`;
    wrapper.style.top = `${(s.y - s.height / 2) * zoom}px`;
    wrapper.style.transform = `rotate(${s.rotation}deg)`;

    const img = document.createElement('img');
    img.src = stampSrc;
    wrapper.appendChild(img);

    const delBtn = document.createElement('button');
    delBtn.className = 'stamp-delete-btn';
    delBtn.innerHTML = '×';
    delBtn.title = t('remove_stamp');
    delBtn.onclick = (e) => {
      e.stopPropagation();
      stamps = stamps.filter(st => st.id !== s.id);
      drawVirtualStamps();
      showToast(t('toast_stamp_removed'));
    };
    wrapper.appendChild(delBtn);

    const resizeHandle = document.createElement('div');
    resizeHandle.className = 'stamp-handle handle-br';
    wrapper.appendChild(resizeHandle);

    const rotateHandle = document.createElement('div');
    rotateHandle.className = 'stamp-handle handle-rot';
    wrapper.appendChild(rotateHandle);

    let currentAction = null;
    let sx, sy, sw, sh, sr, scx, scy;

    const startAction = (e, action) => {
      e.stopPropagation();

      document.querySelectorAll('.stamp-overlay').forEach(el => el.classList.remove('active'));
      wrapper.classList.add('active');

      const touch = e.touches ? e.touches[0] : e;
      currentAction = action;
      sx = touch.clientX;
      sy = touch.clientY;
      sw = s.width;
      sh = s.height;
      sr = s.rotation;

      const rect = wrapper.getBoundingClientRect();
      scx = rect.left + rect.width / 2;
      scy = rect.top + rect.height / 2;

      const onMove = (em) => {
        if (!currentAction) return;
        const t = em.touches ? em.touches[0] : em;

        if (currentAction === 'drag') {
          const dx = (t.clientX - sx) / zoom;
          const dy = (t.clientY - sy) / zoom;
          s.x += dx;
          s.y += dy;
          sx = t.clientX;
          sy = t.clientY;
          wrapper.style.left = `${(s.x - s.width / 2) * zoom}px`;
          wrapper.style.top = `${(s.y - s.height / 2) * zoom}px`;
        } else if (currentAction === 'resize') {
          const dx = (t.clientX - sx) / zoom;
          const dy = (t.clientY - sy) / zoom;
          const scaleDelta = Math.max(dx, dy / stampAspectRatio);

          const newWidth = Math.max(20, sw + scaleDelta * 2);
          const newHeight = newWidth * stampAspectRatio;

          s.width = newWidth;
          s.height = newHeight;

          wrapper.style.width = `${s.width * zoom}px`;
          wrapper.style.height = `${s.height * zoom}px`;
          wrapper.style.left = `${(s.x - s.width / 2) * zoom}px`;
          wrapper.style.top = `${(s.y - s.height / 2) * zoom}px`;
        } else if (currentAction === 'rotate') {
          const angle = Math.atan2(t.clientY - scy, t.clientX - scx);
          const startAngle = Math.atan2(sy - scy, sx - scx);
          s.rotation = sr + (angle - startAngle) * (180 / Math.PI);
          wrapper.style.transform = `rotate(${s.rotation}deg)`;
        }
      };

      const onEnd = () => {
        currentAction = null;
        window.removeEventListener('mousemove', onMove);
        window.removeEventListener('mouseup', onEnd);
        window.removeEventListener('touchmove', onMove);
        window.removeEventListener('touchend', onEnd);
      };

      window.addEventListener('mousemove', onMove);
      window.addEventListener('mouseup', onEnd);
      window.addEventListener('touchmove', onMove, { passive: false });
      window.addEventListener('touchend', onEnd);
    };

    wrapper.addEventListener('mousedown', (e) => startAction(e, 'drag'));
    wrapper.addEventListener('touchstart', (e) => startAction(e, 'drag'), { passive: false });

    wrapper.addEventListener('click', (e) => {
      e.stopPropagation();
      document.querySelectorAll('.stamp-overlay').forEach(el => el.classList.remove('active'));
      wrapper.classList.add('active');
    });

    resizeHandle.addEventListener('mousedown', (e) => startAction(e, 'resize'));
    resizeHandle.addEventListener('touchstart', (e) => startAction(e, 'resize'), { passive: false });
    rotateHandle.addEventListener('mousedown', (e) => startAction(e, 'rotate'));
    rotateHandle.addEventListener('touchstart', (e) => startAction(e, 'rotate'), { passive: false });

    container.appendChild(wrapper);
  });
}

async function processFinalPDF() {
  if (!pdfBytes || !stampImageBytes || stamps.length === 0) {
    showToast(t('toast_no_stamp'));
    return;
  }
  showToast(t('toast_exporting'));
  const btn = el('download-btn');
  if (btn) {
    btn.disabled = true;
    btn.classList.add('disabled');
  }

  try {
    const pdfDocExport = await PDFDocument.load(pdfBytes);
    let stampImage;
    if (stampType === 'image/jpeg' || stampType === 'image/jpg') {
      stampImage = await pdfDocExport.embedJpg(stampImageBytes);
    } else {
      stampImage = await pdfDocExport.embedPng(stampImageBytes);
    }

    const stampsByPage = {};
    for (const s of stamps) {
      if (!stampsByPage[s.pageNum]) stampsByPage[s.pageNum] = [];
      stampsByPage[s.pageNum].push(s);
    }

    for (const [pageNumStr, pageStamps] of Object.entries(stampsByPage)) {
      const pageNum = parseInt(pageNumStr);
      if (pageNum > pdfDocExport.getPageCount()) continue;

      const pjsPage = await pdfDoc.getPage(pageNum);
      const viewport = pjsPage.getViewport({ scale: 1 });

      const page = pdfDocExport.getPages()[pageNum - 1];
      const pageRotation = page.getRotation().angle || 0;

      for (const s of pageStamps) {
        const stampW = s.width;
        const stampH = s.height;
        const screenCX = s.x;
        const screenCY = s.y;

        const [pdfCX, pdfCY] = viewport.convertToPdfPoint(screenCX, screenCY);
        const totalRotDegrees = -s.rotation - pageRotation;
        const theta = totalRotDegrees * (Math.PI / 180);

        const dx = (stampW / 2) * Math.cos(theta) - (stampH / 2) * Math.sin(theta);
        const dy = (stampW / 2) * Math.sin(theta) + (stampH / 2) * Math.cos(theta);

        const bottomLeftX = pdfCX - dx;
        const bottomLeftY = pdfCY - dy;

        page.drawImage(stampImage, {
          x: bottomLeftX,
          y: bottomLeftY,
          width: stampW,
          height: stampH,
          rotate: degrees(totalRotDegrees)
        });
      }
    }

    const finalPdfBytes = await pdfDocExport.save();
    const blob = new Blob([finalPdfBytes], { type: 'application/pdf' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Signed_${pdfFileNameStr || t('default_doc_name')}.pdf`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    showToast(t('toast_saved'));
  } catch (e) {
    console.error(e);
    alert(t('error_exporting'));
  } finally {
    const b = el('download-btn');
    if (b) {
      b.disabled = false;
      b.classList.remove('disabled');
    }
  }
}

function processFinalImage() {
  if (!imageDoc || !stampImageBytes || stamps.length === 0) {
    showToast(t('toast_no_stamp'));
    return;
  }
  showToast(t('toast_exporting'));

  const btn = el('download-btn');
  if (btn) {
    btn.disabled = true;
    btn.classList.add('disabled');
  }

  try {
    // Create a working canvas at full resolution
    const workCanvas = document.createElement('canvas');
    workCanvas.width = imageDoc.width;
    workCanvas.height = imageDoc.height;
    const ctx = workCanvas.getContext('2d');

    // Draw the original image at full resolution
    ctx.drawImage(imageDoc.canvas, 0, 0);

    // Load stamp image
    const stampImg = new Image();
    stampImg.src = stampSrc;

    // Wait for stamp image to load
    if (!stampImg.complete) {
      stampImg.onload = () => drawStampsOnImageCanvas(ctx, workCanvas, stampImg);
    } else {
      drawStampsOnImageCanvas(ctx, workCanvas, stampImg);
    }
  } catch (e) {
    console.error(e);
    alert(t('error_exporting'));
    const b = el('download-btn');
    if (b) {
      b.disabled = false;
      b.classList.remove('disabled');
    }
  }
}

function drawStampsOnImageCanvas(ctx, workCanvas, stampImg) {
  const imgWidth = imageDoc.width;
  const imgHeight = imageDoc.height;

  for (const s of stamps) {
    // Scale from display coordinates to full image coordinates
    const displayWidth = imgWidth;
    const displayHeight = imgHeight;

    // The canvas was rendered at imgWidth * zoom x imgHeight * zoom
    // So the stamp positions stored are already at zoom scale
    // We need to convert back to original image coordinates
    const scaleX = displayWidth / (imgWidth * zoom);
    const scaleY = displayHeight / (imgHeight * zoom);

    const sx = s.x * scaleX;
    const sy = s.y * scaleY;
    const sw = s.width * scaleX;
    const sh = s.height * scaleY;

    ctx.save();

    // Translate to center of stamp, rotate, translate back
    ctx.translate(sx, sy);
    ctx.rotate(s.rotation * Math.PI / 180);
    ctx.drawImage(stampImg, -sw / 2, -sh / 2, sw, sh);

    ctx.restore();
  }

  // Export as PNG
  workCanvas.toBlob((blob) => {
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    const baseName = pdfFileNameStr ? pdfFileNameStr.replace(/\.[^.]+$/, '') : t('default_image_doc_name');
    a.download = `Signed_${baseName}.png`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    showToast(t('toast_saved'));

    const b = el('download-btn');
    if (b) {
      b.disabled = false;
      b.classList.remove('disabled');
    }
  }, 'image/png');
}

init();
