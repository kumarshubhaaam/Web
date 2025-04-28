const express = require('express');
const bodyParser = require('body-parser');
const axios = require('axios');
const app = express();
const PORT = 3000;

// Your LinkShortify API Key
const API_KEY = '72a528cbd7a9686e99344385cda651708238c088';

// Your Streamtape video link
const STREAMTAPE_EMBED = 'https://streamtape.com/e/bee6734wjYsDZ2/VID_20250427_153549610.mp4';

app.use(bodyParser.json());
app.use(express.static('public')); // serve frontend from 'public' folder

// API: Generate a fresh shortlink dynamically
app.post('/generate-link', async (req, res) => {
  try {
    const destinationUrl = 'https://yourwebsite.com/thank-you'; // your post-ad page
    const response = await axios.post('https://linkshortify.com/api/link/create', {
      url: destinationUrl
    }, {
      headers: { Authorization: API_KEY }
    });

    if (response.data && response.data.link) {
      res.json({ success: true, link: response.data.link });
    } else {
      res.json({ success: false, message: 'Failed to create shortlink' });
    }
  } catch (error) {
    console.error(error.response ? error.response.data : error.message);
    res.status(500).json({ success: false, message: 'Server Error' });
  }
});

// API: Verify token
app.post('/verify-token', async (req, res) => {
  const { code } = req.body;

  try {
    const response = await axios.post('https://linkshortify.com/api/link/verify', {
      code: code
    }, {
      headers: { Authorization: API_KEY }
    });

    if (response.data && response.data.success) {
      const expirationTime = Date.now() + (24 * 60 * 60 * 1000); // 24 hours
      res.json({
        success: true,
        videoLink: STREAMTAPE_EMBED,
        expirationTime: expirationTime
      });
    } else {
      res.json({ success: false, message: 'Invalid code or verification failed.' });
    }
  } catch (error) {
    console.error(error.response ? error.response.data : error.message);
    res.status(500).json({ success: false, message: 'Server Error during verification.' });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
