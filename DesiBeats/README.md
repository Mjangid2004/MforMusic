# 🎵 DesiBeats - Free Desi Music Player

A free, ad-free music player for Indian music - Haryana, Bollywood, Punjabi, Rajasthani & more!

## 🚀 Live Demo

**🔗 [DesiBeats - Live](https://desi-beats-tau.vercel.app/)**

Deployed on Vercel - Open the link above to start streaming music!

---

## 📖 What is DesiBeats?

DesiBeats is a web-based music streaming application that lets you search and play music from YouTube without ads. It's designed specifically for fans of Indian regional music, featuring genres like Haryanvi, Bollywood, Punjabi, Rajasthani, Bhojpuri, and more.

### How It Works:

1. **Search** - Type any song name or artist to find music from YouTube
2. **Browse by Genre** - Click on genre buttons (Haryanvi, Bollywood, Punjabi, etc.) to explore curated music
3. **Play** - Click any song to start playing instantly
4. **Manage Queue** - Add songs to queue to play next
5. **Save Favorites** - Like songs to save them to your library
6. **Create Playlists** - Organize your favorite songs into custom playlists

---

## ✨ Features

### Music Playback
- **Stream from YouTube** - Access millions of songs via YouTube API
- **Full Player Controls** - Play, pause, skip, previous, seek, volume control
- **Queue System** - Add songs to queue, reorder, or clear queue
- **Background Play** - Continue listening while browsing

### Library Management
- **Liked Songs** - Save favorite songs with one click
- **Recently Played** - Automatic history of played songs
- **Playlists** - Create, edit, and delete custom playlists

### Genre Browsing
- **Haryanvi** - Latest Haryana songs
- **Bollywood** - Hindi cinema hits
- **Punjabi** - Bhangra and Punjabi pop
- **Rajasthani** - Traditional Rajasthani music
- **Bhojpuri** - Bhojpuri region hits
- **Hip Hop** - Desi hip hop tracks
- **Lo-Fi** - Chill desi beats
- **Trending** - Currently popular
- **Old Hits** - Classic desi songs
- **DJ Mix** - DJ remixes

### User Experience
- **Dark Theme** - Spotify-inspired dark UI
- **PWA Support** - Install as app on mobile/desktop
- **Responsive** - Works on phone, tablet, and desktop
- **Lyrics View** - View song lyrics (where available)

---

## 🛠 Tech Stack

| Technology | Purpose |
|------------|---------|
| **Next.js 14** | React framework with App Router |
| **React** | UI library for components |
| **TypeScript** | Type safety and better DX |
| **Tailwind CSS** | Styling and responsive design |
| **YouTube API** | Music search and streaming |
| **Lucide React** | Icons throughout the app |
| **PWA** | Installable web app |

---

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ installed
- npm or yarn

### Installation

```bash
# Clone the repository
git clone https://github.com/Mjangid2004/DesiBeats.git

# Navigate to project folder
cd DesiBeats

# Install dependencies
npm install

# Start development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 📦 Deployment

### Vercel (Recommended)
1. Push your code to GitHub
2. Go to [https://vercel.com](https://vercel.com)
3. Import your repository
4. Deploy with one click!

### Build for Production
```bash
npm run build
npm start
```

---

## 📁 Project Structure

```
DesiBeats/
├── src/
│   ├── app/           # Next.js app router pages
│   ├── components/   # React components
│   ├── hooks/        # Custom React hooks
│   ├── lib/          # Utilities and helpers
│   └── types/        # TypeScript interfaces
├── public/           # Static assets
└── package.json      # Dependencies
```

---

## 🔧 How to Explain DesiBeats to Others

**Simple Explanation:**
> "DesiBeats is like Spotify, but free and plays music from YouTube. It specializes in Indian music - you can search for any song, browse by genre like Bollywood or Punjabi, create playlists, and save your favorites. It works on any device and can be installed as an app."

**For Technical Audience:**
> "DesiBeats is a Next.js 14 web application that uses YouTube Data API to search and stream music. It features a responsive dark-themed UI built with Tailwind CSS, local storage for persisting user data (playlists, liked songs, history), PWA support for installability, and a queue management system. The app uses client-side state management for player controls and library management."

---

## ⚠️ Note

- Music is streamed from YouTube (requires internet)
- Some features require YouTube API key configuration
- The app is free and ad-supported by YouTube's terms

---

## 📄 License

Free to use! Created with ❤️

---

**🔗 Live App:** https://desi-beats-tau.vercel.app/