"use client";

import * as React from "react";

export function useActiveSection(
  ids: string[],
  rootMargin = "-45% 0px -45% 0px",
) {
  const [active, setActive] = React.useState<string>(ids[0] ?? "");

  React.useEffect(() => {
    const observers: IntersectionObserver[] = [];

    for (const id of ids) {
      const el = document.getElementById(id);
      if (!el) continue;

      const obs = new IntersectionObserver(
        (entries) => {
          const entry = entries[0];
          if (entry?.isIntersecting) setActive(id);
        },
        { root: null, rootMargin, threshold: 0.01 },
      );

      obs.observe(el);
      observers.push(obs);
    }

    return () => observers.forEach((o) => o.disconnect());
  }, [ids, rootMargin]);

  return active;
}
