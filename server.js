const express = require('express');
const path = require('path');
const { fillGoogleForm } = require('./bot');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;
const MAX_RESPONDENTS = parseInt(process.env.MAX_RESPONDENTS) || 500;

app.use(express.json());
app.use(express.static('public'));

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.post('/api/submit-form', async (req, res) => {
  try {
    const { formLink, respondentCount } = req.body;

    if (!formLink || !respondentCount) {
      return res.status(400).json({ error: 'Form link dan jumlah responden diperlukan' });
    }

    if (respondentCount < 1 || respondentCount > MAX_RESPONDENTS) {
      return res.status(400).json({ error: `Jumlah responden harus antara 1-${MAX_RESPONDENTS}` });
    }

    res.json({ 
      message: 'Proses dimulai',
      formLink,
      respondentCount
    });

    // Jalankan bot di background
    fillGoogleForm(formLink, respondentCount)
      .then(() => console.log('✓ Semua responden berhasil diisi'))
      .catch(err => console.error('✗ Error:', err.message));

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Untuk development lokal
if (process.env.NODE_ENV !== 'production') {
  app.listen(PORT, () => {
    console.log(`Server berjalan di http://localhost:${PORT}`);
  });
}

// Export untuk Vercel
module.exports = app;

