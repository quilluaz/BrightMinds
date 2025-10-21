import { useEffect, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { gsap } from "gsap";
import { logout } from "@/services/auth";

const getMenuItems = () => {
  const user = JSON.parse(localStorage.getItem("bm_user")) || {};
  const isGameMaster = user.role === "GAMEMASTER";
  const isPlayer = user.role === "PLAYER";

  const baseItems = [
    {
      label: "home",
      href: "/home",
      ariaLabel: "Home",
      rotation: -8,
      hoverStyles: { bgColor: "#9c8bef", textColor: "#ffffff" },
    },
    {
      label: "settings",
      href: "/settings",
      ariaLabel: "Settings",
      rotation: 8,
      hoverStyles: { bgColor: "#ff8e51", textColor: "#ffffff" },
    },
    {
      label: "about",
      href: "/about",
      ariaLabel: "About",
      rotation: 8,
      hoverStyles: { bgColor: "#ffd83f", textColor: "#ffffff" },
    },
  ];

  // Add dashboard for Game Masters
  if (isGameMaster) {
    baseItems.splice(1, 0, {
      label: "dashboard",
      href: "/gamemaster",
      ariaLabel: "Game Master Dashboard",
      rotation: -4,
      hoverStyles: { bgColor: "#feb0e1", textColor: "#ffffff" },
    });
  }

  // Add dashboard for Players
  if (isPlayer) {
    baseItems.splice(1, 0, {
      label: "dashboard",
      href: "/dashboard",
      ariaLabel: "Player Dashboard",
      rotation: -4,
      hoverStyles: { bgColor: "#3ea66b", textColor: "#ffffff" },
    });
  }

  // Add logout at the end
  baseItems.push({
    label: "logout",
    href: "#",
    ariaLabel: "Logout",
    rotation: -4,
    hoverStyles: { bgColor: "#ef4444", textColor: "#ffffff" },
    isLogout: true,
  });

  return baseItems;
};

export default function BubbleMenu({
  logo,
  onMenuClick,
  className,
  style,
  menuAriaLabel = "Toggle menu",
  menuBg = "#fff",
  menuContentColor = "#111",
  useFixedPosition = false,
  items,
  animationEase = "back.out(1.5)",
  animationDuration = 0.5,
  staggerDelay = 0.12,
}) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showOverlay, setShowOverlay] = useState(false);

  const overlayRef = useRef(null);
  const bubblesRef = useRef([]);
  const labelRefs = useRef([]);

  const location = useLocation();
  const navigate = useNavigate();

  const menuItems = items?.length ? items : getMenuItems();

  const containerClassName = [
    "bubble-menu",
    useFixedPosition ? "fixed" : "absolute",
    "left-0 right-0 top-8",
    "flex items-center justify-between",
    "gap-4 px-8",
    "pointer-events-none",
    "z-[1001]",
    className,
  ]
    .filter(Boolean)
    .join(" ");

  const handleToggle = () => {
    const nextState = !isMenuOpen;
    if (nextState) setShowOverlay(true);
    setIsMenuOpen(nextState);
    onMenuClick?.(nextState);
  };

  const normalizePath = (href) => {
    try {
      const url = new URL(href, window.location.origin);
      return url.pathname.replace(/\/$/, "");
    } catch {
      return href?.replace(/\/$/, "") || "";
    }
  };

  const currentPath = normalizePath(location.pathname || "/");

  const handleMenuItemClick = (item, isActive) => {
    if (isActive) return;
    if (item.isLogout) {
      logout();
    } else if (item.href && item.href !== "#") {
      navigate(item.href);
    }
    setIsMenuOpen(false);
  };

  useEffect(() => {
    const overlay = overlayRef.current;
    const bubbles = bubblesRef.current.filter(Boolean);
    const labels = labelRefs.current.filter(Boolean);
    if (!overlay || !bubbles.length) return;

    if (isMenuOpen) {
      gsap.set(overlay, { display: "flex" });
      gsap.fromTo(
        overlay,
        { opacity: 0 },
        { opacity: 1, duration: 0.25, ease: "power2.out" }
      );
      gsap.killTweensOf([...bubbles, ...labels]);
      gsap.set(bubbles, { scale: 0, transformOrigin: "50% 50%" });
      gsap.set(labels, { y: 24, autoAlpha: 0 });

      bubbles.forEach((bubble, i) => {
        const delay = i * staggerDelay + gsap.utils.random(-0.05, 0.05);
        const tl = gsap.timeline({ delay });
        tl.to(bubble, {
          scale: 1,
          duration: animationDuration,
          ease: animationEase,
        });
        if (labels[i]) {
          tl.to(
            labels[i],
            {
              y: 0,
              autoAlpha: 1,
              duration: animationDuration,
              ease: "power3.out",
            },
            "-=" + animationDuration * 0.9
          );
        }
      });
    } else if (showOverlay) {
      gsap.killTweensOf([...bubbles, ...labels]);
      gsap.to(labels, {
        y: 24,
        autoAlpha: 0,
        duration: 0.2,
        ease: "power3.in",
      });
      gsap.to(bubbles, {
        scale: 0,
        duration: 0.2,
        ease: "power3.in",
        onComplete: () => {
          gsap.to(overlay, {
            opacity: 0,
            duration: 0.18,
            ease: "power2.in",
            onComplete: () => {
              gsap.set(overlay, { display: "none" });
              setShowOverlay(false);
            },
          });
        },
      });
    }
  }, [isMenuOpen, showOverlay, animationEase, animationDuration, staggerDelay]);

  useEffect(() => {
    const handleResize = () => {
      if (isMenuOpen) {
        const bubbles = bubblesRef.current.filter(Boolean);
        const isDesktop = window.innerWidth >= 900;
        bubbles.forEach((bubble, i) => {
          const item = menuItems[i];
          if (bubble && item) {
            const rotation = isDesktop ? item.rotation ?? 0 : 0;
            gsap.set(bubble, { rotation });
          }
        });
      }
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [isMenuOpen, menuItems]);

  return (
    <>
      {/* Workaround for silly Tailwind capabilities */}
      <style>{`
        .bubble-menu .menu-line {
          transition: transform 0.3s ease, opacity 0.3s ease;
          transform-origin: center;
        }
        .bubble-menu-items .pill-list .pill-col:nth-child(4):nth-last-child(2) {
          margin-left: calc(100% / 6);
        }
        .bubble-menu-items .pill-list .pill-col:nth-child(4):last-child {
          margin-left: calc(100% / 3);
          margin-top: 3rem;
        }
        @media (min-width: 900px) {
          .bubble-menu-items .pill-link {
            transform: rotate(var(--item-rot));
          }
          .bubble-menu-items .pill-link:hover {
            transform: rotate(var(--item-rot)) scale(1.06);
            background: var(--hover-bg) !important;
            color: var(--hover-color) !important;
          }
          .bubble-menu-items .pill-link:active {
            transform: rotate(var(--item-rot)) scale(.94);
          }
          .bubble-menu-items .pill-link:focus {
            outline: 2px solid var(--hover-bg);
            outline-offset: 2px;
          }
        }
        @media (max-width: 899px) {
          .bubble-menu-items {
            padding-top: 120px;
            align-items: flex-start;
          }
          .bubble-menu-items .pill-list {
            row-gap: 16px;
          }
          .bubble-menu-items .pill-list .pill-col {
            flex: 0 0 100% !important;
            margin-left: 0 !important;
            overflow: visible;
          }
          .bubble-menu-items .pill-link {
            font-size: clamp(1.2rem, 3vw, 4rem);
            padding: clamp(1rem, 2vw, 2rem) 0;
            min-height: 80px !important;
          }
          .bubble-menu-items .pill-link:hover {
            transform: scale(1.06);
            background: var(--hover-bg);
            color: var(--hover-color);
          }
          .bubble-menu-items .pill-link:active {
            transform: scale(.94);
          }
        }
      `}</style>
      <nav
        className={containerClassName}
        style={style}
        aria-label="Main navigation">
        <div
          className={[
            "bubble logo-bubble",
            "inline-flex items-center justify-center",
            "pointer-events-auto",
            "will-change-transform",
            "ml-5",
          ].join(" ")}
          aria-label="Logo"
          style={{
            background: "transparent",
          }}>
          <span
            className={[
              "logo-content",
              "inline-flex items-center justify-center",
            ].join(" ")}>
            <img
              src="/LogoIconSideLight.svg"
              alt="BrightMinds Logo"
              className="bubble-logo max-h-16 md:max-h-18 object-contain block"
            />
          </span>
        </div>

        <button
          type="button"
          className={[
            "bubble toggle-bubble menu-btn",
            isMenuOpen ? "open" : "",
            "inline-flex flex-col items-center justify-center",
            "rounded-full",
            "bg-white",
            "shadow-[0_4px_16px_rgba(0,0,0,0.12)]",
            "pointer-events-auto",
            "w-12 h-12 md:w-14 md:h-14",
            "border-0 cursor-pointer p-0",
            "will-change-transform",
          ].join(" ")}
          onClick={handleToggle}
          aria-label={menuAriaLabel}
          aria-pressed={isMenuOpen}
          style={{ background: menuBg }}>
          <span
            className="menu-line block mx-auto rounded-[2px]"
            style={{
              width: 26,
              height: 2,
              background: menuContentColor,
              transform: isMenuOpen ? "translateY(4px) rotate(45deg)" : "none",
            }}
          />
          <span
            className="menu-line short block mx-auto rounded-[2px]"
            style={{
              marginTop: "6px",
              width: 26,
              height: 2,
              background: menuContentColor,
              transform: isMenuOpen
                ? "translateY(-4px) rotate(-45deg)"
                : "none",
            }}
          />
        </button>
      </nav>
      {showOverlay && (
        <div
          ref={overlayRef}
          className={[
            "bubble-menu-items",
            useFixedPosition ? "fixed" : "absolute",
            "inset-0",
            "flex items-center justify-center",
            "backdrop-blur-md backdrop-saturate-150 bg-black/30",
            "transition-opacity duration-200",
            "pointer-events-none", // keep overlay non-interactive; see note below
            "z-[1000]",
          ].join(" ")}
          style={{ opacity: 0 }}
          aria-hidden={!isMenuOpen}>
          <ul
            className={[
              "pill-list",
              "list-none m-0 px-6",
              "w-full max-w-[1600px] mx-auto",
              "flex flex-wrap",
              "gap-x-0 gap-y-1",
              "pointer-events-auto",
            ].join(" ")}
            role="menu"
            aria-label="Menu links">
            {menuItems.map((item, idx) => {
              const itemPath = normalizePath(item.href || "");
              const isActive = itemPath && itemPath === currentPath;
              const activeBg = item.hoverStyles?.bgColor || "#f3f4f6";
              const activeColor =
                item.hoverStyles?.textColor || menuContentColor;
              return (
                <li
                  key={idx}
                  role="none"
                  className={[
                    "pill-col",
                    "flex justify-center items-stretch",
                    "[flex:0_0_calc(100%/3)]",
                    "box-border",
                  ].join(" ")}>
                  <button
                    type="button"
                    role="menuitem"
                    aria-label={item.ariaLabel || item.label}
                    onClick={() => handleMenuItemClick(item, isActive)}
                    aria-current={isActive ? "page" : undefined}
                    aria-disabled={isActive ? true : undefined}
                    className={[
                      "pill-link",
                      "w-full",
                      "rounded-[999px]",
                      "no-underline",
                      "bg-white",
                      "text-inherit",
                      "shadow-[0_4px_14px_rgba(0,0,0,0.10)]",
                      "flex items-center justify-center",
                      "relative",
                      "transition-[background,color] duration-300 ease-in-out",
                      "box-border",
                      "whitespace-nowrap overflow-hidden",
                      isActive
                        ? "border-0 cursor-default"
                        : "border-0 cursor-pointer",
                    ].join(" ")}
                    style={{
                      ["--item-rot"]: `${item.rotation ?? 0}deg`,
                      ["--pill-bg"]: isActive ? activeBg : menuBg,
                      ["--pill-color"]: isActive
                        ? activeColor
                        : menuContentColor,
                      ["--hover-bg"]: item.hoverStyles?.bgColor || "#f3f4f6",
                      ["--hover-color"]:
                        item.hoverStyles?.textColor || menuContentColor,
                      background: "var(--pill-bg)",
                      color: "var(--pill-color)",
                      minHeight: "var(--pill-min-h, 160px)",
                      padding: "clamp(1.5rem, 3vw, 8rem) 0",
                      fontSize: "clamp(1.5rem, 4vw, 4rem)",
                      fontWeight: 400,
                      lineHeight: 0,
                      willChange: "transform",
                      height: 10,
                    }}
                    disabled={isActive}
                    ref={(el) => {
                      if (el) bubblesRef.current[idx] = el;
                    }}>
                    <span
                      className="pill-label inline-block"
                      style={{
                        willChange: "transform, opacity",
                        height: "1.2em",
                        lineHeight: 1.2,
                      }}
                      ref={(el) => {
                        if (el) labelRefs.current[idx] = el;
                      }}>
                      {item.label}
                    </span>
                  </button>
                </li>
              );
            })}
          </ul>
        </div>
      )}
    </>
  );
}
