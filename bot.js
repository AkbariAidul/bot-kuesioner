const puppeteer = require('puppeteer');

const sleep = (ms) => new Promise(r => setTimeout(r, ms));

// Daftar nama Indonesia
const namaIndonesia = [
  'Budi Santoso', 'Siti Nurhaliza', 'Ahmad Wijaya', 'Dewi Lestari', 'Rudi Hermawan',
  'Eka Putri', 'Bambang Irawan', 'Sinta Dewi', 'Hendra Kusuma', 'Ratna Sari',
  'Joko Susilo', 'Maya Kusuma', 'Arif Rahman', 'Lina Wijaya', 'Doni Setiawan',
  'Rina Handoko', 'Fajar Nugroho', 'Susi Hartini', 'Yudi Prasetyo', 'Ani Wijaya',
  'Bambang Sutrisno', 'Citra Dewi', 'Dimas Pratama', 'Eka Suryanto', 'Faisal Hidayat',
  'Gita Permata', 'Hadi Wijaya', 'Indah Sari', 'Jaya Kusuma', 'Karina Putri',
  'Laksmi Handoko', 'Mira Santoso', 'Nanda Wijaya', 'Oki Setiawan', 'Putri Handoko',
  'Qori Nugroho', 'Rini Kusuma', 'Sandi Wijaya', 'Tina Sari', 'Udin Hermawan',
  'Vina Dewi', 'Widi Kusuma', 'Xenia Putri', 'Yani Wijaya', 'Zaki Santoso'
];

// Generate NIM dengan hanya strip (-)
const generateNIM = () => {
  return '---';
};

