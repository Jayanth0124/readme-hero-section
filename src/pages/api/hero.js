import { generateHeroSvg } from '../../components/Hero';

// Added a User-Agent header and increased timeout to stop APIs from blocking us
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

export default async function handler(req, res) {
  const { 
    name = "Jayanth", 
    role = "Full-Stack Developer",
    avatar = "https://jayanth.site/assets/img/j2.jpg",
    theme = 'royal'
  } = req.query;

  const githubUser = "Jayanth0124";
  const wakatimeUrl = "https://wakatime.com/badge/user/c1f85662-37d8-4d79-b727-e72a62cbf7d0.json";

  let liveViews = "Connecting...";
  let liveWakaTime = "Connecting...";

  try {
    // 1. FETCH REAL WAKATIME DATA
    try {
      const wakaRes = await fetchWithTimeout(wakatimeUrl);
      if (wakaRes.ok) {
        const wakaData = await wakaRes.json();
        liveWakaTime = wakaData.data?.text || "No recent activity";
      }
    } catch (e) {
      console.log("WakaTime fetch failed");
    }

    // 2. FETCH REAL GITHUB VIEWS (The Hacker Way)
    // We fetch the popular Komarev view counter SVG as raw text...
    try {
      const viewsRes = await fetchWithTimeout(`https://komarev.com/ghpvc/?username=${githubUser}&style=flat`);
      if (viewsRes.ok) {
        const viewsSvg = await viewsRes.text();
        
        // ...and use Regex to extract the numbers out of the raw SVG code!
        const matches = viewsSvg.match(/>([0-9,]+)<\/text>/g);
        if (matches && matches.length > 0) {
          // Cleans the match so it just leaves the pure number (e.g., "1,819")
          liveViews = matches[matches.length - 1].match(/([0-9,]+)/)[0];
        }
      }
    } catch (e) {
      console.log("Views fetch failed");
    }

    // Generate the SVG with your REAL live data
    const svg = generateHeroSvg({ name, role, views: liveViews, wakatime: liveWakaTime, avatar }, theme);

    // Strict Cache-Busting: Forces GitHub to run this script every single time someone looks at your profile
    res.setHeader('Content-Type', 'image/svg+xml');
    res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate, max-age=0');
    res.setHeader('Pragma', 'no-cache');
    res.setHeader('Expires', '0');
    
    return res.status(200).send(svg);
    
  } catch (error) {
    console.error("Critical failure:", error);
    const fallbackSvg = generateHeroSvg({ name, role, views: "Offline", wakatime: "Offline", avatar }, theme);
    res.setHeader('Content-Type', 'image/svg+xml');
    return res.status(200).send(fallbackSvg);
  }
}