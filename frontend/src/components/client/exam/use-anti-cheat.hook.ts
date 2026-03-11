import { useEffect, useRef, useCallback } from "react";

interface UseAntiCheatOptions {
  enabled: boolean;
  onWarning: (count: number) => void;
  onCancel: () => void;
  maxViolations?: number;
}

export const useAntiCheat = ({
  enabled,
  onWarning,
  onCancel,
  maxViolations = 3,
}: UseAntiCheatOptions) => {
  const countRef = useRef(0);
  const cancelledRef = useRef(false);

  const handleViolation = useCallback(() => {
    if (cancelledRef.current) return;
    countRef.current += 1;
    const current = countRef.current;

    if (current >= maxViolations) {
      cancelledRef.current = true;
      onCancel();
    } else {
      onWarning(current);
    }
  }, [maxViolations, onWarning, onCancel]);

  // Fullscreen enforcement
  useEffect(() => {
    if (!enabled) return;

    const enterFullscreen = async () => {
      try {
        if (!document.fullscreenElement) {
          await document.documentElement.requestFullscreen();
        }
      } catch {
        // Browser may block fullscreen without user gesture
      }
    };

    enterFullscreen();

    return () => {
      if (document.fullscreenElement) {
        document.exitFullscreen().catch(() => {});
      }
    };
  }, [enabled]);

  useEffect(() => {
    if (!enabled) return;

    const handleVisibilityChange = () => {
      if (document.hidden) {
        handleViolation();
      }
    };

    const handleBlur = () => {
      handleViolation();
    };

    const handleFullscreenChange = () => {
      // If fullscreen was exited during exam, count as violation
      if (!document.fullscreenElement && enabled) {
        handleViolation();
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);
    window.addEventListener("blur", handleBlur);
    document.addEventListener("fullscreenchange", handleFullscreenChange);

    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      window.removeEventListener("blur", handleBlur);
      document.removeEventListener("fullscreenchange", handleFullscreenChange);
    };
  }, [enabled, handleViolation]);
};
