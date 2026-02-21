import './style.css';
import * as pdfjsLib from 'pdfjs-dist';
import pdfWorkerUrl from 'pdfjs-dist/build/pdf.worker.mjs?url';
import { PDFDocument, degrees } from 'pdf-lib';

// i18n Dictionary
const i18n = {
  en: {
    app_title: "Sign/Stamp PDF",
    app_name: "Doc Signer",
    download_btn: "Download File",
    new_document: "New Document",
    step_1: "1. Choose Files",
    select_pdf: "Select your PDF file",
    select_stamp: "Stamp/Signature Image (PNG or JPG)",
    stamp_preview_alt: "Stamp preview",
    start_stamping: "Start Stamping",
    instruction_add: "Click on pages to add stamps.",
    page: "Page",
    of: "of",
    zoom_out: "Zoom Out",
    zoom_in: "Zoom In",
    success_toast: "Operation Successful",
    toast_stamp_added: "Stamp Added - Drag to move, use handles to resize/rotate",
    toast_stamp_removed: "Stamp Removed",
    toast_loading_doc: "Loading Document...",
    error_loading_pdf: "Error loading PDF",
    toast_no_stamp: "Please add a stamp to a page first",
    toast_exporting: "Generating final document...",
    toast_saved: "Document saved successfully",
    error_exporting: "Error generating file",
    default_doc_name: "Document"
  },
  fa: {
    app_title: "افزودن مُهر به فایل PDF",
    app_name: "سند یار",
    download_btn: "دانلود فایل نهایی",
    new_document: "سند جدید",
    step_1: "۱. انتخاب فایل‌ها",
    select_pdf: "فایل PDF خود را انتخاب کنید",
    select_stamp: "فایل تصویر مُهر (PNG یا JPG)",
    stamp_preview_alt: "پیش‌نمایش مُهر",
    start_stamping: "شروع افزودن مُهر",
    instruction_add: "روی صفحات کلیک کنید تا مهر اضافه شود.",
    page: "صفحه",
    of: "از",
    zoom_out: "کوچک نمایی",
    zoom_in: "بزرگ نمایی",
    success_toast: "عملیات با موفقیت انجام شد",
    toast_stamp_added: "مُهر اضافه شد - جابجا کنید یا زاویه و سایز را تغییر دهید",
    toast_stamp_removed: "مُهر حذف شد",
    toast_loading_doc: "در حال بارگذاری سند...",
    error_loading_pdf: "خطا در بارگذاری PDF",
    toast_no_stamp: "ابتدا مُهری روی صفحات قرار دهید",
    toast_exporting: "در حال صدور سند نهایی...",
    toast_saved: "سند با موفقیت ذخیره شد",
    error_exporting: "خطا در صدور فایل",
    default_doc_name: "سند"
  }
};

let currentLang = localStorage.getItem('app_lang') || 'en';

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

let stampType = null;
let stampImageBytes = null;
let stampSrc = null;
let stampFileNameStr = null;
let stampAspectRatio = 1;

// Array of { pageNum, x, y, width, height, rotation, id }
let stamps = [];

// DOM Reference Function
const el = (id) => document.getElementById(id);

