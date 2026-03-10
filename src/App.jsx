import { useState, useEffect, useRef, useCallback } from "react";

const HUDBracket = ({ position }) => {
  const styles = {
    "top-left":     { top: 16, left: 16,  borderTop: "2px solid rgba(255,255,255,0.6)", borderLeft: "2px solid rgba(255,255,255,0.6)" },
    "top-right":    { top: 16, right: 16, borderTop: "2px solid rgba(255,255,255,0.6)", borderRight: "2px solid rgba(255,255,255,0.6)" },
    "bottom-left":  { bottom: 16, left: 16,  borderBottom: "2px solid rgba(255,255,255,0.6)", borderLeft: "2px solid rgba(255,255,255,0.6)" },
    "bottom-right": { bottom: 16, right: 16, borderBottom: "2px solid rgba(255,255,255,0.6)", borderRight: "2px solid rgba(255,255,255,0.6)" },
  };
  return <div style={{ position: "absolute", width: 28, height: 28, ...styles[position] }} />;
};

const VIDEO_URL = "https://res.cloudinary.com/dae5xuxoc/video/upload/Olvaidlab_mqb9j8.mp4";

// Proyectos — agrega más aquí cuando estén listos
const PROJECTS = [
  { id: 1, name: "DOMIS.CL", url: "https://www.domis.cl", desc: "E-commerce · Retail" },
  // { id: 2, name: "DR. NOMBRE", url: "https://...", desc: "Salud · Medicina" },
];

// Genera path SVG zigzag entre dos puntos (coordenadas en espacio 0-100)
function makeLightningPath(x1, y1, x2, y2, jags = 9) {
  const pts = [[x1, y1]];
  for (let i = 1; i < jags; i++) {
    const t = i / jags;
    const x = x1 + (x2 - x1) * t + (Math.random() - 0.5) * 7;
    const y = y1 + (y2 - y1) * t + (Math.random() - 0.5) * 5;
    pts.push([x, y]);
  }
  pts.push([x2, y2]);
  return "M " + pts.map(p => `${p[0].toFixed(1)} ${p[1].toFixed(1)}`).join(" L ");
}

// Posición de cada tarjeta según índice y total
function cardPosition(index, total) {
  // Alterna paredes: 0→derecha, 1→izquierda, 2→derecha, ...
  const side = index % 2 === 0 ? "right" : "left";
  const topPercents = total === 1 ? [50] : total === 2 ? [35, 35] : [25, 50, 70];
  const top = topPercents[index] ?? 50;
  return { side, top };
}

