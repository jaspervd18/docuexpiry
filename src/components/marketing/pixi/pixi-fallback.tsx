"use client";

export function PixiFallback() {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
      {/* Animated gradient blobs */}
      <div className="absolute -top-24 left-1/2 h-[420px] w-[420px] -translate-x-1/2 animate-pulse rounded-full bg-primary/15 blur-3xl" />
      <div className="absolute -bottom-32 -right-30 h-[420px] w-[420px] animate-pulse rounded-full bg-primary/10 blur-3xl [animation-delay:1s]" />
      <div className="absolute left-10 top-1/3 h-48 w-48 animate-pulse rounded-full bg-primary/8 blur-2xl [animation-delay:0.5s]" />

      {/* Floating document shapes */}
      {Array.from({ length: 6 }).map((_, i) => (
        <div
          key={i}
          className="absolute h-8 w-6 rounded-sm border border-primary/10 bg-primary/5"
          style={{
            left: `${15 + i * 14}%`,
            top: `${20 + (i % 3) * 25}%`,
            animation: `float ${6 + i * 0.8}s ease-in-out infinite`,
            animationDelay: `${i * 0.7}s`,
            transform: `rotate(${-10 + i * 7}deg)`,
          }}
        />
      ))}

      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translateY(0) rotate(var(--tw-rotate, 0deg)); }
          50% { transform: translateY(-20px) rotate(var(--tw-rotate, 0deg)); }
        }
      `}</style>
    </div>
  );
}
