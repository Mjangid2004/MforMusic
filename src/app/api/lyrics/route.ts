import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const title = searchParams.get("title");
  const artist = searchParams.get("artist");

  if (!title) {
    return NextResponse.json({ lyrics: null });
  }

  try {
    const searchQuery = `${title} ${artist} lyrics`.replace(/\s+/g, "+");
    const response = await fetch(`https://api.allorigins.win/raw?url=${encodeURIComponent(`https://www.lyrics.com/ajax.php?a=getText&term=${searchQuery}`)}`, {
      headers: { "User-Agent": "Mozilla/5.0" },
    });

    let lyrics = null;
    if (response.ok) {
      const text = await response.text();
      if (text && text.length > 10 && text.length < 10000) {
        lyrics = text.trim();
      }
    }

    if (!lyrics) {
      lyrics = `♪ ♫ ♪

🎵 ${title}
🎤 ${artist}

♪ ♫ ♪

Lyrics not found. This is a placeholder for the actual lyrics which would be fetched from a lyrics API.

♪ ♫ ♪`;
    }

    return NextResponse.json({ lyrics });
  } catch (error) {
    return NextResponse.json({
      lyrics: `♪ ♫ ♪

🎵 ${title}
🎤 ${artist}

♪ ♫ ♪

Could not fetch lyrics. Please check back later.

♪ ♫ ♪`,
    });
  }
}