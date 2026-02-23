"use client";

import * as React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles } from "lucide-react";

const ReadyContext = React.createContext(false);

export function usePageReady() {
  return React.useContext(ReadyContext);
}

const SESSION_KEY = "docuexpiry-loaded";
const MIN_LOAD_MS = 600;

export function MarketingReadyProvider(props: { children: React.ReactNode }) {
  // If the user already saw the loader this session, skip it entirely
  const alreadyLoaded =
    typeof sessionStorage !== "undefined" &&
    sessionStorage.getItem(SESSION_KEY) === "1";

  const [ready, setReady] = React.useState(alreadyLoaded);

  React.useEffect(() => {
    if (alreadyLoaded) return;

    const start = Date.now();

    void document.fonts.ready.then(() => {
      const elapsed = Date.now() - start;
      const remaining = Math.max(0, MIN_LOAD_MS - elapsed);
      setTimeout(() => {
        sessionStorage.setItem(SESSION_KEY, "1");
        setReady(true);
      }, remaining);
    });
  }, [alreadyLoaded]);

  return (
    <ReadyContext.Provider value={ready}>
      <AnimatePresence>
        {!ready && (
          <motion.div
            key="loader"
            className="fixed inset-0 z-50 flex flex-col items-center justify-center gap-4 bg-background"
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
          >
            <motion.div
              className="flex items-center gap-3"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <span className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-primary/15 ring-1 ring-primary/20">
                <Sparkles className="h-5 w-5 text-primary" />
              </span>
              <span className="text-xl font-semibold tracking-tight">
                DocuExpiry
              </span>
            </motion.div>

            <div className="flex gap-1.5">
              {[0, 1, 2].map((i) => (
                <motion.div
                  key={i}
                  className="h-1.5 w-1.5 rounded-full bg-primary"
                  animate={{ opacity: [0.3, 1, 0.3] }}
                  transition={{
                    duration: 1,
                    repeat: Infinity,
                    delay: i * 0.2,
                    ease: "easeInOut",
                  }}
                />
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      {props.children}
    </ReadyContext.Provider>
  );
}
