# Henna by Fida — Website Handover Guide

## 📁 Files Included

```
mehndi-website/
├── index.html       → Home page
├── gallery.html     → Gallery page
├── booking.html     → Appointment booking page
├── shop.html        → Henna shop page
├── style.css        → All styles
├── main.js          → All JavaScript
└── README.md        → This guide
```

---

## ⚡ Before Going Live — Required Changes

### 1. Update WhatsApp Number
Open **main.js** and find this line (around line 85):
```
const waNumber = '919999999999';
```
Change `919999999999` to your actual WhatsApp number with country code (no +, no spaces).
Example: `919876543210` for +91 98765 43210.

Also update in all 4 HTML files — search for `wa.me/919999999999` and replace with your number.

### 2. Update Business Name
Replace `Henna by Fida` with your actual business name in all 4 HTML files.

### 3. Update Instagram Handle
Search for `@mehndi_by_noor` and `instagram.com` and replace with your actual Instagram URL.

### 4. Update Location
Search for `Kerala, India` and update with your specific location.

---

## 📸 Adding Your Photos

### Hero Section (index.html)
Find the `hero-img-placeholder` div and replace it with:
```html
<img src="images/hero-photo.jpg" alt="Henna artist" style="width:100%;height:100%;object-fit:cover;" />
```

### Gallery (gallery.html)
Each gallery item has a `.img-placeholder` div. Replace with:
```html
<img src="images/gallery/your-photo.jpg" alt="Bridal henna design" style="width:100%;height:100%;object-fit:cover;" />
```
Create a folder called `images/gallery/` and put all your gallery photos there.

### Products (shop.html)
Each `.product-ph` div can be replaced the same way:
```html
<img src="images/products/cone-black.jpg" alt="Black henna cone" style="width:100%;height:100%;object-fit:cover;" />
```

### Why Us section (index.html)
Find the 3 `.why-img-box` divs and replace the `.img-placeholder` divs with `<img>` tags.

---

## 💰 Updating Product Prices

Open **shop.html** and find each product card. Update:
- `₹ 80` → your actual price
- Product names and descriptions as needed

---

## 📱 How the Booking System Works

1. Customer fills the form on `booking.html`
2. Clicks "Send Booking via WhatsApp"
3. WhatsApp opens on their phone/browser with a pre-filled message like:

```
🌿 APPOINTMENT REQUEST — Henna by Fida

👤 Name: Priya Sharma
📱 Phone: 9876543210
📍 Location: Thrissur, Kerala
📅 Date: Friday, 15 August 2025
🕐 Time: Morning (9am – 12pm)
💅 Service: Bridal Henna (Full Package)
👥 Number of People: 1 person

Notes: For my wedding on 16th August
```

4. Customer presses **Send** → you receive it on WhatsApp immediately
5. You confirm or ask follow-up questions

---

## 🛒 How the Shop Order System Works

1. Customer clicks "Order Now" on any product
2. A popup form appears asking for name, phone, address, quantity, payment method
3. They click "Confirm Order via WhatsApp"
4. WhatsApp opens with pre-filled order details
5. You confirm and arrange delivery/payment

---

## 🌐 How to Host the Website (Free Options)

### Option A: GitHub Pages (Recommended — Free)
1. Create a free account at github.com
2. Create a new repository named `your-business-name`
3. Upload all 6 files
4. Go to Settings → Pages → Deploy from main branch
5. Your site will be live at `https://yourusername.github.io/your-business-name`

### Option B: Netlify (Easiest — Free)
1. Go to netlify.com, sign up free
2. Drag and drop your entire website folder onto the dashboard
3. Done! You get a link like `https://amazing-site-123.netlify.app`
4. You can also connect a custom domain like `www.mehndinoor.com`

### Option C: Custom Domain
- Buy a domain at GoDaddy or Namecheap (~₹800-1200/year)
- Connect it to Netlify or GitHub Pages

---

## 🔧 Customization Tips

### Change Colors
Open `style.css`. At the top, find `:root { ... }` and update:
- `--green-dark`: Main dark green
- `--gold`: Gold accent color
- `--beige`: Background color

### Add/Remove Products
Copy-paste a product card block in `shop.html` and update the name, price, and description.

### Add More Gallery Photos
Copy-paste a gallery item div in `gallery.html`. Set `data-category` to `bridal`, `function`, or `closeup`.

---

## ✅ Pre-Launch Checklist

- [ ] WhatsApp number updated in all files
- [ ] Business name updated everywhere
- [ ] Instagram link updated
- [ ] Real photos added (hero, gallery, products)
- [ ] Product prices updated
- [ ] Tested booking form on mobile → WhatsApp opens correctly
- [ ] Tested order form on mobile → WhatsApp opens correctly
- [ ] Website uploaded to hosting
- [ ] Link shared on Instagram bio

---

## 📞 Need Help?

If you get stuck on any of the above steps, just reach out. The website is built with plain HTML/CSS/JavaScript — no complicated frameworks or databases. Anyone comfortable with basic web editing can maintain it.

---

*Built with care for a beautiful henna business. 🌿*
