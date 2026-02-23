/* eslint-disable @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-call */
"use client";

import { useRef, useEffect } from "react";
import { usePixiApp } from "./use-pixi-app";

export function PixiSectionTransition() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { app, ready } = usePixiApp(canvasRef);

  useEffect(() => {
    if (!ready || !app.current) return;

    const pixiApp = app.current;
    let tickerCallback: ((ticker: { deltaTime: number }) => void) | null =
      null;

    void import("pixi.js").then((PIXI) => {
      const w = pixiApp.screen.width;
      const h = pixiApp.screen.height;
      const count = 20;

      const dots: {
        gfx: any; // eslint-disable-line @typescript-eslint/no-explicit-any
        baseX: number;
        baseY: number;
        phase: number;
        amp: number;
      }[] = [];

      for (let i = 0; i < count; i++) {
        const gfx = new PIXI.Graphics();
        const radius = 1.5 + Math.random() * 2;
        gfx.circle(0, 0, radius);
        gfx.fill({ color: 0x9acd32, alpha: 0.12 + Math.random() * 0.08 });

        const baseX = (i / count) * w + Math.random() * (w / count);
        const baseY = h * 0.3 + Math.random() * h * 0.4;
        gfx.x = baseX;
        gfx.y = baseY;

        pixiApp.stage.addChild(gfx);
        dots.push({
          gfx,
          baseX,
          baseY,
          phase: Math.random() * Math.PI * 2,
          amp: 4 + Math.random() * 8,
        });
      }

      let elapsed = 0;
      tickerCallback = (ticker: { deltaTime: number }) => {
        elapsed += ticker.deltaTime * 0.016;
        for (const d of dots) {
          d.gfx.x = d.baseX + Math.sin(elapsed * 0.8 + d.phase) * d.amp;
          d.gfx.y =
            d.baseY + Math.cos(elapsed * 0.5 + d.phase) * (d.amp * 0.5);
        }
      };

      pixiApp.ticker.add(tickerCallback);
    });

    return () => {
      if (tickerCallback && pixiApp.ticker) {
        pixiApp.ticker.remove(tickerCallback);
      }
    };
  }, [ready, app]);

  return (
    <div className="relative h-20 w-full overflow-hidden sm:h-24">
      <canvas
        ref={canvasRef}
        className="pointer-events-none absolute inset-0 h-full w-full"
        aria-hidden="true"
      />
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-transparent via-primary/5 to-transparent" />
    </div>
  );
}
