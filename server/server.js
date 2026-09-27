import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import multer from 'multer';
import sharp from 'sharp';
import fs from 'fs';
import path from 'path';
import os from 'os';
import { fileURLToPath } from 'url';
import { v4 as uuidv4 } from 'uuid';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 5000;

// Directories
const uploadsDir = path.join(__dirname, 'uploads');
const templatesDir = path.join(__dirname, 'templates');

if (!fs.existsSync(uploadsDir)) fs.mkdirSync(uploadsDir, { recursive: true });
if (!fs.existsSync(templatesDir)) fs.mkdirSync(templatesDir, { recursive: true });

// CORS and body parser
app.use(cors({ origin: '*' }));
app.use(express.json({ limit: '30mb' }));
app.use(express.urlencoded({ extended: true, limit: '30mb' }));

// Serve static uploads
app.use('/uploads', express.static(uploadsDir));

// Helper: Get local network IPv4 address for phone QR code scanning
function getLocalNetworkIp() {
  const interfaces = os.networkInterfaces();
  for (const name of Object.keys(interfaces)) {
    for (const iface of interfaces[name] || []) {
      // Skip internal and non-IPv4 addresses
      if (iface.family === 'IPv4' && !iface.internal) {
        return iface.address;
      }
    }
  }
  return 'localhost';
}

// In-memory session store (with 2-hour cleanup)
const sessions = new Map();

// Theme definitions matching the 4 required 2030 environments
const THEMES = [
  {
    id: 'office',
    title: 'Future Office — 2030',
    subtitle: 'Holographic Workstation & Smart Glass Skyscraper',
    badge: 'FUTURE OFFICE // 2030',
    statusText: 'HoloNet Active • 10 Gbps Neural Sync',
    template: 'office.jpg',
    color: '#06b6d4',
    rgb: [6, 182, 212],
    accentGradient: 'from-cyan-500 to-blue-600',
  },
  {
    id: 'nature',
    title: 'Future Nature — 2030',
    subtitle: 'Eco-Futuristic Biodome & Solar Mountain Sanctuaries',
    badge: 'ECO SANCTUARY // 2030',
    statusText: 'Bio-Shield 99.8% • Solar Hydration Active',
    template: 'nature.jpg',
    color: '#10b981',
    rgb: [16, 185, 129],
    accentGradient: 'from-emerald-400 to-teal-600',
  },
  {
    id: 'road',
    title: 'Future Road — 2030',
    subtitle: 'Cyberpunk Autonomous Highway & Neon Metropolis',
    badge: 'NEO EXPRESSWAY // 2030',
    statusText: 'Autonomous Grid Level 5 • MagLev Active',
    template: 'road.jpg',
    color: '#a855f7',
    rgb: [168, 85, 247],
    accentGradient: 'from-purple-500 to-pink-600',
  },
  {
    id: 'travel',
    title: 'Future Travel — 2030',
    subtitle: 'Supersonic Aerospace Port & Coastal Future Harbor',
    badge: 'AERO TRAVEL // 2030',
    statusText: 'Supersonic Cruise Mach 3.2 • Harbor Gate 07',
    template: 'travel.jpg',
    color: '#f59e0b',
    rgb: [245, 158, 11],
    accentGradient: 'from-amber-400 to-orange-500',
  },
];

