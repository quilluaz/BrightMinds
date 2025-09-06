import { useEffect, useState, useCallback, useRef } from "react";
import {
  motion,
  useMotionValue,
  useAnimation,
  useTransform,
} from "framer-motion";

export default function RollingGallery({
  images = [],
  autoplay = true,
  pauseOnHover = true,
  containerClass = "w-full",
  scrollFactor = 0.12,
  dragFactor = 0.05,
  tileTo = 8,
  ringSpread = 2,
  rotationSpeed = 35,
  fitToViewport = true,
  verticalPadding = 96,
  onItemClick,
}) {
  const baseImages = images.length ? images : [];
  const repeats = Math.ceil(tileTo / Math.max(baseImages.length, 1));
  const ringImages = Array.from(
    { length: baseImages.length * repeats },
    (_, i) => ({
      url: baseImages[i % baseImages.length],
      originalIndex: i % baseImages.length,
    })
  );

  const containerRef = useRef(null);
  const [containerW, setContainerW] = useState(0);
  const [vh, setVh] = useState(
    typeof window !== "undefined" ? window.innerHeight : 800
  );

  // Observe container width
  useEffect(() => {
    if (!containerRef.current) return;
    const ro = new ResizeObserver(([entry]) => {
      if (entry?.contentRect?.width) setContainerW(entry.contentRect.width);
    });
    ro.observe(containerRef.current);
    return () => ro.disconnect();
  }, []);

  // Track viewport height for scaling
  useEffect(() => {
    const onResize = () => setVh(window.innerHeight);
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  const [isSm, setIsSm] = useState(
    typeof window !== "undefined" ? window.innerWidth <= 640 : false
  );
  useEffect(() => {
    const r = () => setIsSm(window.innerWidth <= 640);
    window.addEventListener("resize", r);
    return () => window.removeEventListener("resize", r);
  }, []);

  // ----- Layout
  const cylinderWidth = Math.max(
    720,
    Math.floor(containerW * (isSm ? 1.1 : 1.2))
  );
  const faceCount = Math.max(ringImages.length, 1);

  // Large tiles
  const faceWidth = (cylinderWidth / faceCount) * 2.7;
  const cardW = faceWidth * .90;
  const cardH = faceWidth * 0.45;

  // Container height derived from tile height (add headroom for perspective)
  const autoContainerH = Math.ceil(cardH * 1.35);

  // Fit-to-viewport scale (<= 1). We reserve some padding for breathing room.
  const maxAllowedH = Math.max(200, vh - verticalPadding);
  const fitScale = fitToViewport
    ? Math.min(1, maxAllowedH / autoContainerH)
    : 1;

  const baseRadius = cylinderWidth / (2.5 * Math.PI);
  const radius = baseRadius * ringSpread;

  // ----- Motion
  const rotation = useMotionValue(0);
  const controls = useAnimation();
  const transform = useTransform(rotation, (v) => `rotate3d(0,1,0,${v}deg)`);

  const startInfiniteSpin = useCallback(
    (startAngle) => {
      controls.start({
        rotateY: [startAngle, startAngle - 360],
        transition: {
          duration: rotationSpeed,
          ease: "linear",
          repeat: Infinity,
        },
      });
    },
    [controls, rotationSpeed]
  );

  useEffect(() => {
    if (autoplay) startInfiniteSpin(rotation.get());
    else controls.stop();
  }, [autoplay, startInfiniteSpin, rotation, controls]);

  const handleUpdate = (latest) => {
    if (typeof latest.rotateY === "number") rotation.set(latest.rotateY);
  };
  const handleDrag = (_, info) => {
    controls.stop();
    rotation.set(rotation.get() + info.offset.x * dragFactor);
  };
  const handleDragEnd = (_, info) => {
    const finalAngle = rotation.get() + info.velocity.x * dragFactor;
    rotation.set(finalAngle);
    if (autoplay) startInfiniteSpin(finalAngle);
  };
  const handleMouseEnter = () => {
    if (autoplay && pauseOnHover) controls.stop();
  };
  const handleMouseLeave = () => {
    if (autoplay && pauseOnHover) startInfiniteSpin(rotation.get());
  };
  const handleWheel = (e) => {
    const d = e.deltaY || e.deltaX || 0;
    if (!d) return;
    controls.stop();
    rotation.set(rotation.get() + d * scrollFactor);
    if (autoplay && !pauseOnHover) startInfiniteSpin(rotation.get());
  };

  const clickItem = (item) =>
    onItemClick?.(
      { url: item.url, index: item.originalIndex },
      item.originalIndex
    );

  return (
    <div
      ref={containerRef}
      className={`relative ${containerClass}`}
      style={{
        // give the slot its *unscaled* natural height, then fit inside via scale wrapper
        height: `${autoContainerH}px`,
        overflowX: "visible",
        overflowY: "visible",
        transform: "translateZ(0)",
      }}>
      {/* Scale-wrapper: ensures we never exceed the viewport height */}
      <div
        className="grid place-items-center h-full"
        style={{
          transform: `scale(${fitScale})`,
          transformOrigin: "center center",
        }}>
        <div
          className="flex h-full items-center justify-center [perspective:1000px] [transform-style:preserve-3d]"
          onWheel={handleWheel}
          style={{ transform: "translateZ(0)" }}>
          <motion.div
            drag="x"
            dragElastic={0}
            onDrag={handleDrag}
            onDragEnd={handleDragEnd}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            animate={controls}
            onUpdate={handleUpdate}
            style={{
              transform,
              rotateY: rotation,
              width: cylinderWidth,
              transformStyle: "preserve-3d",
            }}
            className="flex min-h-[200px] cursor-grab items-center justify-center [transform-style:preserve-3d]">
            {ringImages.map((item, i) => (
              <button
                type="button"
                key={`${i}-${item.originalIndex}`}
                onClick={() => clickItem(item)}
                className="group absolute flex h-fit items-center justify-center p-[8%] md:p-[6%] [backface-visibility:hidden] focus:outline-none"
                style={{
                  width: `${faceWidth}px`,
                  transform: `rotateY(${
                    (360 / faceCount) * i
                  }deg) translateZ(${radius}px)`,
                }}>
                <img
                  src={item.url}
                  alt={`gallery-${i}`}
                  style={{ width: `${cardW}px`, height: `${cardH}px` }}
                  className="rounded-[20px] border-[4px] border-bmYellow object-cover transition-transform duration-300 ease-out group-hover:scale-105"
                />
              </button>
            ))}
          </motion.div>
        </div>
      </div>
    </div>
  );
}
