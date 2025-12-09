import { useEffect, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { gsap } from "gsap";
import { logout } from "@/services/auth";
import "./BubbleMenu.css";

const getMenuItems = () => {
  let user = {};
  try {
    const userData = localStorage.getItem("bm_user");
    if (userData) {
      user = JSON.parse(userData);
    }
  } catch (error) {
    console.error("Error parsing user data from localStorage:", error);
    // Clear corrupted data
    localStorage.removeItem("bm_user");
  }

  const isGameMaster = user.role === "GAMEMASTER";
  const isPlayer = user.role === "PLAYER";

  const baseItems = [
    {
      label: "games",
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

  const isGamePage = location.pathname.startsWith("/play/");
  const showLogo = !isGamePage;

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

  useEffect(() => {
    if (isMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isMenuOpen]);

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

    try {
      if (item.isLogout) {
        logout();
      } else if (item.href && item.href !== "#") {
        navigate(item.href);
      }
    } catch (error) {
      console.error("Error handling menu item click:", error);
    } finally {
      setIsMenuOpen(false);
    }
  };

  useEffect(() => {
    const overlay = overlayRef.current;
    const bubbles = bubblesRef.current.filter(Boolean);
    const labels = labelRefs.current.filter(Boolean);
    if (!overlay || !bubbles.length) return;

    try {
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
    } catch (error) {
      console.error("Error in GSAP animation:", error);
      // Fallback: just close the menu
      setIsMenuOpen(false);
      setShowOverlay(false);
    }
  }, [isMenuOpen, showOverlay, animationEase, animationDuration, staggerDelay]);

  useEffect(() => {
    const handleResize = () => {
      try {
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
      } catch (error) {
        console.error("Error in resize handler:", error);
      }
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [isMenuOpen, menuItems]);

  return (
    <>
      <nav
        className={containerClassName}
        style={style}
        aria-label="Main navigation">
        {showLogo && (
          <div
            className={[
              "bubble logo-bubble",
              "hidden md:inline-flex items-center justify-center",
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
        )}

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
            // Push to right if logo is hidden
            "ml-auto",
          ].join(" ")}
          onClick={handleToggle}
          aria-label={menuAriaLabel}
          aria-pressed={isMenuOpen}
          style={{ background: menuBg }}>
          {isMenuOpen ? (
            <div className="relative w-6 h-6 flex items-center justify-center">
              <span
                className="absolute block h-0.5 rounded-full bg-current transition-transform duration-300 ease-in-out"
                style={{
                  width: 24,
                  backgroundColor: menuContentColor,
                  transform: "rotate(45deg)",
                }}
              />
              <span
                className="absolute block h-0.5 rounded-full bg-current transition-transform duration-300 ease-in-out"
                style={{
                  width: 24,
                  backgroundColor: menuContentColor,
                  transform: "rotate(-45deg)",
                }}
              />
            </div>
          ) : (
            <span
              className="font-spartan font-bold text-xs md:text-sm uppercase tracking-wide"
              style={{ color: menuContentColor }}>
              Menu
            </span>
          )}
        </button>
      </nav>
      {showOverlay && (
        <div
          ref={overlayRef}
          className={[
            "bubble-menu-items",
            "fixed inset-0",
            "flex items-center justify-center",
            "backdrop-blur-md backdrop-saturate-150 bg-black/30",
            "transition-opacity duration-200",
            "pointer-events-none",
            "z-[1000]",
            "overflow-y-auto",
            "overscroll-y-contain",
          ].join(" ")}
          style={{ opacity: 0 }}
          aria-hidden={!isMenuOpen}>
          <ul
            className={[
              "pill-list",
              "list-none m-0 px-6",
              "w-full max-w-[1600px] mx-auto",
              "flex flex-wrap",
              "justify-center",
              "gap-4 md:gap-8",
              "pointer-events-auto",
              "py-10",
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
                    "w-[calc(100%-1rem)] md:w-[calc(50%-2rem)] lg:w-[calc(33.333%-2rem)]",
                    "box-border",
                  ].join(" ")}
                  style={{ flex: "none" }}>
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