const fillGoogleForm = async (formLink, respondentCount) => {
  let browser;
  try {
    browser = await puppeteer.launch({
      headless: false,
      args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-blink-features=AutomationControlled']
    });

    for (let i = 1; i <= respondentCount; i++) {
      console.log(`\n[${i}/${respondentCount}] Mengisi form...`);
      
      const page = await browser.newPage();
      await page.setDefaultTimeout(60000);
      await page.setViewport({ width: 1280, height: 720 });
      
      await page.evaluateOnNewDocument(() => {
        Object.defineProperty(navigator, 'webdriver', { get: () => false });
      });

      try {
        await page.goto(formLink, { waitUntil: 'networkidle2', timeout: 60000 });
        await sleep(2000);

        // HALAMAN 1: Isi text inputs dan radio
        console.log(`  � Halaman 1:`);
        await page.evaluate(() => window.scrollTo(0, 0));
        await sleep(500);

        // Isi text inputs (Nama Lengkap, NIM)
        const textInputs = await page.$$('input[type="text"]');
        console.log(`    📝 Ditemukan ${textInputs.length} text inputs`);

        const randomNama = namaIndonesia[Math.floor(Math.random() * namaIndonesia.length)];
        const randomNIM = generateNIM();

        for (let j = 0; j < textInputs.length; j++) {
          try {
            const textToFill = j === 0 ? randomNama : randomNIM;
            await textInputs[j].click({ delay: 50 });
            await textInputs[j].type(textToFill, { delay: 30 });
            console.log(`    ✓ Text input ${j + 1}: ${textToFill}`);
          } catch (err) {
            console.log(`    ⚠ Gagal isi text input ${j + 1}`);
          }
        }

        // Isi radio buttons (Jenis Kelamin)
        const radioGroups1 = await page.$$('[role="radiogroup"]');
        console.log(`    🔘 Ditemukan ${radioGroups1.length} radio groups`);

        for (let j = 0; j < radioGroups1.length; j++) {
          try {
            const radios = await radioGroups1[j].$$('[role="radio"]');
            const randomIdx = Math.floor(Math.random() * radios.length);
            
            await radios[randomIdx].click({ delay: 50 });
            await sleep(200);
            console.log(`    ✓ Radio group ${j + 1}: opsi ${randomIdx + 1}`);
          } catch (err) {
            console.log(`    ⚠ Gagal isi radio group ${j + 1}`);
          }
        }

        // Scroll ke bawah dan cari button "Berikutnya"
        await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
        await sleep(1000);

        console.log(`  ➡️ Klik button Berikutnya...`);
        try {
          await page.evaluate(() => {
            const buttons = Array.from(document.querySelectorAll('[role="button"]'));
            const btn = buttons.find(b => b.textContent.trim() === 'Berikutnya');
            if (btn) btn.click();
          });
          await sleep(2500);
          console.log(`    ✓ Berhasil klik Berikutnya`);
        } catch (err) {
          console.log(`  ⚠ Gagal klik Berikutnya: ${err.message}`);
        }

        // HALAMAN 2: Isi 10 radio groups
        console.log(`  📄 Halaman 2:`);
        await page.evaluate(() => window.scrollTo(0, 0));
        await sleep(1000);

        const radioGroups2 = await page.$$('[role="radiogroup"]');
        console.log(`    🔘 Ditemukan ${radioGroups2.length} radio groups`);

        for (let j = 0; j < radioGroups2.length; j++) {
          try {
            // Scroll ke radio group
            await page.evaluate((index) => {
              const radioGroups = document.querySelectorAll('[role="radiogroup"]');
              if (radioGroups[index]) {
                radioGroups[index].scrollIntoView({ behavior: 'smooth', block: 'center' });
              }
            }, j);
            await sleep(500);

            const radios = await radioGroups2[j].$$('[role="radio"]');
            const randomIdx = Math.floor(Math.random() * radios.length);
            
            await radios[randomIdx].click({ delay: 100 });
            await sleep(400);
            console.log(`    ✓ Radio group ${j + 1}: opsi ${randomIdx + 1}`);
          } catch (err) {
            console.log(`    ⚠ Gagal isi radio group ${j + 1}: ${err.message}`);
          }
        }

        // Scroll ke bawah dan cari button "Berikutnya"
        await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
        await sleep(1500);

        // Cek apakah ada button "Berikutnya"
        const hasNextBtn = await page.evaluate(() => {
          const buttons = Array.from(document.querySelectorAll('[role="button"]'));
          return buttons.some(b => b.textContent.trim() === 'Berikutnya');
        });

        if (hasNextBtn) {
          console.log(`  ➡️ Klik button Berikutnya...`);
          try {
            await page.evaluate(() => {
              const buttons = Array.from(document.querySelectorAll('[role="button"]'));
              const btn = buttons.find(b => b.textContent.trim() === 'Berikutnya');
              if (btn) btn.click();
            });
            await sleep(2500);
            console.log(`    ✓ Berhasil klik Berikutnya`);
          } catch (err) {
            console.log(`  ⚠ Gagal klik Berikutnya: ${err.message}`);
          }
        }

        // Scroll ke bawah dan klik button "Kirim"
        await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
        await sleep(1500);

        console.log(`  🚀 Klik button Kirim...`);
        try {
          await page.evaluate(() => {
            const buttons = Array.from(document.querySelectorAll('[role="button"]'));
            const btn = buttons.find(b => b.textContent.trim() === 'Kirim');
            if (btn) btn.click();
          });
          await sleep(3000);
          console.log(`  ✓ Form ${i} berhasil disubmit`);
        } catch (err) {
          console.log(`  ⚠ Gagal klik Kirim: ${err.message}`);
        }

      } catch (pageError) {
        console.log(`  ✗ Error: ${pageError.message}`);
      } finally {
        await page.close();
      }

      // Delay lebih lama antar responden untuk hindari rate limiting
      if (i < respondentCount) {
        const delayMs = 3000 + Math.random() * 2000; // 3-5 detik random
        console.log(`  ⏳ Tunggu ${Math.round(delayMs)}ms sebelum responden berikutnya...`);
        await sleep(delayMs);
      }
    }

    console.log(`\n✓ Selesai! ${respondentCount} responden berhasil diproses`);

  } catch (error) {
    console.error('✗ Error:', error.message);
    throw error;
  } finally {
    if (browser) {
      await browser.close();
    }
  }
};

module.exports = { fillGoogleForm };
