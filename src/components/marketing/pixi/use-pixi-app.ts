/* eslint-disable @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-call */
"use client";

import { useEffect, useRef, useState } from "react";

export function usePixiApp(
  canvasRef: React.RefObject<HTMLCanvasElement | null>,
) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const appRef = useRef<any>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    let destroyed = false;

    void import("pixi.js")
      .then(async (PIXI) => {
        if (destroyed) return;

        const app = new PIXI.Application();
        await app.init({
          canvas,
          resizeTo: canvas.parentElement ?? undefined,
          backgroundAlpha: 0,
          antialias: true,
          resolution: Math.min(window.devicePixelRatio, 2),
        });

        if (destroyed) {
          app.destroy(true);
          return;
        }

        appRef.current = app;
        setReady(true);
      })
      .catch(() => {
        // WebGL not supported or import failed — fallback handled by parent
      });

    return () => {
      destroyed = true;
      if (appRef.current) {
        appRef.current.destroy(true);
        appRef.current = null;
        setReady(false);
      }
    };
  }, [canvasRef]);

  return { app: appRef, ready };
}
