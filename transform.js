// api/transform.js
// Vercel serverless function (Node runtime, Node 18+). Deploy this alongside your frontend.
// No API key required. Uses Pollinations.ai's free "kontext" image-editing model.
//
// How it works:
//   1. Pollinations' image-editing endpoint needs the source photo at a public URL
//      (it can't accept raw base64 directly), so we briefly upload the photo to
//      0x0.st, a free, keyless, anonymous file host, just to get that URL.
//   2. We call Pollinations' kontext model with that URL + a 2030 prompt.
//   3. We stream the generated image back to the frontend as base64.
//
// Privacy note: because of step 1, the uploaded photo is briefly reachable at an
// unguessable public URL rather than staying purely server-to-server. Mention this
// to your users if that matters for your product.

const MODE_PROMPTS = {
  self: "Upgrade the environment, clothing, technology, devices, and lighting around this person to a believable, photorealistic year-2030 setting.",
  city: "Keep the person exactly as they are, but transform the surrounding environment into a realistic 2030 city: modern sustainable architecture, clean streets, electric/autonomous vehicles, subtle smart-glass displays.",
  fashion: "Keep the person's face, body, and identity unchanged. Update only their clothing to realistic, premium 2030-era fashion — smart wearable details, modern cuts and fabrics, no costume or sci-fi exaggeration.",
  sustainable: "Reimagine the setting as a sustainable 2030 world: green architecture, solar/clean energy elements, natural materials, calm natural light.",
  lifestyle: "Add tasteful, realistic AI-powered devices and interfaces to the scene (a slim wearable, a smart display, a subtle holographic UI element) without changing the person's appearance.",
};

const BASE_PROMPT = `Transform this uploaded photo into a realistic vision of the year 2030.
Preserve the person's identity, facial structure, skin tone, hairstyle, body proportions, and recognizable characteristics exactly.
Upgrade only the environment, clothing, technology, architecture, lighting, vehicles, devices, and overall visual atmosphere.
Style: photorealistic, cinematic lighting, natural skin texture, realistic materials and reflections, professional photography, high dynamic range.
Avoid: fantasy or extreme sci-fi, flying cars, robots, cyberpunk neon, glowing effects, distorted faces, extra fingers, deformed hands, plastic skin, cartoon or anime style, changing the person's identity.`;

const UPLOAD_URL = "https://0x0.st";
const POLLINATIONS_URL = "https://image.pollinations.ai/prompt";

// Step 1: get a temporary public URL for the photo so Pollinations can fetch it.
async function uploadTempImage(buffer, mimeType) {
  const form = new FormData();
  const ext = mimeType.split("/")[1] || "jpg";
  form.append("file", new Blob([buffer], { type: mimeType }), `photo.${ext}`);

  const res = await fetch(UPLOAD_URL, { method: "POST", body: form });
  if (!res.ok) {
    throw new Error("Could not host the photo for editing. Please try again.");
  }
  const url = (await res.text()).trim();
  if (!url.startsWith("http")) {
    throw new Error("Unexpected response while preparing your photo.");
  }
  return url;
}

// Step 2: ask Pollinations' kontext model to edit the hosted photo.
async function editWithKontext(photoUrl, prompt) {
  const encodedPrompt = encodeURIComponent(prompt);
  const params = new URLSearchParams({
    model: "kontext",
    image: photoUrl,
    nologo: "true",
  });
  const url = `${POLLINATIONS_URL}/${encodedPrompt}?${params.toString()}`;

  const res = await fetch(url);
  if (!res.ok) {
    if (res.status === 429) {
      throw { status: 429, message: "Rate limit reached. Please wait a moment and try again." };
    }
    throw { status: 502, message: "The AI model failed to generate an image." };
  }

  const contentType = res.headers.get("content-type") || "";
  if (!contentType.startsWith("image/")) {
    // Pollinations returns JSON/text on error instead of an image
    const text = await res.text().catch(() => "");
    console.error("Pollinations non-image response:", text.slice(0, 300));
    throw { status: 502, message: "The AI model didn't return an image. Please try again." };
  }

  const arrayBuffer = await res.arrayBuffer();
  return { buffer: Buffer.from(arrayBuffer), mimeType: contentType };
}

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { imageBase64, mimeType, mode } = req.body || {};
    if (!imageBase64 || !mimeType) {
      return res.status(400).json({ error: "imageBase64 and mimeType are required." });
    }

    const inputBuffer = Buffer.from(imageBase64, "base64");
    if (inputBuffer.length > 8 * 1024 * 1024) {
      return res.status(400).json({ error: "That image is too large. Please use a photo under 8MB." });
    }

    const photoUrl = await uploadTempImage(inputBuffer, mimeType);
    const prompt = `${BASE_PROMPT}\n\n${MODE_PROMPTS[mode] || MODE_PROMPTS.self}`;
    const { buffer, mimeType: outMimeType } = await editWithKontext(photoUrl, prompt);

    return res.status(200).json({
      imageBase64: buffer.toString("base64"),
      mimeType: outMimeType,
    });
  } catch (err) {
    if (err && err.status) {
      return res.status(err.status).json({ error: err.message });
    }
    console.error("Transform error:", err);
    return res.status(500).json({ error: "We couldn't generate your 2030 image. Please try again." });
  }
}
