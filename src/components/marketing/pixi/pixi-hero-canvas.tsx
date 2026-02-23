/* eslint-disable @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-call */
"use client";

import { useRef, useEffect, useCallback } from "react";
import { usePixiApp } from "./use-pixi-app";

interface Particle {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  gfx: any;
  x: number;
  y: number;
  speed: number;
  sway: number;
  swayOffset: number;
  opacity: number;
  size: number;
}

export function PixiHeroCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { app, ready } = usePixiApp(canvasRef);
  const mouseRef = useRef({ x: 0.5, y: 0.5 });
  const particlesRef = useRef<Particle[]>([]);

  const isMobile = useCallback(() => {
    return typeof window !== "undefined" && window.innerWidth < 768;
  }, []);

  useEffect(() => {
    if (!ready || !app.current) return;

    const pixiApp = app.current;
    let tickerCallback: ((ticker: { deltaTime: number }) => void) | null =
      null;

    void import("pixi.js").then((PIXI) => {
      const count = isMobile() ? 18 : 40;
      const w = pixiApp.screen.width;
      const h = pixiApp.screen.height;

      const particles: Particle[] = [];

      for (let i = 0; i < count; i++) {
        const size = 6 + Math.random() * 14;
        const gfx = new PIXI.Graphics();

        const foldSize = size * 0.3;
        gfx.moveTo(0, 0);
        gfx.lineTo(size - foldSize, 0);
        gfx.lineTo(size, foldSize);
        gfx.lineTo(size, size * 1.3);
        gfx.lineTo(0, size * 1.3);
        gfx.closePath();
        gfx.fill({ color: 0x9acd32, alpha: 0.08 + Math.random() * 0.08 });
        gfx.stroke({ color: 0x9acd32, alpha: 0.12, width: 0.5 });

        gfx.moveTo(size - foldSize, 0);
        gfx.lineTo(size - foldSize, foldSize);
        gfx.lineTo(size, foldSize);
        gfx.stroke({ color: 0x9acd32, alpha: 0.1, width: 0.4 });

        const x = Math.random() * w;
        const y = Math.random() * h;
        gfx.x = x;
        gfx.y = y;
        gfx.rotation = (Math.random() - 0.5) * 0.5;

        pixiApp.stage.addChild(gfx);
        particles.push({
          gfx,
          x,
          y,
          speed: 0.15 + Math.random() * 0.35,
          sway: 15 + Math.random() * 25,
          swayOffset: Math.random() * Math.PI * 2,
          opacity: gfx.alpha,
          size,
        });
      }

      const textCount = isMobile() ? 3 : 6;
      const dateTexts = [
        "EXP",
        "03/24",
        "EXPIRED",
        "12/25",
        "RENEW",
        "07/26",
      ];
      for (let i = 0; i < textCount; i++) {
        const text = new PIXI.Text({
          text: dateTexts[i % dateTexts.length],
          style: {
            fontSize: 9 + Math.random() * 4,
            fill: 0x9acd32,
            fontFamily: "monospace",
          },
        });
        text.alpha = 0.06 + Math.random() * 0.06;
        const x = Math.random() * w;
        const y = Math.random() * h;
        text.x = x;
        text.y = y;

        pixiApp.stage.addChild(text);
        particles.push({
          gfx: text,
          x,
          y,
          speed: 0.1 + Math.random() * 0.2,
          sway: 10 + Math.random() * 20,
          swayOffset: Math.random() * Math.PI * 2,
          opacity: text.alpha,
          size: 10,
        });
      }

      particlesRef.current = particles;

      let elapsed = 0;
      tickerCallback = (ticker: { deltaTime: number }) => {
        elapsed += ticker.deltaTime * 0.016;
        const mouse = mouseRef.current;
        const parallaxX = (mouse.x - 0.5) * 30;
        const parallaxY = (mouse.y - 0.5) * 15;

        for (const p of particles) {
          p.y -= p.speed * ticker.deltaTime;

          if (p.y < -p.size * 2) {
            p.y = h + p.size * 2;
            p.x = Math.random() * w;
          }

          const swayX = Math.sin(elapsed * 0.5 + p.swayOffset) * p.sway;

          p.gfx.x = p.x + swayX + parallaxX;
          p.gfx.y = p.y + parallaxY;

          const edgeFade = Math.min(
            p.y / (h * 0.15),
            (h - p.y) / (h * 0.15),
            1,
          );
          p.gfx.alpha = p.opacity * Math.max(0, Math.min(1, edgeFade));
        }
      };

      pixiApp.ticker.add(tickerCallback);
    });

    return () => {
      if (tickerCallback && pixiApp.ticker) {
        pixiApp.ticker.remove(tickerCallback);
      }
      for (const p of particlesRef.current) {
        if (p.gfx.destroy) p.gfx.destroy();
      }
      particlesRef.current = [];
    };
  }, [ready, app, isMobile]);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      mouseRef.current = {
        x: e.clientX / window.innerWidth,
        y: e.clientY / window.innerHeight,
      };
    };
    window.addEventListener("mousemove", handler, { passive: true });
    return () => window.removeEventListener("mousemove", handler);
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="pointer-events-none absolute inset-0 h-full w-full"
      aria-hidden="true"
    />
  );
}
