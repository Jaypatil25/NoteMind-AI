export default function Footer() {
  return (
    <footer className="py-12 px-6 border-t border-border">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <span className="font-display text-xl text-text-primary">
            NoteMind<sup className="text-xs align-super">®</sup>
          </span>
          <span className="text-text-muted text-xs font-body">
            AI-Powered Learning
          </span>
        </div>
        <p className="text-text-muted text-xs font-body">
          © {new Date().getFullYear()} NoteMind. Transform notes into knowledge.
        </p>
      </div>
    </footer>
  );
}
