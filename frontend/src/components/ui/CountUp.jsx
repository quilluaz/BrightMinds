import { useEffect, useRef } from "react";
import { useInView, useMotionValue, useSpring } from "motion/react";

function CountUp({
  end,
  to,
  from = 0,
  direction = "up",
  delay = 0,
  duration = 2,
  className = "",
  startWhen = true,
  separator = "",
  suffix = "",
  onStart,
  onEnd,
}) {
  // Support both 'end' and 'to' props for backward compatibility
  const targetValue = end !== undefined ? end : to;
  const ref = useRef(null);
  const motionValue = useMotionValue(direction === "down" ? targetValue : from);

  const damping = 20 + 40 * (1 / duration);
  const stiffness = 100 * (1 / duration);

  const springValue = useSpring(motionValue, {
    damping,
    stiffness,
  });

  const isInView = useInView(ref, { once: true, margin: "0px" });

  const getDecimalPlaces = (num) => {
    if (typeof num === "number" && !isNaN(num)) {
      const str = num.toString();

      if (str.includes(".")) {
        const decimals = str.split(".")[1];

        if (parseInt(decimals) !== 0) {
          return decimals.length;
        }
      }
    }

    return 0;
  };

  const maxDecimals = Math.max(
    getDecimalPlaces(from),
    getDecimalPlaces(targetValue)
  );

  useEffect(() => {
    if (ref.current) {
      ref.current.textContent = String(
        direction === "down" ? targetValue : from
      );
    }
  }, [from, targetValue, direction]);

  useEffect(() => {
    if (isInView && startWhen) {
      if (typeof onStart === "function") onStart();

      const timeoutId = setTimeout(() => {
        motionValue.set(direction === "down" ? from : targetValue);
      }, delay * 1000);

      const durationTimeoutId = setTimeout(() => {
        if (typeof onEnd === "function") onEnd();
      }, delay * 1000 + duration * 1000);

      return () => {
        clearTimeout(timeoutId);
        clearTimeout(durationTimeoutId);
      };
    }
  }, [
    isInView,
    startWhen,
    motionValue,
    direction,
    from,
    targetValue,
    delay,
    onStart,
    onEnd,
    duration,
  ]);

  useEffect(() => {
    const unsubscribe = springValue.on("change", (latest) => {
      if (ref.current) {
        const hasDecimals = maxDecimals > 0;

        const options = {
          useGrouping: !!separator,
          minimumFractionDigits: hasDecimals ? maxDecimals : 0,
          maximumFractionDigits: hasDecimals ? maxDecimals : 0,
        };

        const formattedNumber = Intl.NumberFormat("en-US", options).format(
          latest
        );

        const finalText = separator
          ? formattedNumber.replace(/,/g, separator)
          : formattedNumber;

        ref.current.textContent = finalText + suffix;
      }
    });

    return () => unsubscribe();
  }, [springValue, separator, maxDecimals, suffix]);

  return <span className={className} ref={ref} />;
}

export default CountUp;