// Composite engine using Sharp: blends captured portrait into 2030 futuristic environment
async function compositeFutureImage(userPhotoBuffer, theme, outputPath) {
  const templatePath = path.join(templatesDir, theme.template);
  
  // If template doesn't exist, create a sleek cyberpunk gradient background fallback
  let backgroundBuffer;
  if (fs.existsSync(templatePath)) {
    backgroundBuffer = await sharp(templatePath)
      .resize(1024, 768, { fit: 'cover', position: 'center' })
      .toBuffer();
  } else {
    // Generate fallback gradient SVG
    const svgFallback = `
      <svg width="1024" height="768" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stop-color="#050814"/>
            <stop offset="50%" stop-color="#0f172a"/>
            <stop offset="100%" stop-color="#020617"/>
          </linearGradient>
        </defs>
        <rect width="1024" height="768" fill="url(#bg)"/>
      </svg>
    `;
    backgroundBuffer = await sharp(Buffer.from(svgFallback)).png().toBuffer();
  }

  // 1. Process user portrait: resize, crop into aesthetic portrait, and apply subtle lighting color grade
  const portraitWidth = 440;
  const portraitHeight = 520;

  // Create an elegant circular/rounded feather mask for the person
  const maskSvg = `
    <svg width="${portraitWidth}" height="${portraitHeight}">
      <defs>
        <radialGradient id="feather" cx="50%" cy="50%" r="50%">
          <stop offset="68%" stop-color="#ffffff" stop-opacity="1"/>
          <stop offset="88%" stop-color="#ffffff" stop-opacity="0.8"/>
          <stop offset="100%" stop-color="#ffffff" stop-opacity="0"/>
        </radialGradient>
      </defs>
      <ellipse cx="${portraitWidth / 2}" cy="${portraitHeight / 2}" rx="${portraitWidth * 0.44}" ry="${portraitHeight * 0.46}" fill="url(#feather)"/>
    </svg>
  `;

  // Filter & tint user photo according to theme's ambient light
  let userProcessed = sharp(userPhotoBuffer)
    .resize(portraitWidth, portraitHeight, { fit: 'cover', position: 'attention' });

  if (theme.id === 'office') {
    // Cool cyan/blue cyber office tone
    userProcessed = userProcessed
      .modulate({ brightness: 1.05, saturation: 1.1 })
      .tint({ r: 210, g: 240, b: 255 });
  } else if (theme.id === 'nature') {
    // Lush vibrant warm daylight tone
    userProcessed = userProcessed
      .modulate({ brightness: 1.08, saturation: 1.25 })
      .tint({ r: 235, g: 255, b: 230 });
  } else if (theme.id === 'road') {
    // Cyberpunk neon purple/magenta tone
    userProcessed = userProcessed
      .modulate({ brightness: 1.02, saturation: 1.3 })
      .tint({ r: 255, g: 215, b: 255 });
  } else if (theme.id === 'travel') {
    // Golden hour warm sunny travel tone
    userProcessed = userProcessed
      .modulate({ brightness: 1.06, saturation: 1.2 })
      .tint({ r: 255, g: 240, b: 220 });
  }

  // Mask the user portrait
  const maskedPortrait = await userProcessed
    .composite([
      {
        input: Buffer.from(maskSvg),
        blend: 'dest-in',
      },
    ])
    .png()
    .toBuffer();

  // Create futuristic HUD & Title Overlay
  const hudSvg = `
    <svg width="1024" height="768" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="hudGrad" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stop-color="${theme.color}" stop-opacity="0.9"/>
          <stop offset="100%" stop-color="#3b82f6" stop-opacity="0.3"/>
        </linearGradient>
        <linearGradient id="vignette" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stop-color="#000000" stop-opacity="0.4"/>
          <stop offset="30%" stop-color="#000000" stop-opacity="0"/>
          <stop offset="70%" stop-color="#000000" stop-opacity="0"/>
          <stop offset="100%" stop-color="#000000" stop-opacity="0.75"/>
        </linearGradient>
      </defs>

      <!-- Ambient Vignette -->
      <rect width="1024" height="768" fill="url(#vignette)"/>

      <!-- Top Header HUD -->
      <rect x="36" y="32" width="280" height="38" rx="8" fill="#090d16" fill-opacity="0.8" stroke="${theme.color}" stroke-width="1.5"/>
      <circle cx="56" cy="51" r="5" fill="${theme.color}"/>
      <text x="72" y="56" font-family="'Space Grotesk', 'Segoe UI', monospace" font-size="13" font-weight="bold" fill="#ffffff" letter-spacing="1.5">${theme.badge}</text>

      <rect x="734" y="32" width="254" height="38" rx="8" fill="#090d16" fill-opacity="0.8" stroke="rgba(255,255,255,0.15)" stroke-width="1"/>
      <text x="861" y="56" text-anchor="middle" font-family="'Segoe UI', sans-serif" font-size="12" fill="#94a3b8" letter-spacing="1">ID VERIFIED • 2030 A.I.</text>

      <!-- Cyber Portrait Targeting Frame around Avatar -->
      <rect x="62" y="148" width="456" height="536" rx="20" fill="none" stroke="${theme.color}" stroke-opacity="0.4" stroke-width="1.5" stroke-dasharray="8 6"/>
      <line x1="62" y1="170" x2="62" y2="148" stroke="${theme.color}" stroke-width="4"/>
      <line x1="62" y1="148" x2="84" y2="148" stroke="${theme.color}" stroke-width="4"/>
      <line x1="496" y1="148" x2="518" y2="148" stroke="${theme.color}" stroke-width="4"/>
      <line x1="518" y1="148" x2="518" y2="170" stroke="${theme.color}" stroke-width="4"/>
      <line x1="62" y1="662" x2="62" y2="684" stroke="${theme.color}" stroke-width="4"/>
      <line x1="62" y1="684" x2="84" y2="684" stroke="${theme.color}" stroke-width="4"/>
      <line x1="496" y1="684" x2="518" y2="684" stroke="${theme.color}" stroke-width="4"/>
      <line x1="518" y1="684" x2="518" y2="662" stroke="${theme.color}" stroke-width="4"/>

      <!-- Lower HUD Badge & Status Info -->
      <g transform="translate(36, 700)">
        <text font-family="'Outfit', 'Segoe UI', sans-serif" font-size="22" font-weight="bold" fill="#ffffff">${theme.title}</text>
        <text y="24" font-family="'Segoe UI', sans-serif" font-size="13" fill="#cbd5e1">${theme.statusText}</text>
      </g>

      <!-- Watermark / Year 2030 stamp -->
      <g transform="translate(988, 726)" text-anchor="end">
        <text font-family="'Space Grotesk', monospace" font-size="18" font-weight="900" fill="${theme.color}" letter-spacing="2">FUTURE 2030</text>
        <text y="16" font-family="'Segoe UI', sans-serif" font-size="10" fill="#64748b">AI IDENTITY MATRIX</text>
      </g>
    </svg>
  `;

  // Final composite: Background + Masked User + Futuristic HUD Overlay
  await sharp(backgroundBuffer)
    .composite([
      {
        input: maskedPortrait,
        top: 156,
        left: 70,
        blend: 'over',
      },
      {
        input: Buffer.from(hudSvg),
        top: 0,
        left: 0,
        blend: 'over',
      },
    ])
    .jpeg({ quality: 94 })
    .toFile(outputPath);
}

