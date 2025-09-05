import { useEffect, useRef } from "react";
import { gsap } from "gsap";

const GridMotion = ({
  items = [],
  gradientColor = "black",
  autoScroll = true, // default: auto drift on
}) => {
  const gridRef = useRef(null);
  const rowRefs = useRef([]);
  const mouseXRef = useRef(
    typeof window !== "undefined" ? window.innerWidth / 2 : 0
  );

  // ---- Motion Tunables (single source of truth) ----
  const SPEED_PX_PER_SEC = 40; // drift speed (increase = faster)
  const SINE_SCALE = 150; // amplitude of drift
  const SINE_DIVISOR = 50; // wavelength / smoothness
  const BASE_DURATION = 0.8; // easing base
  const INERTIA = [0.6, 0.4, 0.3, 0.2];

  const totalItems = 28;
  const defaultItems = Array.from(
    { length: totalItems },
    (_, i) => `Item ${i + 1}`
  );
  const combinedItems =
    items.length > 0 ? items.slice(0, totalItems) : defaultItems;

  useEffect(() => {
    gsap.ticker.lagSmoothing(0);

    if (!autoScroll) {
      // Mouse-driven motion (kept for completeness)
      const onMove = (e) => (mouseXRef.current = e.clientX);
      const update = () => {
        const maxMoveAmount = 300;
        rowRefs.current.forEach((row, index) => {
          if (!row) return;
          const direction = index % 2 === 0 ? 1 : -1;
          const moveAmount =
            ((mouseXRef.current / window.innerWidth) * maxMoveAmount -
              maxMoveAmount / 2) *
            direction;

          gsap.to(row, {
            x: moveAmount,
            duration: BASE_DURATION + INERTIA[index % INERTIA.length],
            ease: "power3.out",
            overwrite: "auto",
          });
        });
      };

      const remove = gsap.ticker.add(update);
      window.addEventListener("mousemove", onMove);
      return () => {
        window.removeEventListener("mousemove", onMove);
        remove();
      };
    }

    // Auto-scroll mode
    let rafId;
    let last = performance.now();
    let drift = 0;

    const loop = (t) => {
      const dt = (t - last) / 1000;
      last = t;
      drift += SPEED_PX_PER_SEC * dt;

      rowRefs.current.forEach((row, index) => {
        if (!row) return;
        const direction = index % 2 === 0 ? 1 : -1;
        const moveAmount =
          Math.sin(drift / SINE_DIVISOR + index) * SINE_SCALE * direction;

        gsap.to(row, {
          x: moveAmount,
          duration: BASE_DURATION + INERTIA[index % INERTIA.length],
          ease: "power1.inOut",
          overwrite: "auto",
        });
      });

      rafId = requestAnimationFrame(loop);
    };

    rafId = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(rafId);
  }, [autoScroll]);

  return (
    <div ref={gridRef} className="h-full w-full overflow-hidden">
      <section
        className="w-full h-screen overflow-hidden relative flex items-center justify-center"
        style={{
          background: `radial-gradient(circle, ${gradientColor} 0%, transparent 100%)`,
        }}>
        <div className="absolute inset-0 pointer-events-none z-[4] bg-[length:250px]" />
        <div className="gap-4 flex-none relative w-[150vw] h-[150vh] grid grid-rows-4 grid-cols-1 rotate-[-15deg] origin-center z-[2]">
          {[...Array(4)].map((_, rowIndex) => (
            <div
              key={rowIndex}
              className="grid gap-4 grid-cols-7"
              style={{ willChange: "transform, filter" }}
              ref={(el) => (rowRefs.current[rowIndex] = el)}>
              {[...Array(7)].map((_, itemIndex) => {
                const content = combinedItems[rowIndex * 7 + itemIndex];
                return (
                  <div key={itemIndex} className="relative">
                    <div className="relative w-full h-full overflow-hidden rounded-[10px] bg-[#111] flex items-center justify-center text-white text-[1.5rem]">
                      {typeof content === "string" &&
                      (/^(https?:)?\/\//.test(content) ||
                        content.startsWith("/") ||
                        content.startsWith("./")) ? (
                        <div
                          className="w-full h-full bg-cover bg-center absolute top-0 left-0"
                          style={{ backgroundImage: `url(${content})` }}
                        />
                      ) : (
                        <div className="p-4 text-center z-[1]">{content}</div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          ))}
        </div>
        <div className="relative w-full h-full top-0 left-0 pointer-events-none" />
      </section>
    </div>
  );
};

export default GridMotion;
