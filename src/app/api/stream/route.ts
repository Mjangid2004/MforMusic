import { NextRequest, NextResponse } from "next/server";

const CORS_PROXY = "https://api.codetabs.com/v1/proxy";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const videoId = searchParams.get("videoId");

  if (!videoId) {
    return NextResponse.json({ error: "Video ID required" }, { status: 400 });
  }

  try {
    const streamUrl = `https://www.youtube.com/watch?v=${videoId}`;
    
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 15000);

    const response = await fetch(`${CORS_PROXY}?quest=${encodeURIComponent(streamUrl)}`, {
      headers: {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
      },
      signal: controller.signal,
    });

    clearTimeout(timeout);

    if (!response.ok) {
      return NextResponse.json({ error: "Failed to fetch video page" }, { status: 500 });
    }

    const html = await response.text();

    const streamMatch = html.match(/"signatureCipher".*?"url":"([^"]+)"/);
    let audioUrl = null;

    if (streamMatch) {
      audioUrl = decodeURIComponent(streamMatch[1].replace(/\\u0026/g, "&"));
    } else {
      const urlMatch = html.match(/,"url":"([^"]+)"/);
      if (urlMatch) {
        audioUrl = urlMatch[1];
      }
    }

    if (audioUrl) {
      return NextResponse.json({ audioUrl, success: true });
    }

    return NextResponse.json({ 
      error: "No audio stream found",
      message: "Direct download not available for this video"
    }, { status: 404 });

  } catch (error) {
    console.error("Stream error:", error);
    return NextResponse.json({ error: "Stream fetch failed" }, { status: 500 });
  }
}