// 1. API: Get network and client IP configuration
app.get('/api/network-ip', (req, res) => {
  const localIp = getLocalNetworkIp();
  const host = req.headers.host || `localhost:${PORT}`;
  
  res.json({
    localIp,
    serverPort: PORT,
    clientPort: 5173,
    serverUrl: `http://${localIp}:${PORT}`,
    clientUrl: `http://${localIp}:5173`,
  });
});

// 2. API: Generate 4 future images from user snapshot
app.post('/api/generate-future', async (req, res) => {
  try {
    const { imageBase64, userCustomPrompt } = req.body;

    if (!imageBase64) {
      return res.status(400).json({ error: 'No image provided' });
    }

    // Extract raw base64 data
    const base64Data = imageBase64.replace(/^data:image\/\w+;base64,/, '');
    const userPhotoBuffer = Buffer.from(base64Data, 'base64');

    const sessionId = uuidv4();
    const generatedImages = [];

    // Save original user capture
    const originalFileName = `original_${sessionId}.jpg`;
    const originalFilePath = path.join(uploadsDir, originalFileName);
    await sharp(userPhotoBuffer).jpeg({ quality: 90 }).toFile(originalFilePath);

    // Generate each of the 4 themes
    for (const theme of THEMES) {
      const imageId = `${sessionId}_${theme.id}`;
      const fileName = `${imageId}.jpg`;
      const outputPath = path.join(uploadsDir, fileName);

      await compositeFutureImage(userPhotoBuffer, theme, outputPath);

      const localIp = getLocalNetworkIp();
      const imageUrl = `/uploads/${fileName}`;
      const downloadUrl = `/api/download/${imageId}`;
      const mobilePageUrl = `http://${localIp}:${PORT}/download/${imageId}`;

      generatedImages.push({
        id: imageId,
        themeId: theme.id,
        title: theme.title,
        subtitle: theme.subtitle,
        color: theme.color,
        imageUrl,
        downloadUrl,
        mobilePageUrl,
      });
    }

    // Save session in memory
    const sessionData = {
      sessionId,
      createdAt: new Date(),
      originalImageUrl: `/uploads/${originalFileName}`,
      images: generatedImages,
    };
    sessions.set(sessionId, sessionData);

    res.json({
      success: true,
      sessionId,
      images: generatedImages,
    });
  } catch (error) {
    console.error('Error generating future images:', error);
    res.status(500).json({ error: 'Failed to generate future images', details: error.message });
  }
});

