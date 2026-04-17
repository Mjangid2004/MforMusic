import { NextRequest, NextResponse } from "next/server";
import { Song } from "@/lib/types";

const CORS_PROXY = "https://api.codetabs.com/v1/proxy";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const query = searchParams.get("q");

  if (!query) {
    return NextResponse.json({ results: [] });
  }

  try {
    const searchUrl = `https://www.youtube.com/results?search_query=${encodeURIComponent(query)}&sp=EgIQAQ%3D%3D`;
    
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 15000);

    const response = await fetch(`${CORS_PROXY}?quest=${encodeURIComponent(searchUrl)}`, {
      headers: {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
      },
      signal: controller.signal,
    });

    clearTimeout(timeout);

    if (!response.ok) {
      return NextResponse.json({ results: [] });
    }

    const html = await response.text();
    const results: Song[] = [];
    
    const ytInitialDataMatch = html.match(/ytInitialData\s*=\s*({.*?});/s);
    
    if (ytInitialDataMatch) {
      try {
        const data = JSON.parse(ytInitialDataMatch[1]);
        const videos = data?.contents?.twoColumnSearchResultsRenderer?.primaryContents?.sectionListRenderer?.contents;
        
        if (videos && Array.isArray(videos)) {
          for (const section of videos) {
            const items = section?.itemSectionRenderer?.contents;
            if (items && Array.isArray(items)) {
              for (const item of items) {
                const video = item?.videoRenderer;
                if (video?.videoId && video?.title?.runs?.[0]?.text) {
                  const videoId = video.videoId;
                  const title = video.title.runs[0].text;
                  const channel = video.ownerText?.runs?.[0]?.text || "YouTube";
                  const duration = video.lengthText?.simpleText || "0:00";
                  
                  results.push({
                    id: videoId,
                    title: title,
                    artist: channel,
                    thumbnail: `https://img.youtube.com/vi/${videoId}/mqdefault.jpg`,
                    duration: parseDuration(duration),
                    videoId: videoId,
                  });
                }
              }
            }
          }
        }
      } catch (parseError) {
        console.error("Parse error:", parseError);
      }
    }
    
    if (results.length === 0) {
      const videoIdRegex = /"videoId":"([a-zA-Z0-9_-]{11})"/g;
      let match;
      const foundIds = new Set<string>();
      
      while ((match = videoIdRegex.exec(html)) !== null) {
        const id = match[1];
        if (!foundIds.has(id)) {
          foundIds.add(id);
          results.push({
            id: id,
            title: "Song",
            artist: "YouTube",
            thumbnail: `https://img.youtube.com/vi/${id}/mqdefault.jpg`,
            duration: 0,
            videoId: id,
          });
        }
      }
    }

    return NextResponse.json({ results: results.slice(0, 20) });
  } catch (error) {
    console.error("Search error:", error);
    return NextResponse.json({ results: [], error: "Search failed" });
  }
}

function parseDuration(duration: string): number {
  if (!duration) return 0;
  const parts = duration.split(":").map(p => parseInt(p) || 0);
  if (parts.length === 2) return parts[0] * 60 + parts[1];
  if (parts.length === 3) return parts[0] * 3600 + parts[1] * 60 + parts[2];
  return 0;
}

async function getRelatedSongs(videoId: string, artistName?: string, songTitle?: string) {
  try {
    const genrePatterns = [
      "haryanvi", "bollywood", "punjabi", "bhojpuri", "rajasthani", "bihari",
      "gujarati", "marathi", "bengali", "tamil", "telugu", "kannada", "malayalam",
      "hindi", "english", "pop", "rock", "hip hop", "lofi", "lo-fi", "sad",
      " romantic", "party", "dj", "remix", "old", "classic", "90s", "80s", "2000s"
    ];

    const detectGenre = (text: string): string | null => {
      const lower = text.toLowerCase();
      for (const pattern of genrePatterns) {
        if (lower.includes(pattern)) return pattern;
      }
      return null;
    };

    const detectedGenre = detectGenre(songTitle || "") || detectGenre(artistName || "");
    
    const searchQuery = detectedGenre 
      ? `${detectedGenre} song latest 2024 popular`
      : "hindi song popular 2024";
    
    const searchUrl = `https://www.youtube.com/results?search_query=${encodeURIComponent(searchQuery)}&sp=EgIQAQ%3D%3D`;
    
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 15000);

    const response = await fetch(`${CORS_PROXY}?quest=${encodeURIComponent(searchUrl)}`, {
      headers: {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
      },
      signal: controller.signal,
    });

    clearTimeout(timeout);

    if (!response.ok) {
      return NextResponse.json({ results: [] });
    }

    const html = await response.text();
    const results: Song[] = [];
    const currentVideoId = videoId;
    
    const ytInitialDataMatch = html.match(/ytInitialData\s*=\s*({.*?});/s);
    
    if (ytInitialDataMatch) {
      try {
        const data = JSON.parse(ytInitialDataMatch[1]);
        const videos = data?.contents?.twoColumnSearchResultsRenderer?.primaryContents?.sectionListRenderer?.contents;
        
        if (videos && Array.isArray(videos)) {
          for (const section of videos) {
            const items = section?.itemSectionRenderer?.contents;
            if (items && Array.isArray(items)) {
              for (const item of items) {
                const video = item?.videoRenderer;
                if (video?.videoId && video?.title?.runs?.[0]?.text) {
                  const vid = video.videoId;
                  const title = video.title.runs[0].text;
                  const channel = video.ownerText?.runs?.[0]?.text || "YouTube";
                  
                  if (vid !== currentVideoId) {
                    results.push({
                      id: vid,
                      title: title,
                      artist: channel,
                      thumbnail: `https://img.youtube.com/vi/${vid}/mqdefault.jpg`,
                      duration: parseDuration(video.lengthText?.simpleText || "0:00"),
                      videoId: vid,
                    });
                  }
                }
              }
            }
          }
        }
      } catch (parseError) {
        console.error("Parse error:", parseError);
      }
    }

    return NextResponse.json({ results: results.slice(0, 10) });
  } catch (error) {
    console.error("Related songs error:", error);
    return NextResponse.json({ results: [], error: "Failed to get related songs" });
  }
}

export async function POST(request: NextRequest) {
  const body = await request.json();
  const { videoId, artistName, songTitle } = body;
  
  if (!videoId) {
    return NextResponse.json({ results: [] });
  }
  
  return getRelatedSongs(videoId, artistName, songTitle);
}
