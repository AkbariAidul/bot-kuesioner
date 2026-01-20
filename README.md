# Google Forms Bot

Bot otomatis untuk mengisi Google Forms secara massal menggunakan Puppeteer dan Node.js.

## Fitur

- ✅ Isi text inputs (nama, NIM, dll)
- ✅ Pilih radio buttons (single choice)
- ✅ Support multi-page forms
- ✅ Generate nama Indonesia random
- ✅ Generate NIM dengan format custom
- ✅ Rate limiting untuk hindari blocking
- ✅ Error handling dan logging

## Requirement

- Node.js v14+
- npm atau yarn
- Google Chrome/Chromium (untuk Puppeteer)

## Instalasi

1. Clone atau download project ini
2. Install dependencies:

```bash
npm install
```

## Cara Pakai

### 1. Jalankan Server

```bash
npm start
```

Server akan berjalan di `http://localhost:3000`

### 2. Buka Browser

Buka browser dan akses `http://localhost:3000`

### 3. Isi Form

- **Link Google Form**: Paste link form kamu (format `https://forms.gle/...`)
- **Jumlah Responden**: Masukkan berapa banyak responden yang ingin ditambahkan (1-500)

### 4. Klik "Mulai Proses"

Bot akan otomatis:
1. Buka form di browser (visible)
2. Isi semua field dengan data random
3. Submit form berkali-kali sesuai jumlah yang diminta

## Struktur Project

```
.
├── package.json          # Dependencies
├── server.js             # Express server
├── bot.js                # Logic bot Puppeteer
├── public/
│   └── index.html        # UI frontend
└── README.md             # Dokumentasi ini
```

## Konfigurasi

### Ubah Nama Indonesia

Edit array `namaIndonesia` di `bot.js`:

```javascript
const namaIndonesia = [
  'Nama1', 'Nama2', 'Nama3', ...
];
```

### Ubah Format NIM

Edit function `generateNIM()` di `bot.js`:

```javascript
const generateNIM = () => {
  return '---'; // Atau format lain sesuai kebutuhan
};
```

### Ubah Delay Antar Submit

Edit delay di `bot.js` (baris akhir loop):

```javascript
const delayMs = 3000 + Math.random() * 2000; // 3-5 detik
```

### Ubah Max Responden

Edit di `server.js`:

```javascript
if (respondentCount < 1 || respondentCount > 500) {
  // Ubah 500 ke angka lain
}
```

## Limitasi

- **Hanya support text inputs dan radio buttons** - Checkbox, dropdown, file upload belum support
- **Google Forms punya rate limiting** - Jika submit terlalu cepat, bisa di-block
- **Perlu browser visible** - Bot membuka browser yang terlihat (tidak headless)
- **Perlu internet stabil** - Koneksi putus akan error

## Troubleshooting

### Bot tidak bisa klik button

Kemungkinan struktur form berbeda. Cek di console browser:

```javascript
Array.from(document.querySelectorAll('[role="button"]')).forEach((btn, i) => {
  console.log(`Button ${i}: "${btn.textContent.trim()}"`);
});
```

### Form tidak terkirim

- Pastikan semua field required sudah terisi
- Cek apakah ada validasi khusus di form
- Tunggu lebih lama antar submit (increase delay)

### Puppeteer error

Install ulang:

```bash
npm install puppeteer --force
```

## Catatan Penting

⚠️ **Gunakan bot ini hanya untuk:**
- Testing/development
- Research/academic purposes
- Form yang kamu buat sendiri

❌ **Jangan gunakan untuk:**
- Spam atau abuse
- Form orang lain tanpa izin
- Melanggar Terms of Service Google Forms

## Deployment ke Vercel

### Langkah-langkah:

1. **Install Vercel CLI** (opsional):
```bash
npm install -g vercel
```

2. **Push ke GitHub** (sudah kamu lakukan)

3. **Buka https://vercel.com** dan login dengan GitHub

4. **Import Project**:
   - Klik "New Project"
   - Pilih repository `bot-kuesioner`
   - Klik "Import"

5. **Configure Project**:
   - Framework: Node.js
   - Root Directory: ./
   - Build Command: (kosongkan)
   - Output Directory: (kosongkan)

6. **Environment Variables** (opsional):
   - Klik "Environment Variables"
   - Tambahkan jika perlu:
     - `PORT`: 3000
     - `MAX_RESPONDENTS`: 500

7. **Deploy**:
   - Klik "Deploy"
   - Tunggu proses selesai

### URL Deployment

Setelah deploy, kamu akan dapat URL seperti:
```
https://bot-kuesioner.vercel.app
```

### Catatan Penting

⚠️ **Limitasi Vercel:**
- Serverless functions punya timeout 60 detik (Pro) atau 10 detik (Free)
- Bot yang berjalan lama mungkin timeout
- Puppeteer memerlukan resources besar

**Solusi:**
- Gunakan Vercel Pro untuk timeout lebih lama
- Atau host di platform lain seperti Railway, Render, atau Heroku

---
