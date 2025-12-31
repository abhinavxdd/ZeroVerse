import Link from "next/link";

export default function Footer() {
  return (
    <footer className="border-t border-white/10 bg-black mt-auto">
      <div className="container mx-auto px-4 py-3">
        <div className="flex flex-col md:flex-row justify-between items-center gap-2 text-sm">
          {/* Brand */}
          <div className="text-center md:text-left">
            <span className="font-semibold text-white">ZeroVerse</span>
            <span className="text-white/50 ml-2">
              Anonymous Community for Students
            </span>
          </div>

          {/* Copyright */}
          <div className="text-white/40">
            © {new Date().getFullYear()} ZeroVerse. All rights reserved.
          </div>
        </div>
      </div>
    </footer>
  );
}