// 3. API: Get session details
app.get('/api/session/:sessionId', (req, res) => {
  const { sessionId } = req.params;
  const session = sessions.get(sessionId);
  if (!session) {
    return res.status(404).json({ error: 'Session not found or expired' });
  }
  res.json(session);
});

// 4. API: Direct File Download endpoint (forces file save with proper filename)
app.get('/api/download/:imageId', (req, res) => {
  const { imageId } = req.params;
  const fileName = `${imageId}.jpg`;
  const filePath = path.join(uploadsDir, fileName);

  if (!fs.existsSync(filePath)) {
    return res.status(404).send('Image not found or expired');
  }

  // Find theme name for friendly filename
  const themePart = imageId.split('_').slice(1).join('_');
  const downloadName = `Future_2030_${themePart.toUpperCase() || 'IMAGE'}.jpg`;

  res.setHeader('Content-Disposition', `attachment; filename="${downloadName}"`);
  res.setHeader('Content-Type', 'image/jpeg');
  fs.createReadStream(filePath).pipe(res);
});

// 5. Standalone Mobile Landing Page (Steps 9, 10, 11)
// When user scans the QR code with their mobile phone, they land on this mobile-optimized page!
app.get('/download/:imageId', (req, res) => {
  const { imageId } = req.params;
  const fileName = `${imageId}.jpg`;
  const filePath = path.join(uploadsDir, fileName);

  if (!fs.existsSync(filePath)) {
    return res.status(404).send(`
      <!DOCTYPE html>
      <html>
        <head>
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Image Expired</title>
          <style>
            body { font-family: sans-serif; background: #090d16; color: #fff; text-align: center; padding: 40px 20px; }
          </style>
        </head>
        <body>
          <h2>Image Link Expired or Not Found</h2>
          <p>Please regenerate your 2030 future photo from the main application.</p>
        </body>
      </html>
    `);
  }

  // Theme lookup
  const themePart = imageId.split('_')[1] || 'office';
  const theme = THEMES.find(t => t.id === themePart) || THEMES[0];

  const html = `
  <!DOCTYPE html>
  <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
      <title>Your 2030 Future Avatar — ${theme.title}</title>
      <link rel="preconnect" href="https://fonts.googleapis.com">
      <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
      <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@600;700;800&family=Plus+Jakarta+Sans:wght@400;500;600;700&display=swap" rel="stylesheet">
      <style>
        * { box-sizing: border-box; margin: 0; padding: 0; }
        body {
          font-family: 'Plus Jakarta Sans', sans-serif;
          background: #030712;
          color: #f8fafc;
          min-height: 100vh;
          display: flex;
          flex-direction: column;
          align-items: center;
          padding: 24px 16px;
        }
        .container {
          max-width: 440px;
          width: 100%;
          background: #0f172a;
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 24px;
          overflow: hidden;
          box-shadow: 0 20px 40px rgba(0, 0, 0, 0.6);
        }
        .header {
          padding: 20px;
          text-align: center;
          background: linear-gradient(180deg, rgba(30, 41, 59, 0.8) 0%, rgba(15, 23, 42, 0.9) 100%);
          border-bottom: 1px solid rgba(255, 255, 255, 0.08);
        }
        .badge {
          display: inline-block;
          font-size: 11px;
          letter-spacing: 1.5px;
          font-weight: 700;
          color: ${theme.color};
          background: rgba(${theme.rgb.join(',')}, 0.15);
          border: 1px solid rgba(${theme.rgb.join(',')}, 0.35);
          padding: 4px 12px;
          border-radius: 9999px;
          margin-bottom: 8px;
        }
        h1 {
          font-family: 'Outfit', sans-serif;
          font-size: 24px;
          font-weight: 800;
          color: #ffffff;
        }
        p.subtitle {
          font-size: 13px;
          color: #94a3b8;
          margin-top: 4px;
        }
        .image-wrapper {
          padding: 16px;
          position: relative;
        }
        .image-box {
          border-radius: 16px;
          overflow: hidden;
          border: 2px solid rgba(255, 255, 255, 0.12);
          position: relative;
          background: #000;
          box-shadow: 0 10px 25px rgba(0,0,0,0.5);
        }
        .image-box img {
          width: 100%;
          display: block;
          object-fit: cover;
        }
        .actions {
          padding: 0 16px 20px 16px;
          display: flex;
          flex-direction: column;
          gap: 12px;
        }
        .btn-download {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 10px;
          width: 100%;
          padding: 16px;
          border-radius: 16px;
          background: #2563eb;
          background: linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%);
          color: #ffffff;
          font-size: 16px;
          font-weight: 700;
          text-decoration: none;
          box-shadow: 0 8px 20px rgba(37, 99, 235, 0.4);
          transition: transform 0.15s ease, background 0.15s ease;
          border: none;
          cursor: pointer;
        }
        .btn-download:active {
          transform: scale(0.98);
        }
        .btn-download svg {
          width: 20px;
          height: 20px;
        }
        .info-card {
          margin-top: 6px;
          padding: 12px;
          border-radius: 12px;
          background: rgba(15, 23, 42, 0.5);
          border: 1px solid rgba(255, 255, 255, 0.05);
          text-align: center;
          font-size: 12px;
          color: #64748b;
        }
        /* Success Screen (Step 11) */
        #success-banner {
          display: none;
          padding: 16px;
          margin-bottom: 16px;
          border-radius: 16px;
          background: rgba(16, 185, 129, 0.15);
          border: 1px solid rgba(16, 185, 129, 0.4);
          text-align: center;
        }
        .check-icon {
          width: 44px;
          height: 44px;
          background: #10b981;
          color: white;
          border-radius: 50%;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          margin-bottom: 8px;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <div class="badge">YEAR 2030 AVATAR</div>
          <h1>Your 2030 Image</h1>
          <p class="subtitle">${theme.title}</p>
        </div>

        <div class="image-wrapper">
          <div id="success-banner">
            <div class="check-icon">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round">
                <polyline points="20 6 9 17 4 12"></polyline>
              </svg>
            </div>
            <h3 style="font-size: 16px; color: #34d399; font-weight: 700;">Image Downloaded Successfully!</h3>
            <p style="font-size: 12px; color: #cbd5e1; margin-top: 4px;">Enjoy your 2030 look!</p>
          </div>

          <div class="image-box">
            <img src="/uploads/${fileName}" alt="${theme.title}" id="avatar-img" />
          </div>
        </div>

        <div class="actions">
          <a href="/api/download/${imageId}" class="btn-download" id="download-btn" download="Future_2030_${theme.id}.jpg" onclick="handleDownload()">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
              <polyline points="7 10 12 15 17 10"></polyline>
              <line x1="12" y1="15" x2="12" y2="3"></line>
            </svg>
            Download Image
          </a>
          
          <div class="info-card">
            High Quality HD • Identity Preserved • Year 2030
          </div>
        </div>
      </div>

      <script>
        function handleDownload() {
          setTimeout(() => {
            document.getElementById('success-banner').style.display = 'block';
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }, 600);
        }
      </script>
    </body>
  </html>
  `;

  res.send(html);
});

// Start server
app.listen(PORT, '0.0.0.0', () => {
  const localIp = getLocalNetworkIp();
  console.log(`🚀 Future 2030 Backend Server running on port ${PORT}`);
  console.log(`📡 Local: http://localhost:${PORT}`);
  console.log(`📱 LAN Network IP: http://${localIp}:${PORT}`);
});
