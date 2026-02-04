export function Footer() {
  return (
    <footer className="border-t border-[var(--border-default)] bg-[var(--bg-main)]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <p className="text-center text-sm text-[var(--text-muted)]">
          © {new Date().getFullYear()} Wubba Lubba Dub Dub DB. Nao afiliado com Adult Swim.
        </p>
      </div>
    </footer>
  );
}
