import Link from "next/link";

export default function Footer() {
  return (
    <footer className="border-t border-white/10 bg-black mt-auto">
      <div className="container mx-auto px-4 py-4">
        <div className="flex flex-col md:flex-row justify-between items-center gap-2">
          {/* Brand */}
          <div className="text-center md:text-left">
            <h3 className="text-lg font-bold text-white">ZeroVerse</h3>
            <p className="text-xs text-white/50">
              Anonymous Community for Students
            </p>
          </div>

          {/* Copyright */}
          <div className="text-xs text-white/40">
            © {new Date().getFullYear()} ZeroVerse. All rights reserved.
          </div>
        </div>
      </div>
    </footer>
  );
}
