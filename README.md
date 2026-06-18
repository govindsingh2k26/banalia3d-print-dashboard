# BANALIA3D STUDIO — Website

> Premium 3D printing studio landing page built with React, Vite, Tailwind CSS, and Three.js.

A modern, static website for BANALIA3D Studio with a memorable hero section, product showcase, WhatsApp-driven contact flow, and GitHub Pages deployment.

---

## 🚀 Live Demo

https://govindsingh2k26.github.io/banalia3d-print-dashboard/

---

## ✨ What this project includes

- Dark futuristic landing page with neon highlights and clean typography
- Responsive hero section with animated 3D visuals
- Product showcase with WhatsApp CTA buttons
- Contact section with email, WhatsApp, Instagram, and location
- Reusable Tailwind-based UI components
- Static Vite build ready for GitHub Pages
- Custom font support with Google Fonts

---

## 🧰 Tech stack

- React 18
- Vite
- Tailwind CSS
- Framer Motion
- Three.js / React Three Fiber
- GitHub Pages deployment

---

## 🔧 Quick start

```bash
npm install
npm run dev
```

Open the site locally at:

```bash
http://localhost:5174
```

Build for production:

```bash
npm run build
```

Preview the production build:

```bash
npm run preview
```

Deploy to GitHub Pages:

```bash
npm run deploy
```

---

## 📁 Project structure

```
banalia3d-studio/
├── dist/                  # production output
├── public/                # static assets and favicon
├── src/
│   ├── components/        # reusable UI sections
│   ├── data/              # product data used by the site
│   ├── lib/               # app config and helper utilities
│   ├── App.jsx            # main app shell
│   ├── index.css          # global Tailwind + site styling
│   └── main.jsx           # React entrypoint
├── index.html             # Vite app shell
├── package.json           # scripts + dependencies
├── tailwind.config.js     # Tailwind configuration
└── vite.config.js         # Vite build config
```

---

## ⚙️ Update site content

### Contact details

Edit `src/lib/config.js`:

```js
export const SITE = {
  name: 'BANALIA3D STUDIO',
  tagline: 'Turning Ideas Into Reality Through 3D Printing',
  description: 'Premium custom 3D printing studio in India.',
  location: 'Noida, UP, India',
  email: 'govindsingh2k26@gmail.com',
  whatsappNumber: '917408647600',
  instagramUrl: 'https://www.instagram.com/banalia3d/',
}
```

This updates the footer, contact section, and WhatsApp links across the site.

### Products

Edit `src/data/products.js` to add or update product cards.

### Hero font and headline

Update `src/components/Hero.jsx` if you want to change the hero text or font styling.

---

## 🧪 Notes for deployment

- The site is built as a static app with Vite and can be hosted on GitHub Pages.
- The `deploy` script uses `gh-pages` to publish the contents of `dist/`.
- If you want to use a custom domain, configure it in your GitHub Pages repository settings.

---

## 📝 Recommendations

- Keep product images in `public/images/` and reference them from `src/data/products.js`.
- Use consistent product names and short descriptions for clarity.
- Keep the WhatsApp message flow simple so customers can contact you quickly.

---

## 📞 Contact

For content updates, edit the configuration in `src/lib/config.js`.

---

© 2026 BANALIA3D STUDIO. Built for a premium custom printing experience.
