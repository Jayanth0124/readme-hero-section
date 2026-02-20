import { generateHeroSvg } from '../../components/Hero';

// Helper to stop APIs from hanging
const fetchWithTimeout = async (resource, options = {}) => {
  const { timeout = 5000 } = options;
  const controller = new AbortController();
  const id = setTimeout(() => controller.abort(), timeout);
  const response = await fetch(resource, { 
    ...options, 
    signal: controller.signal,
    headers: {
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)',
      'Accept': 'application/json, text/plain, */*'
    }
  });
  clearTimeout(id);
  return response;
};

// 🟢 NEW: Converts your external image URL into raw Base64 code
const getBase64Image = async (imageUrl) => {
  try {
    const response = await fetch(imageUrl);
    const arrayBuffer = await response.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    const base64 = buffer.toString('base64');
    const mimeType = response.headers.get('content-type') || 'image/jpeg';
    return `data:${mimeType};base64,${base64}`;
  } catch (error) {
    console.error("Failed to convert image to Base64:", error);
    return ""; // Falls back to empty if the image link is broken
  }
};

export default async function handler(req, res) {
  const { 
    name = "Jayanth", 
    role = "Full-Stack Developer",
    avatar = "https://www.jayanth.site/assets/img/j2.jpg", // Your image link
    theme = 'royal'
  } = req.query;

  const githubUser = "Jayanth0124";
  const wakatimeUrl = "https://wakatime.com/badge/user/c1f85662-37d8-4d79-b727-e72a62cbf7d0.json";

  let liveViews = "Connecting...";
  let liveWakaTime = "Connecting...";

  try {
    // 1. Fetch WakaTime
    try {
      const wakaRes = await fetchWithTimeout(wakatimeUrl);
      if (wakaRes.ok) {
        const wakaData = await wakaRes.json();
        liveWakaTime = wakaData.data?.text || "No recent activity";
      }
    } catch (e) {
      console.log("WakaTime fetch failed");
    }

    // 2. Fetch GitHub Views
    try {
      const viewsRes = await fetchWithTimeout(`https://komarev.com/ghpvc/?username=${githubUser}&style=flat`);
      if (viewsRes.ok) {
        const viewsSvg = await viewsRes.text();
        const matches = viewsSvg.match(/>([0-9,]+)<\/text>/g);
        if (matches && matches.length > 0) {
          liveViews = matches[matches.length - 1].match(/([0-9,]+)/)[0];
        }
      }
    } catch (e) {
      console.log("Views fetch failed");
    }

    // 🟢 3. Convert the Avatar to Base64 BEFORE rendering the SVG
    const base64Avatar = await getBase64Image(avatar);

    // Pass the base64 string to the SVG generator instead of the raw URL
    const svg = generateHeroSvg({ name, role, views: liveViews, wakatime: liveWakaTime, avatar: base64Avatar }, theme);

    // Cache-Busting
    res.setHeader('Content-Type', 'image/svg+xml');
    res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate, max-age=0');
    res.setHeader('Pragma', 'no-cache');
    res.setHeader('Expires', '0');
    
    return res.status(200).send(svg);
    
  } catch (error) {
    console.error("Critical failure:", error);
    // If everything fails, still try to render the avatar
    const base64Avatar = await getBase64Image(avatar);
    const fallbackSvg = generateHeroSvg({ name, role, views: "Offline", wakatime: "Offline", avatar: base64Avatar }, theme);
    res.setHeader('Content-Type', 'image/svg+xml');
    return res.status(200).send(fallbackSvg);
  }
}