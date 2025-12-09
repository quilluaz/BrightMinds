import { cn } from "@/lib/utils";

export default function CircularProfile({ name, role, imageUrl, className }) {
  // SVG Config
  // We use a fixed viewBox size, but the component itself will scale with CSS (vh/vw)
  const size = 300;
  const center = size / 2;
  // Radius for the text path - needs to be inside the circle
  // Circle edge is at 150. Let's put text around 120-130 radius.
  const textRadius = 120; 
  const fontSize = 24; // Larger font for impact

  return (
    <div 
      className={cn(
        "relative flex items-center justify-center rounded-full overflow-hidden shadow-xl bg-black/20 backdrop-blur-sm border-2 border-white/10",
        className
      )}
      // Use vh for adaptive sizing, with sensible min/max
      style={{
        width: "min(35vh, 320px)",
        height: "min(35vh, 320px)",
        // Mobile fallback if vh is too small/large
        minWidth: "250px",
        minHeight: "250px"
      }}
    >
      {/* Background Image - Scaled Down to create text track */}
      <div className="absolute inset-0 z-0 flex items-center justify-center">
        <div className="w-[75%] h-[75%] rounded-full overflow-hidden relative shadow-inner">
          <img
            src={imageUrl}
            alt={`${name} - ${role}`}
            className="w-full h-full object-cover"
          />
          {/* Dark Overlay for text readability (optional, maybe lighter now that it's separate) */}
          <div className="absolute inset-0 bg-black/10" />
        </div>
      </div>

      {/* Rotating Text Ring - Overlay */}
      <div className="absolute inset-0 z-10 animate-spin-slowest pointer-events-none">
        <svg
          viewBox={`0 0 ${size} ${size}`}
          className="w-full h-full"
        >
          <defs>
            <path
              id="innerCirclePath"
              d={`M${center},${center} m -${textRadius}, 0 a ${textRadius},${textRadius} 0 1,1 ${textRadius * 2},0 a ${textRadius},${textRadius} 0 1,1 -${textRadius * 2},0`}
            />
          </defs>
          {/* Name at Top (25%) */}
          <text 
            fill="white" 
            fontSize={fontSize} 
            fontWeight="bold" 
            letterSpacing="2"
            style={{ textTransform: "uppercase", textShadow: "0 2px 4px rgba(0,0,0,0.5)" }}
          >
            <textPath
              href="#innerCirclePath"
              startOffset="25%"
              textAnchor="middle"
              className="fill-white"
            >
              {name}
            </textPath>
          </text>
          {/* Role at Bottom (75%) */}
          <text 
            fill="white" 
            fontSize={fontSize} 
            fontWeight="bold" 
            letterSpacing="2"
            style={{ textTransform: "uppercase", textShadow: "0 2px 4px rgba(0,0,0,0.5)" }}
          >
            <textPath
              href="#innerCirclePath"
              startOffset="75%"
              textAnchor="middle"
              className="fill-white"
            >
              {role}
            </textPath>
          </text>
        </svg>
      </div>
    </div>
  );
}
