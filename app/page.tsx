import Link from "next/link";

export default function Home() {
  return (
    <div className="relative min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-blue-50 via-white to-purple-100 dark:from-gray-900 dark:via-gray-950 dark:to-gray-900 transition-colors overflow-hidden">
      {/* Glassy hero card */}
      <div className="relative z-10 w-full max-w-2xl mx-auto rounded-3xl bg-white/30 dark:bg-black/40 shadow-2xl backdrop-blur-xl px-8 py-16 flex flex-col items-center gap-8 mt-16 mb-8">
        <h1 className="text-4xl sm:text-5xl font-extrabold text-center text-gray-900 dark:text-white drop-shadow-lg">
          AI Video Generator
        </h1>
        <p className="text-lg sm:text-xl text-center text-gray-700 dark:text-gray-200 max-w-xl">
          Effortlessly create, interact with, and download stunning videos powered by AI. Minimal, immersive, and lightning fast.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 w-full justify-center">
          <Link
            href="/uploads"
            className="btn btn-primary rounded-full px-8 py-3 text-lg font-semibold shadow-lg hover:scale-105 transition-transform"
          >
            Generate Video
          </Link>
          <Link
            href="/explore"
            className="btn btn-outline rounded-full px-8 py-3 text-lg font-semibold shadow-lg hover:scale-105 transition-transform"
          >
            Explore Videos
          </Link>
        </div>
        <div className="flex flex-wrap gap-4 justify-center mt-6">
          <span className="px-4 py-2 rounded-full bg-white/60 dark:bg-black/30 text-gray-800 dark:text-gray-100 text-sm shadow">
            🎬 AI-powered video creation
          </span>
          <span className="px-4 py-2 rounded-full bg-white/60 dark:bg-black/30 text-gray-800 dark:text-gray-100 text-sm shadow">
            🌓 Night mode ready
          </span>
          <span className="px-4 py-2 rounded-full bg-white/60 dark:bg-black/30 text-gray-800 dark:text-gray-100 text-sm shadow">
            ⚡ Immersive & minimal UI
          </span>
        </div>
      </div>
      {/* Subtle animated background blobs */}
      <div className="absolute -top-32 -left-32 w-96 h-96 bg-blue-300 dark:bg-blue-900 opacity-30 rounded-full blur-3xl animate-pulse z-0" />
      <div className="absolute -bottom-32 -right-32 w-96 h-96 bg-purple-200 dark:bg-purple-900 opacity-30 rounded-full blur-3xl animate-pulse z-0" />
      <footer className="relative z-10 mt-auto mb-4 text-center text-gray-500 dark:text-gray-400 text-sm">
        &copy; {new Date().getFullYear()} AI Video Generator. All rights reserved.
      </footer>
    </div>
  );
}
