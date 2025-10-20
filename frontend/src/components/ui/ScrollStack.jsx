import { useLayoutEffect, useRef, useCallback, useState } from "react";

export const ScrollStackItem = ({ children, itemClassName = "" }) => (
  <div
    className={`scroll-stack-card relative w-full h-80 my-4 p-8 rounded-[40px] shadow-[0_0_30px_rgba(0,0,0,0.3)] box-border origin-top will-change-transform bg-gray-900/80 backdrop-blur-sm border border-gray-700/50 transition-transform duration-100 ease-out ${itemClassName}`.trim()}
    style={{
      backfaceVisibility: "hidden",
      transformStyle: "preserve-3d",
    }}>
    {children}
  </div>
);

const ScrollStack = ({
  children,
  className = "",
  itemDistance = 50,
  itemScale = 0.05,
  itemStackDistance = 15,
  stackPosition = "40%",
  scaleEndPosition = "15%",
  baseScale = 0.8,
  rotationAmount = 1,
  blurAmount = 0.5,
  useWindowScroll = false,
  onStackComplete,
}) => {
  const containerRef = useRef(null);
  const cardsRef = useRef([]);
  const [isInitialized, setIsInitialized] = useState(false);
  const stackCompletedRef = useRef(false);
  const lastScrollTop = useRef(0);
  const animationFrameRef = useRef(null);

  const calculateProgress = useCallback((scrollTop, start, end) => {
    if (scrollTop < start) return 0;
    if (scrollTop > end) return 1;
    return (scrollTop - start) / (end - start);
  }, []);

  const parsePercentage = useCallback((value, containerHeight) => {
    if (typeof value === "string" && value.includes("%")) {
      return (parseFloat(value) / 100) * containerHeight;
    }
    return parseFloat(value);
  }, []);

  const getScrollData = useCallback(() => {
    if (useWindowScroll) {
      return {
        scrollTop: window.scrollY,
        containerHeight: window.innerHeight,
      };
    } else {
      const container = containerRef.current;
      return {
        scrollTop: container?.scrollTop || 0,
        containerHeight: container?.clientHeight || 0,
      };
    }
  }, [useWindowScroll]);

  const getElementOffset = useCallback(
    (element) => {
      if (useWindowScroll) {
        const rect = element.getBoundingClientRect();
        return rect.top + window.scrollY;
      } else {
        return element.offsetTop;
      }
    },
    [useWindowScroll]
  );

  const updateCardTransforms = useCallback(() => {
    if (!cardsRef.current.length || !isInitialized) return;

    const { scrollTop, containerHeight } = getScrollData();
    const stackPositionPx = parsePercentage(stackPosition, containerHeight);
    const scaleEndPositionPx = parsePercentage(
      scaleEndPosition,
      containerHeight
    );

    // Find the end element for stack completion detection
    const endElement = useWindowScroll
      ? document.querySelector(".scroll-stack-end")
      : containerRef.current?.querySelector(".scroll-stack-end");

    const endElementTop = endElement ? getElementOffset(endElement) : 0;

    let stackCompleted = false;

    cardsRef.current.forEach((card, i) => {
      if (!card) return;

      const cardTop = getElementOffset(card);
      const triggerStart = cardTop - stackPositionPx - itemStackDistance * i;
      const triggerEnd = cardTop - scaleEndPositionPx;
      const pinStart = cardTop - stackPositionPx - itemStackDistance * i;
      const pinEnd = endElementTop - containerHeight / 2;

      // Calculate scale progress - this is the key to proper stacking
      const scaleProgress = calculateProgress(
        scrollTop,
        triggerStart,
        triggerEnd
      );
      const targetScale = baseScale + i * itemScale;
      const scale = Math.max(
        targetScale,
        1 - scaleProgress * (1 - targetScale)
      );

      // Calculate rotation
      const rotation = rotationAmount ? i * rotationAmount * scaleProgress : 0;

      // Calculate blur for stacked cards
      let blur = 0;
      if (blurAmount) {
        let topCardIndex = 0;
        for (let j = 0; j < cardsRef.current.length; j++) {
          const jCardTop = getElementOffset(cardsRef.current[j]);
          const jTriggerStart =
            jCardTop - stackPositionPx - itemStackDistance * j;
          if (scrollTop >= jTriggerStart) {
            topCardIndex = j;
          }
        }

        if (i < topCardIndex) {
          const depthInStack = topCardIndex - i;
          blur = Math.max(0, depthInStack * blurAmount);
        }
      }

      // Calculate translateY for pinning effect
      let translateY = 0;
      const isPinned = scrollTop >= pinStart && scrollTop <= pinEnd;

      if (isPinned) {
        // Cards stack much more tightly with minimal spacing
        translateY =
          scrollTop - cardTop + stackPositionPx + itemStackDistance * i * 0.3;
      } else if (scrollTop > pinEnd) {
        // Cards stay in their final stacked position
        translateY =
          pinEnd - cardTop + stackPositionPx + itemStackDistance * i * 0.3;
      }

      // Apply transforms with proper stacking order
      const transform = `translate3d(0, ${translateY}px, 0) scale(${scale}) rotate(${rotation}deg)`;
      const filter = blur > 0 ? `blur(${blur}px)` : "";

      card.style.transform = transform;
      card.style.filter = filter;
      card.style.zIndex = cardsRef.current.length - i; // Ensure proper stacking order

      // Check for stack completion
      if (i === cardsRef.current.length - 1) {
        const isInView = scrollTop >= pinStart && scrollTop <= pinEnd;
        if (isInView) {
          stackCompleted = true;
        }
      }
    });

    // Handle stack completion callback
    if (stackCompleted && !stackCompletedRef.current) {
      stackCompletedRef.current = true;
      onStackComplete?.();
    } else if (!stackCompleted && stackCompletedRef.current) {
      stackCompletedRef.current = false;
    }
  }, [
    isInitialized,
    itemScale,
    itemStackDistance,
    stackPosition,
    scaleEndPosition,
    baseScale,
    rotationAmount,
    blurAmount,
    useWindowScroll,
    onStackComplete,
    calculateProgress,
    parsePercentage,
    getScrollData,
    getElementOffset,
  ]);

  const handleScroll = useCallback(() => {
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
    }

    animationFrameRef.current = requestAnimationFrame(() => {
      const { scrollTop } = getScrollData();

      // Throttle scroll updates for better performance
      if (Math.abs(scrollTop - lastScrollTop.current) > 1) {
        lastScrollTop.current = scrollTop;
        updateCardTransforms();
      }
    });
  }, [getScrollData, updateCardTransforms]);

  useLayoutEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // Get all scroll stack cards
    const cards = Array.from(
      useWindowScroll
        ? document.querySelectorAll(".scroll-stack-card")
        : container.querySelectorAll(".scroll-stack-card")
    );

    cardsRef.current = cards;

    // Set up initial styles for each card
    cards.forEach((card, i) => {
      if (i < cards.length - 1) {
        card.style.marginBottom = `${itemDistance * 0.5}px`;
      }
      card.style.willChange = "transform, filter";
      card.style.transformOrigin = "top center";
      card.style.backfaceVisibility = "hidden";
      card.style.transform = "translateZ(0)";
      card.style.webkitTransform = "translateZ(0)";
      card.style.perspective = "1000px";
      card.style.webkitPerspective = "1000px";
      card.style.zIndex = cards.length - i; // Initial stacking order
    });

    // Set up scroll listener
    const scrollTarget = useWindowScroll ? window : container;
    scrollTarget.addEventListener("scroll", handleScroll, { passive: true });

    // Initial transform update
    setIsInitialized(true);
    updateCardTransforms();

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
      scrollTarget.removeEventListener("scroll", handleScroll);
      cardsRef.current = [];
      setIsInitialized(false);
      stackCompletedRef.current = false;
    };
  }, [
    itemDistance,
    itemScale,
    itemStackDistance,
    stackPosition,
    scaleEndPosition,
    baseScale,
    rotationAmount,
    blurAmount,
    useWindowScroll,
    handleScroll,
    updateCardTransforms,
  ]);

  // Container styles
  const containerStyles = useWindowScroll
    ? {
        // Global scroll mode
        overscrollBehavior: "contain",
        WebkitOverflowScrolling: "touch",
        WebkitTransform: "translateZ(0)",
        transform: "translateZ(0)",
      }
    : {
        // Container scroll mode
        overscrollBehavior: "contain",
        WebkitOverflowScrolling: "touch",
        scrollBehavior: "smooth",
        WebkitTransform: "translateZ(0)",
        transform: "translateZ(0)",
        willChange: "scroll-position",
      };

  const containerClassName = useWindowScroll
    ? `relative w-full ${className}`.trim()
    : `relative w-full h-full overflow-y-auto overflow-x-visible ${className}`.trim();

  return (
    <div
      className={containerClassName}
      ref={containerRef}
      style={containerStyles}>
      <div className="scroll-stack-inner pt-[20vh] px-20 pb-[50rem] min-h-screen">
        {children}
        {/* Spacer for proper pin release */}
        <div className="scroll-stack-end w-full h-px" />
      </div>
    </div>
  );
};

export default ScrollStack;
