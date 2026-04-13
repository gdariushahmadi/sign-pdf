# Doc Signer — Sign & Stamp PDFs Online

**sign-pdf** is a free, browser-based tool for signing and stamping PDF documents and images. No account required, no uploads to any server — everything happens locally in your browser.

---

## Features

- **Sign & Stamp** — Upload any PDF or image (PNG, JPG) and place your signature/stamp with a click
- **Multi-page Support** — Navigate through all pages of a multi-page PDF
- **Background Removal** — Automatically remove the background from your stamp image
- **Transform Tools** — Drag, resize, and rotate stamps before placing
- **Save Stamp Library** — Reuse your stamps across sessions (up to 20 stored locally)
- **Works Offline** — PWA support means it works without an internet connection
- **Bilingual** — Full English and Persian (Farsi) interface
- **Dark & Light Mode** — Choose your preferred theme

---

## Tech Stack

| Layer | Technology |
|------|-------------|
| PDF Rendering | [pdfjs-dist](https://github.com/mozilla/pdf.js) |
| PDF Manipulation | [pdf-lib](https://github.com/Hickory-Signatures/pdf-lib) |
| Build Tool | [Vite](https://vitejs.dev/) |
| Hosting | [Cloudflare Pages](https://pages.cloudflare.com/) |
| PWA | Service Worker + Web App Manifest |

---

## Getting Started

### Prerequisites

- Node.js 18+
- npm

### Install Dependencies

```bash
npm install
```

### Development Server

```bash
npm run dev
```

Then open `http://localhost:8001` in your browser.

### Build for Production

```bash
npm run build
```

The output will be in the `dist/` folder.

### Deploy to Cloudflare Pages

```bash
npm run build && npx env-cmd -f .env wrangler pages deploy dist
```

Make sure you have a `.env` file with your Cloudflare credentials configured.

---

## Project Structure

```
sign-pdf/
├── main.js              # Main application logic
├── index.html           # HTML with landing page and app UI
├── style.css            # Base styles
├── vite.config.js       # Vite configuration
├── wrangler.toml       # Cloudflare Pages configuration
├── package.json         # Dependencies and scripts
├── public/              # Static assets
│   ├── sw.js            # Service worker
│   ├── manifest.json    # PWA manifest
│   ├── icon.svg         # App icon
│   └── pages/           # SEO landing pages
└── dist/                # Production build output
```

---

## How It Works

1. **Upload** a PDF file or image (PNG/JPG)
2. **Upload** your stamp/signature image
3. **Click** on the document to place the stamp
4. **Adjust** position, size, and rotation as needed
5. **Download** the signed document

All processing is done client-side — your documents never leave your browser.

---

## License

This project is private and proprietary.
