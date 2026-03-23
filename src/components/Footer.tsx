import { Send, ExternalLink } from "lucide-react";

const VKIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
    <path d="M21.547 7h-3.29a.743.743 0 0 0-.655.392s-1.312 2.416-1.734 3.23C14.734 12.813 14 12.126 14 11.11V7.603A1.104 1.104 0 0 0 12.896 6.5h-2.474a1.982 1.982 0 0 0-1.75.813s1.255-.204 1.255 1.49c0 .42.022 1.626.04 2.64a.73.73 0 0 1-1.272.503 21.54 21.54 0 0 1-2.498-4.543.693.693 0 0 0-.63-.403h-2.99a.508.508 0 0 0-.48.685C3.005 10.175 6.918 18 11.38 18h1.878a.742.742 0 0 0 .742-.742v-1.135a.73.73 0 0 1 1.23-.53l2.247 2.112a1.09 1.09 0 0 0 .746.295h2.953c1.424 0 1.424-.988.647-1.753-.546-.538-2.518-2.617-2.518-2.617a1.02 1.02 0 0 1-.078-1.323c.637-.84 1.68-2.212 2.122-2.8.603-.804 1.697-2.507.197-2.507z" />
  </svg>
);

const Footer = () => {
  return (
    <footer className="bg-foreground text-primary-foreground py-8 px-4">
      <div className="max-w-4xl mx-auto flex flex-col items-center gap-4">
        {/* Social links */}
        <div className="flex items-center gap-6">
          <a
            href="#"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:opacity-70 transition-opacity flex items-center gap-1.5 text-sm"
            aria-label="Telegram"
          >
            <Send className="w-5 h-5" />
            <span>Telegram</span>
          </a>
          <a
            href="#"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:opacity-70 transition-opacity flex items-center gap-1.5 text-sm"
            aria-label="VK"
          >
            <VKIcon />
            <span>VK</span>
          </a>
        </div>

        {/* Created by */}
        <a
          href="#"
          target="_blank"
          rel="noopener noreferrer"
          className="text-xs opacity-70 hover:opacity-100 transition-opacity flex items-center gap-1"
        >
          <ExternalLink className="w-3 h-3" />
          <span>Created by ...</span>
        </a>

        {/* Copyright */}
        <p className="text-xs opacity-50">
          © {new Date().getFullYear()} Название компании. Все права защищены.
        </p>
      </div>
    </footer>
  );
};

export default Footer;
