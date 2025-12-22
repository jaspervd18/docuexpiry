export function SiteFooter() {
  return (
    <footer className="border-t">
      <div className="mx-auto max-w-6xl flex-col gap-2 px-4 py-6 text-sm text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
        <p>© {new Date().getFullYear()} DocuExpiry</p>
        <p className="text-xs">
          Built for small businesses • Stay ahead of expirations
        </p>
      </div>
    </footer>
  );
}