function init() {
  setLanguage(currentLang);
  loadStampFromMemory();
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

function loadStampFromMemory() {
  const dataUrl = localStorage.getItem('saved_stamp_data');
  const name = localStorage.getItem('saved_stamp_name');
  if (dataUrl) {
    stampSrc = dataUrl;
    stampFileNameStr = name || 'Saved Stamp [Memory]';

    const fn = el('stamp-filename');
    if (fn) fn.textContent = stampFileNameStr;

    const preview = el('stamp-preview');
    if (preview) {
      preview.src = stampSrc;
      preview.classList.remove('hidden');
    }

    // Extract mime
    const mimeMatch = dataUrl.split(',')[0].match(/:(.*?);/);
    if (!mimeMatch) return;
    stampType = mimeMatch[1];

    // Convert base64 to Uint8Array safely
    try {
      const base64str = dataUrl.split(',')[1];
      const binary = atob(base64str);
      const len = binary.length;
      let bytes = new Uint8Array(len);
      for (let i = 0; i < len; i++) {
        bytes[i] = binary.charCodeAt(i);
      }
      stampImageBytes = bytes;
      updateStampAspect(stampSrc);
      checkReady();
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

function resetWorkspace() {
  pdfBytes = null;
  pdfFileNameStr = null;

  const upload = el('pdf-upload');
  if (upload) upload.value = '';

  const fn = el('pdf-filename');
  if (fn) fn.textContent = t('select_pdf');

  stamps = [];
  currentNum = 1;
  totalNum = 0;

  el('workspace-section')?.classList.add('hidden');
  el('setup-section')?.classList.remove('hidden');
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

function attachEventListeners() {
  el('lang-btn')?.addEventListener('click', () => {
    const newLang = currentLang === 'en' ? 'fa' : 'en';
    setLanguage(newLang);
  });

  el('reset-btn')?.addEventListener('click', resetWorkspace);

  el('pdf-upload')?.addEventListener('change', async (e) => {
    const file = e.target.files[0];
    if (file) {
      pdfFileNameStr = file.name;
      const fn = el('pdf-filename');
      if (fn) fn.textContent = file.name;
      pdfBytes = await file.arrayBuffer();
      checkReady();
    }
  });

  el('stamp-upload')?.addEventListener('change', async (e) => {
    const file = e.target.files[0];
    if (file) {
      stampType = file.type;
      stampFileNameStr = file.name;
      const fn = el('stamp-filename');
      if (fn) fn.textContent = file.name;

      const preview = el('stamp-preview');
      if (preview) preview.classList.remove('hidden');

      const buffer = await file.arrayBuffer();
      stampImageBytes = new Uint8Array(buffer);

      const blob = new Blob([stampImageBytes], { type: stampType });
      stampSrc = URL.createObjectURL(blob);
      if (preview) preview.src = stampSrc;

      saveStampToMemory(file);
      updateStampAspect(stampSrc);
      checkReady();
    }
  });

  el('start-stamping-btn')?.addEventListener('click', () => {
    if (pdfBytes && stampImageBytes) {
      el('setup-section')?.classList.add('hidden');
      el('workspace-section')?.classList.remove('hidden');
      el('reset-btn')?.classList.remove('hidden');

      const downBtn = el('download-btn');
      if (downBtn) {
        downBtn.classList.remove('disabled');
        downBtn.disabled = false;
      }

      loadPDF();
    }
  });

  el('prev-page-btn')?.addEventListener('click', () => {
    if (currentNum <= 1) return;
    currentNum--;
    renderPage(currentNum);
  });

  el('next-page-btn')?.addEventListener('click', () => {
    if (currentNum >= totalNum) return;
    currentNum++;
    renderPage(currentNum);
  });

  el('zoom-in-btn')?.addEventListener('click', () => {
    zoom += 0.2;
    const zl = el('zoom-level');
    if (zl) zl.textContent = `${Math.round(zoom * 100)}%`;
    renderPage(currentNum);
  });

  el('zoom-out-btn')?.addEventListener('click', () => {
    if (zoom <= 0.4) return;
    zoom -= 0.2;
    const zl = el('zoom-level');
    if (zl) zl.textContent = `${Math.round(zoom * 100)}%`;
    renderPage(currentNum);
  });

  el('canvas-container')?.addEventListener('click', (e) => {
    if (e.target.closest('.stamp-overlay')) return;
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

  el('download-btn')?.addEventListener('click', processFinalPDF);
}

function checkReady() {
  if (pdfBytes && stampImageBytes) {
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
    const pn = el('page-num');
    if (pn) pn.textContent = num;
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

      // Ensure this stamp becomes active
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

    // Explicit selection on click
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

    // Group stamps by page for efficient processing
    const stampsByPage = {};
    for (const s of stamps) {
      if (!stampsByPage[s.pageNum]) stampsByPage[s.pageNum] = [];
      stampsByPage[s.pageNum].push(s);
    }

    for (const [pageNumStr, pageStamps] of Object.entries(stampsByPage)) {
      const pageNum = parseInt(pageNumStr);
      if (pageNum > pdfDocExport.getPageCount()) continue;

      // Get pdf.js viewport definitions for this page
      const pjsPage = await pdfDoc.getPage(pageNum);
      const viewport = pjsPage.getViewport({ scale: 1 });

      const page = pdfDocExport.getPages()[pageNum - 1];
      const pageRotation = page.getRotation().angle || 0;

      for (const s of pageStamps) {
        // Point distance in PDF.js scale=1 is exactly 1 PDF point
        const stampW = s.width;
        const stampH = s.height;

        // Our screen coordinates for the center
        const screenCX = s.x;
        const screenCY = s.y;

        // Use PDF.js to convert the screen center coordinate EXACTLY to PDF internal coordinate space
        // This handles CropBox, MediaBox offsets, and PDF page rotations automatically.
        const [pdfCX, pdfCY] = viewport.convertToPdfPoint(screenCX, screenCY);

        // Calculate final rotation (what user wants + compensation for internal page rotation)
        const totalRotDegrees = -s.rotation - pageRotation;
        const theta = totalRotDegrees * (Math.PI / 180);

        // pdf-lib draws from the bottom-left corner of the image space.
        // If we rotate the image, pdf-lib rotates it around this bottom-left corner.
        // We need to calculate the bottom-left (x, y) such that after rotation, the center lands on (pdfCX, pdfCY)
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

init();