export default function App() {
  const [menuOpen, setMenuOpen]           = useState(false);
  const [contactModalOpen, setContactModalOpen] = useState(false);
  const [loaded, setLoaded]               = useState(false);
  const [glitch, setGlitch]               = useState(false);
  const [projectsOpen, setProjectsOpen]   = useState(false);
  const [lightningPaths, setLightningPaths] = useState([]);
  const [lightningActive, setLightningActive] = useState(false);
  const [screenFlash, setScreenFlash]     = useState(false);
  const videoRef = useRef(null);

  useEffect(() => {
    const t  = setTimeout(() => setLoaded(true), 100);
    const gi = setInterval(() => {
      setGlitch(true);
      setTimeout(() => setGlitch(false), 150);
    }, 4500);
    return () => { clearTimeout(t); clearInterval(gi); };
  }, []);

  const handleVerProyectos = useCallback(() => {
    if (projectsOpen) { setProjectsOpen(false); return; }

    // Genera un rayo por proyecto, cada uno apunta a su posición en la pared
    const paths = PROJECTS.map((_, i) => {
      const { side, top } = cardPosition(i, PROJECTS.length);
      const endX = side === "right" ? 94 : 6;
      const endY = top;
      return makeLightningPath(50, 82, endX, endY);
    });

    setLightningPaths(paths);
    setLightningActive(true);

    // Flash al impactar
    setTimeout(() => setScreenFlash(true), 400);
    setTimeout(() => setScreenFlash(false), 550);

    // Mostrar tarjetas
    setTimeout(() => {
      setProjectsOpen(true);
      setLightningActive(false);
    }, 700);
  }, [projectsOpen]);

  const menuItems = [
    { label: "PROYECTOS", action: handleVerProyectos },
    { label: "PROCESO",   url: "#" },
    { label: "ESTUDIO",   url: "#" },
    { label: "CONTACTO",  action: () => setContactModalOpen(true) }
  ];

  return (
    <div style={{
      position: "relative", width: "100vw", height: "100vh",
      background: "#050308", color: "#fff",
      fontFamily: "'Barlow Condensed', sans-serif",
      overflow: "hidden", cursor: "crosshair",
    }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Barlow+Condensed:wght@300;400;600;700&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }

        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(30px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes scanMove {
          0%   { background-position: 0 0; }
          100% { background-position: 0 100px; }
        }
        @keyframes curtainLeft {
          from { transform: translateX(-60px); opacity: 0; }
          to   { transform: translateX(0); opacity: 1; }
        }
        @keyframes curtainRight {
          from { transform: translateX(60px); opacity: 0; }
          to   { transform: translateX(0); opacity: 1; }
        }
        @keyframes heroReveal {
          from { opacity: 0; transform: scale(1.04); }
          to   { opacity: 1; transform: scale(1); }
        }
        @keyframes glitchShift {
          0%   { opacity: 1; clip-path: inset(0 0 95% 0);   transform: translate(-4px, 0); }
          20%  { opacity: 1; clip-path: inset(40% 0 50% 0); transform: translate(4px, 0);  }
          40%  { opacity: 1; clip-path: inset(70% 0 10% 0); transform: translate(-2px, 0); }
          60%  { opacity: 1; clip-path: inset(20% 0 75% 0); transform: translate(3px, 0);  }
          80%  { opacity: 1; clip-path: inset(60% 0 30% 0); transform: translate(-3px, 0); }
          100% { opacity: 0; clip-path: inset(0 0 95% 0);   transform: translate(0, 0);    }
        }
        @keyframes lineExpand {
          from { width: 0; }
          to   { width: 100%; }
        }
        @keyframes videoGlow {
          0%, 100% { opacity: 0.4; transform: translateX(-50%) scaleX(1);    }
          50%      { opacity: 0.7; transform: translateX(-50%) scaleX(1.15); }
        }
        @keyframes blinkDot {
          0%, 100% { opacity: 1; } 50% { opacity: 0; }
        }
        @keyframes menuSlide {
          from { opacity: 0; transform: translateY(-20px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes lightningStrike {
          0%   { stroke-dashoffset: 300; opacity: 1; }
          60%  { stroke-dashoffset: 0;   opacity: 1; }
          100% { stroke-dashoffset: 0;   opacity: 0; }
        }
        @keyframes cardSlideRight {
          from { opacity: 0; transform: translateX(40px) translateY(-50%); }
          to   { opacity: 1; transform: translateX(0)    translateY(-50%); }
        }
        @keyframes cardSlideLeft {
          from { opacity: 0; transform: translateX(-40px) translateY(-50%); }
          to   { opacity: 1; transform: translateX(0)     translateY(-50%); }
        }
        @keyframes impactFlash {
          0%   { opacity: 0; }
          50%  { opacity: 0.25; }
          100% { opacity: 0; }
        }

        .curtain-left  { animation: ${loaded ? "curtainLeft  1.2s cubic-bezier(0.16,1,0.3,1) 0.1s both" : "none"}; }
        .curtain-right { animation: ${loaded ? "curtainRight 1.2s cubic-bezier(0.16,1,0.3,1) 0.1s both" : "none"}; }
        .hero-area     { animation: ${loaded ? "heroReveal   1.4s cubic-bezier(0.16,1,0.3,1) 0.5s both" : "none"}; }
        .title-main    { animation: ${loaded ? "fadeUp 1s cubic-bezier(0.16,1,0.3,1) 0.8s both" : "none"}; }
        .subtitle-line { animation: ${loaded ? "fadeUp 1s cubic-bezier(0.16,1,0.3,1) 1.0s both" : "none"}; }
        .cta-row       { animation: ${loaded ? "fadeUp 1s cubic-bezier(0.16,1,0.3,1) 1.1s both" : "none"}; }
        .ui-top        { animation: ${loaded ? "fadeUp 0.8s cubic-bezier(0.16,1,0.3,1) 0.2s both" : "none"}; }

        .glitch-layer { position: relative; display: inline-block; }
        .glitch-layer::before,
        .glitch-layer::after {
          content: attr(data-text);
          position: absolute; left: 0; top: 0; width: 100%;
          opacity: 0; pointer-events: none;
        }
        .glitch-layer::before { color: #ff00ff; animation: ${glitch ? "glitchShift 0.15s steps(1) forwards" : "none"}; }
        .glitch-layer::after  { color: #00ffff; animation: ${glitch ? "glitchShift 0.15s steps(1) 0.04s forwards" : "none"}; }

        .scan-lines {
          position: absolute; inset: 0; pointer-events: none; z-index: 5;
          background: repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,0,0,0.03) 2px, rgba(0,0,0,0.03) 4px);
          animation: scanMove 8s linear infinite;
        }
        .video-glow    { animation: videoGlow 3s ease-in-out infinite; }
        .blink         { animation: blinkDot 1.2s step-end infinite; }
        .menu-overlay  { animation: menuSlide 0.3s cubic-bezier(0.16,1,0.3,1) both; }

        .lightning-path {
          stroke-dasharray: 300;
          stroke-dashoffset: 300;
          animation: lightningStrike 0.7s ease-out forwards;
        }
        .lightning-path-glow {
          stroke-dasharray: 300;
          stroke-dashoffset: 300;
          animation: lightningStrike 0.7s ease-out forwards;
          animation-delay: 0.02s;
        }

        .try-btn:hover       { background: rgba(255,255,255,0.12) !important; border-color: rgba(255,255,255,0.6) !important; }
        .menu-item:hover     { color: #c084fc !important; letter-spacing: 8px !important; }
        .cta-primary:hover   { background: #e0e0e0 !important; }
        .cta-secondary:hover { border-color: rgba(255,255,255,0.5) !important; color: #fff !important; }

        video::-webkit-media-controls { display: none !important; }
        video { object-fit: contain; }
      `}</style>

      {/* SCAN LINES */}
      <div className="scan-lines" />

      {/* NOISE GRAIN */}
      <div style={{
        position: "absolute", inset: 0, zIndex: 4, pointerEvents: "none", opacity: 0.035,
        backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
      }} />

      {/* HUD BRACKETS */}
      {["top-left","top-right","bottom-left","bottom-right"].map(p => <HUDBracket key={p} position={p} />)}

      {/* COORD izquierda */}
      <div style={{
        position: "absolute", bottom: 30, left: 24, zIndex: 20,
        fontSize: 11, letterSpacing: 3, color: "rgba(255,255,255,0.35)",
        fontWeight: 600, textTransform: "uppercase", lineHeight: 1.8,
      }}>
        33.4°S / 70.6°W<br />
        <span style={{ opacity: 0.5 }}>SANTIAGO, CL</span>
      </div>

      {/* COORD derecha */}
      <div style={{
        position: "absolute", bottom: 30, right: 24, zIndex: 20,
        fontSize: 11, letterSpacing: 3, color: "rgba(255,255,255,0.35)",
        fontWeight: 600, textTransform: "uppercase", textAlign: "right",
      }}>
        <span className="blink" style={{ color: "#c084fc", marginRight: 6 }}>●</span>
        SISTEMA ACTIVO
      </div>

      {/* CORTINA IZQUIERDA */}
      <div className="curtain-left" style={{
        position: "absolute", left: 0, top: 0, bottom: 0, width: "22%",
        background: "linear-gradient(to right, #0e0610 60%, transparent 100%)",
        zIndex: 2,
      }}>
        <div style={{
          position: "absolute", right: 0, top: "10%", bottom: "10%",
          width: 1, background: "linear-gradient(to bottom, transparent, rgba(192,132,252,0.3), transparent)",
        }} />
      </div>

      {/* CORTINA DERECHA */}
      <div className="curtain-right" style={{
        position: "absolute", right: 0, top: 0, bottom: 0, width: "22%",
        background: "linear-gradient(to left, #0e0610 60%, transparent 100%)",
        zIndex: 2,
      }}>
        <div style={{
          position: "absolute", left: 0, top: "10%", bottom: "10%",
          width: 1, background: "linear-gradient(to bottom, transparent, rgba(192,132,252,0.3), transparent)",
        }} />
      </div>

      {/* HERO VIDEO */}
      <div className="hero-area" style={{
        position: "absolute", inset: 0, zIndex: 1,
        display: "flex", alignItems: "center", justifyContent: "center",
      }}>
        <div style={{ position: "relative", display: "flex", alignItems: "flex-end", justifyContent: "center" }}>
          <div style={{
            position: "relative", height: "82vh",
            maskImage: "linear-gradient(to bottom, transparent 0%, black 8%, black 75%, transparent 100%), linear-gradient(to right, transparent 0%, black 8%, black 92%, transparent 100%)",
            maskComposite: "intersect",
            WebkitMaskImage: "linear-gradient(to bottom, transparent 0%, black 8%, black 75%, transparent 100%), linear-gradient(to right, transparent 0%, black 8%, black 92%, transparent 100%)",
            WebkitMaskComposite: "source-in",
          }}>
            <video ref={videoRef} src={VIDEO_URL} autoPlay muted loop playsInline
              style={{ height: "100%", width: "auto", maxWidth: "50vw" }} />
          </div>
          <div className="video-glow" style={{
            position: "absolute", bottom: -10, left: "50%",
            width: 220, height: 44, borderRadius: "50%",
            background: "radial-gradient(ellipse, rgba(192,132,252,0.3) 0%, transparent 70%)",
            filter: "blur(10px)",
          }} />
          <div style={{
            position: "absolute", bottom: -30, left: "50%", transform: "translateX(-50%)",
            width: "80%", height: 30,
            background: "linear-gradient(to bottom, rgba(192,132,252,0.06), transparent)",
            filter: "blur(4px)",
          }} />
        </div>
      </div>

      {/* ── RAYOS ── */}
      {lightningActive && lightningPaths.length > 0 && (
        <svg
          key={lightningPaths[0]} // re-mount para re-trigger animation
          style={{ position: "fixed", inset: 0, width: "100vw", height: "100vh", zIndex: 60, pointerEvents: "none" }}
          viewBox="0 0 100 100"
          preserveAspectRatio="none"
        >
          <defs>
            <filter id="lglow" x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur stdDeviation="1.2" result="blur" />
              <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
            </filter>
          </defs>
          {lightningPaths.map((path, i) => (
            <g key={i}>
              {/* capa glow */}
              <path d={path} fill="none" stroke="rgba(192,132,252,0.6)" strokeWidth="1.5"
                filter="url(#lglow)" className="lightning-path-glow" />
              {/* capa blanca core */}
              <path d={path} fill="none" stroke="#fff" strokeWidth="0.5"
                className="lightning-path" />
            </g>
          ))}
        </svg>
      )}

      {/* ── FLASH DE IMPACTO ── */}
      {screenFlash && (
        <div style={{
          position: "fixed", inset: 0, zIndex: 61, pointerEvents: "none",
          background: "rgba(192,132,252,0.25)",
          animation: "impactFlash 0.15s ease-out forwards",
        }} />
      )}

      {/* ── TARJETAS DE PROYECTOS ── */}
      {projectsOpen && PROJECTS.map((project, i) => {
        const { side, top } = cardPosition(i, PROJECTS.length);
        const isRight = side === "right";
        return (
          <div key={project.id} style={{
            position: "fixed",
            [side]: 0,
            top: `${top}%`,
            transform: "translateY(-50%)",
            zIndex: 55,
            width: 220,
            animation: isRight ? "cardSlideRight 0.5s cubic-bezier(0.16,1,0.3,1) forwards"
                                : "cardSlideLeft  0.5s cubic-bezier(0.16,1,0.3,1) forwards",
          }}>
            {/* Línea de conexión lateral */}
            <div style={{
              position: "absolute",
              top: "50%",
              [isRight ? "right" : "left"]: "100%",
              width: 32,
              height: 1,
              background: "linear-gradient(to " + (isRight ? "right" : "left") + ", transparent, rgba(192,132,252,0.6))",
            }} />

            <div style={{
              background: "rgba(14,6,16,0.97)",
              border: "1px solid rgba(192,132,252,0.4)",
              [isRight ? "borderRight" : "borderLeft"]: "none",
              padding: 0,
              overflow: "hidden",
            }}>
              {/* Header tarjeta */}
              <div style={{
                padding: "8px 12px",
                borderBottom: "1px solid rgba(192,132,252,0.2)",
                display: "flex", alignItems: "center", justifyContent: "space-between",
              }}>
                <span style={{
                  fontFamily: "'Bebas Neue', sans-serif",
                  fontSize: 16, letterSpacing: 2, color: "#c084fc",
                }}>{project.name}</span>
                <span style={{
                  fontSize: 10, letterSpacing: 2, color: "rgba(255,255,255,0.3)",
                  textTransform: "uppercase",
                }}>{project.desc}</span>
              </div>

              {/* Preview iframe */}
              <div style={{ position: "relative", height: 130, overflow: "hidden", background: "#080410" }}>
                <iframe
                  src={project.url}
                  title={project.name}
                  style={{
                    width: "160%", height: "160%",
                    border: "none",
                    transform: "scale(0.625)", transformOrigin: "top left",
                    pointerEvents: "none",
                    opacity: 0.85,
                  }}
                />
                {/* overlay scanlines sobre iframe */}
                <div style={{
                  position: "absolute", inset: 0, pointerEvents: "none",
                  background: "repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,0,0,0.1) 2px, rgba(0,0,0,0.1) 4px)",
                }} />
              </div>

              {/* Footer tarjeta */}
              <div style={{ padding: "8px 12px", display: "flex", gap: 8 }}>
                <a href={project.url} target="_blank" rel="noreferrer" style={{
                  flex: 1, textAlign: "center",
                  background: "rgba(192,132,252,0.15)",
                  border: "1px solid rgba(192,132,252,0.3)",
                  color: "#c084fc",
                  fontFamily: "'Barlow Condensed', sans-serif",
                  fontSize: 11, fontWeight: 700, letterSpacing: 2,
                  textTransform: "uppercase", padding: "6px 0",
                  textDecoration: "none",
                  display: "block",
                }}>VISITAR →</a>
                <button onClick={() => setProjectsOpen(false)} style={{
                  background: "none", border: "1px solid rgba(255,255,255,0.15)",
                  color: "rgba(255,255,255,0.3)", cursor: "pointer",
                  fontFamily: "'Barlow Condensed', sans-serif",
                  fontSize: 11, letterSpacing: 1, padding: "6px 8px",
                  textTransform: "uppercase",
                }}>✕</button>
              </div>
            </div>
          </div>
        );
      })}

      {/* TOP BAR */}
      <div className="ui-top" style={{
        position: "absolute", top: 0, left: 0, right: 0, zIndex: 30,
        display: "flex", alignItems: "center", justifyContent: "space-between",
        padding: "20px 28px",
      }}>
        <button onClick={() => setMenuOpen(!menuOpen)} style={{
          background: "none", border: "none", cursor: "pointer",
          display: "flex", alignItems: "center", gap: 10,
          color: "#fff", fontFamily: "'Barlow Condensed', sans-serif",
          fontSize: 13, fontWeight: 700, letterSpacing: 4, textTransform: "uppercase",
        }}>
          <div style={{ display: "flex", flexDirection: "column", gap: 4, width: 20 }}>
            {[0,1,2].map(i => (
              <span key={i} style={{
                display: "block", height: 1.5,
                background: (menuOpen && i !== 1) ? "#c084fc" : "#fff",
                opacity: menuOpen && i === 1 ? 0 : 1,
                transition: "all 0.3s",
                transform: menuOpen && i === 0 ? "rotate(45deg) translateY(5.5px)"
                         : menuOpen && i === 2 ? "rotate(-45deg) translateY(-5.5px)" : "none",
              }} />
            ))}
          </div>
          MENÚ
        </button>

        <button className="try-btn" style={{
          background: "rgba(0,0,0,0.4)", border: "1px solid rgba(255,255,255,0.3)",
          color: "#fff", fontFamily: "'Barlow Condensed', sans-serif",
          fontSize: 12, fontWeight: 600, letterSpacing: 2,
          textTransform: "uppercase", padding: "8px 16px",
          cursor: "pointer", transition: "all 0.3s",
          display: "flex", alignItems: "center", gap: 8, borderRadius: 2,
        }}>
          <span style={{
            width: 8, height: 8, borderRadius: "50%", background: "#84cc16",
            boxShadow: "0 0 6px #84cc16, 0 0 12px #84cc16", display: "inline-block",
            animation: "blinkDot 1.5s ease-in-out infinite"
          }} />
          TRY A 3D PREVIEW
        </button>
      </div>

      {/* MENÚ OVERLAY */}
      {menuOpen && (
        <div className="menu-overlay" style={{
          position: "absolute", inset: 0, zIndex: 50,
          background: "rgba(8,8,8,0.97)",
          display: "flex", flexDirection: "column",
          alignItems: "center", justifyContent: "center", gap: 8,
        }}>
          {menuItems.map((item, i) => (
            <div key={item.label} style={{ animation: `fadeUp 0.5s cubic-bezier(0.16,1,0.3,1) ${0.05*i}s both` }}>
              <button className="menu-item" onClick={() => {
                setMenuOpen(false);
                if (item.url && item.url !== "#") window.open(item.url, "_blank");
                if (item.action) item.action();
              }} style={{
                background: "none", border: "none", cursor: "pointer",
                fontFamily: "'Bebas Neue', sans-serif",
                fontSize: "clamp(48px, 8vw, 96px)",
                color: "rgba(255,255,255,0.85)",
                letterSpacing: 6, textTransform: "uppercase",
                transition: "all 0.3s", display: "block", lineHeight: 1.05,
              }}>
                {item.label}
              </button>
            </div>
          ))}
          <button onClick={() => setMenuOpen(false)} style={{
            position: "absolute", top: 24, right: 28,
            background: "none", border: "none", color: "rgba(255,255,255,0.4)",
            fontFamily: "'Barlow Condensed', sans-serif",
            fontSize: 13, letterSpacing: 3, cursor: "pointer", textTransform: "uppercase",
          }}>
            [ CERRAR ]
          </button>
          <div style={{
            position: "absolute", bottom: 32,
            fontSize: 11, letterSpacing: 4, color: "rgba(255,255,255,0.2)",
            fontFamily: "'Barlow Condensed', sans-serif", textTransform: "uppercase",
          }}>
            OLVAID STUDIO — SANTIAGO 2025
          </div>
        </div>
      )}

      {/* TÍTULO + SUBTÍTULO + CTA */}
      <div style={{
        position: "absolute", bottom: 0, left: 0, right: 0,
        zIndex: 10, textAlign: "center", padding: "0 0 52px",
        background: "linear-gradient(to top, rgba(5,3,8,0.95) 40%, transparent 100%)",
      }}>
        <div style={{
          width: "28%", height: 1, margin: "0 auto 20px",
          background: "linear-gradient(to right, transparent, rgba(192,132,252,0.5), transparent)",
          animation: loaded ? "lineExpand 1.2s cubic-bezier(0.16,1,0.3,1) 0.9s both" : "none",
        }} />

        <div className="glitch-layer title-main" data-text="OLVAIDLAB" style={{
          fontFamily: "'Bebas Neue', sans-serif",
          fontSize: "clamp(56px, 11vw, 140px)",
          lineHeight: 0.88, letterSpacing: "-0.02em", color: "#fff",
          textShadow: "0 0 80px rgba(192,132,252,0.15)",
        }}>
          OLVAIDLAB
        </div>

        <div className="subtitle-line" style={{
          fontSize: "clamp(13px, 1.4vw, 17px)", letterSpacing: 2, fontWeight: 300,
          color: "rgba(255,255,255,0.45)", textTransform: "uppercase", marginTop: 10,
        }}>
          Diseño web que convierte visitantes en clientes
        </div>

        <div className="cta-row" style={{
          display: "flex", alignItems: "center", justifyContent: "center",
          gap: 28, marginTop: 22,
        }}>
          <button className="cta-primary" onClick={handleVerProyectos} style={{
            background: "#fff", color: "#050308", border: "none", cursor: "pointer",
            fontFamily: "'Barlow Condensed', sans-serif",
            fontSize: 13, fontWeight: 700, letterSpacing: 3,
            textTransform: "uppercase", padding: "11px 28px", transition: "background 0.2s",
          }}>
            VER PROYECTOS
          </button>
          <button className="cta-secondary" onClick={() => setContactModalOpen(true)} style={{
            background: "none", color: "rgba(255,255,255,0.6)",
            border: "1px solid rgba(255,255,255,0.2)", cursor: "pointer",
            fontFamily: "'Barlow Condensed', sans-serif",
            fontSize: 13, fontWeight: 600, letterSpacing: 3,
            textTransform: "uppercase", padding: "11px 28px", transition: "all 0.2s",
          }}>
            CONTACTAR
          </button>
        </div>
      </div>

      {/* CONTACT MODAL */}
      {contactModalOpen && (
        <div style={{
          position: "fixed", inset: 0, zIndex: 100,
          background: "rgba(0,0,0,0.8)", backdropFilter: "blur(5px)",
          display: "flex", alignItems: "center", justifyContent: "center"
        }}>
          <div style={{
            background: "#0e0610", border: "1px solid rgba(192,132,252,0.3)",
            padding: 40, width: "90%", maxWidth: 400, position: "relative"
          }}>
            <button onClick={() => setContactModalOpen(false)} style={{
              position: "absolute", top: 16, right: 16, background: "none", border: "none",
              color: "#fff", cursor: "pointer", fontSize: 20
            }}>✕</button>
            <h2 style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 32, letterSpacing: 2, marginBottom: 20 }}>INICIAR PROYECTO</h2>
            <form onSubmit={(e) => {
              e.preventDefault();
              const fd = new FormData(e.currentTarget);
              const nombre = fd.get("nombre");
              const apellido = fd.get("apellido");
              const numero = fd.get("numero");
              const text = `Hola, me interesa hacer una web con ustedes. Mi nombre es ${nombre} ${apellido} y mi número es ${numero}.`;
              window.open(`https://wa.me/56982348089?text=${encodeURIComponent(text)}`, "_blank");
              window.location.href = `mailto:olvaidlab@gmail.com?subject=Nuevo prospecto web&body=${encodeURIComponent(text)}`;
              setContactModalOpen(false);
            }} style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              <input name="nombre" placeholder="Nombre" required style={{
                background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.2)",
                color: "#fff", padding: "10px 14px", fontFamily: "'Barlow Condensed', sans-serif",
                fontSize: 16, outline: "none"
              }} />
              <input name="apellido" placeholder="Apellido" required style={{
                background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.2)",
                color: "#fff", padding: "10px 14px", fontFamily: "'Barlow Condensed', sans-serif",
                fontSize: 16, outline: "none"
              }} />
              <input name="numero" placeholder="Número de teléfono" required style={{
                background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.2)",
                color: "#fff", padding: "10px 14px", fontFamily: "'Barlow Condensed', sans-serif",
                fontSize: 16, outline: "none"
              }} />
              <button type="submit" style={{
                background: "#fff", color: "#050308", border: "none", cursor: "pointer",
                fontFamily: "'Barlow Condensed', sans-serif", fontSize: 14, fontWeight: 700,
                letterSpacing: 2, textTransform: "uppercase", padding: "12px", marginTop: 10
              }}>ENVIAR MENSAJE</button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
