# See Yourself in 2030 — no API key required

This package has two parts:
- `index.html` — the app UI (upload/camera, mode picker, loading state, before/after slider)
- `api/transform.js` — a serverless function that edits your photo using **Pollinations.ai's free `kontext` model** — no signup, no API key, no billing

## How it works

1. Your browser sends the photo to `/api/transform`.
2. The function briefly uploads it to **0x0.st** (a free, anonymous file host) to get a public URL — Pollinations' editing endpoint needs a URL, not raw image data.
3. It calls `image.pollinations.ai/prompt/...?model=kontext&image=<url>` with the 2030 prompt.
4. The edited image is streamed back to your browser.

**Privacy note:** step 2 means the photo is briefly reachable at an unguessable public URL rather than staying purely server-to-server. Mention this to your users, or swap in a private upload step (e.g. your own S3 bucket) if that matters for your product.

## Deploy in ~5 minutes (Vercel)

1. Put `index.html` and `api/transform.js` in a folder together (same structure as this download).
2. Install the Vercel CLI and deploy — no environment variables to configure:
   ```bash
   npm i -g vercel
   vercel --prod
   ```
3. That's it. No API key, no account setup, no billing page.

Any other Node 18+ host (Netlify Functions, Cloudflare Pages Functions, a small Express server) works too — `api/transform.js` just needs to run as a POST endpoint at `/api/transform`.

## Limits to know about

- Pollinations' anonymous tier is rate-limited (roughly one request per ~15 seconds) and results can be less consistent than a paid model like Gemini or GPT-Image.
- For higher limits and no watermark risk, register a free account at `auth.pollinations.ai` and add the key as a header — still free, just removes the anonymous-tier caps.
- The five `mode` prompts (Future Self, Future City, Future Fashion, Sustainable 2030, AI Lifestyle) live in `MODE_PROMPTS` in `api/transform.js` — edit the wording there to tune results.
