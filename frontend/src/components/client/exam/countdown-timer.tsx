import { useEffect, useRef, useState } from "react";

interface CountdownTimerProps {
  /** Total seconds remaining */
  totalSeconds: number;
  onExpire: () => void;
  className?: string;
}

const CountdownTimer = ({
  totalSeconds,
  onExpire,
  className = "",
}: CountdownTimerProps) => {
  const [remaining, setRemaining] = useState(totalSeconds);

  // Keep onExpire in a ref so changing parent callbacks never restart the interval
  const onExpireRef = useRef(onExpire);
  useEffect(() => {
    onExpireRef.current = onExpire;
  }, [onExpire]);

  // Reset if totalSeconds prop changes (e.g. section switch)
  useEffect(() => {
    setRemaining(totalSeconds);
  }, [totalSeconds]);

  // Start the ticker ONCE on mount — no callback in deps to avoid restarts
  useEffect(() => {
    const timer = setInterval(() => {
      setRemaining((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Fire onExpire exactly when remaining hits 0
  useEffect(() => {
    if (remaining === 0) {
      onExpireRef.current();
    }
  }, [remaining]);

  const minutes = Math.floor(remaining / 60);
  const seconds = remaining % 60;
  const isUrgent = remaining <= 60;

  return (
    <div
      className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg font-mono text-lg font-bold ${
        isUrgent
          ? "bg-red-100 text-red-700 animate-pulse"
          : "bg-blue-50 text-blue-700"
      } ${className}`}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="h-5 w-5"
        viewBox="0 0 20 20"
        fill="currentColor"
      >
        <path
          fillRule="evenodd"
          d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z"
          clipRule="evenodd"
        />
      </svg>
      {String(minutes).padStart(2, "0")}:{String(seconds).padStart(2, "0")}
    </div>
  );
};

export default CountdownTimer;
